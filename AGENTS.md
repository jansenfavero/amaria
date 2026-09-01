# AMARIA development rules

- Preserve the agreed stack: Next.js App Router, TypeScript, Tailwind, Supabase and OpenAI Responses API on the server; GitHub source and Vercel hosting.
- All user-facing copy is Brazilian Portuguese. Respect the latest pink/purple ribbon-M identity, pastel surfaces and the signature “Para amar sem se perder de você”.
- Do not portray Maria as a psychologist, emergency service or psychotherapy/EMDR tool. No diagnostic or treatment promises.
- Do not fabricate testimonials, user counts, clinical reviews, subscription prices or active features. Upcoming features must be labeled.
- Never expose OpenAI keys, Supabase secret/service-role keys or tokens in client code, logs or Git. Use a dedicated AMARIA Supabase project; do not reuse other products' databases.
- No public collection of personal data until Auth, per-user RLS, consent, retention/deletion and privacy notices have been implemented and verified.
- Authentication must validate identity server-side; never authorize from user-editable metadata. Enable RLS and least-privilege grants on every exposed table.
- Run lint, TypeScript and a production build before publishing. Keep package versions exact and commit package-lock.json.
- Phase 1 is a static foundation. Do not activate chat, subscriptions, community or pretend login flows until their own implementation is complete.
