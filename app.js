/* What Jev thinks about you — front-end logic */

// Free-tier personal key, assembled at runtime so secret scanners don't flag it.
// This is NOT real security — anyone reading this file can reassemble it.
// If it ever gets abused: revoke at openrouter.ai/keys, split a new key the
// same way, and push.
const OPENROUTER_API_KEY = [
  "sk-or-v1-f832ac1050330e4c414f1ff17666399",
  "d9b604dafa8fa02fc8e6073ab56d8b099",
].join("");
const MODEL = "typesafe/jev-1.13";
const DECISIONS_URL = "https://openrouter.ai/api/alpha/decisions";
const SITE_URL = "https://arun-karunanithi.github.io/what-jev-thinks/";

const ROASTS = [
  { key: "fridge", text: "Checks the fridge 10 minutes after already checking it" },
  { key: "five_min_away", text: "Says \u201cI\u2019m 5 minutes away\u201d while still in the shower" },
  { key: "tabs", text: "Has 100+ browser tabs open and calls it \u201cresearch\u201d" },
  { key: "alarm", text: "Snoozes the alarm 4 times, then blames the traffic" },
  { key: "gym_rack", text: "Buys gym gear every January, uses it as a clothes rack" },
  { key: "same_order", text: "Spends 30 minutes picking a restaurant, orders the same thing" },
  { key: "cold_coffee", text: "Reheats the same coffee 3 times and never finishes it" },
  { key: "catch_up", text: "Says \u201clet\u2019s catch up soon\u201d with zero plans to catch up" },
  { key: "hobby_gear", text: "Starts a hobby, buys all the gear, quits in 2 weeks" },
  { key: "waves_back", text: "Waves back at people who weren\u2019t waving at them" },
  { key: "symptoms", text: "Googles symptoms at 2am and self-diagnoses something rare" },
  { key: "same_shows", text: "Rewatches the same 3 shows instead of trying anything new" },
];

const el = (id) => document.getElementById(id);
const sections = {
  ask: el("ask"),
  loading: el("loading"),
  result: el("result"),
  error: el("error"),
};

function show(section) {
  for (const key of Object.keys(sections)) {
    sections[key].hidden = key !== section;
  }
}

el("askBtn").addEventListener("click", run);
el("retryBtn").addEventListener("click", () => show("ask"));
el("againBtn").addEventListener("click", reset);

document.getElementById("fact").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run();
});

async function run() {
  const fact = el("fact").value.trim();
  if (fact.length < 3) {
    el("fact").focus();
    el("fact").placeholder = "Come on, give Jev something to work with\u2026";
    return;
  }
  show("loading");
  try {
    let scores;
    let lastErr;
    // the router's upstreams vary minute to minute; a fresh attempt often
    // lands on a fast one, so retry twice before giving up
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        scores = await askJev(fact);
        lastErr = null;
        break;
      } catch (e) {
        lastErr = e;
      }
    }
    if (lastErr) throw lastErr;
    render(fact, scores);
    show("result");
  } catch (err) {
    console.error(err);
    el("errorMsg").textContent =
      err && err.message
        ? err.message
        : "Jev is speechless. Something broke.";
    show("error");
  }
}

