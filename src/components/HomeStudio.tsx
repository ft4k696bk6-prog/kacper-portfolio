"use client";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Github, Linkedin, BookOpen, BrainCircuit, Newspaper } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { homepageCopy } from "@/content/homepage-copy";
import { ClientMarquee } from "./ClientMarquee";
import { ClientTestimonials } from "./ClientTestimonials";
import { FractionalLeadershipTeaser } from "./FractionalLeadershipTeaser";
import { Projects } from "./Projects";
import { ContactReveal } from "./ContactReveal";
import { LeadContactForm } from "./LeadContactForm";
import { OfferCards } from "./OfferCards";
import styles from "./HomeStudio.module.css";

export function HomeStudio() {
  const { lang, t } = useLanguage();
  const c = homepageCopy[lang];
  // Animate the REAL navbar KB element, not a duplicate drawn over it.
  // The element travels from viewport centre to its native, responsive position.
  useEffect(() => {
    const root = document.documentElement;
    if (root.dataset.homeIntro !== "armed") return;

    const logo = document.querySelector<HTMLElement>("[data-bernecki-nav-logo]");
    if (!logo || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.homeIntro = "skip";
      return;
    }

    const bounds = logo.getBoundingClientRect();
    const logoX = bounds.left + bounds.width / 2;
    const logoY = bounds.top + bounds.height / 2;
    const shiftX = window.innerWidth / 2 - logoX;
    const shiftY = window.innerHeight / 2 - logoY;
    root.style.setProperty("--intro-origin-x", `${logoX}px`);
    root.style.setProperty("--intro-origin-y", `${logoY}px`);

    // Animate the original DOM node. Once it reaches its native position it
    // requires no swap, copy, crossfade, or overlay hiding the actual header.
    const flight = logo.animate([
      { transform: `translate3d(${shiftX}px, ${shiftY}px, 0) scale(1.95)`, offset: 0 },
      { transform: `translate3d(${shiftX}px, ${shiftY}px, 0) scale(1.95)`, offset: 0.13, easing: "cubic-bezier(.62,.04,.16,1)" },
      { transform: "translate3d(0,0,0) scale(1)", offset: 0.45 },
      { transform: "translate3d(0,0,0) scale(1)", offset: 1 },
    ], { duration: 2400, fill: "both" });

    root.dataset.homeIntro = "running";
    const finish = () => {
      root.dataset.homeIntro = "skip";
      flight.cancel(); // The real logo stays exactly where the navbar laid it out.
    };
    const done = window.setTimeout(finish, 3770);
    const onResize = () => finish(); // No misaligned landing if the viewport changes mid-flight.
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.clearTimeout(done);
      window.removeEventListener("resize", onResize);
      finish();
    };
  }, []);
  return <main className={`${styles.studio} portfolio-content`}>
    <div className={styles.introOverlay} aria-hidden="true">
      <div className={styles.introBackdrop} />
      <div className={styles.introGrid} />
      <div className={styles.introHalo} />
    </div>
    <div className={styles.introTerminal} aria-hidden="true">
      <div className={styles.introTerminalTop}>
        <span className={styles.introDots}><i /><i /><i /></span>
        <span>BERNECKI.DEV <em>/</em> AI / BUILD ENGINE</span>
        <span className={styles.introTerminalState}>BUILDING</span>
      </div>
      <div className={styles.introCode}>
        <div className={styles.introCodeRowOne}><b>01</b><code><span>›</span> init(<strong>bernecki.dev</strong>)</code></div>
        <div className={styles.introCodeRowTwo}><b>02</b><code><span>›</span> compile(<strong>&lt;Header /&gt;</strong>)</code></div>
        <div className={styles.introCodeRowThree}><b>03</b><code><span>›</span> write(<strong>hero + copy</strong>)</code></div>
        <div className={styles.introCodeRowFour}><b>04</b><code><span>›</span> load(<strong>portrait.png</strong>)</code></div>
        <div className={styles.introCodeRowFive}><b>05</b><code><span>›</span> mount(<strong>projects[3]</strong>)</code></div>
      </div>
      <div className={styles.introProgress}><i /></div>
      <div className={styles.introBuildSuccess}>✓ PAGE READY <span>100%</span></div>
    </div>
    <section id="home" className={[styles.hero, "hero-night"].join(" ")} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{c.signature}</p>
        <h1 id="hero-title">{c.title.map(line => <span key={line}>{line}</span>)}</h1>
        <p className={styles.intro}>{c.intro}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#contact">{c.call}<ArrowUpRight size={18}/></a>
          <a className={styles.secondary} href="#projects">{c.projects}<ArrowUpRight size={18}/></a>
        </div>
      </div>
      <div className={styles.heroScene}>
        <div className={styles.portraitLight} aria-hidden="true" />
        <div className={styles.portrait}>
          <Image src="/images/profile-3-cutout.png" alt={c.portrait} width={1000} height={1280} priority sizes="(min-width:1024px) 560px, (min-width:768px) 44vw, 75vw"/>
        </div>
        <Link href="/case-studies/starcars" className={[styles.heroTile, styles.tileStarCars].join(" ")} aria-label={lang === "pl" ? "Zobacz projekt StarCars" : "View StarCars project"}>
          <div className={styles.tileVisual}>
            <Image src="/images/projects/starcars-live-current.jpg" alt={lang === "pl" ? "Zrzut prawdziwej strony StarCars" : "Screenshot of the actual StarCars website"} width={640} height={400} sizes="(min-width:1024px) 330px, (min-width:768px) 23vw, 46vw" loading="eager" />
          </div>
          <div className={styles.tileCaption}><strong>StarCars</strong><ArrowUpRight size={16}/></div>
        </Link>
        <Link href="/realizacje/isto-kebab-strona" className={[styles.heroTile, styles.tileIsto].join(" ")} aria-label={lang === "pl" ? "Zobacz projekt Isto Kebab" : "View Isto Kebab project"}>
          <div className={styles.tileVisual}>
            <Image src="/images/projects/isto-live-nov08.jpg" alt={lang === "pl" ? "Zrzut prawdziwej strony Isto Kebab" : "Screenshot of the actual Isto Kebab website"} width={640} height={400} sizes="(min-width:1024px) 260px, (min-width:768px) 22vw, 36vw" loading="eager" />
          </div>
          <div className={styles.tileCaption}><strong>Isto Kebab</strong><ArrowUpRight size={16}/></div>
        </Link>
        <Link href="/case-studies/b-crm" className={[styles.heroTile, styles.tileCrm].join(" ")} aria-label={lang === "pl" ? "Zobacz projekt B-CRM" : "View B-CRM project"}>
          <div className={styles.tileVisual}>
            <Image src="/images/projects/bcrm-admin-dashboard.jpg" alt={lang === "pl" ? "Zrzut rzeczywistego panelu B-CRM" : "Screenshot of the real B-CRM dashboard"} width={640} height={400} sizes="(min-width:1024px) 450px, (min-width:768px) 36vw, 62vw" loading="eager" />
          </div>
          <div className={styles.tileCaption}><strong>B-CRM</strong><ArrowUpRight size={16}/></div>
        </Link>
      </div>
    </section>
    <ClientMarquee/>
    <Projects/>
    <ClientTestimonials/>
    <FractionalLeadershipTeaser english={lang === "en"}/>
    <section id="services" className={styles.section}>
      <p className={styles.eyebrow}>{lang === "pl" ? "Oferta" : "Services"}</p><h2>{c.services}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">{lang === "pl" ? "Wybierz temat, rozwiń szczegóły i sprawdź, w czym mogę pomóc. Jeśli nie wiesz, czego potrzebujesz, napisz — ustalimy to wspólnie." : "Choose a topic, expand details and explore how I can help. Not sure yet? Describe your project."}</p>
      <OfferCards offers={c.offer} english={lang === "en"}/>
      <div className="mt-8 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        <Link href="/kontakt" className="brand-action inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-3 py-3 text-center text-[11px] font-semibold leading-5 text-black sm:px-6 sm:text-sm">{lang === "pl" ? "Zapytaj o współpracę" : "Discuss your project"} <ArrowUpRight size={17}/></Link>
        <Link href="/#projects" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/20 px-3 py-3 text-center text-[11px] leading-5 text-white hover:border-white/50 sm:px-6 sm:text-sm">{lang === "pl" ? "Zobacz realizacje" : "View projects"} <ArrowRight size={16}/></Link>
      </div>
    </section>
    <section id="guides" className={styles.section}>
      <p className={styles.eyebrow}>{lang === "pl" ? "Wiedza i poradniki" : "Guides and articles"}</p>
      <div className="flex flex-wrap items-end justify-between gap-5">
       <div><h2>{lang === "pl" ? "Chcesz zrobić coś samodzielnie?" : "Prefer to learn first?"}</h2>
       <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65">{lang === "pl" ? "Poradniki są osobno od oferty. Jeśli potrzebujesz wykonawcy — przejdź do kontaktu. Jeśli rozwiązujesz problem sam — znajdziesz instrukcje poniżej." : "Guides are separate from the service offer. Read practical instructions or contact me to discuss a project."}</p></div>
       <Link href="/poradniki" className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">{lang === "pl" ? "Wszystkie poradniki" : "All guides"} <ArrowRight size={16}/></Link>
      </div>
      <div className="mt-8 grid gap-3 md:grid-cols-3">
       <Link href="/poradniki/tematy/ai-w-firmie" className="group rounded-xl border border-white/15 p-6 transition hover:border-white/50"><BrainCircuit size={24} strokeWidth={1.5} aria-hidden="true"/><h3 className="mt-5 text-xl">{lang === "pl" ? "AI w praktyce" : "AI in practice"}</h3><p className="mt-3 text-sm leading-7 text-white/65">{lang === "pl" ? "Prompty, API, klucze, automatyzacje i błędy." : "Prompts, APIs, secrets and automation."}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-white/85">{lang === "pl" ? "Czytaj" : "Explore"} <ArrowRight size={16}/></span></Link>
       <Link href="/poradniki" className="group rounded-xl border border-white/15 p-6 transition hover:border-white/50"><BookOpen size={24} strokeWidth={1.5} aria-hidden="true"/><h3 className="mt-5 text-xl">{lang === "pl" ? "Poradniki" : "Guides"}</h3><p className="mt-3 text-sm leading-7 text-white/65">{lang === "pl" ? "Strony, CRM, biznes, koszty i podatki w praktyce." : "Websites, CRM, operations and business costs."}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-white/85">{lang === "pl" ? "Przeglądaj" : "Browse"} <ArrowRight size={16}/></span></Link>
       <Link href="/blog" className="group rounded-xl border border-white/15 p-6 transition hover:border-white/50"><Newspaper size={24} strokeWidth={1.5} aria-hidden="true"/><h3 className="mt-5 text-xl">Blog</h3><p className="mt-3 text-sm leading-7 text-white/65">{lang === "pl" ? "Doświadczenia, projekty i obserwacje z pracy." : "Projects, lessons and observations."}</p><span className="mt-5 inline-flex items-center gap-2 text-sm text-white/85">{lang === "pl" ? "Czytaj wpisy" : "Read posts"} <ArrowRight size={16}/></span></Link>
      </div>
      <Link href="/kontakt" className="mt-7 inline-flex items-center gap-2 text-sm text-white underline underline-offset-4">{lang === "pl" ? "Wolisz zlecić wykonanie? Napisz do mnie" : "Need an implementation? Contact me"} <ArrowRight size={16}/></Link>
    </section>
    <section id="about" className={`${styles.section} ${styles.about}`}>
      <div><p className={styles.eyebrow}>{lang === "pl" ? "O mnie" : "About me"}</p><h2>{c.about}</h2><p className={styles.bio}>{c.bio}</p><div className={styles.textLinks}><Link href="/case-studies/b-crm">{c.technical}<ArrowUpRight size={15}/></Link><a href={t.contact.github} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight size={15}/></a></div></div>
      <ol className={styles.steps}>{c.steps.map(([title, description], i) => <li key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
    </section>
    <section id="faq" className={`${styles.section} ${styles.faq}`}>
      <h2>{c.faqTitle}</h2><div>{c.faq.map(([question, answer]) => <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>)}</div>
    </section>
    <section id="contact" className={`${styles.section} ${styles.contact}`}>
      <div className={styles.contactCopy}><p className={styles.eyebrow}>{t.nav.contact}</p><h2>{c.contact}</h2><p className={styles.bio}>{c.contactIntro}</p>
        <Link href="/kontakt" className="mt-7 inline-flex items-center gap-2 text-sm text-white/85 underline underline-offset-4">{lang === "pl" ? "Formularz, kalendarz i bezpośredni kontakt" : "Contact form, calendar and direct contact"} <ArrowRight size={16}/></Link>
        <ContactReveal plain copy={{...t.contact.reveal,phoneButton:c.phone,emailButton:c.email}}/>
        <p className={styles.location}>{c.location}</p><div className={styles.textLinks}><a href={t.contact.github} target="_blank" rel="noopener noreferrer"><Github size={15}/>GitHub</a><a href={t.contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15}/>LinkedIn</a></div>
      </div>
      <div className={styles.calendar}><LeadContactForm english={lang === "en"}/><Link href="/kontakt" className="mt-5 inline-flex items-center gap-2 text-sm text-white/85 underline underline-offset-4">{lang === "pl" ? "Wolisz umówić rozmowę w kalendarzu?" : "Prefer to book a call?"} <ArrowRight size={16}/></Link></div>
    </section>
  </main>;
}
