# Pozyskiwanie klientów firmowych — dwa landing page

Strony:
- `/crm-dla-firm-handlowych`: dedykowany CRM dla zespołów handlowych.
- `/automatyzacja-leadow-i-sprzedazy`: marketing, formularze, CRM i obsługa leadów.

## Konwersje i atrybucja
- `page_view`: obecny GoogleAnalytics.tsx, ścieżka i parametry kampanii w GA4.
- `offer_cta_click`: kliknięcie przycisku konsultacji lub dowodu na ofertach, z `offer_type`, `cta_placement`, `link_destination` i `page_path`.
- `generate_lead`: **dopiero po potwierdzeniu rezerwacji przez API**. Nie przesyłaj do GA4 nazwisk, e-maili ani telefonów.
- Ustaw `generate_lead` jako kluczowe zdarzenie w GA4, po potwierdzeniu go w DebugView/Realtime.
- Powiąż Search Console z GA4, prześlij `https://bernecki.dev/sitemap.xml`, monitoruj indeksację dwóch URL-i.
- Mierz kwartalnie: ruch -> kliknięcia CTA -> potwierdzone rezerwacje -> kwalifikowane zapytania -> projekty. Ostatnie dwa etapy wymagają ręcznej/CRM-owej kwalifikacji; sama liczba rezerwacji nie jest przychodem.

## Zasady publikacji
- Wyniki 2 331 leadów i 29,79 zł CPL dotyczą tylko opisanych kampanii Re-Energy System, **nie sprzedaży**.
- Nie deklarować % poprawy efektywności B-CRM bez twardych danych.
- Nowe historie klientów dodawać dopiero za zgodą i po weryfikacji liczb.
- Publikacje LinkedIn powinny odsyłać do jednej właściwej strony (z tagami UTM), nie ogólnie do homepage.
