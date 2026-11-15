import type {Metadata} from "next";
import Link from "next/link";
const site="https://bernecki.dev";
export const metadata:Metadata={
 title:"Privacy Policy | bernecki.dev",
 description:"How bernecki.dev handles contact enquiries, bookings, optional analytics, cookies and personal data.",
 alternates:{canonical:site+"/en/privacy",languages:{"pl-PL":site+"/polityka-prywatnosci",en:site+"/en/privacy"}}
};
const sections=[
 {title:"1. Data controller",paragraphs:[
  "The controller of information submitted through the bernecki.dev website is Kacper Bernecki, who operates bernecki.dev. You can contact the controller using the form and contact details on the Contact page.",
  "Where an enquiry concerns cooperation with another business, the responsibilities for processing personal data will be explained before that cooperation begins."
 ]},
 {title:"2. Data collected and its purposes",paragraphs:[
  "The contact form collects your name, email address, optional company name, selected service and enquiry. This information is used to receive and respond to your message and to prepare an offer or discuss cooperation.",
  "Depending on the enquiry, processing is based on taking steps at your request before entering into a contract (GDPR Article 6(1)(b)) or the controller’s legitimate interests in managing correspondence and preventing abuse (Article 6(1)(f)).",
  "Providing data is voluntary, but without a way to reply it may not be possible to handle your enquiry."
 ]},
 {title:"3. Contact form, security and service providers",paragraphs:[
  "Enquiries are handled using Vercel hosting infrastructure and stored in a protected Supabase database. New enquiry notifications may be sent using Resend and may also be processed by the provider of the email mailbox used for correspondence.",
  "Anti-spam protections process technical submission details. The database stores a hash of a network identifier for rate limiting, rather than a plain IP address in the enquiry record.",
  "Service providers may use subcontractors and, depending on configuration, transfer data outside the European Economic Area under appropriate data-protection mechanisms. Details depend on the providers’ current terms and technical settings."
 ]},
 {title:"4. How long information is stored",paragraphs:[
  "Enquiries are stored for as long as needed to manage correspondence and a possible business relationship. The system marks records for review after 12 months. If an enquiry results in a contract, some documentation may need to be retained longer under applicable legal obligations and claims periods.",
  "You may request deletion earlier unless another legal basis requires continued retention."
 ]},
 {title:"5. Appointment booking and AI assistant",paragraphs:[
  "When you book a meeting, the information required for the appointment is handled by the connected calendar service. Messages you enter in the AI assistant may be sent to the language-model provider to generate a response. Do not enter passwords, API keys, financial details or sensitive personal data in the chat.",
  "Some automatic assistant comments are selected from prepared messages and do not require a model request. With optional cookie consent, weather-related comments may be tailored only where the browser already has location permission and the precise location matches an approximate IP-based estimate. The assistant does not independently request location permission. Device coordinates are checked locally in the browser and are not sent to the site server. MET Norway receives only rounded approximate coordinates based on the server-side IP estimate.",
  "You can disable automatic assistant messages using the ’Do not show again’ option. Your browser may locally store recent message identifiers, topics and displayed text to avoid repetition. This history does not contain a plain IP address, exact location or a unique visitor ID, and it is not sent to the server. You can erase it by clearing site data.",
  "The website also uses technical mechanisms necessary to operate contact forms, bookings and saved preferences."
 ]},
 {title:"6. Cookies and analytics",paragraphs:[
  "Cookies and similar technologies that are necessary for the site may be used without separate consent. Optional analytics or marketing tools, when enabled, require consent through the website preference panel. You can withdraw consent later in cookie settings.",
  "Statistical data may be processed by analytics providers within the scope of the options you have enabled."
 ]},
 {title:"7. Your rights",paragraphs:[
  "Under the GDPR you may have rights to access, correct, erase, restrict or port your data, where applicable, and to object to processing based on legitimate interests.",
  "You may also lodge a complaint with the Polish supervisory authority, the President of the Personal Data Protection Office (UODO). To exercise your rights, contact the controller through the Contact page."
 ]}
];
export default function EnglishPrivacy(){
 return <main lang="en" className="site-page min-h-screen bg-[#080808] px-5 pb-24 pt-32 text-white md:px-8 md:pt-40"><div className="mx-auto max-w-3xl">
  <nav className="text-sm text-white/65"><Link href="/">Home</Link> / Privacy policy</nav>
  <p className="mt-10 text-xs uppercase tracking-widest text-white/55">Personal data protection</p>
  <h1 className="mt-4 text-4xl font-semibold md:text-5xl">Privacy policy</h1>
  <p className="mt-6 text-sm text-white/70">Last updated: 15 November 2026</p>
  <p className="mt-4 leading-8 text-white/75">How we handle personal information during enquiries, booking and use of bernecki.dev.</p>
  <div className="mt-10 space-y-10">{sections.map(section=><section key={section.title} className="border-t border-white/15 pt-7">
   <h2 className="text-xl font-semibold">{section.title}</h2>
   {section.paragraphs.map(p=><p key={p} className="mt-4 text-sm leading-8 text-white/75">{p}</p>)}
  </section>)}</div>
  <div className="mt-10"><Link href="/en/contact" className="inline-flex min-h-12 items-center rounded-lg border border-white/30 px-5 text-sm">Contact and enquiries</Link></div>
 </div></main>;
}