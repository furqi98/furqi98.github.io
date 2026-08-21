/* =====================================================================
   main.js — reads CONFIG and wires it into the page.
   Drives both index.html (academic layout) and index-modern.html.
   Every lookup is null-guarded, so each page uses only what it has.
   You should not need to edit this file. Edit config.js instead.
   ===================================================================== */
(function () {
  "use strict";

  /* config.js declares `const CONFIG`, which lives in script scope rather
     than on window — so read the binding directly and fall back to the
     global in case someone changes the declaration later.              */
  var C = (typeof CONFIG !== "undefined" && CONFIG) || window.CONFIG || {};

  /* ---------------------------- icons ------------------------------ */
  var ICON = {
    mail:     '<svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3 6.5 9 6 9-6"/></svg>',
    calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
    github:   '<svg viewBox="0 0 24 24"><path d="M9 19c-4.5 1.4-4.5-2.3-6.2-2.8m12.4 5.8v-3.6a3.1 3.1 0 0 0-.9-2.4c3-.3 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C5.9 1.9 4.8 2.2 4.8 2.2a4.8 4.8 0 0 0-.1 3.6 5.1 5.1 0 0 0-1.4 3.6c0 5.1 3.1 6.3 6.1 6.6a3.1 3.1 0 0 0-.9 2.4V22"/></svg>',
    scholar:  '<svg viewBox="0 0 24 24"><path d="M12 3 2 8.5 12 14l10-5.5L12 3Z"/><path d="M6 11v5.2c0 1.6 2.7 2.9 6 2.9s6-1.3 6-2.9V11"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7.5 10.5V17M7.5 7.4v.1M11.5 17v-3.7a2.3 2.3 0 0 1 4.6 0V17"/></svg>',
    twitter:  '<svg viewBox="0 0 24 24"><path d="m3 3 7.6 10.2L3.3 21M20.5 3l-7.2 7.8L21 21h-5.3L3.4 3h5.3Z"/></svg>',
    doc:      '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    film:     '<svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="M7.5 4.5v15M16.5 4.5v15M2.5 12h19M2.5 8.2h5M2.5 15.8h5M16.5 8.2h5M16.5 15.8h5"/></svg>',
    play:     '<svg viewBox="0 0 24 24"><path d="M8 5.2v13.6L19 12 8 5.2Z"/></svg>'
  };

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function link(href, label, icon, cls, blank) {
    var a = el("a", cls || "", (icon ? icon : "") + "<span>" + label + "</span>");
    a.href = href;
    if (blank) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    return a;
  }

  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/);
    if (!parts[0]) return "?";
    var first = parts[0][0];
    var last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  /* ------------------------- text bindings ------------------------- */
  function bindText() {
    if (C.name) {
      document.querySelectorAll("[data-bind='name']").forEach(function (n) { n.textContent = C.name; });
      document.title = C.name;
      var og = document.querySelector("meta[property='og:title']");
      if (og) og.setAttribute("content", C.name + (C.role ? " — " + C.role : ""));
    }

    var role = document.getElementById("roleLine");
    if (role) {
      var bits = [];
      if (C.role)        bits.push(C.role);
      if (C.affiliation) bits.push(C.affiliation);
      var html = bits.join('<span class="sep">·</span>');
      if (C.status) html += (html ? '<span class="sep">·</span>' : "") + '<span class="status">' + C.status + "</span>";
      role.innerHTML = html;
    }

    var year = document.getElementById("footYear");
    if (year) year.textContent = new Date().getFullYear();
  }

  /* ---------------------------- portrait --------------------------- */
  function buildPortrait() {
    var host = document.getElementById("portrait");
    if (!host) return;

    if (C.photo) {
      var img = document.createElement("img");
      img.src = C.photo;
      img.alt = C.name || "Portrait";
      img.onerror = function () { host.innerHTML = ""; host.appendChild(el("span", "initials", initials(C.name))); };
      host.appendChild(img);
    } else {
      host.appendChild(el("span", "initials", initials(C.name)));
      host.appendChild(el("span", "hint", "Add a photo: set <code>photo</code> in config.js"));
    }
  }

  /* ------------------------- contact links ------------------------- */
  /* Used by the academic masthead (#contactRow) and the older
     hero layout (#heroActions), which want slightly different classes. */
  function buildContactLinks() {
    var host = document.getElementById("contactRow") || document.getElementById("heroActions");
    if (!host) return;

    var academic = host.id === "contactRow";
    var base = academic ? "" : "btn";
    var primary = academic ? "primary" : "btn btn-primary";

    var sched = C.scheduling || {};
    var hasSched = sched.url && sched.provider !== "none";

    if (hasSched) host.appendChild(link("#contact", "Book a meeting", ICON.calendar, primary));
    if (C.email)  host.appendChild(link("mailto:" + C.email, "Email", ICON.mail, hasSched ? base : primary));
    if (C.cv)       host.appendChild(link(C.cv, "CV", ICON.doc, base, true));
    if (C.scholar)  host.appendChild(link(C.scholar, "Google Scholar", ICON.scholar, base, true));
    if (C.github)   host.appendChild(link(C.github, "GitHub", ICON.github, base, true));
    if (C.linkedin) host.appendChild(link(C.linkedin, "LinkedIn", ICON.linkedin, base, true));
    if (C.twitter)  host.appendChild(link(C.twitter, "Twitter", ICON.twitter, base, true));
  }

  /* ------------------------ per-entry links ------------------------ */
  function buildEntryLinks() {
    var repos = C.repos || {}, reports = C.reports || {}, videos = C.videos || {};

    document.querySelectorAll("[data-links]").forEach(function (host) {
      var key = host.getAttribute("data-links");
      var v = videos[key] || {};

      if (v.id)      host.appendChild(link("https://youtu.be/" + v.id, "Video", null, "", true));
      if (v.short)   host.appendChild(link("https://youtube.com/shorts/" + v.short, "Short", null, "", true));
      if (repos[key])   host.appendChild(link(repos[key], "Code", null, "", true));
      if (reports[key]) host.appendChild(link(reports[key], "Report", null, "", true));
    });

    /* older layout: a bare repo button slot */
    document.querySelectorAll("[data-repo]").forEach(function (host) {
      var url = repos[host.getAttribute("data-repo")];
      if (url) host.appendChild(link(url, "Code", ICON.github, "btn", true));
    });
  }

  /* ---------------------------- videos ----------------------------- */
  /* Click-to-load: nothing is requested from YouTube until the visitor
     clicks, and the embed uses the no-cookie domain.                  */
  function buildVideos() {
    var videos = C.videos || {};

    document.querySelectorAll(".video-slot").forEach(function (slot) {
      var key = slot.getAttribute("data-video");
      var v = videos[key] || {};
      var frame = el("div", "video-frame");

      if (!v.id) {
        frame.appendChild(el("div", "video-empty",
          ICON.film + "<p>Video slot ready — add the YouTube ID for <code>" + key +
          "</code> in config.js</p>"));
        slot.appendChild(frame);
        return;
      }

      var btn = el("button", "video-facade", '<span class="video-play">' + ICON.play + "</span>");
      btn.type = "button";
      btn.setAttribute("aria-label", "Play video: " + (v.caption || key));

      /* Thumbnail. YouTube serves these publicly for unlisted videos too.
         maxresdefault only exists for uploads >=1280x720, so start with
         hqdefault (always generated) and upgrade if the larger one loads. */
      if (v.poster) {
        btn.style.backgroundImage = "url('" + v.poster + "')";
      } else {
        btn.style.backgroundImage = "url('https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg')";
        var hi = new Image();
        hi.onload = function () {
          if (hi.naturalWidth > 200) btn.style.backgroundImage = "url('" + hi.src + "')";
        };
        hi.src = "https://i.ytimg.com/vi/" + v.id + "/maxresdefault.jpg";
      }

      btn.addEventListener("click", function () {
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + v.id +
                "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
        f.title = v.caption || "Project video";
        f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
        f.allowFullscreen = true;
        frame.innerHTML = "";
        frame.appendChild(f);
      });

      frame.appendChild(btn);
      slot.appendChild(frame);
      if (v.caption) slot.appendChild(el("p", "video-caption", v.caption));
    });
  }

  /* -------------------------- scheduling --------------------------- */
  function buildScheduler() {
    var host = document.getElementById("scheduler");
    var actions = document.getElementById("contactActions") || document.getElementById("meetActions");
    var academic = !!document.getElementById("contactActions");
    var base = academic ? "" : "btn";
    var primary = academic ? "primary" : "btn btn-primary";

    var s = C.scheduling || {};

    if (!s.url || s.provider === "none") {
      if (host && s.provider !== "none") {
        host.appendChild(el("div", "sched-setup",
          "<h4>Scheduling not configured yet</h4>" +
          "<p>Create a free booking page (Cal.com or Calendly), then paste the link into " +
          "<code>scheduling.url</code> in <code>config.js</code>. The calendar appears here.</p>" +
          "<p>This notice only shows while the link is empty — it disappears on its own.</p>"));
      }
      if (C.email && actions) actions.appendChild(link("mailto:" + C.email, C.email, ICON.mail, primary));
      return;
    }

    var embedUrl = null;
    if (s.inlineWidget && host) {
      var join = s.url.indexOf("?") > -1 ? "&" : "?";
      if (s.provider === "cal")           embedUrl = s.url + join + "embed=true&layout=month_view";
      else if (s.provider === "calendly") embedUrl = s.url + join + "hide_gdpr_banner=1";
      else if (s.provider === "google")   embedUrl = s.url;
    }

    if (embedUrl) {
      var wrap = el("div", "cal-embed");
      var f = document.createElement("iframe");
      f.src = embedUrl;
      f.title = "Booking calendar";
      f.loading = "lazy";
      wrap.appendChild(f);
      host.appendChild(wrap);
    }

    if (actions) {
      actions.appendChild(link(s.url, embedUrl ? "Open booking page" : "Pick a time",
                               ICON.calendar, embedUrl ? base : primary, true));
      if (C.email) actions.appendChild(link("mailto:" + C.email, C.email, ICON.mail, base));
    }
  }

  /* ------------------- footer (older layout only) ------------------ */
  function buildFooterLinks() {
    var host = document.getElementById("footerLinks");
    if (!host) return;
    if (C.email)    host.appendChild(link("mailto:" + C.email, "Email", null, "", false));
    if (C.github)   host.appendChild(link(C.github, "GitHub", null, "", true));
    if (C.scholar)  host.appendChild(link(C.scholar, "Google Scholar", null, "", true));
    if (C.linkedin) host.appendChild(link(C.linkedin, "LinkedIn", null, "", true));
    if (C.cv)       host.appendChild(link(C.cv, "CV", null, "", true));
  }

  /* ------------------------- theme toggle -------------------------- */
  function applyStoredTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    if (saved === "dark" || saved === "light") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }

  function bindThemeToggle() {
    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      if (!cur) cur = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      var next = cur === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  /* ---------------- scroll behaviours (older layout) --------------- */
  function initScroll() {
    var nav = document.getElementById("nav");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 8); };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  /* ------------------------------ go ------------------------------- */
  function init() {
    bindText();
    buildPortrait();
    buildContactLinks();
    buildEntryLinks();
    buildVideos();
    buildScheduler();
    buildFooterLinks();
    bindThemeToggle();
    initScroll();
  }

  applyStoredTheme(); // run early to avoid a flash of the wrong theme
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
