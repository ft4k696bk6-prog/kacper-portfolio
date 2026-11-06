# Portfolio AI: OpenRouter (isolated backend change)

This branch changes ONLY the existing `/api/ai-consultant` backend and adds a
small knowledge helper plus tests. It does **not** change the mascot, booking UI,
page layout, SEO, image assets, or the current production deployment.

## Configuration required before merge / production

1. Create a **separate API key** in OpenRouter at https://openrouter.ai/settings/keys .
2. Set a small per-key credit limit, ideally **USD 1 monthly**, and disable
   automatic top-ups. Verify the actual reset interval in OpenRouter.
3. In Vercel project `kacper-portfolio`, add the **server-only**
   environment variable `OPENROUTER_API_KEY` for Production/Preview.
   Never use a `NEXT_PUBLIC_` prefix or commit the value to GitHub.
4. In Vercel Firewall, add an IP rate limit for `/api/ai-consultant`:
   e.g. 5 requests per 10 minutes per client IP, action: deny/429.
   The code's in-memory limits are NOT distributed across serverless instances.
5. Test the existing mascot on Preview and run `npm run typecheck`,
   `npm test` and `npm run build` before merging.
6. Merge only after the other conversation's portfolio UI work has finished,
   rebasing this small backend change on the latest main if necessary.

## Cost controls

- Pinned model: `openai/gpt-oss-20b`.
- Input: a single latest user question, max 250 characters. Previous chat
  history is accepted from the existing UI for compatibility but **discarded**
  before the upstream call.
- Output: at most 256 model tokens and 850 visible characters.
- No tools, browsing, image uploads, model fallback chains or NVIDIA fallback.
- Off-topic requests return a fixed, free refusal without calling OpenRouter.
- Serverless in-memory limits: 5 requests per IP per 10 minutes, max 100
  requests per day **per instance**. Not a substitute for WAF/provider cap.
- If the API key is absent, the page shows a static portfolio fallback and
  incurs no inference cost.

## Knowledge policy

Public case-study records are read directly from the current website's
`src/i18n/case-studies.ts`. No private user history, customer data, secret
keys or confidential commercial information is added.

## Known limitations

- A system prompt and keyword guard are not a security boundary; prompt
  injections may occasionally change model behavior.
- Per-instance counters cannot enforce an absolute sitewide daily limit.
- The provider credit cap controls API cost, not Vercel infrastructure usage.
- The key is not stored in the branch; it must be supplied in Vercel by the account owner.
