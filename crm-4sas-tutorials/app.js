var LESSONS = [
  { id: "part-1", part: "Part 1", title: "Export the Pending Triggered leads from Odoo", short: "Export from Odoo",
    src: "part1.mp4", poster: "poster1.jpg", dur: 57, meta: "57 sec · 8 steps",
    steps: [
      { t: 4.0, title: "Open the CRM module", text: "From the Odoo home screen, click CRM.", tip: "Can't see CRM? Use the <b>Search menus</b> box at the top." },
      { t: 8.8, title: "Go to Reporting › 4SAS Dashboard", text: "Click Reporting in the top menu, then choose 4SAS Dashboard.", tip: "The dashboard shows totals for 3, 7, 14 and 30 days." },
      { t: 18.5, title: "Click the Pending Triggered chart", text: "The pink tile at the top left. It opens the list of pending triggered leads.", tip: "Use <b>Pending Triggered</b>, not the one marked “(No …)” below it." },
      { t: 23.3, title: "Select all records", text: "Tick the small box at the left of the header row.", tip: "Check the count at the top, e.g. <b>“78 selected”</b>, matches the dashboard." },
      { t: 28.2, title: "Click Actions", text: "The Actions button appears at the top once records are selected.", tip: "No Actions button? Nothing is selected yet." },
      { t: 33.0, title: "Click Export", text: "It is the first option in the Actions menu.", tip: "Export only downloads data. It does not change the leads." },
      { t: 37.8, title: "Choose the 4SAS 2.0 template", text: "Click the Template box and pick 4SAS 2.0 from the list.", tip: "Keep the format on <b>XLSX</b>." },
      { t: 47.5, title: "Click Export", text: "Press Export at the bottom of the window. The .xlsx file saves to Downloads.", tip: "The file is named <b>LeadOpportunity (crm.lead)</b> plus the date and time." }
    ],
    quiz: [
      { q: "Which template do you choose when exporting?", o: ["4AUTO 2.1", "4SAS 2.0", "1ST 4SAS", "CRM REPEAT DATA"], a: 1, why: "4SAS 2.0 has the columns the trackers expect." },
      { q: "Which dashboard chart do you open?", o: ["TOTAL 4SAS", "Repeat Order", "Pending Triggered", "3 DAYS"], a: 2, why: "Pending Triggered holds the leads that need the 4SAS follow-up." },
      { q: "Where is the Export option?", o: ["Reporting menu", "Actions menu", "Print button", "Filters"], a: 1, why: "Select all records first, then Actions › Export." }
    ] },
  { id: "part-2", part: "Part 2", title: "Input the export into the 4SAS and Retention sheets", short: "Input to Google Sheets",
    src: "part2.mp4", poster: "poster2.jpg", dur: 77, meta: "77 sec · 9 steps",
    steps: [
      { t: 4.0, title: "Open the exported file", text: "In File Explorer › Downloads, open the newest LeadOpportunity file.", tip: "Sort by <b>Date modified</b> so the newest file is on top." },
      { t: 7.6, title: "Select all the contents", text: "Click the corner box above row 1.", tip: "Or press <kbd>Ctrl</kbd> + <kbd>A</kbd>." },
      { t: 11.2, title: "Copy", text: "Copy everything you selected.", tip: "Press <kbd>Ctrl</kbd> + <kbd>C</kbd>." },
      { t: 14.2, title: "Paste into DONT DELETE", text: "Open 4SAS PAGE/WHATSAPP, go to the DONT DELETE tab, click A1 and paste.", tip: "Press <kbd>Ctrl</kbd> + <kbd>V</kbd> with A1 selected." },
      { t: 21.5, title: "Filter the Potential Duplicate column", text: "Click Create a filter, then the filter icon on Potential Duplicate Lead Count.", tip: "It is column <b>K</b>." },
      { t: 28.8, title: "Show only 0", text: "Click Clear, tick 0, then OK. These are the non-retention clients.", tip: "The bottom right shows how many rows are displayed." },
      { t: 36.8, title: "Copy to the 1ST 4SAS tab", text: "Select all, copy, open the 1ST 4SAS tab and paste.", tip: "With a filter on, only the visible rows are copied." },
      { t: 46.4, title: "Show all except 0 and (Blanks)", text: "Open the filter again, click Select all, untick 0 and (Blanks), then OK.", tip: "Only rows with <b>1 and up</b> should remain." },
      { t: 60.2, title: "Paste into the Retention Tracker", text: "Copy the rows, open RETENTION TRACKER › RO 1st 4SAS, click A1 and paste.", tip: "These are the retention clients." }
    ],
    quiz: [
      { q: "Which tab do you paste the raw export into first?", o: ["1ST 4SAS", "DONT DELETE", "4SAS COUNTS", "FOLLOW UP"], a: 1, why: "DONT DELETE holds the full export before filtering." },
      { q: "A lead with Potential Duplicate = 0 goes to…", o: ["RO 1st 4SAS", "1ST 4SAS tab", "SOURCE COUNTS", "Nowhere"], a: 1, why: "0 means a non-retention client." },
      { q: "Which values go to the Retention Tracker?", o: ["0 only", "Blanks only", "1 and up", "Everything"], a: 2, why: "Untick 0 and (Blanks); what's left are retention clients." }
    ] }
];

