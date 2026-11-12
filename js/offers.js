// Offers (/offers, the offers strip on /events and event pages). On every visit, in Dhaka time (UTC+6):
// removes offers whose end date has passed, sets "Coming soon" / "On now" with a day count, and hides a list that is
// left empty (showing its empty-state message when it names one), so an offer disappears the day after it ends.
(() => {
  const BN = document.documentElement.lang.startsWith("bn"), T = (en, bn) => (BN ? bn : en);
  const today = new Date(Date.now() + 6 * 36e5).toISOString().slice(0, 10);
  const days = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
  document.querySelectorAll("[data-offer]").forEach((el) => {
    const { start, end } = el.dataset;
    if (today > end) return el.remove();
    const s = el.querySelector("[data-offer-status]");
    if (!s) return;
    const soon = today < start, n = days(today, soon ? start : end);
    s.dataset.status = soon ? "upcoming" : "live";
    s.querySelector("[data-offer-count]").textContent = soon
      ? (n === 1 ? T("Starts tomorrow", "আগামীকাল শুরু") : T(`Starts in ${n} days`, `${n} দিন পর শুরু`))
      : n === 0 ? T("Last day", "আজই শেষ দিন") : n === 1 ? T("Ends tomorrow", "আগামীকাল শেষ") : T(`Ends in ${n} days`, `আর ${n} দিন`);
  });
  document.querySelectorAll("[data-offers-host]").forEach((host) => {
    if (host.querySelector("[data-offer]")) return;
    const empty = host.dataset.offersHost && document.getElementById(host.dataset.offersHost);
    if (empty) empty.hidden = false;
    host.remove();
  });
})();
