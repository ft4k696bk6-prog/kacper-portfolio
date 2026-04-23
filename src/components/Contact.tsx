"use client";

import Image from "next/image";
import { Mail, Linkedin, Phone, Download } from "lucide-react";

export function Contact() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-900/50">
      <div className="w-full">
        <div className="max-w-none w-full">
          <h2 className="text-4xl md:text-5xl text-white mb-12">
            Get In Touch
          </h2>

          <div className="mb-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision. Let&apos;s build
                something great together.
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:michal@sagan.dev"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group"
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Mail className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Email</div>
                    <div className="text-white">michal@sagan.dev</div>
                  </div>
                </a>

                <a
                  href="tel:+48600341211"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group"
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Phone className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Phone</div>
                    <div className="text-white">+48 600 341 211</div>
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/michal-sagan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-cyan-500/50 transition-all group"
                >
                  <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
                    <Linkedin className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">LinkedIn</div>
                    <div className="text-white">in/michal-sagan</div>
                  </div>
                </a>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-4 p-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all group cursor-pointer"
                >
                  <div className="p-3 bg-white/10 rounded-lg">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-cyan-100">
                      Download / Print
                    </div>
                    <div className="text-white">Save as PDF</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-3xl opacity-30 scale-75"></div>
                <Image
                  src="/footer.png"
                  alt="Michał Sagan"
                  width={384}
                  height={500}
                  className="relative w-80 h-auto md:w-100 -mb-4 md:h-auto object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400">
              <div>
                <p className="text-sm">
                  © 2026 Michał Sagan. All rights reserved.
                </p>
              </div>
              <div className="text-sm">
                <p>
                  Product Architect at{" "}
                  <span className="text-cyan-400">Heineken</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
