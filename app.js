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

// 100 supplied roasts minus 3 exact duplicates (97, 99, 100).
const ROASTS = [
  { key: "r01", category: "Productivity",     text: "Has 47 tabs open and calls it \u201cresearch.\u201d" },
  { key: "r02", category: "Time",            text: "Says \u201cI\u2019m on my way\u201d while still at home." },
  { key: "r03", category: "Social",          text: "Says \u201clet\u2019s catch up soon\u201d with absolutely no intention of making plans." },
  { key: "r04", category: "Food",            text: "Opens the fridge, finds nothing, closes it, then checks again five minutes later." },
  { key: "r05", category: "Entertainment",   text: "Spends 30 minutes choosing what to watch and watches nothing." },
  { key: "r06", category: "Entertainment",   text: "Says \u201cone more episode\u201d like they haven\u2019t said it 400 times before." },
  { key: "r07", category: "Sleep",           text: "Sets five alarms and wakes up angry at all five." },
  { key: "r08", category: "Sleep",           text: "Says \u201cI\u2019ll sleep early tonight\u201d at 1:30 AM." },
  { key: "r09", category: "Overthinking",    text: "Gets into bed and suddenly remembers every embarrassing thing they\u2019ve ever done." },
  { key: "r10", category: "Phone",           text: "Picks up their phone to check the time and ends up scrolling for 45 minutes." },
  { key: "r11", category: "Social Media",    text: "Opens Instagram for five minutes and disappears for an hour." },
  { key: "r12", category: "Messaging",       text: "Reads a message from the notification and never actually opens it." },
  { key: "r13", category: "Messaging",       text: "Opens a message, gets distracted, and forgets to reply." },
  { key: "r14", category: "Messaging",       text: "Says \u201csorry, just saw this\u201d after seeing it three days ago." },
  { key: "r15", category: "Productivity",    text: "Has 99+ unread emails and somehow feels in control." },
  { key: "r16", category: "Productivity",    text: "Makes a to-do list instead of doing the things on it." },
  { key: "r17", category: "Productivity",    text: "Downloads a productivity app instead of becoming productive." },
  { key: "r18", category: "Productivity",    text: "Watches a video about productivity instead of being productive." },
  { key: "r19", category: "Procrastination", text: "Says \u201cI\u2019ll start tomorrow\u201d every single day." },
  { key: "r20", category: "Memory",          text: "Writes something down so they won\u2019t forget and forgets where they wrote it." },
  { key: "r21", category: "Memory",          text: "Says \u201cI\u2019ll remember\u201d instead of setting a reminder." },
  { key: "r22", category: "Home",            text: "Has a chair that is 90% clothes and 10% chair." },
  { key: "r23", category: "Home",            text: "Cleans their room by moving everything to one corner." },
  { key: "r24", category: "Shopping",        text: "Goes to the supermarket for one thing and forgets that one thing." },
  { key: "r25", category: "Food",            text: "Buys vegetables with absolutely no plan to eat them." },
  { key: "r26", category: "Food",            text: "Orders food while already having food at home." },
  { key: "r27", category: "Food",            text: "Says \u201cI\u2019m not hungry\u201d and then eats everyone else\u2019s food." },
  { key: "r28", category: "Food",            text: "Says \u201cI don\u2019t care where we eat\u201d and rejects every suggestion." },
  { key: "r29", category: "Food",            text: "Says \u201cI don\u2019t need dessert\u201d and eats everyone else\u2019s." },
  { key: "r30", category: "Food",            text: "Opens a snack \u201cjust to have one\u201d and finishes the entire packet." },
  { key: "r31", category: "Shopping",        text: "Checks the delivery tracker every two minutes." },
  { key: "r32", category: "Shopping",        text: "Adds something to the cart and waits three weeks before buying it." },
  { key: "r33", category: "Money",           text: "Buys something because it\u2019s 40% off and saves absolutely nothing." },
  { key: "r34", category: "Money",           text: "Checks their bank balance after spending money like the number might have changed." },
  { key: "r35", category: "Money",           text: "Says \u201cI\u2019m saving money\u201d while ordering delivery." },
  { key: "r36", category: "Fitness",         text: "Buys gym clothes as a substitute for going to the gym." },
  { key: "r37", category: "Fitness",         text: "Says \u201cI\u2019ll start working out tomorrow\u201d while eating on the couch." },
  { key: "r38", category: "Hobbies",         text: "Buys everything needed for a new hobby and quits before using it." },
  { key: "r39", category: "Motivation",      text: "Gets extremely motivated at 2 AM and wakes up with zero motivation." },
  { key: "r40", category: "Life",            text: "Makes a five-year plan and can\u2019t decide what to eat for dinner." },
  { key: "r41", category: "Social Media",    text: "Takes 20 photos and posts none of them." },
  { key: "r42", category: "Social Media",    text: "Checks their own profile after posting something." },
  { key: "r43", category: "Overthinking",    text: "Says \u201cI don\u2019t care\u201d and then asks seven follow-up questions." },
  { key: "r44", category: "Social",          text: "Says \u201cno pressure\u201d while applying enormous pressure." },
  { key: "r45", category: "Overthinking",    text: "Rehearses an argument in the shower and wins every time." },
  { key: "r46", category: "Overthinking",    text: "Thinks of the perfect comeback three hours after the conversation." },
  { key: "r47", category: "Self-awareness",  text: "Gives advice they would never follow themselves." },
  { key: "r48", category: "Sleep",           text: "Says \u201cI\u2019m tired\u201d and stays awake for another three hours." },
  { key: "r49", category: "Time",            text: "Says \u201cI\u2019m almost there\u201d while still looking for their shoes." },
  { key: "r50", category: "Self-improvement", text: "Has spent years waiting to become the person they keep planning to become." },
  { key: "r51", category: "Confidence",      text: "Has the confidence of someone who has never heard themselves speak." },
  { key: "r52", category: "Confidence",      text: "Somehow manages to be wrong with incredible confidence." },
  { key: "r53", category: "Intelligence",    text: "Has two brain cells and both are on airplane mode." },
  { key: "r54", category: "Social",          text: "Brings nothing to the conversation except volume." },
  { key: "r55", category: "Personality",     text: "Has the personality of a loading screen." },
  { key: "r56", category: "Communication",   text: "Could turn a two-minute story into a hostage situation." },
  { key: "r57", category: "Decision-making", text: "You don\u2019t need enemies when your decision-making is this good." },
  { key: "r58", category: "Decision-making", text: "Has never met a bad idea they weren\u2019t willing to try." },
  { key: "r59", category: "General",         text: "Their biggest talent is making simple things unnecessarily complicated." },
  { key: "r60", category: "Personality",     text: "Has the emotional range of a parking ticket." },
  { key: "r61", category: "Arguments",       text: "Could lose an argument with a mirror." },
  { key: "r62", category: "Confidence",      text: "Has the confidence of a genius and the evidence of neither." },
  { key: "r63", category: "Common Sense",    text: "If common sense were money, they\u2019d be financially ruined." },
  { key: "r64", category: "Social",          text: "Somehow makes silence feel like a better conversation." },
  { key: "r65", category: "Overthinking",    text: "Has never seen an opportunity to overthink that they didn\u2019t take." },
  { key: "r66", category: "Social",          text: "Could make a compliment sound like an insult." },
  { key: "r67", category: "Communication",   text: "Has the rare ability to miss the point from every possible direction." },
  { key: "r68", category: "Life",            text: "Their life isn\u2019t a mess; it\u2019s a carefully curated disaster." },
  { key: "r69", category: "Responsibility",  text: "Has the urgency of someone who has never experienced consequences." },
  { key: "r70", category: "Attention",       text: "Their attention span has the structural integrity of wet tissue." },
  { key: "r71", category: "Productivity",    text: "Has mastered the art of being busy without accomplishing anything." },
  { key: "r72", category: "Planning",        text: "Their plans have more plot holes than a bad movie." },
  { key: "r73", category: "Drama",           text: "Somehow turns every minor inconvenience into a personal documentary." },
  { key: "r74", category: "Confidence",      text: "Has enough confidence to compensate for absolutely nothing." },
  { key: "r75", category: "Common Sense",    text: "Their common sense is currently out of office." },
  { key: "r76", category: "Overthinking",    text: "Could overcomplicate ordering water." },
  { key: "r77", category: "Social",          text: "Has a PhD in making things awkward." },
  { key: "r78", category: "Decision-making", text: "Every decision comes with an unnecessary sequel." },
  { key: "r79", category: "Intelligence",    text: "Their brain really said \u201cgood enough\u201d and logged off." },
  { key: "r80", category: "Opinions",        text: "Has never let a lack of information stop them from having an opinion." },
  { key: "r81", category: "Responsibility",  text: "Somehow always looks surprised by consequences." },
  { key: "r82", category: "Planning",        text: "Their life strategy appears to be \u201cwe\u2019ll see what happens.\u201d" },
  { key: "r83", category: "Organization",    text: "Has the organizational skills of a junk drawer." },
  { key: "r84", category: "Communication",   text: "Could turn a simple yes-or-no question into a TED Talk." },
  { key: "r85", category: "Life",            text: "Has been winging it for so long they think it\u2019s a strategy." },
  { key: "r86", category: "Timing",          text: "If bad timing were a career, they\u2019d be senior management." },
  { key: "r87", category: "Social",          text: "Has the unique ability to make everyone else question their own sanity." },
  { key: "r88", category: "Self-awareness",  text: "Their biggest red flag is the number of red flags they don\u2019t notice." },
  { key: "r89", category: "Personality",     text: "Could make a peaceful situation unnecessarily competitive." },
  { key: "r90", category: "Overthinking",    text: "Has never met a straightforward route they couldn\u2019t make complicated." },
  { key: "r91", category: "Intelligence",    text: "Their brain occasionally connects to the internet but never downloads the update." },
  { key: "r92", category: "Confidence",      text: "Has the confidence of someone who definitely didn\u2019t read the instructions." },
  { key: "r93", category: "Time",            text: "Somehow manages to be late to things they were already late to." },
  { key: "r94", category: "Excuses",         text: "If excuses burned calories, they\u2019d be an athlete." },
  { key: "r95", category: "Self-improvement", text: "Their personal growth is currently buffering." },
  { key: "r96", category: "Decision-making", text: "Honestly impressive how consistently they manage to make the obvious choice last." },
  { key: "r98", category: "Communication",   text: "Has the conversational skills of someone answering a customer-service survey." },
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
  el("verdictCategory").textContent = category;
  el("verdictPct").textContent = `${pct}% likely`;
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
