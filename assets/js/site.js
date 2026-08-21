/* =====================================================================
   site.js — fills in personal links and the booking widget from config.js.
   Edit config.js, not this file.
   ===================================================================== */
(function () {
  "use strict";

  /* config.js declares `const CONFIG`, which lives in script scope rather
     than on window — read the binding directly.                        */
  var C = (typeof CONFIG !== "undefined" && CONFIG) || window.CONFIG || {};

  function a(href, label, blank) {
    return '<a href="' + href + '"' +
           (blank ? ' target="_blank" rel="noopener"' : '') + '>' + label + '</a>';
  }

  function initials(name) {
    var p = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!p.length) return "";
    return p.slice(0, 3).map(function (w) { return w[0]; }).join("").toUpperCase();
  }

  /* ------------------------- name & photo -------------------------- */
  function profile() {
    if (C.name) {
      var n = document.getElementById("profile-name");
      if (n) n.textContent = C.name;
      document.querySelectorAll("[data-bind='name']").forEach(function (e) {
        e.textContent = C.name;
      });
    }

    var slot = document.getElementById("photoSlot");
    if (slot) {
      if (C.photo) {
        var img = new Image();
        img.src = C.photo;
        img.alt = C.name || "";
        img.onload = function () { slot.replaceWith(img); };
        img.onerror = function () { slot.textContent = initials(C.name); };
      } else {
        slot.textContent = initials(C.name);
      }
    }
  }

  /* ------------------------- profile links ------------------------- */
  function links() {
    var host = document.getElementById("profileLinks");
    if (!host) return;

    var out = [];
    if (C.email)       out.push(a("mailto:" + C.email, "Email"));
    if (C.cv)          out.push(a(C.cv, "CV", true));
    if (C.github)      out.push(a(C.github, "GitHub", true));
    if (C.huggingface) out.push(a(C.huggingface, "Hugging Face", true));
    if (C.scholar)     out.push(a(C.scholar, "Scholar", true));
    if (C.linkedin)    out.push(a(C.linkedin, "LinkedIn", true));

    host.innerHTML = out.join(" &middot; ");
  }

  /* ---------------------------- contact ---------------------------- */
  function contact() {
    var host = document.getElementById("contactLinks");
    if (host) {
      var out = [];
      if (C.email)       out.push(a("mailto:" + C.email, C.email));
      if (C.github)      out.push(a(C.github, "GitHub", true));
      if (C.huggingface) out.push(a(C.huggingface, "Hugging Face", true));
      if (C.linkedin)    out.push(a(C.linkedin, "LinkedIn", true));
      host.innerHTML = out.join(" &middot; ");
    }

    var sched = document.getElementById("scheduler");
    if (!sched) return;

    var s = C.scheduling || {};
    if (!s.url || s.provider === "none") {
      sched.innerHTML =
        '<div class="sched-setup">' +
        '<p><b>Booking not set up yet.</b></p>' +
        '<p>Create a free page on Cal.com or Calendly, then paste the link into ' +
        '<code>scheduling.url</code> in <code>assets/js/config.js</code>. The calendar ' +
        'will appear here and this notice disappears on its own.</p>' +
        (C.email ? '<p>In the meantime: ' + a("mailto:" + C.email, C.email) + '</p>' : '') +
        '</div>';
      return;
    }

    var join = s.url.indexOf("?") > -1 ? "&" : "?";
    var url = s.url;
    if (s.provider === "cal")           url += join + "embed=true&layout=month_view";
    else if (s.provider === "calendly") url += join + "hide_gdpr_banner=1";

    sched.innerHTML = '<div class="cal-embed"><iframe src="' + url +
                      '" title="Booking calendar" loading="lazy"></iframe></div>';
  }

  /* ----------------------------- misc ------------------------------ */
  function misc() {
    document.querySelectorAll("#footYear").forEach(function (e) {
      e.textContent = new Date().getFullYear();
    });

    /* The autoplay attribute alone does not reliably start a clip that was
       laid out in a background tab, or one scrolled out of a horizontal
       strip. Start them explicitly, and again whenever the tab is shown. */
    function playAll() {
      document.querySelectorAll("video[autoplay]").forEach(function (v) {
        if (v.paused) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
      });
    }

    playAll();
    window.addEventListener("load", playAll);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) playAll();
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting && en.target.paused) {
            var pr = en.target.play(); if (pr && pr.catch) pr.catch(function () {});
          }
        });
      }, { threshold: 0.05 });
      document.querySelectorAll("video[autoplay]").forEach(function (v) { io.observe(v); });
    }
  }

  function init() { profile(); links(); contact(); misc(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
