# Portfolio site

Static site — plain HTML, CSS and JavaScript. No build step, no dependencies,
no framework. Open `index.html` in a browser and it works.

```
portfolio/
├── index.html              ← academic layout (the live one)
├── index-modern.html       ← alternative layout, kept for comparison
├── assets/
│   ├── css/style.css              academic styling
│   ├── css/style-modern.css       styling for the alternative
│   ├── js/config.js        ← THE ONLY FILE YOU MUST EDIT
│   ├── js/main.js          wiring — drives both layouts
│   └── img/                photo, poster images, CV.pdf
└── tools/compress_video.ps1  optional: shrink video files with ffmpeg
```

Both layouts read the same `config.js`. Open each in a browser, keep the one
you prefer, delete the other.

---

## 1. Fill in `assets/js/config.js`

Everything personal lives in that one file: name, photo, email, GitHub,
Scholar, CV path, booking link, and video IDs. Any field left as `""` makes
its element disappear rather than break — so the page stays presentable
while you fill it in piece by piece.

**Currently unset and worth doing first:**

- `photo` — the page shows an initials block until you add one. Academics look
  for a face. A photo of you with the SO-101 arm beats a plain headshot: it
  shows you do hardware.
- `github` — professors will click it. It should point somewhere with your
  actual code.
- `cv` — drop the PDF into `assets/` and set the path.
- `scheduling.url` — see section 3.

**Also verify:** the name is currently `Syed Furqan Ali`, inferred from your
email address. Correct it if wrong — it appears in the title, header and footer.

---

## 2. Videos — already configured

Your four YouTube videos are wired in:

| Slot | Video | Short |
|---|---|---|
| `surveyrag` | `lmt_aM5NoCk` | `38rppjAhm9I` |
| `so101` | `oDDR4Vwr4Uo` | `2M_eX9eejPE` |
| `landing` | *(empty — shows a placeholder)* | |

Thumbnails are pulled from YouTube automatically, which works for unlisted
videos too. The player is click-to-load and uses `youtube-nocookie.com`, so
nothing is requested from Google until a visitor actually presses play.

**Pick your thumbnails deliberately** in YouTube Studio. The default is often a
black frame from the start of the video. For the Survey-RAG video, a frame
showing the typed query alongside the aerial view communicates the whole idea
before anyone clicks.

To host video files yourself instead, `tools/compress_video.ps1` shrinks a
380 MB capture to roughly 10–15 MB at 720p (needs ffmpeg:
`winget install Gyan.FFmpeg`).

---

## 3. Set up scheduling

Pick one, create a free account, paste the link into `scheduling.url`:

| Provider | Free tier | Link format |
|---|---|---|
| **Cal.com** (recommended) | unlimited event types, open source | `https://cal.com/you/30min` |
| Calendly | 1 event type | `https://calendly.com/you/30min` |
| Google Calendar | 1 booking page, already in your account | Appointment Schedule share link |

Set `provider` to match (`"cal"`, `"calendly"`, `"google"`), and
`inlineWidget: true` to embed the calendar in the page.

**Set your availability to real hours in your own timezone.** A professor in
another timezone booking a slot that turns out to be 3 a.m. for you is a bad
first impression, and the tool will let that happen if you leave the defaults.

---

## 4. Check the News section

`index.html` has a **News** block with six dated entries. I wrote them from
your file timestamps and reports, so the claims are grounded — but **verify the
dates and wording before sending this to anyone.** Edit them directly in
`index.html`; they are plain list items.

---

## 5. Deploy

### GitHub Pages — free, recommended

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/furqi98/furqi98.github.io.git
git push -u origin main
```

Then: repo → **Settings** → **Pages** → Source: `main` / root → **Save**.
Live at `https://furqi98.github.io` in about a minute.

Naming the repo exactly `furqi98.github.io` gives you the clean root URL.
Any other name puts the site at `furqi98.github.io/reponame` instead.

### Netlify — free, no git needed

Drag the `portfolio` folder onto [app.netlify.com/drop](https://app.netlify.com/drop).
Live in seconds. Rename the site under Site settings → Change site name.

### Cloudflare Pages — free, fastest CDN

Connect the repo at [pages.cloudflare.com](https://pages.cloudflare.com).
Build command: empty. Output directory: `/`. Pick this if you end up hosting
video files yourself — bandwidth is unmetered.

### Custom domain — about $10–15/year

The one thing worth paying for. `firstname-lastname.com` in an email signature
reads more seriously than a `github.io` subdomain. Buy at
[Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) (at-cost)
or Namecheap, then point it at your host:

- **GitHub Pages** — add a `CNAME` file containing your domain, then set the DNS
  records GitHub shows under Settings → Pages → Custom domain.
- **Netlify / Cloudflare Pages** — add the domain in the dashboard; DNS is automatic.

HTTPS is free and automatic on all three.

---

## 6. Before you send it to anyone

- [ ] Name spelled correctly (currently inferred from your email)
- [ ] Photo added
- [ ] News dates verified
- [ ] Every claim matches what you can actually demonstrate
- [ ] Videos play — open the live URL on your phone, not just your laptop
- [ ] Booking link opens a real calendar with sane availability
- [ ] CV PDF opens and is current
- [ ] Page looks right in both light and dark mode
- [ ] One person reads it cold and can tell you what you work on

---

## Editing the content

The prose is plain HTML in `index.html`, organised by section with comment
banners (`<!-- ==== PROJECTS ==== -->`). Editing text is just editing text —
find the sentence, change it. Keep the `class` attributes intact; the styling
hangs off them.

To reorder projects, move an entire `<article class="entry">…</article>` block.
To add one, copy an existing block, change the contents, and add matching
entries in `config.js` under `videos`, `repos` and `reports`.

### Adding a Publications section later

When you have papers, copy the `<section class="block">` pattern, put it
directly after the News block, and reuse the `.entry` markup — it is already
the standard thumbnail-left, title-and-links-right paper format. No redesign
needed.
