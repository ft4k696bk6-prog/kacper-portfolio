"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowDown, ArrowUp, Check, ChevronLeft, ChevronRight, Download, FilePlus2, ImagePlus, LoaderCircle, PenLine, RotateCcw, RotateCw, Square, Trash2, Type, Undo2, Redo2, Upload, X, ZoomIn, ZoomOut } from "lucide-react";

type Page = { id: string; source: number | null; width: number; height: number; rotation: number };
type ElementKind = "text" | "image" | "rectangle" | "cover";
type Element = { id: string; pageId: string; kind: ElementKind; x: number; y: number; w: number; h: number; text: string; fontSize: number; color: string; fill: string; image?: string; bold: boolean };
type Snapshot = { pages: Page[]; elements: Element[] };
type TextSpot = { text: string; x: number; y: number; w: number; h: number };
const PDFJS_URL = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js";
const PDFJS_WORKER = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
const PDFLIB_URL = "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js";
const uid = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2));
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
let librariesPromise: Promise<{ pdfjs: any; pdflib: any }> | null = null;

function addScript(url: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="' + url + '"]');
    if (existing?.dataset.loaded === "true") { resolve(); return; }
    const script = existing || document.createElement("script");
    const onReady = () => { script.dataset.loaded = "true"; resolve(); };
    const onFail = () => { script.remove(); reject(new Error("Nie udało się pobrać biblioteki PDF. Sprawdź połączenie internetowe.")); };
    script.addEventListener("load", onReady, { once: true });
    script.addEventListener("error", onFail, { once: true });
    if (!existing) { script.src = url; script.async = true; document.head.appendChild(script); }
  });
}
async function pdfLibraries() {
  if (!librariesPromise) librariesPromise = Promise.all([addScript(PDFJS_URL), addScript(PDFLIB_URL)]).then(() => {
    const global = window as any;
    if (!global.pdfjsLib || !global.PDFLib) throw new Error("Brak silnika PDF.");
    global.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
    return { pdfjs: global.pdfjsLib, pdflib: global.PDFLib };
  }).catch(error => { librariesPromise = null; throw error; });
  return librariesPromise;
}
function snapshot(pages: Page[], elements: Element[]): Snapshot {
  return { pages: pages.map(p => ({ ...p })), elements: elements.map(e => ({ ...e })) };
}
function wrappedLines(ctx: CanvasRenderingContext2D, text: string, width: number) {
  const out: string[] = [];
  for (const paragraph of text.split("\n")) {
    if (!paragraph) { out.push(""); continue; }
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? line + " " + word : word;
      if (line && ctx.measureText(candidate).width > width) { out.push(line); line = word; }
      else line = candidate;
    }
    out.push(line);
  }
  return out;
}
async function elementPng(element: Element): Promise<string> {
  const ratio = 2.5;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.round(element.w * ratio));
  canvas.height = Math.max(2, Math.round(element.h * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas niedostępny.");
  ctx.scale(ratio, ratio);
  ctx.fillStyle = element.color;
  ctx.font = (element.bold ? "700 " : "400 ") + element.fontSize + "px Arial, sans-serif";
  ctx.textBaseline = "top";
  const lines = wrappedLines(ctx, element.text, element.w - 8);
  lines.forEach((line, i) => {
    if ((i + 1) * element.fontSize * 1.35 <= element.h + element.fontSize * .2) ctx.fillText(line, 4, 2 + i * element.fontSize * 1.35);
  });
  return canvas.toDataURL("image/png");
}
function downloadBlob(bytes: Uint8Array, name: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 12000);
}
const action = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm text-white/85 transition hover:border-white/60 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35";
const input = "min-h-11 w-full rounded-xl border border-white/20 bg-[#191919] px-3 py-2 text-base text-white outline-none focus:border-white/65";

