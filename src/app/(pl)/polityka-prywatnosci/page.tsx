import type { Metadata } from "next";
import Link from "next/link";

export const metadata:Metadata={
 title:"Polityka prywatności",
 description:"Informacje o przetwarzaniu danych osobowych w serwisie bernecki.dev.",
 alternates:{canonical:"https://bernecki.dev/polityka-prywatnosci"}
};
const sections=[
 {title:"1. Administrator danych",paragraphs:[
  "Administratorem danych podawanych podczas kontaktu za pośrednictwem serwisu bernecki.dev jest Kacper Bernecki, prowadzący serwis bernecki.dev. Kontakt z administratorem jest możliwy przez formularz na stronie Kontakt oraz opublikowane tam dane kontaktowe.",
  "Jeżeli kontakt dotyczy konkretnej współpracy realizowanej przez inną firmę, zakres odpowiedzialności za dane zostanie wyjaśniony przed jej rozpoczęciem."
 ]},
 {title:"2. Jakie dane i w jakim celu?",paragraphs:[
  "Formularz kontaktowy zbiera imię i nazwisko, adres e-mail, opcjonalną nazwę firmy, wybraną usługę i treść zapytania. Służą one wyłącznie do odbioru i obsługi wiadomości, przygotowania odpowiedzi lub propozycji współpracy.",
  "Podstawą przetwarzania jest podejmowanie działań na żądanie osoby przed zawarciem umowy (art. 6 ust. 1 lit. b RODO) albo prawnie uzasadniony interes administratora w obsłudze korespondencji i zabezpieczeniu przed nadużyciami (art. 6 ust. 1 lit. f RODO), zależnie od charakteru zgłoszenia.",
  "Podanie danych jest dobrowolne, lecz bez danych do odpowiedzi może nie być możliwe obsłużenie zapytania."
 ]},
 {title:"3. Formularz, zabezpieczenia i odbiorcy danych",paragraphs:[
  "Zapytania są obsługiwane przez infrastrukturę hostingową Vercel i zapisywane w zabezpieczonej bazie Supabase. Powiadomienia o nowych zapytaniach mogą być wysyłane za pośrednictwem dostawcy usługi e-mail (Resend). Dane mogą trafić także do dostawcy skrzynki pocztowej używanej do korespondencji.",
  "Mechanizmy antyspamowe przetwarzają techniczne informacje o zgłoszeniu. W systemie zapisywany jest skrót identyfikatora sieciowego wykorzystywany do ograniczania nadużyć, a nie jawny adres IP w tabeli zgłoszeń.",
  "Dostawcy usług mogą angażować podwykonawców oraz, zależnie od konfiguracji, przetwarzać dane poza Europejskim Obszarem Gospodarczym na podstawie odpowiednich mechanizmów ochronnych. Szczegóły zależą od aktualnych warunków i konfiguracji usług."
 ]},
 {title:"4. Czas przechowywania",paragraphs:[
  "Dane z zapytań są przechowywane przez okres potrzebny do prowadzenia korespondencji i podjęcia decyzji o współpracy. System techniczny oznacza zgłoszenia do przeglądu po 12 miesiącach. Jeśli zapytanie prowadzi do zawarcia umowy, przechowywanie dokumentacji może trwać dłużej, zgodnie z właściwymi obowiązkami i terminami dochodzenia roszczeń.",
  "Można wcześniej zwrócić się o usunięcie danych, o ile nie istnieje inna podstawa ich dalszego przechowywania."
 ]},
 {title:"5. Kalendarz i asystent AI",paragraphs:[
  "Podczas rezerwacji spotkania dane niezbędne do umówienia terminu są przekazywane do usługi kalendarzowej obsługującej rezerwacje. Dane wpisane w rozmowie z asystentem AI mogą zostać przekazane dostawcy modelu językowego w celu wygenerowania odpowiedzi. Nie wpisuj do czatu haseł, kluczy API, danych finansowych ani danych wrażliwych.",
  "Na stronie używane są też techniczne mechanizmy niezbędne do działania formularza, kalendarza i preferencji użytkownika."
 ]},
 {title:"6. Cookies i analityka",paragraphs:[
  "Pliki cookies i podobne technologie niezbędne do działania strony mogą być używane bez odrębnej zgody. Opcjonalne narzędzia analityczne i marketingowe, jeżeli są włączone, wymagają zgody zbieranej przez dostępny na stronie panel preferencji. Zgodę można później wycofać w ustawieniach cookies.",
  "Informacje statystyczne mogą być przetwarzane przez dostawców narzędzi analitycznych w zakresie zależnym od aktywowanych ustawień."
 ]},
 {title:"7. Twoje prawa",paragraphs:[
  "W zakresie określonym przez RODO przysługuje Ci prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia (gdy ma zastosowanie) oraz sprzeciwu wobec przetwarzania opartego na prawnie uzasadnionym interesie.",
  "Możesz również złożyć skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO). Aby zrealizować prawa, skontaktuj się za pomocą danych podanych w sekcji Kontakt."
 ]},
];
export default function PrivacyPage(){
 return <main className="site-page min-h-screen bg-[#080808] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40">
  <div className="mx-auto max-w-3xl">
   <nav className="text-sm text-white/65"><Link href="/" className="hover:text-white">Portfolio</Link> / Polityka prywatności</nav>
   <p className="mt-10 text-xs uppercase tracking-[.18em] text-white/55">Ochrona danych</p>
   <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Polityka prywatności</h1>
   <p className="mt-6 text-sm leading-7 text-white/70">Ostatnia aktualizacja: 8 listopada 2026 r.</p>
   <p className="mt-4 text-base leading-8 text-white/75">Poniżej opisano przetwarzanie danych przy kontakcie, rezerwacji spotkania i korzystaniu z serwisu bernecki.dev.</p>
   <div className="mt-10 space-y-10">{sections.map(s=><section key={s.title} className="border-t border-white/15 pt-7">
    <h2 className="text-xl font-semibold">{s.title}</h2>
    {s.paragraphs.map(p=><p key={p} className="mt-4 text-sm leading-8 text-white/75">{p}</p>)}
   </section>)}</div>
   <div className="mt-10"><Link href="/kontakt" className="inline-flex min-h-12 items-center rounded-lg border border-white/30 px-5 text-sm hover:border-white/70">Kontakt i zapytania</Link></div>
  </div>
 </main>;
}
