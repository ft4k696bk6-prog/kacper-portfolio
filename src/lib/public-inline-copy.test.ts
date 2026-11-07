import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const roots = ["src/app", "src/components", "src/content", "src/i18n"] as const;
const unwanted = [
  /opis oparty na (?:zakresie współpracy|materiałach przekazanych)/i,
  /według (?:relacji|informacji) (?:Kacpra|właściciela)/i,
  /(?:Kacper|właściciel) (?:podaje|deklaruje)\b/i,
  /(?:ze|z|na podstawie) (?:udostępnionych|przesłanych|dostarczonych) zrzutów/i,
  /brak niezależnego audytu panelu/i,
  /nie mam niezależnej weryfikacji/i,
  /(?:Źródło|Source) liczb: informacje przekazane/i,
  /nie publikujemy surowych zrzutów ekranu/i,
  /zrzuty przedstawiają publiczną wersję strony/i,
  /screenshots show the public live site/i,
  /screenshot captured from the public live site/i,
  /treść wspomagana AI, poddana automatycznej kontroli/i,
  /materiały dostępne bez połączeń z API generatywnej AI/i,
] as const;

function listFiles(dir:string):string[]{
  return readdirSync(dir,{withFileTypes:true}).flatMap((item)=>{
    const filename=join(dir,item.name);
    if(item.isDirectory())return listFiles(filename);
    if(!item.isFile()||!/\.(tsx?|json)$/.test(filename)||/\.test\.tsx?$/.test(filename))return [];
    return [filename];
  });
}

describe("inline public website copy audit",()=>{
  it("scans every website component, route, public content file and translation file",()=>{
    const files=roots.flatMap(listFiles);
    expect(files.length).toBeGreaterThan(70);
    const issues:string[]=[];
    for(const filename of files){
      const source=readFileSync(filename,"utf8");
      for(const pattern of unwanted){
        const match=source.match(pattern);
        if(match)issues.push(`${filename}: ${match[0]}`);
      }
    }
    expect(issues).toEqual([]);
  });
});
