"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { homepageCopy } from "@/content/homepage-copy";
import { ClientMarquee } from "./ClientMarquee";
import { Projects } from "./Projects";
import { ContactReveal } from "./ContactReveal";
import { BookingCalendar } from "./BookingCalendar";
import styles from "./HomeStudio.module.css";

export function HomeStudio() {
  const { lang, t } = useLanguage();
  const c = homepageCopy[lang];
  return <main className={`${styles.studio} portfolio-content`}>
    <section id="home" className={`${styles.hero} hero-night`} aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{c.signature}</p>
        <h1 id="hero-title">{c.title.map(line => <span key={line}>{line}</span>)}</h1>
        <p className={styles.intro}>{c.intro}</p>
        <div className={styles.actions}>
          <a className={styles.primary} href="#contact">{c.call}<ArrowUpRight size={18}/></a>
          <a className={styles.secondary} href="#projects">{c.projects}<ArrowUpRight size={18}/></a>
        </div>
        <div className={styles.heroSignals} aria-label={lang === "pl" ? "Obszary współpracy" : "Areas of expertise"}>
          <span>{lang === "pl" ? "Strategia i start" : "Strategy & launch"}</span>
          <span>{lang === "pl" ? "Produkty i dostawcy" : "Products & suppliers"}</span>
          <span>{lang === "pl" ? "Technologia i sprzedaż" : "Technology & sales"}</span>
        </div>
      </div>
      <div className={styles.heroScene} aria-label={lang === "pl" ? "Wybrane projekty i zdjęcie autora" : "Selected projects and founder portrait"}>
        <div className={styles.portraitLight} aria-hidden="true" />
        <div className={styles.portrait}>
          <Image src="/images/profile-3-cutout.png" alt={c.portrait} width={1122} height={1402} priority sizes="(min-width:1024px) 490px, 73vw"/>
        </div>
        <Link href="/case-studies/starcars" className={`${styles.heroTile} ${styles.tileStarCars}`}>
          <div className={styles.tileVisual}>
            <Image src="/images/projects/starcars-live-current.jpg" alt={lang === "pl" ? "Rzeczywista strona StarCars" : "Real StarCars website"} width={640} height={380} sizes="(min-width:1024px) 300px, 44vw" />
          </div>
          <div className={styles.tileCaption}><strong>StarCars</strong><ArrowUpRight size={16}/></div>
        </Link>
        <Link href="/case-studies/isto-kebab" className={`${styles.heroTile} ${styles.tileIsto}`}>
          <div className={styles.tileVisual}>
            <img src="https://s0.wp.com/mshots/v1/https%3A%2F%2Fisto.bernecki.dev%2F?vpw=1440&vph=940&w=1200" alt={lang === "pl" ? "Zrzut rzeczywistej strony Isto Kebab" : "Screenshot of the real Isto Kebab website"} width={1200} height={784} loading="lazy" decoding="async" />
          </div>
          <div className={styles.tileCaption}><strong>Isto Kebab</strong><ArrowUpRight size={16}/></div>
        </Link>
        <Link href="/case-studies/b-crm" className={`${styles.heroTile} ${styles.tileCrm}`}>
          <div className={styles.tileVisual}>
            <Image src="/images/projects/bcrm-admin-dashboard.jpg" alt={lang === "pl" ? "Rzeczywisty panel B-CRM" : "Real B-CRM dashboard"} width={960} height={600} sizes="(min-width:1024px) 400px, 68vw" />
          </div>
          <div className={styles.tileCaption}><strong>B-CRM</strong><ArrowUpRight size={16}/></div>
        </Link>
      </div>
    </section>
    <ClientMarquee/>
    <Projects/>
    <section id="services" className={styles.section}>
      <p className={styles.eyebrow}>{lang === "pl" ? "Oferta" : "Services"}</p><h2>{c.services}</h2>
      <div className={styles.offer}>{c.offer.map(([title, description, href]) => <Link href={href} key={title}><h3>{title}</h3><p>{description}</p><ArrowUpRight size={20}/></Link>)}</div>
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
        <ContactReveal plain copy={{...t.contact.reveal,phoneButton:c.phone,emailButton:c.email}}/>
        <p className={styles.location}>{c.location}</p><div className={styles.textLinks}><a href={t.contact.github} target="_blank" rel="noopener noreferrer"><Github size={15}/>GitHub</a><a href={t.contact.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15}/>LinkedIn</a></div>
      </div>
      <div className={styles.calendar}><h3>{c.booking}</h3><BookingCalendar copy={t.contact.booking} locale={lang === "pl" ? "pl-PL" : "en-US"} emptyMessage={lang === "pl" ? "Nie ma teraz dostępnych terminów lub nie udało się ich pobrać. Napisz lub zadzwoń — ustalimy termin bezpośrednio." : "No times are available right now, or they could not be loaded. Email or call me and we’ll arrange a time directly."}/></div>
    </section>
  </main>;
}
