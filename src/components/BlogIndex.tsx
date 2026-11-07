import Link from "next/link";
import { blogPosts, blogTopicLabels, type BlogLanguage } from "@/content/blog";

export function BlogIndex({lang}:{lang:BlogLanguage}){
 const english=lang==="en";
 const root=english?"/en/blog":"/blog";
 const directory=english?"/en/guides":"/poradniki";
 return <main lang={lang} className="site-page editorial-page mx-auto max-w-6xl px-5 pb-24 pt-36 md:px-8">
  <nav aria-label={english?"Breadcrumb":"Ścieżka strony"} className="text-sm text-white/65">
    <Link href="/">Kacper Bernecki</Link> / {english?"Blog":"Blog"}
  </nav>
  <header className="mt-12 max-w-4xl">
   <p className="text-xs uppercase tracking-[0.2em] text-white/60">{english?"Business · Technology · Marketing":"Biznes · Technologia · Marketing"}</p>
   <h1 className="mt-5 text-4xl leading-tight md:text-6xl">{english?"Ideas that turn into working business processes.":"Od pomysłu do działającego biznesu."}</h1>
   <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">
    {english?"Practical articles about marketing, sales systems, SEO and websites. Each article connects the bigger picture with specific troubleshooting guides and project examples.":"Praktyczne artykuły o marketingu, sprzedaży, CRM, SEO i stronach internetowych. Każdy łączy szerszy temat z konkretnymi instrukcjami oraz realizacjami."}
   </p>
   <div className="mt-7 flex flex-wrap gap-5 text-sm">
    <Link href={directory} className="underline underline-offset-4">{english?"Browse 400+ troubleshooting guides":"Zobacz bazę 400+ poradników"}</Link>
    <Link href={english?"/en/case-studies":"/case-studies"} className="underline underline-offset-4">{english?"See case studies":"Zobacz realizacje"}</Link>
   </div>
  </header>
  <section aria-labelledby="blog-articles-heading" className="mt-14">
   <h2 id="blog-articles-heading" className="text-2xl md:text-3xl">{english?"Latest articles":"Artykuły"}</h2>
   <div className="mt-6 grid gap-5 md:grid-cols-2">
    {blogPosts.map(post=>{const text=post[lang];return <article key={post.slug} className="surface-card flex flex-col rounded-2xl border border-white/15 bg-white/[0.025] p-7 transition-colors hover:border-white/40">
     <p className="text-xs uppercase tracking-[0.16em] text-white/55">{blogTopicLabels[lang][post.topic]}</p>
     <h3 className="mt-4 text-2xl leading-tight"><Link href={root+"/"+post.slug}>{text.title}</Link></h3>
     <p className="mt-4 flex-1 leading-7 text-white/70">{text.excerpt}</p>
     <Link href={root+"/"+post.slug} className="mt-6 text-sm text-white underline underline-offset-4">{english?"Read article":"Czytaj artykuł"}</Link>
    </article>})}
   </div>
  </section>
  <section className="mt-16 border-t border-white/15 pt-12">
   <h2 className="text-2xl">{english?"Looking for a specific fix?":"Szukasz rozwiązania konkretnego błędu?"}</h2>
   <p className="mt-4 max-w-3xl leading-8 text-white/70">{english?"Use the troubleshooting directory for step-by-step diagnostics, technical errors and practical checklists.":"Skorzystaj z katalogu poradników, jeśli potrzebujesz diagnostyki konkretnego błędu, instrukcji krok po kroku albo listy kontrolnej."}</p>
   <Link href={directory} className="mt-5 inline-block underline underline-offset-4">{english?"Open guide directory":"Przejdź do poradników"}</Link>
  </section>
 </main>;
}
