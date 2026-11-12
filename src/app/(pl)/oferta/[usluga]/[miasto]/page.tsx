import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cityExamples, getLocalOffer, getServiceCity, localOffers, serviceCities } from "@/lib/local-offers";
import { getGoogleAdsCityPlan } from "@/lib/google-ads-local";

type Props = { params: Promise<{ usluga: string; miasto: string }> };
const site = "https://bernecki.dev";

export const dynamicParams = false;
export function generateStaticParams() {
  return localOffers.flatMap((offer) =>
    serviceCities.map((city) => ({ usluga: offer.slug, miasto: city.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { usluga, miasto } = await params;
  const city = getServiceCity(miasto);
  const offer = getLocalOffer(usluga);
  if (!city || !offer) return {};
  const title = offer.title + " " + city.name + " | Oferta dla firm – Bernecki";
  const description = offer.title + " dla firm " + city.from + ". " + offer.intro + " Konsultacja i wycena online, współpraca w całej Polsce.";
  const url = site + "/oferta/" + offer.slug + "/" + city.slug;
  return {
    title: { absolute: title },
    description: description.slice(0, 260),
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, locale: "pl_PL", type: "website" },
  };
}

export default async function LocalOfferPage({ params }: Props) {
  const { usluga, miasto } = await params;
  const city = getServiceCity(miasto);
  const offer = getLocalOffer(usluga);
  if (!city || !offer) notFound();

  const url = site + "/oferta/" + offer.slug + "/" + city.slug;
  const faq = [
    {
      q: "Czy realizujesz projekty dla firm " + city.from + " bez lokalnego biura?",
      a: "Tak. Wymagania, rozmowy, prezentację projektu, testy i odbiór można przeprowadzić zdalnie. Nie deklaruję biura ani stałej obecności na miejscu " + city.where + ".",
    },
    {
      q: "Ile kosztuje " + offer.title.toLocaleLowerCase("pl") + "?",
      a: "Koszt zależy od stanu obecnego rozwiązania, liczby funkcji, integracji i koniecznych testów. Po krótkim omówieniu celu przygotowuję zakres i indywidualną wycenę.",
    },
    {
      q: "Od czego zacząć współpracę?",
      a: "Wystarczy opisać cel, obecną sytuację, narzędzia i oczekiwany termin. Ustalimy, co jest niezbędne, a co można odłożyć na kolejny etap.",
    },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": url + "#webpage", url, name: offer.title + " – " + city.name, inLanguage: "pl-PL",
        isPartOf: { "@id": site + "/#website" } },
      { "@type": "Service", "@id": url + "#service", name: offer.title, description: offer.intro,
        areaServed: { "@type": "City", name: city.name },
        serviceType: offer.title, provider: { "@type": "Person", name: "Kacper Bernecki", url: site } },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Start", item: site },
        { "@type": "ListItem", position: 2, name: "Usługi", item: site + "/uslugi" },
        { "@type": "ListItem", position: 3, name: city.name, item: site + "/uslugi/" + city.slug },
        { "@type": "ListItem", position: 4, name: offer.title, item: url },
      ] },
    ],
  };
  const similar = localOffers.filter((other) => other.slug !== offer.slug).slice(0, 5);
  const localAdsPlan = ["google-ads", "audyt-google-ads"].includes(offer.slug) ? getGoogleAdsCityPlan(city.slug) : undefined;

  const relatedGuides = offer.slug === "reklamy-meta" ? [
    ["Reklamy Meta nie działają — diagnostyka", "/poradniki/reklamy-meta-nie-dzialaja"],
    ["Reklamy Facebook nie działają", "/poradniki/reklamy-facebook-nie-dzialaja"],
    ["Reklamy Instagram nie działają", "/poradniki/reklamy-instagram-nie-dzialaja"],
    ["Jak poprawić reklamy w internecie?", "/poradniki/jak-poprawic-reklamy"],
  ] : offer.slug === "google-ads" || offer.slug === "audyt-google-ads" ? [
    ["Google Ads nie działa? Co sprawdzić", "/poradniki/google-ads-nie-dziala-co-sprawdzic"],
    ["Dlaczego Google Ads nie ma konwersji?", "/poradniki/google-ads-brak-konwersji"],
    ["Ile kosztuje reklama w Google?", "/poradniki/ile-kosztuje-reklama-google-ads"],
    ["Google Ads czy Meta Ads?", "/poradniki/google-ads-czy-meta-ads"],
  ] : offer.slug === "marketing-internetowy" || offer.slug === "widocznosc-w-internecie" ? [
    ["Jak poprawić marketing firmy?", "/poradniki/jak-poprawic-marketing-firmy"],
    ["Jak poprawić reklamy w internecie?", "/poradniki/jak-poprawic-reklamy"],
  ] : offer.slug === "crm-na-zamowienie" || offer.slug === "wdrozenie-crm" ? [
    ["Ile kosztuje CRM na zamówienie?", "/poradniki/ile-kosztuje-crm-na-zamowienie"],
  ] : offer.slug === "wirtualna-recepcjonistka-ai" ? [
    ["Czy wirtualna recepcjonistka AI ma sens?", "/poradniki/wirtualna-recepcjonistka-ai-czy-warto"],
  ] : offer.slug === "chatbot-ai-dla-firm" ? [
    ["Ile kosztuje chatbot AI dla firmy?", "/poradniki/ile-kosztuje-chatbot-ai-dla-firm"],
  ] : [];


  return (
    <main className="relative z-10 min-h-screen bg-[var(--brand-black)] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-28 md:px-8 md:pt-36">
        <nav aria-label="Ścieżka nawigacji" className="mb-9 text-sm text-white/60">
          <Link href="/" className="hover:text-white">Start</Link> /{" "}
          <Link href="/uslugi" className="hover:text-white">Usługi</Link> /{" "}
          <Link href={"/uslugi/" + city.slug} className="hover:text-white">{city.name}</Link> /{" "}
          <span className="text-white/90">{offer.title}</span>
        </nav>
        <p className="mb-5 text-sm font-medium uppercase tracking-[0.2em] text-white/55">
          Dla firm {city.from} · współpraca online
        </p>
        <h1 className="max-w-5xl text-4xl font-semibold tracking-tight md:text-6xl">
          {offer.title} – {city.name}
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/70">{offer.intro}</p>
        <p className="mt-4 max-w-3xl leading-8 text-white/60">
          Wspieram m.in. {city.regionalContext}. Każdy projekt zaczynam od rozpoznania procesu,
          aby zakres prac miał sens biznesowy, a nie był wyłącznie listą funkcji.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href="/kontakt" className="rounded-full bg-white px-7 py-4 font-semibold text-black transition hover:bg-white/85">
            Porozmawiaj o projekcie
          </Link>
          <Link href={offer.caseHref} className="rounded-full border border-white/25 px-7 py-4 font-medium transition hover:border-white/60">
            {offer.caseLabel}
          </Link>
        </div>
      </section>

      {localAdsPlan && (
        <section className="border-y border-white/10 bg-white/[0.035] px-5 py-14 md:px-8" aria-label="Lokalny plan kampanii Google Ads">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold">Reklamy w Google – {city.name}: przykładowy plan</h2>
            <p className="mt-5 max-w-4xl leading-7 text-white/65">
              To scenariusz do omówienia podczas audytu, a nie obietnica wyników ani opis
              przeprowadzonej kampanii w tym mieście.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {[
                ["Dla kogo", localAdsPlan.focus],
                ["Słowa i lokalizacje", localAdsPlan.intent],
                ["Strona docelowa", localAdsPlan.landing],
              ].map(([heading, copy]) => (
                <article className="rounded-2xl border border-white/10 bg-black/20 p-6" key={heading}>
                  <h3 className="font-semibold text-lg">{heading}</h3>
                  <p className="mt-3 leading-7 text-white/70">{copy}</p>
                </article>
              ))}
            </div>
            <p className="mt-7 max-w-4xl leading-7 text-white/65">
              Zasięg kampanii dobieramy do faktycznej możliwości obsługi klientów. Nie wymaga to
              lokalnego biura wykonawcy {city.where}.
            </p>
            <Link href="/google-ads-dla-firm" className="mt-6 inline-block font-semibold underline underline-offset-4">
              Google Ads: pełny zakres i przebieg współpracy
            </Link>
          </div>
        </section>
      )}

      <section className="border-y border-white/10 bg-white/[0.035] px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold">Co obejmuje usługa?</h2>
          <p className="mt-4 max-w-3xl leading-7 text-white/65">Poniżej przykładowy zakres. Ostateczne elementy dobieram do celu i budżetu, zamiast wdrażać wszystko bez potrzeby.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {offer.scope.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-2xl border border-white/10 bg-black/20 p-5">
                <span className="text-sm font-semibold text-white/45">{String(index + 1).padStart(2, "0")}</span>
                <p className="leading-7 text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="text-3xl font-semibold">Kiedy warto wdrożyć?</h2>
          <p className="mt-5 leading-8 text-white/70">
            Przykładowy scenariusz dla firm {city.from}: {cityExamples[city.slug]}
            To możliwe zastosowanie, a nie deklaracja wykonanej realizacji w tym mieście.
          </p>
          <p className="mt-5 leading-8 text-white/70">
            Najpierw sprawdzamy, gdzie obecny proces traci zapytania, czas lub pieniądze.
            Dopiero potem dobieramy rozwiązanie i ustalamy, co faktycznie warto mierzyć.
          </p>
          <Link href={offer.serviceHref} className="mt-7 inline-block font-medium underline underline-offset-4">
            Pełna oferta i zakres współpracy
          </Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7">
          <h2 className="text-2xl font-semibold">Pytania przed wyceną</h2>
          <ul className="mt-6 space-y-5">
            {offer.check.map((item) => (
              <li key={item} className="border-l-2 border-white/30 pl-4 leading-7 text-white/70">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.035] px-5 py-16 md:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold">Jak przebiega współpraca?</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              ["01. Analiza", "Rozmawiamy o problemie, obecnych narzędziach, odbiorcach i oczekiwanym wyniku."],
              ["02. Projekt", "Przygotowuję zakres, priorytety i plan weryfikacji działania, a następnie indywidualną wycenę."],
              ["03. Wdrożenie", "Wprowadzam rozwiązanie, sprawdzam kluczowe scenariusze i omawiam dalsze kroki."],
            ].map(([heading, copy]) => (
              <article key={heading} className="rounded-2xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold">{heading}</h3>
                <p className="mt-3 leading-7 text-white/65">{copy}</p>
              </article>
            ))}
          </div>
          <p className="mt-7 text-white/75">
            <strong>Cel prac:</strong> {offer.result}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <h2 className="text-3xl font-semibold">Najczęstsze pytania</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {faq.map(({ q, a }) => (
            <article key={q} className="rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold">{q}</h3>
              <p className="mt-3 leading-7 text-white/65">{a}</p>
            </article>
          ))}
        </div>
        <h2 className="mt-14 text-2xl font-semibold">Powiązane pojęcia</h2>
        <p className="mt-3 max-w-4xl leading-7 text-white/65">
          W tej ofercie mieszczą się również: {offer.aliases.join(", ")}.
          Szczegóły funkcjonalne ustalamy indywidualnie.
        </p>
      </section>

      {relatedGuides.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-14 md:px-8" aria-label="Powiązane poradniki">
          <h2 className="text-2xl font-semibold">Poradniki i rozwiązania problemów</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {relatedGuides.map(([label, href]) => (
              <Link key={href} href={href}
                className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white/75 transition hover:border-white/50 hover:text-white">
                {label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-5 pb-20 md:px-8">
        <div className="rounded-3xl bg-white p-8 text-black md:p-12">
          <h2 className="text-3xl font-semibold">Szukasz rozwiązania dla firmy {city.from}?</h2>
          <p className="mt-4 max-w-2xl leading-8 text-black/70">
            Opisz aktualną sytuację i oczekiwany rezultat. Otrzymasz propozycję kolejnego kroku.
            Nie musisz mieć gotowej specyfikacji technicznej.
          </p>
          <Link href="/kontakt" className="mt-7 inline-block rounded-full bg-black px-7 py-4 font-semibold text-white">Kontakt i wycena</Link>
        </div>
        <nav aria-label="Inne usługi" className="mt-12">
          <h2 className="mb-5 text-xl font-semibold">Inne usługi w mieście {city.name}</h2>
          <div className="flex flex-wrap gap-3">
            {similar.map((item) => (
              <Link key={item.slug} href={"/oferta/" + item.slug + "/" + city.slug}
                className="rounded-full border border-white/20 px-4 py-2 text-sm text-white/75 hover:text-white">
                {item.title}
              </Link>
            ))}
            <Link href={"/uslugi/" + city.slug} className="rounded-full border border-white/25 px-4 py-2 text-sm text-white/85">
              Wszystkie usługi – {city.name}
            </Link>
          </div>
        </nav>
      </section>
    </main>
  );
}
