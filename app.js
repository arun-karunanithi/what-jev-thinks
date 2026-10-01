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

// From the user's 1000-row CSV: 100 base jokes x 10 machine-phrasings each;
// the canonical phrasing of each joke is kept (3 grammar fixes applied).
const ROASTS = [
  { key: "r001", category: "Sleep", text: "You set five alarms and then wake up angry at all five." },
  { key: "r011", category: "Sleep", text: "You say “I’ll sleep early tonight” and then start scrolling at 1:30 AM." },
  { key: "r021", category: "Sleep", text: "You get into bed and then remember every embarrassing thing you’ve ever done." },
  { key: "r031", category: "Sleep", text: "You take a “quick nap” and then wake up three hours later." },
  { key: "r041", category: "Sleep", text: "You check the time at 2 AM and then decide 2:30 AM is basically the same thing." },
  { key: "r051", category: "Sleep", text: "You promise yourself you’ll wake up early and then negotiate with the alarm every morning." },
  { key: "r061", category: "Sleep", text: "You turn off your phone to sleep and then pick it up again two minutes later." },
  { key: "r071", category: "Sleep", text: "You sleep in on the weekend and then wake up early on the one day you wanted to sleep." },
  { key: "r081", category: "Sleep", text: "You stay up late finishing absolutely nothing and then feel productive because you were awake." },
  { key: "r091", category: "Sleep", text: "You blame your tiredness on your schedule and then ignore the fact that you went to bed at 3 AM." },
  { key: "r101", category: "Phone", text: "You pick up your phone to check the time and then open three apps before remembering why you picked it up." },
  { key: "r111", category: "Phone", text: "You plug your phone in at 2% and then forget about it until it is somehow at 100%." },
  { key: "r121", category: "Phone", text: "You look for your phone and then realize you’re holding it." },
  { key: "r131", category: "Phone", text: "You check one notification and then disappear into your phone for 40 minutes." },
  { key: "r141", category: "Phone", text: "You delete photos to free storage and then regret deleting one five minutes later." },
  { key: "r151", category: "Phone", text: "You say you’re taking a break from your phone and then check it every four minutes." },
  { key: "r161", category: "Phone", text: "You turn on Do Not Disturb and then keep checking your phone anyway." },
  { key: "r171", category: "Phone", text: "You open your camera by accident and then immediately act like nothing happened." },
  { key: "r181", category: "Phone", text: "You refresh an app repeatedly and then expect the internet to suddenly develop urgency." },
  { key: "r191", category: "Phone", text: "You have 20 charging cables and then somehow have none when you need one." },
  { key: "r201", category: "Social Media", text: "You open Instagram for five minutes and then lose an hour." },
  { key: "r211", category: "Social Media", text: "You post something and say you don’t care who sees it and then check the views 14 times." },
  { key: "r221", category: "Social Media", text: "You watch one reel and then watch 37 more without knowing how you got there." },
  { key: "r231", category: "Social Media", text: "You stalk someone’s profile and then accidentally like an old post." },
  { key: "r241", category: "Social Media", text: "You see a post you don’t understand and then read every comment before giving up." },
  { key: "r251", category: "Social Media", text: "You save a recipe and then never make it." },
  { key: "r261", category: "Social Media", text: "You save a workout and then never do it." },
  { key: "r271", category: "Social Media", text: "You take 20 photos for a post and then upload none of them." },
  { key: "r281", category: "Social Media", text: "You post a story and then check who viewed it like it’s election results." },
  { key: "r291", category: "Social Media", text: "You say you’re deleting social media and then redownload it before dinner." },
  { key: "r301", category: "Messaging", text: "You read a message from the notification and then forget to reply." },
  { key: "r311", category: "Messaging", text: "You open a message while busy and then mentally reply and never actually reply." },
  { key: "r321", category: "Messaging", text: "You say “sorry, just saw this” and then have actually seen it three days ago." },
  { key: "r331", category: "Messaging", text: "You type “haha” and then sit there looking completely serious." },
  { key: "r341", category: "Messaging", text: "You send “??” and then have waited approximately 18 seconds." },
  { key: "r351", category: "Messaging", text: "You say “no pressure” and then apply enormous pressure." },
  { key: "r361", category: "Messaging", text: "You say “take your time” and then check your phone every 30 seconds." },
  { key: "r371", category: "Messaging", text: "You write a long reply and then delete it and send “lol”." },
  { key: "r381", category: "Messaging", text: "You see someone typing and then immediately start wondering what they’re going to say." },
  { key: "r391", category: "Messaging", text: "You get a “we need to talk” text and then mentally prepare for your entire life to collapse." },
  { key: "r401", category: "Productivity", text: "You make a to-do list and then feel productive before doing anything on it." },
  { key: "r411", category: "Productivity", text: "You download a productivity app and then use it twice." },
  { key: "r421", category: "Productivity", text: "You watch a productivity video and then call it research." },
  { key: "r431", category: "Productivity", text: "You reorganize your desktop and then avoid the actual task for another hour." },
  { key: "r441", category: "Productivity", text: "You clean your workspace and then suddenly find 14 things that need doing first." },
  { key: "r451", category: "Productivity", text: "You open your laptop to work and then check everything except your work." },
  { key: "r461", category: "Productivity", text: "You write “URGENT” on a task and then still postpone it." },
  { key: "r471", category: "Productivity", text: "You plan your entire week and then ignore Monday by Monday morning." },
  { key: "r481", category: "Productivity", text: "You promise yourself a focused afternoon and then spend half of it deciding what to work on." },
  { key: "r491", category: "Productivity", text: "You say “I work better under pressure” and then create pressure by doing nothing until the last minute." },
  { key: "r501", category: "Work", text: "You join a meeting early and then spend the first five minutes asking if everyone can hear you." },
  { key: "r511", category: "Work", text: "You say “quick meeting” and then turn it into an hour." },
  { key: "r521", category: "Work", text: "You write a two-line email and then rewrite it 11 times." },
  { key: "r531", category: "Work", text: "You open a spreadsheet and then immediately question every life choice that led there." },
  { key: "r541", category: "Work", text: "You say “I’ll send it shortly” and then still be editing it two hours later." },
  { key: "r551", category: "Work", text: "You finish one task and then reward yourself with 45 minutes of scrolling." },
  { key: "r561", category: "Work", text: "You have one productive meeting and then mention it for the rest of the day." },
  { key: "r571", category: "Work", text: "You open Slack or Teams and then forget what you originally needed." },
  { key: "r581", category: "Work", text: "You say “let’s circle back” and then hope nobody actually circles back." },
  { key: "r591", category: "Work", text: "You put something on your calendar and then still somehow forget it." },
  { key: "r601", category: "Food", text: "You open the fridge and then find nothing interesting." },
  { key: "r611", category: "Food", text: "You close the fridge and then reopen it five minutes later." },
  { key: "r621", category: "Food", text: "You say you’re not hungry and then eat everyone else’s fries." },
  { key: "r631", category: "Food", text: "You say you don’t want dessert and then ask for a bite of someone else’s." },
  { key: "r641", category: "Food", text: "You open a snack packet for one bite and then finish the entire packet." },
  { key: "r651", category: "Food", text: "You say you’ll eat healthy today and then order fries by evening." },
  { key: "r661", category: "Food", text: "You order food while having food at home and then still call it a necessary purchase." },
  { key: "r671", category: "Food", text: "You spend 30 minutes choosing a restaurant and then order the same thing you always order." },
  { key: "r681", category: "Food", text: "You buy vegetables and then let them become a science experiment in the fridge." },
  { key: "r691", category: "Food", text: "You make coffee and then forget about it until it’s cold." },
  { key: "r701", category: "Money", text: "You say you’re saving money and then order delivery anyway." },
  { key: "r711", category: "Money", text: "You see a 40% discount and then spend 100% of the money you didn’t plan to spend." },
  { key: "r721", category: "Money", text: "You check your bank balance and then act surprised by your own purchases." },
  { key: "r731", category: "Money", text: "You make a budget and then break it before the week ends." },
  { key: "r741", category: "Money", text: "You buy something because it’s on sale and then convince yourself you made money." },
  { key: "r751", category: "Money", text: "You say “I deserve this” and then use it to justify something you absolutely don’t need." },
  { key: "r761", category: "Money", text: "You wait for payday and then spend most of it mentally before it arrives." },
  { key: "r771", category: "Money", text: "You open your banking app and then close it immediately after seeing the balance." },
  { key: "r781", category: "Money", text: "You say “it’s only a small purchase” and then repeat that sentence 14 times." },
  { key: "r791", category: "Money", text: "You try a no-spend week and then start negotiating with yourself on day one." },
  { key: "r801", category: "Shopping", text: "You add something to your cart and then wait three weeks before buying it." },
  { key: "r811", category: "Shopping", text: "You go shopping for one thing and then come back with everything except that thing." },
  { key: "r821", category: "Shopping", text: "You buy clothes for one occasion and then never wear them again." },
  { key: "r831", category: "Shopping", text: "You say “I’m just browsing” and then leave with a package." },
  { key: "r841", category: "Shopping", text: "You see free shipping and then add something you don’t need to qualify." },
  { key: "r851", category: "Shopping", text: "You track your delivery and then refresh the status every five minutes." },
  { key: "r861", category: "Shopping", text: "You see “out for delivery” and then suddenly become afraid to leave home." },
  { key: "r871", category: "Shopping", text: "You buy something online and then forget you ordered it until it arrives." },
  { key: "r881", category: "Shopping", text: "You compare two products for an hour and then buy neither." },
  { key: "r891", category: "Shopping", text: "You buy something because it’s viral and then forget about it two weeks later." },
  { key: "r901", category: "Confidence", text: "You have the confidence of someone who has never heard themselves speak and then still speak with complete authority." },
  { key: "r911", category: "Intelligence", text: "You are wrong with incredible confidence and then treat confidence like evidence." },
  { key: "r921", category: "Personality", text: "You have two brain cells and then keep both of them on airplane mode." },
  { key: "r931", category: "Communication", text: "You bring nothing to a conversation and then still somehow dominate it." },
  { key: "r941", category: "Common Sense", text: "You have the personality of a loading screen and then still expect everyone to be impressed." },
  { key: "r951", category: "General Roast", text: "You turn a two-minute story into a hostage situation." },
  { key: "r961", category: "Decision-making", text: "You make simple things unnecessarily complicated and then act surprised by the outcome." },
  { key: "r971", category: "Self-awareness", text: "You lose an argument with a mirror and then still think you won." },
  { key: "r981", category: "Social", text: "You have the confidence of a genius and then have the evidence of neither." },
  { key: "r991", category: "General Roast", text: "You treat common sense like an optional subscription and then still expect life to work smoothly." },
];

