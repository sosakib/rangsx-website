// Events (/events, /events/<slug>): status and countdown from the event dates, in Dhaka time (UTC+6), on every visit,
// so a page built weeks earlier still says "Upcoming", "Happening now" or "Ended" correctly.
(() => {
  const BN = document.documentElement.lang.startsWith("bn"), T = (en, bn) => (BN ? bn : en);
  const today = new Date(Date.now() + 6 * 36e5).toISOString().slice(0, 10);
  const day = (iso) => Math.round(Date.parse(iso) / 864e5);
  document.querySelectorAll("[data-ev-status]").forEach((el) => {
    const { start, end } = el.dataset, now = day(today), a = day(start), b = day(end);
    const st = today < start ? "upcoming" : today > end ? "past" : "live";
    el.dataset.status = st;
    const n = a - now, d = now - a + 1, of = b - a + 1;
    el.querySelector("[data-ev-count]").textContent =
      st === "upcoming" ? (n === 1 ? T("Starts tomorrow", "আগামীকাল শুরু") : T(`Starts in ${n} days`, `${n} দিন পর শুরু`))
      : st === "live" && of > 1 ? T(`Day ${d} of ${of}`, `দিন ${d} / ${of}`) : "";
  });
})();
