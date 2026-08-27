(function () {
  "use strict";

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

  function profile() {
    if (C.name) {
      var n = document.getElementById("profile-name");
      if (n) n.textContent = C.name;
      document.querySelectorAll("[data-bind='name']").forEach(function (e) {
        e.textContent = C.name;
      });
    }

    // The photo is in the HTML so it starts downloading during parse rather
    // than waiting for config.js and this script to run. Only intervene if
    // config points somewhere else, or has no photo at all.
    var photo = document.getElementById("profilePhoto");
    if (photo) {
      if (!C.photo) {
        var ph = document.createElement("div");
        ph.className = "no-photo";
        ph.textContent = initials(C.name);
        photo.replaceWith(ph);
      } else {
        if (C.photo !== photo.getAttribute("src")) photo.src = C.photo;
        if (C.name) photo.alt = C.name;
        photo.onerror = function () {
          var f = document.createElement("div");
          f.className = "no-photo";
          f.textContent = initials(C.name);
          photo.replaceWith(f);
        };
      }
    }
  }

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

  function misc() {
    document.querySelectorAll("#footYear").forEach(function (e) {
      e.textContent = new Date().getFullYear();
    });

    // Clips are muted+loop+autoplay, so the browser drives them. This only
    // nudges any that the autoplay policy left paused, and again when the tab
    // is brought back to the foreground.
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
