/** Real user-provided screenshots, manually cropped to remove profile photo and account data. */
export const guideScreenshots: Record<string, readonly {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}[]> = {
  "google-search-console-nieprawidlowy-adres-mapy-witryny": [{
    src: "/poradniki/gsc-invalid-sitemap.webp",
    alt: "Autentyczny komunikat Google Search Console: Nieprawidłowy adres mapy witryny. Podaj prawidłową ścieżkę do mapy Twojej witryny.",
    caption: "Rzeczywisty ekran Google Search Console, 5 listopada 2026 r. Kadr zanonimizowano i ograniczono do komunikatu. Sam zrzut nie potwierdza przyczyny błędu.",
    width: 480,
    height: 281
  }],
  "google-business-weryfikacja-wideo-brak-filmu": [{
    src: "/poradniki/gbp-video-verification.webp",
    alt: "Autentyczny panel Google: Wybierz sposób weryfikacji, dostępna opcja Prześlij film pokazujący firmę.",
    caption: "Rzeczywisty ekran weryfikacji Profilu Firmy Google, 5 listopada 2026 r. Przycięto zdjęcie profilowe i elementy identyfikujące konto. Metoda dostępna zależy od profilu.",
    width: 480,
    height: 266
  }]
};