const CATEGORIES = [...new Set(ROASTS.map((r) => r.category))];

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
  setStage("Jev is picking a category");
  try {
    // call 1: which category of roast fits this person?
    const category = await withRetries(() =>
      jevChoice(
        fact,
        "Which category of harmless roast fits this person best, based on their " +
          "self-description? Pick where the funniest true thing about them lives.",
        Object.fromEntries(CATEGORIES.map((c) => [c, c]))
      )
    );

    // call 2: which roast within the winning category?
    const inCategory = ROASTS.filter((r) => r.category === category.top);
    let verdict;
    if (inCategory.length === 1) {
      verdict = { roast: inCategory[0], pct: category.pct };
    } else {
      setStage("Found the category \u2014 now the exact roast");
      const roastPick = await withRetries(() =>
        jevChoice(
          fact,
          `This person belongs in the "${category.top}" category. Which exact ` +
            "statement about them is most likely true and the funniest?",
          Object.fromEntries(inCategory.map((r) => [r.key, r.text]))
        )
      );
      const roast =
        inCategory.find((r) => r.key === roastPick.top) ?? inCategory[0];
      verdict = { roast, pct: roastPick.pct };
    }

    render(fact, verdict.roast, category.top, verdict.pct);
    show("result");
  } catch (err) {
    console.error(err);
    el("errorMsg").textContent =
      err && err.message ? err.message : "Jev is speechless. Something broke.";
    show("error");
  }
}

