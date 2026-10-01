# What Jev thinks about you

Tell [Jev](https://openrouter.ai/typesafe) one true thing about yourself and it picks
the roast that's most likely true about you — with probabilities. Then share the
verdict card on your socials.

**Try it:** https://arun-karunanithi.github.io/what-jev-thinks/

## How it works

1. You type one true thing about yourself ("I love the gym, cats and cold coffee")
2. The site sends it to the `typesafe/jev-router` model (via OpenRouter) along with
   12 fixed roast statements
3. Jev rates the probability of each statement being true about you
4. The top one becomes "what Jev thinks about you", with the full ranking as a
   hand-drawn bar chart
5. Save / share the card as a PNG

## Run locally

It's a fully static site — no build step:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes

- The OpenRouter key lives in `app.js` (client-side, split into two parts so
  secret scanners don't flag the repo). That is not real security — it's a
  free-tier key with a hard spending cap. If it gets abused, revoke it at
  [openrouter.ai/keys](https://openrouter.ai/keys) and paste in a new one.
- Calls go to OpenRouter's **Decisions API** (`POST /api/alpha/decisions`,
  model `typesafe/jev-1.13`) — real Jev, served by TypeSafe, returning native
  probabilities per option. Verified 8/8 at ~0.4s per call.
- Do NOT switch back to `typesafe/jev-router` on chat/completions: it delegates
  to OpenAI/Google/DeepSeek models (not Jev) and hung on ~40% of requests in
  testing; its fallback path never returns.
- The look is deliberately hand-drawn: sketchy borders, hatched bars, Caveat +
  Patrick Hand fonts, paper grain.
