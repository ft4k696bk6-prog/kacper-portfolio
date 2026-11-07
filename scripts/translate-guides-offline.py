#!/usr/bin/env python3
"""Offline Polish→English translations using the open-source Argos language model.

No third-party translation API receives page text. The only network access is
the initial download of an open-source PL→EN model package, on CI runners.
Translated pages are versioned content, never live per-request translations.
"""
import json
import os
import re
import sys
from pathlib import Path
from argostranslate import package, translate

source_path = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/bernecki-guide-source-pl.json")
dest_path = Path(sys.argv[2] if len(sys.argv) > 2 else "src/content/pseo/guide-translations.en.json")
source = json.loads(source_path.read_text("utf-8"))
existing = json.loads(dest_path.read_text("utf-8")) if dest_path.exists() else {}
if not isinstance(existing, dict):
    raise SystemExit("English guide source must be a JSON object")

installed = translate.get_installed_languages()
if not any(lang.code == "pl" for lang in installed) or not any(lang.code == "en" for lang in installed):
    print("Installing open-source Polish→English translation model...", flush=True)
    package.update_package_index()
    available = [p for p in package.get_available_packages() if p.from_code == "pl" and p.to_code == "en"]
    if not available:
        raise SystemExit("No trusted PL→EN Argos package found. Do not publish an English fallback.")
    model = sorted(available, key=lambda p: p.package_version)[-1]
    package.install_from_path(model.download())
    installed = translate.get_installed_languages()
source_lang = next((x for x in installed if x.code=="pl"), None)
target_lang = next((x for x in installed if x.code=="en"), None)
if not source_lang or not target_lang:
    raise SystemExit("Translation model installation did not expose both required languages")
translator = source_lang.get_translation(target_lang)
if translator is None:
    raise SystemExit("PL→EN translation pair unavailable")

cache = {}
translated_count = 0
polish_residue = []
polish_letters = re.compile(r"[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]")

def _pieces(value, max_chars=220):
    """Split long, often technical paragraphs before translation to avoid model truncation."""
    sentences = re.split(r'(?<=[.!?])\s+(?=[A-ZĄĆĘŁŃÓŚŹŻ0-9])', value.strip())
    chunks = []
    for sentence in sentences:
        words = sentence.split()
        if not words:
            continue
        current = ""
        for word in words:
            if len(current) + 1 + len(word) > max_chars and current:
                chunks.append(current)
                current = word
            else:
                current = (current + " " + word).strip()
        if current:
            chunks.append(current)
    return chunks or [value]

def _translate_piece(piece, depth=0):
    result = translator.translate(piece).strip()
    suspicious = not result or (len(piece)>70 and len(result)<10)
    if suspicious and len(piece)>55 and depth<5:
        # Try smaller chunks instead of publishing a garbled sentence or dropping text.
        words = piece.split()
        if len(words)>2:
            half = len(words)//2
            left = " ".join(words[:half])
            right = " ".join(words[half:])
            return _translate_piece(left,depth+1) + " " + _translate_piece(right,depth+1)
    if suspicious:
        raise ValueError("Translation failed for source: " + repr(piece[:150]) + " | result: " + repr(result[:100]))
    return result

def convert(value):
    if not isinstance(value, str):
        raise ValueError("Cannot translate non-string")
    if not value.strip():
        return value
    if value in cache:
        return cache[value]
    parts = _pieces(value)
    result = " ".join(_translate_piece(part) for part in parts).strip()
    if not result or (len(value)>70 and len(result)<10):
        raise ValueError("Empty or implausibly truncated translation for " + repr(value[:150]))
    if result == value and len(value)>40 and polish_letters.search(value):
        polish_residue.append(value[:100])
    cache[value] = result
    return result

for index, guide in enumerate(source):
    slug = guide["slug"]
    previous = existing.get(slug, {})
    if previous.get("sourceHash") == guide["sourceHash"] and previous.get("status") == "machine" and previous.get("sections"):
        continue
    translated = {
        "sourceHash": guide["sourceHash"],
        "status": "machine",
        "title": convert(guide["title"]),
        "description": convert(guide["description"]),
        "intro": convert(guide["intro"]),
        "serviceLabel": convert(guide["serviceLabel"]),
        "sections": [
            {"title": convert(s["title"]), "paragraphs": [convert(text) for text in s["paragraphs"]]}
            for s in guide["sections"]
        ]
    }
    if len(translated["sections"]) != len(guide["sections"]):
        raise ValueError("Section count mismatch")
    existing[slug] = translated
    translated_count += 1
    if translated_count % 25 == 0:
        print(f"Translated {translated_count} guides; at source position {index+1}/{len(source)}", flush=True)

# Only published source pages receive translation records.
valid_slugs = {guide["slug"] for guide in source}
result = {slug: existing[slug] for slug in sorted(valid_slugs) if slug in existing and existing[slug].get("sourceHash")}
if len(result) != len(source):
    raise SystemExit(f"Incomplete translation corpus: {len(result)} of {len(source)} source pages")
if len(polish_residue) > max(3, len(source)//20):
    raise SystemExit(f"Untranslated Polish paragraphs detected: {polish_residue[:10]}")
# Keep manually edited SEO headlines stable while their Polish source remains unchanged.
# This is a small editorial layer, not a claim of human review of the full translation.
editorial_path = Path("src/content/pseo/english-title-overrides.json")
editorial = json.loads(editorial_path.read_text("utf8")) if editorial_path.exists() else {}

glossary = [
    (r"\bSubabase\b", "Supabase"),
    (r"\bSubbase\b", "Supabase"),
    (r"\bConversations API\b", "Conversions API"),
    (r"\bleady\b", "leads"),
    (r"\bleades\b", "leads"),
    (r"\bdefloyment\b", "deployment"),
    (r"\bdefloy\b", "deploy"),
    (r"\btraders\b", "sales representatives"),
    (r"\btrader\b", "sales representative"),
    (r"\bmerchants\b", "sales representatives"),
    (r"\bmerchant\b", "sales representative"),
    (r"\bEscapulate\b", "Escape"),
    (r"\bbushes\b", "garbled characters"),
    (r"\bunique contrast\b", "unique constraint"),
]
def polish_technical_terminology(value):
    for pattern, replacement in glossary:
        value = re.sub(pattern, replacement, value, flags=re.IGNORECASE)
    return value

for slug, record in result.items():
    for field in ["title", "description", "intro", "serviceLabel"]:
        record[field] = polish_technical_terminology(record[field])
    for section in record["sections"]:
        section["title"] = polish_technical_terminology(section["title"])
        section["paragraphs"] = [polish_technical_terminology(p) for p in section["paragraphs"]]
    headline = editorial.get(slug, {})
    if headline.get("sourceHash") == record["sourceHash"] and headline.get("title"):
        record["title"] = headline["title"]

dest_path.parent.mkdir(parents=True, exist_ok=True)
dest_path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf8")
print(f"Done: {len(result)} English versions, {translated_count} newly translated, {len(cache)} unique segments.",flush=True)
if polish_residue:
    print("Manual review recommended for retained Polish phrases:",polish_residue[:5],flush=True)
