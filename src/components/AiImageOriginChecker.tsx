"use client";

import { useEffect, useState } from "react";
import { FileImage, LockKeyhole, SearchCheck, ShieldAlert } from "lucide-react";
import { inspectImageOrigin, type ImageOriginResult } from "@/lib/ai-image-origin";

type Language = "pl" | "en";

export function AiImageOriginChecker({ lang }: { lang: Language }) {
  const en = lang === "en";
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [result, setResult] = useState<ImageOriginResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => { URL.revokeObjectURL(url); setImageUrl(""); };
  }, [file]);

  async function analyze(selected: File | undefined) {
    setFile(null);
    setResult(null);
    setError("");
    if (!selected) return;
    if (selected.size > 20_000_000) {
      setError(en ? "The maximum file size is 20 MB." : "Maksymalny rozmiar pliku to 20 MB.");
      return;
    }
    if (!selected.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|heif|avif)$/i.test(selected.name)) {
      setError(en ? "Choose an image file." : "Wybierz plik ze zdjęciem.");
      return;
    }
    setFile(selected);
    setBusy(true);
    try {
      setResult(inspectImageOrigin(await selected.arrayBuffer()));
    } catch {
      setError(en ? "The image could not be inspected." : "Nie udało się odczytać metadanych zdjęcia.");
    } finally {
      setBusy(false);
    }
  }

  const verdict = result?.verdict;
  const status = !result ? "" : verdict === "ai-clues"
    ? en ? "AI generation clues found" : "Wykryto ślady narzędzi AI"
    : verdict === "credentials"
    ? en ? "Content Credentials marker found" : "Znaleziono znacznik Content Credentials"
    : verdict === "unsupported"
    ? en ? "Limited support for this format" : "Ograniczona obsługa tego formatu"
    : en ? "Origin cannot be determined" : "Nie udało się ustalić pochodzenia";

  return <section className="mx-auto max-w-4xl rounded-2xl border border-white/15 bg-[#111] p-5 sm:p-8">
    <div className="flex items-start gap-4">
      <div className="rounded-xl border border-white/20 bg-white/5 p-3"><FileImage size={25}/></div>
      <div>
        <h2 className="text-xl font-semibold">{en ? "Check an image" : "Prześlij zdjęcie do analizy"}</h2>
        <p className="mt-2 text-sm leading-6 text-white/60">{en ? "The file is inspected locally in your browser. It is not sent to our server." : "Plik analizowany jest lokalnie w przeglądarce. Nie wysyłamy go na serwer."}</p>
      </div>
    </div>

    <label className="mt-6 block cursor-pointer rounded-xl border border-dashed border-white/30 bg-[#171717] px-5 py-8 text-center transition-colors hover:border-white/65">
      <span className="block text-base font-medium">{en ? "Choose a photo" : "Wybierz zdjęcie"}</span>
      <span className="mt-2 block text-xs leading-6 text-white/50">JPEG, PNG, WebP · {en ? "up to" : "do"} 20 MB · HEIC/AVIF ({en ? "limited inspection" : "ograniczona analiza"})</span>
      <input type="file" accept="image/*,.heic,.heif,.avif" className="sr-only" aria-label={en ? "Select image file" : "Wybierz plik zdjęcia"}
        onChange={event => { void analyze(event.target.files?.[0]); event.target.value = ""; }}/>
    </label>

    {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
    {busy && <p role="status" className="mt-4 text-sm text-white/70">{en ? "Reading metadata…" : "Odczytywanie metadanych…"}</p>}

    {result && <div aria-live="polite" className="mt-6 space-y-5">
      <div className="grid gap-5 sm:grid-cols-[minmax(0,180px)_1fr]">
        {imageUrl && <img src={imageUrl} alt={en ? "Selected image preview" : "Podgląd wybranego zdjęcia"} className="max-h-52 w-full rounded-xl border border-white/15 bg-black object-contain"/>}
        <div className="rounded-xl border border-white/25 bg-[#1c1c1c] p-5">
          <p className="text-xs uppercase tracking-wider text-white/45">{en ? "Metadata result" : "Wynik analizy metadanych"}</p>
          <div className="mt-3 flex items-center gap-3">
            {verdict === "ai-clues" ? <SearchCheck size={22}/> : <ShieldAlert size={22}/>}
            <h3 className="text-lg font-semibold">{status}</h3>
          </div>
          <p className="mt-3 text-sm leading-6 text-white/65">{result.format} · {file?.name}</p>
          <p className="mt-3 text-sm leading-6 text-white/70">{verdict === "ai-clues"
            ? en ? "Generator-related names were found in image metadata. Metadata may be edited or forged, so this is not definitive proof." : "W metadanych znaleziono nazwy narzędzi generatywnych. Metadane można zmienić lub podrobić — to nie jest ostateczny dowód."
            : verdict === "credentials"
            ? en ? "A C2PA / Content Credentials marker exists, but its digital signature has not been verified." : "Obecny jest znacznik C2PA / Content Credentials, ale podpis cyfrowy nie został zweryfikowany."
            : verdict === "unsupported"
            ? en ? "This image container is not fully supported by the local metadata reader. Try a JPG or PNG export." : "Ten format nie jest w pełni obsługiwany przez lokalny czytnik metadanych. Spróbuj eksportu do JPG lub PNG."
            : en ? "No clear AI-generation metadata was found. This does not establish that the image is real or human-made." : "Nie znaleziono jednoznacznych śladów generatora AI. Nie oznacza to, że zdjęcie jest prawdziwe lub wykonane przez człowieka."}</p>
        </div>
      </div>
      {result.signals.length > 0 && <div className="rounded-xl border border-white/15 p-5">
        <p className="text-sm font-medium">{en ? "Found generator names" : "Wykryte nazwy generatorów"}</p>
        <div className="mt-3 flex flex-wrap gap-2">{result.signals.map(signal => <span className="rounded-full border border-white/20 px-3 py-1 text-xs" key={signal}>{signal}</span>)}</div>
      </div>}
      {result.hasCredentialsMarker && <p className="text-sm text-white/65">{en ? "A Content Credentials marker was detected; authenticity and signatures were not checked." : "Wykryto znacznik Content Credentials. Autentyczność i podpisy nie zostały sprawdzone."}</p>}
    </div>}

    <div className="mt-7 space-y-3 border-t border-white/15 pt-6">
      <p className="flex items-start gap-2 text-xs leading-6 text-white/55"><LockKeyhole size={16} className="mt-1 shrink-0"/>{en ? "Your image stays on your device. No account or upload is required." : "Zdjęcie pozostaje na Twoim urządzeniu. Nie wymagamy konta ani wysyłania pliku."}</p>
      <p className="text-xs leading-6 text-white/55"><strong className="text-white/80">{en ? "Important:" : "Ważne:"}</strong> {en ? "This is a metadata provenance check, not an AI image classifier. Many generated images contain no traceable metadata, and some real images carry AI-editor metadata. Never use this result alone as proof." : "To analiza pochodzenia na podstawie metadanych, nie klasyfikator obrazu AI. Wiele grafik wygenerowanych przez AI nie zawiera takich śladów, a prawdziwe zdjęcia mogą mieć metadane edytorów AI. Wynik nie jest dowodem."}</p>
    </div>
  </section>;
}
