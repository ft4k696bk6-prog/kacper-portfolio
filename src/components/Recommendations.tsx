"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

export function Recommendations() {
  const { t } = useLanguage();
  const recommendations = [
    {
      name: "Mikel Bitson",
      role: "Senior Software Development Manager",
      company: "Hunter Douglas",
      image:
        "https://media.licdn.com/dms/image/v2/D5603AQGJSz2bvR1KiA/profile-displayphoto-scale_400_400/B56ZgqP_foHkAg-/0/1753055494219?e=1778716800&v=beta&t=NB23wuei_x7hA9JXCwPx8yYzBskf-_Edsb5aUe9rAek",
      text: "Michal worked with me on an Adobe Commerce headless project and he was a critical resource for the team as we worked to expand the built-in API functionality for our needs. Michal's work is always extremely detailed and done the best possible way. He's continually keeping up with the Adobe Commerce releases and gaining knowledge that ensures his code is current. He worked extremely well with the team, both in code reviews and in meetings. He was able to share a great deal of knowledge during his time with us. If you need a backend developer for any PHP project, especially Adobe Commerce, Michal is a great choice!",
      date: "August 2023",
    },
    {
      name: "Dex Caffery",
      role: "Applications Engineer",
      company: "Hunter Douglas",
      image:
        "https://media.licdn.com/dms/image/v2/C4E03AQFofY4rtS7c0A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1516834201631?e=1778716800&v=beta&t=kJ3LZLtBbNZjbvBFYBi2vd1HjP2A05ravXOfHqtCYh8",
      text: "I worked with Michal while at Levolor on an Adobe Commerce/PWA Studio project. From day 1 Michal was extremely valuable, being able and willing to solve our more complex needs for the project. Michal understands Adobe Commerce very well, and knows how to implement the highest standards of php code. Michal worked very well in our team, teaching and handling code reviews routinely. There are few people I have worked with that approach the same level of quality as Michals work. I learned a lot from Michal, and would choose him to be a team member on any software project I am on.",
      date: "October 2023",
    },
  ];

  return (
    <section className="py-24 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl text-white mb-12"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {t.recommendations.title}
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-2 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
                }}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Image
                    src={rec.image}
                    alt={rec.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full border-2 border-cyan-500/30"
                  />
                  <div className="flex-1">
                    <h3 className="text-white">{rec.name}</h3>
                    <p className="text-sm text-cyan-400">{rec.role}</p>
                    <p className="text-sm text-slate-400">{rec.company}</p>
                  </div>
                  <Quote className="w-8 h-8 text-cyan-500/30" />
                </div>

                <p className="text-slate-300 leading-relaxed mb-4 italic">
                  &ldquo;{rec.text}&rdquo;
                </p>

                <div className="text-sm text-slate-500">{rec.date}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