function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null"); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
var progress = store("crm4sas-progress") || {};
var quizState = store("crm4sas-quiz") || {};

var $ = function (id) { return document.getElementById(id); };
var video = $("video");
var L = null, cur = 0, segs = [], rows = [];
var CHECK = '<svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function done(l) { return progress[l.id] || (progress[l.id] = []); }
function fmt(s) { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

function renderLessons() {
  $("lessons").innerHTML = LESSONS.map(function (l) {
    var n = done(l).length, tot = l.steps.length, c = 2 * Math.PI * 20;
    return '<button class="lesson-btn" role="tab" aria-selected="' + (L && L.id === l.id) + '" data-id="' + l.id + '">' +
      '<div class="ring"><svg viewBox="0 0 48 48"><circle class="trk" cx="24" cy="24" r="20" fill="none" stroke-width="4"/>' +
      '<circle class="val" cx="24" cy="24" r="20" fill="none" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - n / tot)) + '"/></svg>' +
      '<span>' + n + '/' + tot + '</span></div>' +
      '<div><div class="lb-part">' + l.part + '</div><div class="lb-title">' + l.short + '</div><div class="lb-sub">' + l.meta + '</div></div></button>';
  }).join("");
  Array.prototype.forEach.call($("lessons").children, function (b) {
    b.onclick = function () { location.hash = b.dataset.id; };
  });
}

function load(id) {
  var l = LESSONS.filter(function (x) { return x.id === id; })[0] || LESSONS[0];
  if (L === l) return;
  L = l; cur = 0;
  video.poster = l.poster; video.src = l.src;
  $("partLabel").textContent = l.part;
  $("lessonTitle").textContent = l.title;
  $("lessonMeta").innerHTML = l.meta;
  var dur = l.dur;
  $("tl").innerHTML = l.steps.map(function (s, i) {
    var end = i + 1 < l.steps.length ? l.steps[i + 1].t : dur;
    return '<button class="seg" style="flex-grow:' + (end - s.t).toFixed(1) + '" data-i="' + i + '" title="Step ' + (i + 1) + ': ' + s.title + '"><span class="fill"></span><b>' + (i + 1) + '</b></button>';
  }).join("");
  segs = Array.prototype.slice.call($("tl").children);
  segs.forEach(function (b) { b.onclick = function () { go(+b.dataset.i, true); }; });
  $("checks").innerHTML = l.steps.map(function (s, i) {
    return '<li data-i="' + i + '"><button class="box" aria-label="Mark step ' + (i + 1) + ' done">' + CHECK + '</button><span class="txt"><b>' + (i + 1) + '.</b> ' + s.title + '</span></li>';
  }).join("");
  rows = Array.prototype.slice.call($("checks").children);
  rows.forEach(function (r) {
    r.querySelector(".box").onclick = function (e) { e.stopPropagation(); toggle(+r.dataset.i); };
    r.onclick = function () { go(+r.dataset.i, true); };
  });
  renderQuiz();
  renderLessons();
  paint();
}

function go(i, play) {
  cur = Math.max(0, Math.min(L.steps.length - 1, i));
  video.currentTime = L.steps[cur].t;
  if (play) { var p = video.play(); if (p && p.catch) p.catch(function () {}); }
  paint();
}

function toggle(i) {
  var d = done(L), k = d.indexOf(i);
  if (k >= 0) d.splice(k, 1); else d.push(i);
  store("crm4sas-progress", progress);
  renderLessons(); paint();
}

function paint() {
  var s = L.steps[cur], d = done(L);
  $("nowN").textContent = cur + 1;
  $("nowLabel").textContent = "Step " + (cur + 1) + " of " + L.steps.length + " · " + fmt(s.t);
  $("nowTitle").textContent = s.title;
  $("nowText").textContent = s.text;
  $("nowTip").innerHTML = "<b>Tip:</b> " + s.tip;
  $("prev").disabled = cur === 0;
  $("next").disabled = cur === L.steps.length - 1;
  var isDone = d.indexOf(cur) >= 0;
  $("mark").setAttribute("aria-pressed", isDone);
  $("mark").textContent = isDone ? "✓ Done" : "✓ Mark done";
  segs.forEach(function (b, i) { b.classList.toggle("on", i === cur); b.classList.toggle("done", d.indexOf(i) >= 0); });
  rows.forEach(function (r, i) { r.classList.toggle("on", i === cur); r.classList.toggle("done", d.indexOf(i) >= 0); });
  $("count").textContent = d.length + " / " + L.steps.length + " done";
}

video.addEventListener("timeupdate", function () {
  if (!L) return;
  var t = video.currentTime, idx = 0;
  L.steps.forEach(function (s, i) { if (t >= s.t - 0.05) idx = i; });
  $("clock").textContent = fmt(t) + " / " + fmt(video.duration || L.dur);
  segs.forEach(function (b, i) {
    var st = L.steps[i].t, en = i + 1 < L.steps.length ? L.steps[i + 1].t : (video.duration || L.dur);
    b.querySelector(".fill").style.width = Math.max(0, Math.min(1, (t - st) / (en - st))) * 100 + "%";
  });
  if (idx !== cur) { cur = idx; paint(); }
});
video.addEventListener("ended", function () {
  var d = done(L);
  L.steps.forEach(function (s, i) { if (d.indexOf(i) < 0) d.push(i); });
  store("crm4sas-progress", progress); renderLessons(); paint();
});

$("prev").onclick = function () { go(cur - 1, true); };
$("next").onclick = function () { go(cur + 1, true); };
$("play").onclick = function () { go(cur, true); };
$("mark").onclick = function () { toggle(cur); };
$("reset").onclick = function () {
  progress = {}; quizState = {};
  store("crm4sas-progress", progress); store("crm4sas-quiz", quizState);
  renderLessons(); renderQuiz(); paint();
};

function renderQuiz() {
  var st = quizState[L.id] || (quizState[L.id] = {});
  var right = 0, answered = 0;
  $("quiz").innerHTML = L.quiz.map(function (q, qi) {
    var pick = st[qi];
    if (pick !== undefined) { answered++; if (pick === q.a) right++; }
    return '<div class="q"><p>' + (qi + 1) + '. ' + q.q + '</p><div class="opts">' + q.o.map(function (o, oi) {
      var cls = "opt";
      if (pick !== undefined) { if (oi === q.a) cls += " right"; else if (oi === pick) cls += " wrong"; }
      return '<button class="' + cls + '" data-q="' + qi + '" data-o="' + oi + '"' + (pick !== undefined ? " disabled" : "") + '>' + o + '</button>';
    }).join("") + '</div>' + (pick !== undefined ? '<p class="why">' + (pick === q.a ? "Correct. " : "Not quite. ") + q.why + '</p>' : "") + '</div>';
  }).join("") + (answered === L.quiz.length ?
    (right === L.quiz.length ? '<div class="done-banner">All correct. You know ' + L.part + '.</div>'
      : '<div class="controls"><button class="btn" id="retry">Try again</button></div>') : "");
  $("score").textContent = answered ? right + " / " + L.quiz.length + " correct" : L.quiz.length + " questions";
  Array.prototype.forEach.call($("quiz").querySelectorAll(".opt"), function (b) {
    b.onclick = function () { st[+b.dataset.q] = +b.dataset.o; store("crm4sas-quiz", quizState); renderQuiz(); };
  });
  var r = $("retry"); if (r) r.onclick = function () { quizState[L.id] = {}; store("crm4sas-quiz", quizState); renderQuiz(); };
}

document.addEventListener("keydown", function (e) {
  if (e.target.closest("input, textarea")) return;
  if (e.key === "ArrowRight" && e.altKey) { go(cur + 1, true); e.preventDefault(); }
  if (e.key === "ArrowLeft" && e.altKey) { go(cur - 1, true); e.preventDefault(); }
});

function route() { load(location.hash.replace("#", "") || "part-1"); }
window.addEventListener("hashchange", route);
route();
