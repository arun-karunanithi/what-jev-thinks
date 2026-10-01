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

- The OpenRouter key lives in `app.js` (client-side). This is a free-tier personal
  key with a hard spending cap — if it gets scraped and abused, revoke it at
  [openrouter.ai/keys](https://openrouter.ai/keys) and paste in a new one.
- The look is deliberately hand-drawn: sketchy borders, hatched bars, Caveat +
  Patrick Hand fonts, paper grain.
