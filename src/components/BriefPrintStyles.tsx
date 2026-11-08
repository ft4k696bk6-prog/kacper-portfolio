/** Print-only styling for the freely available website and CRM briefs. */
export function BriefPrintStyles() {
  return (
    <style>{`
      @media print {
        .site-nav, body > footer, footer { display: none !important; }
        body { background: white !important; }
        .printable-brief {
          padding: 0 !important;
          margin: 0 !important;
          min-height: 0 !important;
          background: white !important;
          color: #161616 !important;
        }
        .printable-brief * {
          color: #161616 !important;
          background: transparent !important;
          box-shadow: none !important;
          text-shadow: none !important;
          border-color: #b8b8b8 !important;
        }
        .printable-brief section { break-inside: avoid-page; }
        .printable-brief h1 { font-size: 26pt !important; }
        .printable-brief h2 { font-size: 16pt !important; }
        .printable-brief a { text-decoration: none !important; }
      }
    `}</style>
  );
}
