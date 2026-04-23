import Image from "next/image";
import { Mail, Linkedin, ChevronDown } from "lucide-react";

export function Hero() {
  return (
    <section className="min-h-screen flex relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-center">
        <div className="grid md:grid-cols-2 gap-12 md:items-end min-h-screen">
          <div className="order-2 md:order-2 space-y-6 self-center">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl lg:text-7xl text-white tracking-tight">
                Michał Sagan
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-px bg-gradient-to-r from-cyan-500 to-transparent w-12"></div>
                <p className="text-xl md:text-2xl text-cyan-400 uppercase tracking-wider">
                  Software Engineer
                </p>
              </div>
            </div>

            <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
              Product Architect specializing in cloud-native integration
              platforms, GraphQL Federation, and API ecosystems. Transforming
              complex business requirements into scalable technical solutions.
            </p>

            <div className="flex gap-4 pt-4">
              <a
                href="mailto:michal@sagan.dev"
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </a>
              <a
                href="https://linkedin.com/in/michal-sagan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="order-1 md:order-1 flex justify-center items-end pt-[10%]">
            <div className="relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-[70%] bg-gradient-to-t from-cyan-500 via-blue-600 to-transparent blur-3xl opacity-40"></div>
              <Image
                src="/hero_banner.png"
                alt="Michał Sagan"
                width={448}
                height={600}
                priority
                className="relative h-screen w-auto object-contain drop-shadow-2xl object-bottom"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-cyan-400" />
      </div>
    </section>
  );
}
