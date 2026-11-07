import Link from "next/link";
import {BLOG_PUBLISHED_DATE, blogTopicLabels, blogRelatedPosts, type BlogLanguage, type BlogPost} from "@/content/blog";
import {getGuide} from "@/lib/guide-directory";
import {getEnglishGuide} from "@/lib/guide-i18n";

export function BlogArticle({post,lang}:{post:BlogPost;lang:BlogLanguage}){
 const english=lang==="en",content=post[lang],root=english?"/en/blog":"/blog";
 const url=`https://bernecki.dev${root}/${post.slug}`;
 const guideLinks=post.guideSlugs.map(slug=>{
  const source=getGuide(slug);
  if(!source)return null;
  const translated=english?getEnglishGuide(slug):null;
  if(english&&!translated)return null;
  return {slug,href:english?`/en/guides/${slug}`:`/poradniki/${slug}`,title:english?translated!.title:source.title};
 }).filter((item):item is {slug:string;href:string;title:string}=>item!==null);
 const schema={"@context":"https://schema.org","@type":"BlogPosting",
  headline:content.title,description:content.excerpt,url,mainEntityOfPage:url,inLanguage:english?"en":"pl-PL",
  datePublished:BLOG_PUBLISHED_DATE,dateModified:BLOG_PUBLISHED_DATE,
  author:{"@type":"Person","@id":"https://bernecki.dev/#person",name:"Kacper Bernecki",url:"https://bernecki.dev/"},
  publisher:{"@type":"Organization",name:"bernecki.dev",url:"https://bernecki.dev/"}};
 const otherPosts=blogRelatedPosts(post.slug,3);
 return <main lang={lang} className="site-page editorial-page mx-auto max-w-4xl px-5 pb-24 pt-36 md:px-8">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
  <nav aria-label={english?"Breadcrumb":"Ścieżka strony"} className="flex flex-wrap gap-2 text-sm text-white/65">
   <Link href="/">Kacper Bernecki</Link><span>/</span><Link href={root}>Blog</Link><span>/</span><span>{blogTopicLabels[lang][post.topic]}</span>
  </nav>
  <article>
   <header className="mt-11">
    <p className="text-xs uppercase tracking-[0.2em] text-white/60">{blogTopicLabels[lang][post.topic]}</p>
    <h1 className="mt-5 text-4xl leading-tight text-white md:text-5xl">{content.title}</h1>
    <p className="mt-6 text-sm text-white/60">{english?"By Kacper Bernecki":"Kacper Bernecki"} · <time dateTime={BLOG_PUBLISHED_DATE}>{BLOG_PUBLISHED_DATE}</time></p>
    <p className="surface-card mt-8 rounded-2xl border border-white/20 bg-[var(--brand-black)] p-6 text-lg leading-8 text-white">{content.lead}</p>
   </header>
   <nav aria-label={english?"Table of contents":"Spis treści"} className="surface-card my-12 rounded-xl border border-white/15 p-6">
    <h2 className="mb-4 text-lg">{english?"In this article":"W artykule"}</h2>
    <ol className="list-inside list-decimal space-y-2">{content.sections.map((section,i)=>
     <li key={i}><a href={`#article-section-${i+1}`} className="underline underline-offset-4">{section.heading}</a></li>
    )}</ol>
   </nav>
   {content.sections.map((section,i)=><section key={i} id={`article-section-${i+1}`} className="mt-12 scroll-mt-28">
    <h2 className="text-2xl leading-tight md:text-3xl">{section.heading}</h2>
    {section.paragraphs.map((p,j)=><p key={j} className="mt-5 leading-8 text-white/85">{p}</p>)}
   </section>)}
  </article>
  <nav aria-label={english?"Related step-by-step guides":"Powiązane poradniki"} className="surface-card mt-16 rounded-2xl border border-white/20 p-7">
   <h2 className="text-2xl">{english?"Go deeper: practical guides":"Przejdź do konkretnych instrukcji"}</h2>
   <p className="mt-3 leading-7 text-white/70">{english?"Solve individual problems using these diagnostic guides and implementation checklists.":"Jeśli potrzebujesz naprawić konkretny błąd, sprawdź powiązane poradniki i listy kontrolne."}</p>
   <div className="mt-6 grid gap-3">{guideLinks.map(item=><Link key={item.slug} href={item.href} className="rounded-lg border border-white/15 p-4 text-white transition-colors hover:border-white/50">
    {item.title}
   </Link>)}</div>
  </nav>
  <section className="mt-12 border-t border-white/15 pt-10">
   <h2 className="text-2xl">{english?"Put the ideas into practice":"Wykorzystaj to w swojej firmie"}</h2>
   <p className="mt-4 max-w-3xl leading-8 text-white/70">{english?"Explore a related service or an implemented project to see how these pieces work together.":"Zobacz powiązaną usługę lub realny projekt, żeby połączyć wiedzę z praktycznym wdrożeniem."}</p>
   <div className="mt-6 flex flex-wrap gap-5">
    <Link href={post.service[lang]} className="brand-action rounded-lg px-5 py-3 text-black">{english?"Explore the service":"Poznaj ofertę"}</Link>
    {post.caseStudy&&<Link href={post.caseStudy[lang]} className="brand-outline rounded-lg px-5 py-3">{english?"See a case study":"Zobacz realizację"}</Link>}
   </div>
  </section>
  <nav aria-label={english?"More blog articles":"Inne artykuły na blogu"} className="mt-14 border-t border-white/15 pt-10">
   <h2 className="text-2xl">{english?"More on the blog":"Czytaj też na blogu"}</h2>
   <div className="mt-5 grid gap-3 sm:grid-cols-2">{otherPosts.map(other=><Link key={other.slug} href={root+"/"+other.slug} className="surface-card rounded-xl border border-white/15 p-5 transition-colors hover:border-white/50">
    <span className="text-xs text-white/55">{blogTopicLabels[lang][other.topic]}</span>
    <p className="mt-3 text-lg leading-snug">{other[lang].title}</p>
   </Link>)}</div>
   <p className="mt-6 text-sm"><Link href={root} className="underline underline-offset-4">{english?"All blog articles":"Wszystkie artykuły"}</Link></p>
  </nav>
 </main>;
}
