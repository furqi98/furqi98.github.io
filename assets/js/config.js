/* =====================================================================
   EDIT THIS FILE — it is the only file you need to touch.
   Everything below controls what appears on the site.
   ===================================================================== */

const CONFIG = {

  /* --- Who you are ------------------------------------------------- */
  name:        "Syed Furqan Ali",
  role:        "Robotics & Embodied AI",
  affiliation: "",                      // e.g. "MS Robotics, NUST" — leave "" to hide
  status:      "Applying for PhD positions",

  /* Photo: drop a file in assets/img/ and reference it here.
     A headshot works; you working with the SO-101 arm works better.
     Leave "" and a neutral initials block is shown instead.           */
  photo:       "assets/img/profile.jpg",

  /* --- Contact & links --------------------------------------------- */
  /* Leave any value as "" and its link disappears automatically.      */
  email:     "syed.furqan.ali.1998@gmail.com",
  github:    "https://github.com/furqi98",
  scholar:   "",                       // "https://scholar.google.com/citations?user=XXXX"
  linkedin:  "",                       // "https://linkedin.com/in/yourusername"
  twitter:   "",                       // "https://x.com/yourusername"
  huggingface: "https://huggingface.co/Syed-Furqan",
  cv:        "",                       // "assets/CV.pdf" — drop the PDF in assets/

  /* --- Scheduling ---------------------------------------------------
     Pick ONE provider and paste your booking link.
       Cal.com    →  "https://cal.com/your-username/30min"
       Calendly   →  "https://calendly.com/your-username/30min"
       Google     →  your Appointment Schedule share link
     inlineWidget: true embeds the calendar directly in the page.
  -------------------------------------------------------------------- */
  scheduling: {
    provider:      "cal",              // "cal" | "calendly" | "google" | "none"
    url:           "",                 // paste your booking link here
    inlineWidget:  true,
  },

  /* --- Videos --------------------------------------------------------
     Paste the YouTube ID only — the part after youtu.be/ or /shorts/.
       https://youtu.be/lmt_aM5NoCk            →  "lmt_aM5NoCk"
       https://youtube.com/shorts/38rppjAhm9I  →  "38rppjAhm9I"

     Thumbnails are pulled from YouTube automatically — this works for
     unlisted videos too. Nothing loads from YouTube until a visitor
     actually clicks play.

     `short` is optional: a vertical Shorts cut, offered as a second link.
     `poster` overrides the YouTube thumbnail with your own image.
  -------------------------------------------------------------------- */
  videos: {
    surveyrag: {
      id:      "lmt_aM5NoCk",
      short:   "38rppjAhm9I",
      poster:  "",
      caption: "Survey flight, indexing, and typed natural-language requests flown end to end",
    },
    so101: {
      id:      "oDDR4Vwr4Uo",
      short:   "2M_eX9eejPE",
      poster:  "",
      caption: "ACT policy on the SO-101 — 7/8 trials, block repositioned by hand each time",
    },
    landing: {
      id:      "",
      short:   "",
      poster:  "",
      caption: "VLM landing-zone selection and grid-lock descent",
    },
  },

  /* --- Per-project links (optional) --------------------------------- */
  repos: {
    surveyrag: "",   // private for now — set when you make it public
    so101:     "https://github.com/furqi98/so101-imitation-learning",
    landing:   "https://github.com/furqi98/hexagrid-vlm-landing",
  },
  reports: {
    surveyrag: "",                     // e.g. "assets/survey-rag-report.pdf"
    so101:     "",
    landing:   "",
  },

  /* --- Extra per-project links (shown after Video/Short/Code) -------- */
  extraLinks: {
    so101: [
      { label: "Dataset",  url: "https://huggingface.co/datasets/Syed-Furqan/pick_place_1_grid" },
      { label: "Policy",   url: "https://huggingface.co/Syed-Furqan/act_pick_place_1_grid_policy" },
      { label: "Episodes", url: "https://huggingface.co/spaces/lerobot/visualize_dataset?path=%2FSyed-Furqan%2Fpick_place_1_grid%2Fepisode_0" },
    ],
  },
};