export function PdfEditor({ lang = "pl" }: { lang?: "pl" | "en" }) {
  const en = lang === "en";
  const t = useCallback((pl: string, english: string) => en ? english : pl, [en]);
  const [pages, setPages] = useState<Page[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [activeId, setActiveId] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [filename, setFilename] = useState("dokument.pdf");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [zoom, setZoom] = useState(1);
  const [textSpots, setTextSpots] = useState<TextSpot[]>([]);
  const [pickText, setPickText] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [thumbnailUrls, setThumbnailUrls] = useState<Record<number, string>>({});
  const currentPdf = useRef<any>(null);
  const originalBytes = useRef<Uint8Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const signatureRef = useRef<HTMLCanvasElement>(null);
  const imageInput = useRef<HTMLInputElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const drag = useRef<{ id: string; startX: number; startY: number; x: number; y: number } | null>(null);
  const drawing = useRef(false);
  const history = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const pagesRef = useRef(pages);
  const elementsRef = useRef(elements);
  pagesRef.current = pages;
  elementsRef.current = elements;
  const activeIndex = pages.findIndex(p => p.id === activeId);
  const activePage = pages[activeIndex] || null;
  const activeElement = elements.find(e => e.id === selectedId) || null;
  const pageElements = elements.filter(e => e.pageId === activeId);
  const saveHistory = useCallback(() => {
    history.current = [...history.current.slice(-29), snapshot(pagesRef.current, elementsRef.current)];
    future.current = [];
  }, []);
  const undo = useCallback(() => {
    if (!history.current.length) return;
    future.current.push(snapshot(pagesRef.current, elementsRef.current));
    const prev = history.current.pop()!;
    setPages(prev.pages); setElements(prev.elements); setSelectedId("");
    if (!prev.pages.some(p => p.id === activeId)) setActiveId(prev.pages[0]?.id || "");
  }, [activeId]);
  const redo = useCallback(() => {
    if (!future.current.length) return;
    history.current.push(snapshot(pagesRef.current, elementsRef.current));
    const next = future.current.pop()!;
    setPages(next.pages); setElements(next.elements); setSelectedId("");
    if (!next.pages.some(p => p.id === activeId)) setActiveId(next.pages[0]?.id || "");
  }, [activeId]);
  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "z") return;
      const target = e.target as HTMLElement;
      if (target.closest("input,textarea,[contenteditable]")) return;
      e.preventDefault();
      if (e.shiftKey) redo(); else undo();
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [undo, redo]);

  const openFile = async (file: File) => {
    setError(""); setNotice("");
    if (!/\.pdf$/i.test(file.name) && file.type !== "application/pdf") { setError(t("Wybierz plik PDF.", "Choose a PDF file.")); return; }
    if (file.size > 30 * 1024 * 1024) { setError(t("Limit pliku to 30 MB.", "File limit is 30 MB.")); return; }
    setBusy(t("Otwieranie dokumentu…", "Opening document…"));
    try {
      const { pdfjs } = await pdfLibraries();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const document = await pdfjs.getDocument({ data: bytes.slice(), useSystemFonts: true }).promise;
      if (document.numPages > 120) { await document.destroy(); throw new Error(t("Maksymalnie 120 stron na dokument.", "Maximum 120 pages per document.")); }
      const next: Page[] = [];
      for (let i = 1; i <= document.numPages; i++) {
        const page = await document.getPage(i);
        const v = page.view;
        next.push({ id: uid(), source: i - 1, width: v[2] - v[0], height: v[3] - v[1], rotation: 0 });
        page.cleanup();
      }
      if (currentPdf.current) await currentPdf.current.destroy();
      currentPdf.current = document;
      originalBytes.current = bytes;
      setPages(next); setElements([]); setActiveId(next[0]?.id || "");
      setSelectedId(""); setTextSpots([]); setThumbnailUrls({});
      setFilename(file.name); setZoom(.95);
      history.current = []; future.current = [];
      setNotice(t("Dokument otwarty. Zmiany zapiszą się dopiero po pobraniu.", "Document opened. Changes are saved when you download."));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Nie można odczytać dokumentu. Pliki szyfrowane mogą nie być obsługiwane.", "Could not read PDF. Encrypted files may not be supported."));
    } finally { setBusy(""); }
  };
  const createBlank = () => {
    saveHistory();
    originalBytes.current = null;
    if (currentPdf.current) void currentPdf.current.destroy();
    currentPdf.current = null;
    const p = { id: uid(), source: null, width: 595, height: 842, rotation: 0 };
    setPages([p]); setElements([]); setActiveId(p.id); setSelectedId(""); setFilename("nowy-dokument.pdf"); setThumbnailUrls({});
    setNotice(t("Pusty dokument A4 jest gotowy.", "A blank A4 document is ready.")); setError("");
    history.current = []; future.current = [];
  };

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas || !activePage) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      setTextSpots([]);
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      const page = activePage;
      try {
        const proxy = page.source === null ? null : await currentPdf.current?.getPage(page.source + 1);
        if (cancelled) return;
        const viewport = proxy?.getViewport({ scale: zoom, rotation: 0 });
        const w = viewport?.width || page.width * zoom;
        const h = viewport?.height || page.height * zoom;
        canvas.width = Math.ceil(w * ratio); canvas.height = Math.ceil(h * ratio);
        canvas.style.width = w + "px"; canvas.style.height = h + "px";
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (proxy) {
          const rv = proxy.getViewport({ scale: zoom * ratio, rotation: 0 });
          await proxy.render({ canvasContext: ctx, viewport: rv }).promise;
          if (cancelled) return;
          const contents = await proxy.getTextContent();
          const spots: TextSpot[] = [];
          for (const item of contents.items) {
            if (!item.str || !item.transform || !item.width) continue;
            const tx = (window as any).pdfjsLib.Util.transform(viewport.transform, item.transform);
            const height = Math.max(9, Math.abs(item.height || Math.hypot(tx[2], tx[3]) / zoom)) * zoom;
            const x = tx[4] / zoom;
            const y = (tx[5] - height) / zoom;
            if (Number.isFinite(x) && Number.isFinite(y) && y >= -5 && x >= -5) spots.push({ text: item.str, x, y, w: Math.max(item.width, 10), h: height / zoom + 4 });
          }
          if (!cancelled) setTextSpots(spots);
        }
      } catch { if (!cancelled) setError(t("Nie udało się wyświetlić tej strony PDF.", "Could not render this PDF page.")); }
    };
    void render();
    return () => { cancelled = true; };
  }, [activePage?.id, activePage?.source, activePage?.width, activePage?.height, zoom, t]); 
  // Thumbnails are lazy and capped; the complete document remains editable.
  useEffect(() => {
    let cancelled = false;
    const preview = async () => {
      const pdf = currentPdf.current;
      if (!pdf) return;
      const urls: Record<number, string> = {};
      try {
        const sources = [...new Set(pages.map(p => p.source).filter((s): s is number => s !== null))].slice(0, 24);
        for (const source of sources) {
          if (cancelled) return;
          const pg = await pdf.getPage(source + 1);
          const v = pg.getViewport({ scale: .18, rotation: 0 });
          const c = document.createElement("canvas");
          c.width = Math.ceil(v.width); c.height = Math.ceil(v.height);
          const ctx = c.getContext("2d");
          if (!ctx) continue;
          await pg.render({ canvasContext: ctx, viewport: v }).promise;
          urls[source] = c.toDataURL("image/png");
          if (cancelled) return;
          setThumbnailUrls(previous => ({ ...previous, [source]: urls[source] }));
        }
      } catch { /* thumbnails are optional */ }
    };
    void preview();
    return () => { cancelled = true; };
  }, [filename]);

  const addElement = (kind: ElementKind, overrides: Partial<Element> = {}) => {
    if (!activePage) return;
    saveHistory();
    const w = kind === "text" ? 240 : 175;
    const h = kind === "text" ? 56 : 110;
    const el: Element = { id: uid(), pageId: activeId, kind, x: Math.max(10, (activePage.width - w) / 2), y: Math.max(10, (activePage.height - h) / 2), w, h,
      text: t("Nowy tekst", "New text"), fontSize: 20, color: "#171717", fill: kind === "cover" ? "#ffffff" : "#e5e7eb", bold: false, ...overrides };
    setElements(prev => [...prev, el]); setSelectedId(el.id); setPickText(false);
  };
  const addReplacement = (spot: TextSpot) => {
    if (!activePage) return;
    saveHistory();
    const x = clamp(spot.x, 0, activePage.width - 10);
    const y = clamp(spot.y, 0, activePage.height - 10);
    const w = Math.min(activePage.width - x, Math.max(spot.w + 12, 65));
    const h = Math.min(activePage.height - y, Math.max(spot.h + 5, 18));
    const cover: Element = { id: uid(), pageId: activeId, kind: "cover", x, y, w, h, text: "", fontSize: 14, color: "#000000", fill: "#ffffff", bold: false };
    const el: Element = { ...cover, id: uid(), kind: "text", text: spot.text, w: Math.max(w, 130), h: Math.max(h, 38), fontSize: Math.min(20, Math.max(10, spot.h * .88)) };
    setElements(prev => [...prev, cover, el]); setSelectedId(el.id); setPickText(false);
    setNotice(t("Podmiana jest wizualną nakładką. Oryginalny tekst pozostaje w pliku — nie używaj tego do usuwania poufnych danych.", "Replacement uses a visual cover. Original text remains in the PDF — do not use this to redact confidential data."));
  };
  const changeElement = (changes: Partial<Element>) => setElements(prev => prev.map(el => el.id === selectedId ? { ...el, ...changes } : el));
  const deleteElement = () => { if (!selectedId) return; saveHistory(); setElements(prev => prev.filter(el => el.id !== selectedId)); setSelectedId(""); };
  const reorderPage = (shift: number) => {
    if (activeIndex < 0 || activeIndex + shift < 0 || activeIndex + shift >= pages.length) return;
    saveHistory();
    setPages(prev => { const next = [...prev]; const tmp = next[activeIndex]; next[activeIndex] = next[activeIndex + shift]; next[activeIndex + shift] = tmp; return next; });
  };
  const duplicatePage = () => {
    if (!activePage) return;
    saveHistory();
    const id = uid(); const cloned = { ...activePage, id };
    setPages(prev => [...prev.slice(0, activeIndex + 1), cloned, ...prev.slice(activeIndex + 1)]);
    setElements(prev => [...prev, ...pageElements.map(el => ({ ...el, id: uid(), pageId: id }))]);
    setActiveId(id); setSelectedId("");
  };
  const addPage = () => {
    saveHistory();
    const base = activePage || { width: 595, height: 842 };
    const pg: Page = { id: uid(), source: null, width: base.width, height: base.height, rotation: 0 };
    setPages(prev => [...prev.slice(0, activeIndex + 1), pg, ...prev.slice(activeIndex + 1)]);
    setActiveId(pg.id); setSelectedId("");
  };
  const deletePage = () => {
    if (pages.length === 1) { setError(t("Dokument musi zawierać przynajmniej jedną stronę.", "A PDF must contain at least one page.")); return; }
    saveHistory();
    setPages(prev => prev.filter(p => p.id !== activeId));
    setElements(prev => prev.filter(el => el.pageId !== activeId));
    setActiveId(pages[activeIndex === pages.length - 1 ? activeIndex - 1 : activeIndex + 1].id); setSelectedId("");
  };
  const rotatePage = () => {
    if (!activePage) return;
    saveHistory(); setPages(prev => prev.map(pg => pg.id === activeId ? { ...pg, rotation: (pg.rotation + 90) % 360 } : pg));
    setNotice(t("Obrót strony będzie widoczny w pobranym pliku.", "Page rotation is applied in the downloaded file."));
  };

  const insertImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !activePage) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setError(t("Obsługiwane obrazy: PNG, JPG, WebP.", "Supported images: PNG, JPG, WebP.")); return; }
    if (file.size > 8 * 1024 * 1024) { setError(t("Obraz może mieć maksymalnie 8 MB.", "Images can be up to 8 MB.")); return; }
    try {
      const url = URL.createObjectURL(file);
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      const factor = Math.min(1, 3000 / Math.max(image.naturalWidth, image.naturalHeight));
      canvas.width = Math.round(image.naturalWidth * factor); canvas.height = Math.round(image.naturalHeight * factor);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas unavailable");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/png");
      URL.revokeObjectURL(url);
      const width = Math.min(240, activePage.width * .75);
      addElement("image", { image: data, text: "", w: width, h: width * canvas.height / canvas.width });
    } catch { setError(t("Nie udało się otworzyć obrazu.", "Could not read image.")); }
  };

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>, el: Element) => {
    if (event.button !== 0) return;
    event.stopPropagation(); event.preventDefault();
    saveHistory(); setSelectedId(el.id);
    drag.current = { id: el.id, x: el.x, y: el.y, startX: event.clientX, startY: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !activePage) return;
    const el = elementsRef.current.find(x => x.id === d.id);
    if (!el) return;
    const dx = (event.clientX - d.startX) / zoom, dy = (event.clientY - d.startY) / zoom;
    const x = clamp(d.x + dx, 0, activePage.width - el.w);
    const y = clamp(d.y + dy, 0, activePage.height - el.h);
    setElements(prev => prev.map(item => item.id === d.id ? { ...item, x, y } : item));
  };

  const signaturePointer = (event: ReactPointerEvent<HTMLCanvasElement>, step: "start" | "move" | "end") => {
    const canvas = signatureRef.current, ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (step === "end") { drawing.current = false; return; }
    if (step === "move" && !drawing.current) return;
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * canvas.width / rect.width, y = (event.clientY - rect.top) * canvas.height / rect.height;
    if (step === "start") { drawing.current = true; canvas.setPointerCapture(event.pointerId); ctx.beginPath(); ctx.moveTo(x, y); }
    else { ctx.lineTo(x, y); ctx.lineWidth = 3.4; ctx.strokeStyle = "#111111"; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.stroke(); }
  };

  const exportPdf = async () => {
    if (!pages.length) return;
    setBusy(t("Zapisywanie PDF…", "Saving PDF…")); setError("");
    try {
      const { pdflib } = await pdfLibraries();
      const output = await pdflib.PDFDocument.create();
      const original = originalBytes.current ? await pdflib.PDFDocument.load(originalBytes.current.slice()) : null;
      for (const entry of pages) {
        const page = entry.source === null ? output.addPage([entry.width, entry.height]) : (await output.copyPages(original, [entry.source]))[0];
        if (entry.source !== null) output.addPage(page);
        const rotation = ((page.getRotation().angle + entry.rotation) % 360 + 360) % 360;
        if (rotation) page.setRotation(pdflib.degrees(rotation));
        for (const el of elements.filter(e => e.pageId === entry.id)) {
          const x = clamp(el.x, 0, entry.width);
          const y = entry.height - el.y - el.h;
          if (el.kind === "rectangle" || el.kind === "cover") {
            const hex = el.fill.replace("#", "");
            const rgb = (start: number) => parseInt(hex.slice(start, start + 2), 16) / 255;
            page.drawRectangle({ x, y, width: el.w, height: el.h, color: pdflib.rgb(rgb(0), rgb(2), rgb(4)) });
          } else {
            const data = el.kind === "text" ? await elementPng(el) : el.image;
            if (!data) continue;
            const embedded = await output.embedPng(data);
            page.drawImage(embedded, { x, y, width: el.w, height: el.h });
          }
        }
      }
      const bytes = await output.save();
      downloadBlob(bytes, filename.replace(/\.pdf$/i, "") + "-edytowany.pdf");
      setNotice(t("PDF pobrany. Oryginalny dokument nie został nadpisany.", "PDF downloaded. Your original file is unchanged."));
    } catch (e) {
      setError(e instanceof Error ? e.message : t("Nie udało się wyeksportować PDF.", "PDF export failed."));
    } finally { setBusy(""); }
  };

  return <section className="rounded-[1.7rem] border border-white/15 bg-[#101010] p-3 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-white/45">{t("DARMOWY EDYTOR PDF", "FREE PDF EDITOR")}</p>
        <h2 className="mt-1 text-lg font-semibold">{pages.length ? filename : t("Otwórz PDF lub utwórz pustą stronę", "Open a PDF or start blank")}</h2>
        <p className="mt-1 text-xs leading-5 text-white/50">{t("Bez konta, bez karty, bez wysyłania pliku na serwer.", "No sign-up, no card, no document uploads.")}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        <input ref={fileInput} type="file" accept=".pdf,application/pdf" className="hidden" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void openFile(file); }}/>
        <button type="button" className={action} disabled={!!busy} onClick={() => fileInput.current?.click()}><Upload size={16}/>{t("Otwórz PDF", "Open PDF")}</button>
        <button type="button" className={action} disabled={!!busy} onClick={createBlank}><FilePlus2 size={16}/>{t("Nowy A4", "New A4")}</button>
        <button type="button" className={action + " border-white/55 bg-white text-black hover:bg-white/85 hover:text-black"} disabled={!pages.length || !!busy} onClick={() => void exportPdf()}><Download size={16}/>{t("Pobierz PDF", "Download PDF")}</button>
      </div>
    </div>
    {!!busy && <p role="status" className="mt-4 flex items-center gap-2 text-sm text-white/70"><LoaderCircle size={17} className="animate-spin"/>{busy}</p>}
    {!!error && <p role="alert" className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
    {!!notice && <p role="status" className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-6 text-white/65">{notice}</p>}
    {!pages.length ? <div className="mt-5 rounded-2xl border border-dashed border-white/25 p-10 text-center sm:p-16" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) void openFile(f); }}>
      <Upload size={32} className="mx-auto text-white/55"/><h3 className="mt-5 text-xl font-semibold">{t("Upuść PDF tutaj", "Drop a PDF here")}</h3>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/55">{t("Dodawaj tekst, obrazy, podpis, prostokąty i strony. Zmieniaj kolejność i zapisuj gotowy plik. Dokument przetwarzany jest na Twoim urządzeniu.", "Add text, images, signatures, shapes and pages. Reorder, annotate and download your result. The PDF is processed on your device.")}</p>
      <button type="button" className={action + " mt-6"} onClick={() => fileInput.current?.click()}>{t("Wybierz plik PDF", "Choose a PDF")}</button>
    </div> : <>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" className={action} onClick={() => addElement("text")}><Type size={16}/>{t("Tekst", "Text")}</button>
        <input ref={imageInput} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => void insertImage(e)}/>
        <button type="button" className={action} onClick={() => imageInput.current?.click()}><ImagePlus size={16}/>{t("Obraz / logo", "Image / logo")}</button>
        <button type="button" className={action} onClick={() => setShowSignature(true)}><PenLine size={16}/>{t("Podpis", "Signature")}</button>
        <button type="button" className={action} onClick={() => addElement("rectangle")}><Square size={16}/>{t("Kształt", "Shape")}</button>
        <button type="button" className={action} onClick={() => addElement("cover", { w: 220, h: 38, text: "" })}>{t("Zakryj fragment", "Visual cover")}</button>
        <button type="button" className={action + (pickText ? " border-white bg-white/10" : "")} onClick={() => setPickText(!pickText)}>{t("Kliknij tekst PDF", "Select PDF text")}</button>
        <span className="mx-1 h-5 border-l border-white/15"/>
        <button type="button" className={action} disabled={!history.current.length} onClick={undo} aria-label={t("Cofnij", "Undo")}><Undo2 size={16}/></button>
        <button type="button" className={action} disabled={!future.current.length} onClick={redo} aria-label={t("Ponów", "Redo")}><Redo2 size={16}/></button>
      </div>
      <div className="mt-5 grid min-w-0 gap-4 xl:grid-cols-[160px_minmax(0,1fr)_240px]">
        <aside className="min-w-0 rounded-xl border border-white/10 bg-[#151515] p-3">
          <div className="flex items-center justify-between gap-2"><h3 className="text-sm font-semibold">{t("Strony", "Pages")} ({pages.length})</h3><button type="button" onClick={addPage} title={t("Dodaj pustą stronę", "Add blank page")} className={action}><FilePlus2 size={15}/></button></div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-2 xl:max-h-[625px] xl:flex-col xl:overflow-y-auto">
            {pages.map((p, i) => <button type="button" key={p.id} onClick={() => { setActiveId(p.id); setSelectedId(""); }} className={"flex min-w-[95px] shrink-0 flex-col items-center rounded-xl border p-2 transition xl:w-full " + (p.id === activeId ? "border-white/65 bg-white/10" : "border-white/10 hover:border-white/35")}>
              <div className="flex h-[110px] w-[80px] items-center justify-center overflow-hidden rounded-md bg-white text-zinc-600">
                {p.source !== null && thumbnailUrls[p.source] ? <img src={thumbnailUrls[p.source]} alt="" className="max-h-full max-w-full object-contain"/> : <span className="text-xs">{p.source === null ? "A4" : "PDF"}</span>}
              </div>
              <span className="mt-2 text-xs">{t("Strona", "Page")} {i + 1}</span>
            </button>)}
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1">
            <button type="button" className={action} onClick={() => reorderPage(-1)} disabled={activeIndex <= 0} title={t("Przesuń w górę", "Move up")}><ArrowUp size={15}/></button>
            <button type="button" className={action} onClick={() => reorderPage(1)} disabled={activeIndex >= pages.length - 1} title={t("Przesuń w dół", "Move down")}><ArrowDown size={15}/></button>
            <button type="button" className={action} onClick={duplicatePage} title={t("Duplikuj stronę", "Duplicate page")}><FilePlus2 size={15}/></button>
            <button type="button" className={action} onClick={deletePage} title={t("Usuń stronę", "Delete page")}><Trash2 size={15}/></button>
          </div>
          <button type="button" className={action + " mt-2 w-full"} onClick={rotatePage}><RotateCw size={15}/>{t("Obróć 90°", "Rotate 90°")}</button>
        </aside>
        <div className="min-w-0 rounded-xl border border-white/10 bg-[#202020]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
            <div className="flex items-center gap-1 text-xs text-white/60">
              <button type="button" className={action} disabled={activeIndex <= 0} onClick={() => setActiveId(pages[activeIndex - 1].id)} aria-label={t("Poprzednia", "Previous")}><ChevronLeft size={15}/></button>
              {activeIndex + 1} / {pages.length}
              <button type="button" className={action} disabled={activeIndex >= pages.length - 1} onClick={() => setActiveId(pages[activeIndex + 1].id)} aria-label={t("Następna", "Next")}><ChevronRight size={15}/></button>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className={action} onClick={() => setZoom(v => clamp(+(v - .1).toFixed(2), .35, 1.6))} aria-label={t("Pomniejsz", "Zoom out")}><ZoomOut size={15}/></button>
              <span className="min-w-11 text-center text-xs text-white/65">{Math.round(zoom * 100)}%</span>
              <button type="button" className={action} onClick={() => setZoom(v => clamp(+(v + .1).toFixed(2), .35, 1.6))} aria-label={t("Powiększ", "Zoom in")}><ZoomIn size={15}/></button>
            </div>
          </div>
          <div className="max-h-[780px] min-h-[430px] overflow-auto p-4 sm:p-6">
            <div className="relative mx-auto bg-white shadow-2xl" style={{ width: activePage.width * zoom, height: activePage.height * zoom }} onClick={() => setSelectedId("")}>
              <canvas ref={canvasRef} className="block"/>
              {pickText && textSpots.map((spot, i) => <button key={i} type="button" aria-label={t("Zastąp tekst: ", "Replace text: ") + spot.text} title={spot.text} onClick={e => { e.stopPropagation(); addReplacement(spot); }}
                className="absolute z-10 cursor-text rounded-sm bg-amber-400/15 outline outline-1 outline-amber-400/35 hover:bg-amber-400/35" style={{ left: spot.x * zoom, top: spot.y * zoom, width: spot.w * zoom, height: spot.h * zoom }}/>)}
              {pageElements.map(el => <div key={el.id} role="button" tabIndex={0} aria-label={t("Przesuń element", "Move element")} onKeyDown={e => { if (e.key === "Enter") { e.stopPropagation(); setSelectedId(el.id); } }}
                onClick={e => { e.stopPropagation(); setSelectedId(el.id); }}
                onPointerDown={e => startDrag(e, el)} onPointerMove={moveDrag} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}
                className={"absolute select-none overflow-hidden border border-dashed touch-none " + (el.id === selectedId ? "z-20 border-blue-600 bg-blue-500/5" : "z-[5] border-transparent hover:border-blue-400/70")}
                style={{ left: el.x * zoom, top: el.y * zoom, width: el.w * zoom, height: el.h * zoom, cursor: "grab" }}>
                {el.kind === "text" ? <div style={{ width: "100%", height: "100%", padding: 4 * zoom, fontFamily: "Arial, sans-serif", fontSize: el.fontSize * zoom, fontWeight: el.bold ? 700 : 400, lineHeight: 1.35, color: el.color, whiteSpace: "pre-wrap", overflow: "hidden", overflowWrap: "break-word" }}>{el.text}</div>
                : el.kind === "image" && el.image ? <img src={el.image} alt={t("Dodany obraz", "Inserted image")} className="h-full w-full object-fill" draggable={false}/>
                : <div className="h-full w-full" style={{ backgroundColor: el.fill }}/>}
              </div>)}
            </div>
          </div>
        </div>
        <aside className="min-w-0 rounded-xl border border-white/10 bg-[#151515] p-4">
          <h3 className="text-sm font-semibold">{t("Właściwości", "Properties")}</h3>
          {activeElement ? <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between"><p className="text-xs text-white/65">{activeElement.kind === "text" ? t("Pole tekstowe", "Text field") : activeElement.kind === "image" ? t("Obraz", "Image") : t("Kształt", "Shape")}</p><button type="button" className={action} onClick={deleteElement} aria-label={t("Usuń element", "Delete element")}><Trash2 size={15}/></button></div>
            {activeElement.kind === "text" && <>
              <label className="block text-xs text-white/60">{t("Treść tekstu", "Text content")}<textarea className={input + " mt-2 min-h-[115px] resize-y"} value={activeElement.text} onFocus={saveHistory} onChange={e => changeElement({ text: e.target.value })}/></label>
              <label className="block text-xs text-white/60">{t("Rozmiar czcionki", "Font size")}<input type="number" min="8" max="72" className={input + " mt-2"} value={activeElement.fontSize} onFocus={saveHistory} onChange={e => changeElement({ fontSize: clamp(Number(e.target.value) || 8, 8, 72) })}/></label>
              <label className="flex items-center gap-2 text-xs text-white/60"><input type="checkbox" checked={activeElement.bold} onChange={e => { saveHistory(); changeElement({ bold: e.target.checked }); }}/>{t("Pogrubienie", "Bold")}</label>
            </>}
            {(activeElement.kind === "text" || activeElement.kind === "cover" || activeElement.kind === "rectangle") && <label className="block text-xs text-white/60">{activeElement.kind === "text" ? t("Kolor tekstu", "Text color") : t("Kolor wypełnienia", "Fill color")}<input type="color" className="mt-2 block h-11 w-full rounded-md border border-white/20 bg-[#191919] p-1" value={activeElement.kind === "text" ? activeElement.color : activeElement.fill} onFocus={saveHistory} onChange={e => changeElement(activeElement.kind === "text" ? { color: e.target.value } : { fill: e.target.value })}/></label>}
            <div className="grid grid-cols-2 gap-2">
              {(["w", "h", "x", "y"] as const).map(key => <label key={key} className="block text-xs text-white/60">{key === "w" ? t("Szerokość", "Width") : key === "h" ? t("Wysokość", "Height") : key === "x" ? "X" : "Y"}
                <input type="number" min="0" className={input + " mt-2"} value={Math.round(activeElement[key])} onFocus={saveHistory} onChange={e => changeElement({ [key]: clamp(Number(e.target.value) || 0, 0, key === "x" ? activePage.width - activeElement.w : key === "y" ? activePage.height - activeElement.h : key === "w" ? activePage.width - activeElement.x : activePage.height - activeElement.y) })}/></label>)}
            </div>
            <p className="text-xs leading-5 text-white/45">{t("Przeciągnij element na podglądzie, aby go przesunąć.", "Drag an element on the page to move it.")}</p>
          </div> : <p className="mt-4 text-xs leading-6 text-white/50">{t("Kliknij dodany element, aby edytować treść, rozmiar i pozycję. Aby podmienić tekst istniejącego PDF-a, włącz „Kliknij tekst PDF”.", "Select an inserted element to edit its content, size and position. To visually replace existing text, use Select PDF text.")}</p>}
          <div className="mt-7 border-t border-white/10 pt-5 text-xs leading-6 text-white/50">
            <p className="font-semibold text-white/70">{t("Ważne ograniczenie", "Important limitation")}</p>
            <p className="mt-2">{t("W istniejącym PDF podmiana tekstu zakrywa stary fragment i nakłada nowy. Nie usuwa tekstu z warstwy źródłowej i nie służy do bezpiecznej anonimizacji.", "Replacing existing PDF text visually covers it, then overlays new text. The underlying text remains in the source layer. Not suitable for secure redaction.")}</p>
            <p className="mt-2">{t("Edycja odbywa się lokalnie w przeglądarce. Brak automatycznego zapisu w chmurze.", "Editing happens locally in your browser. There is no automatic cloud save.")}</p>
          </div>
        </aside>
      </div>
    </>}
    {showSignature && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4" onClick={() => setShowSignature(false)}>
      <div className="w-full max-w-xl rounded-2xl border border-white/20 bg-[#171717] p-5 sm:p-7" role="dialog" aria-modal="true" aria-label={t("Rysuj podpis", "Draw signature")} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h3 className="text-lg font-semibold">{t("Narysuj podpis", "Draw your signature")}</h3><button type="button" className={action} onClick={() => setShowSignature(false)} aria-label={t("Zamknij", "Close")}><X size={18}/></button></div>
        <p className="mt-2 text-sm text-white/55">{t("Użyj palca, myszy albo rysika. Podpis zostanie dodany jako obraz.", "Use your finger, mouse, or stylus. The signature is inserted as an image.")}</p>
        <canvas ref={signatureRef} width={560} height={190} className="mt-5 w-full rounded-xl bg-white" style={{ touchAction: "none" }}
          onPointerDown={e => signaturePointer(e, "start")} onPointerMove={e => signaturePointer(e, "move")} onPointerUp={e => signaturePointer(e, "end")} onPointerCancel={e => signaturePointer(e, "end")}/>
        <div className="mt-4 flex flex-wrap justify-end gap-2"><button type="button" className={action} onClick={() => signatureRef.current?.getContext("2d")?.clearRect(0, 0, 560, 190)}><RotateCcw size={15}/>{t("Wyczyść", "Clear")}</button>
          <button type="button" className={action + " border-white/50 bg-white text-black hover:bg-white/90 hover:text-black"} onClick={() => { const src = signatureRef.current?.toDataURL("image/png"); if (src) addElement("image", { image: src, w: 240, h: 82, text: "" }); setShowSignature(false); }}><Check size={15}/>{t("Dodaj podpis", "Insert signature")}</button></div>
      </div>
    </div>}
  </section>;
}