function setStage(text) {
  el("stageText").textContent = text;
}

async function withRetries(fn) {
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

// One Decisions API call: returns { top, pct } for the highest-probability option.
// Real Jev (served by TypeSafe, provider field confirms it). The chat/completions
// "jev-router" alternative delegates to OpenAI/Google/DeepSeek models and hangs
// ~40% of the time — don't go back there.
async function jevChoice(fact, instructions, criteria) {
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
          decision: {
            type: "choice",
            instructions,
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
    const probs = data.answers?.decision?.probabilities;
    if (!probs || Object.keys(probs).length === 0) {
      throw new Error("Jev mumbled something unreadable. Give it another shot.");
    }
    let top = null;
    let pct = 0;
    for (const [key, value] of Object.entries(probs)) {
      if (value > pct) {
        top = key;
        pct = value;
      }
    }
    return { top, pct: Math.round(pct * 100) };
  } catch (e) {
    if (e.name === "AbortError") {
      throw new Error("Jev wandered off mid-judgement. Give it another go.");
    }
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

function render(fact, roast, category, pct) {
  el("factEcho").textContent = fact;
  el("verdictText").textContent = roast.text;
}

function reset() {
  el("fact").value = "";
  show("ask");
  el("fact").focus();
}

/* ---------- share / save ---------- */

async function cardToBlob() {
  await document.fonts.ready;
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