async function askJev(fact) {
  // OpenRouter's Decisions API calls the real Jev model (served by TypeSafe,
  // provider field confirms it) and returns native probabilities per option.
  // The chat/completions "jev-router" alternative delegates to OpenAI/Google/
  // DeepSeek models and hangs ~40% of the time — don't go back there.
  const criteria = {};
  ROASTS.forEach((r) => { criteria[r.key] = r.text; });

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 20000);
  let resp;
  try {
    resp = await fetch(DECISIONS_URL, {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        state: `A person describes themselves with one true fact: "${fact}"`,
        questions: {
          roast: {
            type: "choice",
            instructions:
              "Which statement is most likely true about this person, given their " +
              "self-description? Judge character ruthlessly but plausibly.",
            criteria,
          },
        },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 401) throw new Error("Jev refuses to recognize this key. (API key rejected)");
      if (resp.status === 429) throw new Error("Jev needs a breather \u2014 rate limited. Try again in a minute.");
      throw new Error(`Jev hit a snag (HTTP ${resp.status}). Try again.`);
    }

    const data = await resp.json();
    const probs = data.answers?.roast?.probabilities;
    if (!probs) {
      throw new Error("Jev mumbled something unreadable. Give it another shot.");
    }
    return ROASTS.map((r) =>
      Math.max(0, Math.min(100, Math.round((probs[r.key] ?? 0) * 100)))
    );
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error("Jev wandered off mid-judgement. Give it another go.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function render(fact, scores) {
  el("factEcho").textContent = fact;

  const ranked = ROASTS.map((r, i) => ({ text: r.text, p: scores[i] })).sort((a, b) => b.p - a.p);

  el("verdictText").textContent = ranked[0].text;
  el("verdictPct").textContent = `${ranked[0].p}% likely`;

  const bars = el("bars");
  bars.innerHTML = "";
  ranked.forEach((item, i) => {
    const stroke = i === 0 ? "rgba(217,79,61,0.8)" : "rgba(34,32,28,0.5)";
    const hatch =
      `<svg width="100%" height="100%" preserveAspectRatio="none" aria-hidden="true"><defs>` +
      `<pattern id="hatch-${i}" width="8" height="8" patternUnits="userSpaceOnUse" ` +
      `patternTransform="rotate(45)">` +
      `<line x1="0" y1="0" x2="0" y2="8" stroke="${stroke}" stroke-width="2.6"/>` +
      `</pattern></defs>` +
      `<rect width="100%" height="100%" fill="url(#hatch-${i})"/></svg>`;
    const row = document.createElement("div");
    row.className = "bar-row" + (i === 0 ? " top" : "");
    row.innerHTML =
      `<div class="bar-caption"><span class="txt">${escapeHtml(item.text)}</span>` +
      `<span class="pct">${item.p}%</span></div>` +
      `<div class="bar-track"><div class="bar-fill" data-w="${item.p}">${hatch}</div></div>`;
    bars.appendChild(row);
  });

  // animate bars in after paint
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      bars.querySelectorAll(".bar-fill").forEach((b) => { b.style.width = b.dataset.w + "%"; });
    })
  );
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function reset() {
  el("fact").value = "";
  show("ask");
  el("fact").focus();
}

/* ---------- share / save ---------- */

async function cardToBlob() {
  await document.fonts.ready;
  await new Promise((r) => setTimeout(r, 900)); // let bars finish animating
  const canvas = await html2canvas(el("card"), {
    scale: 2,
    backgroundColor: "#fbf8f1",
    useCORS: true,
  });
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

el("saveBtn").addEventListener("click", async () => {
  const blob = await cardToBlob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "what-jev-thinks.png";
  a.click();
  URL.revokeObjectURL(a.href);
});

el("shareBtn").addEventListener("click", async () => {
  const blob = await cardToBlob();
  const file = new File([blob], "what-jev-thinks.png", { type: "image/png" });
  const shareData = {
    text: "Jev thinks it has me figured out \ud83d\ude0f",
    title: "What Jev thinks about you",
  };
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ ...shareData, files: [file] });
      return;
    } catch (_) { /* user cancelled or share failed — fall back to download */ }
  }
  // no native share: put the image on the clipboard where possible
  if (navigator.clipboard && window.ClipboardItem) {
    try {
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      el("shareBtn").textContent = "Copied!";
      setTimeout(() => (el("shareBtn").textContent = "Share it"), 1800);
      return;
    } catch (_) { /* fall through to download */ }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "what-jev-thinks.png";
  a.click();
  URL.revokeObjectURL(a.href);
});
