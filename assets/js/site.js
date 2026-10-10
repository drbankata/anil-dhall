/* =====================================================================
   DR (COL) ANIL DHALL · Cardiology · site script (no libraries, no build step)
   Progressive enhancement: every page reads fine without JavaScript.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var NL = String.fromCharCode(10);

  /* ---------- SETTINGS (edit here) ----------
     Anything left empty simply stays hidden on the site.                                        */
  var EMAIL       = "dranildhall@gmail.com";          /* on his LinkedIn banner (2026) */
  var CLINIC_EMAIL = "theheartclinicgurugram@gmail.com"; /* on theheartclinicgurugram.com */
  var PHONE       = "+91 88829 25342";                 /* clinic number, public on his clinic site + LinkedIn */
  var WHATSAPP    = "918882925342";                    /* digits only, with country code — clinic WhatsApp (public on his clinic site) */
  var CLINIC      = "The Heart Clinic Gurugram, T-12/2 (Ground Floor), DLF Phase III, Sector 24, Gurugram, Haryana 122002";
  var BOOKING_URL = "";   /* optional online diary (Practo / Calendly / Cal.com). Adds "Pick a slot online" buttons */
  var PRACTO_URL  = "https://www.practo.com/delhi/doctor/dr-anil-dhall-cardiologist-3"; /* his claimed Practo profile */
  var SEND_URL    = "";   /* optional: FormSubmit endpoint, e.g. "https://formsubmit.co/ajax/dranildhall@gmail.com" (one-time Activate click in his inbox). Empty = forms open WhatsApp / email */
  var FORM_URL    = "";   /* optional Google Form link (used only if SEND_URL is empty) */
  /* Online payment links per service (Razorpay Payment Pages / Instamojo / Cashfree / PayU links).
     When a link is filled in, "Pay online" appears on that service and after booking. */
  var PAYMENT = {
    "clinic":         "",
    "follow-up":      "",
    "video":          "",
    "second-opinion": "",
    "heart-risk":     "",
    "holter":         "",
    "abpm":           "",
    "elr":            ""
  };
  var UPI_ID   = "";   /* e.g. "dranildhall@okhdfcbank" — adds a "Pay by UPI" button (opens GPay / PhonePe / Paytm on phones with the amount filled in) */
  var UPI_NAME = "Dr Anil Dhall";
  var BANK_DETAILS = ""; /* optional bank-transfer line shown after booking (public!) */
  var LINKEDIN  = "https://www.linkedin.com/in/anildhall";
  var YOUTUBE   = "https://www.youtube.com/@Dr.ColAnilDhall";
  var FACEBOOK  = "https://www.facebook.com/dranildhall/";
  var INSTAGRAM = "https://www.instagram.com/the.heartclinicgurugram/";
  var TWITTER   = "https://x.com/dhall_dr";
  var SITE = "https://drbankata.github.io/anil-dhall/";

  /* Services (keep in step with the service rows in consultations/ and home).
     Fees are NOT shown on the site (Dr Dhall's decision, 2026-10-10). To show a fee later, fill price (e.g. "₹1,500")
     and amount (number, used for UPI links) — it then appears in the booking summary and the WhatsApp/email message. */
  var SERVICES = {
    "clinic":         { name: "Clinic consultation", price: "", amount: 0 },
    "follow-up":      { name: "Follow-up visit", price: "", amount: 0 },
    "video":          { name: "Video consultation", price: "", amount: 0 },
    "second-opinion": { name: "Second opinion on angiography or reports", price: "", amount: 0 },
    "heart-risk":     { name: "Heart risk review", price: "", amount: 0 },
    "holter":         { name: "Holter monitoring (24–48 h)", price: "", amount: 0 },
    "abpm":           { name: "24-hour blood pressure monitoring (ABPM)", price: "", amount: 0 },
    "elr":            { name: "Event loop recorder (ELR)", price: "", amount: 0 }
  };

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ref() { var d = new Date(); return "AD-" + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + Math.floor(100 + Math.random() * 900); }
  function reduced() { return window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function upi(id) {
    if (!UPI_ID) return "";
    var s = SERVICES[id], q = "pa=" + encodeURIComponent(UPI_ID) + "&pn=" + encodeURIComponent(UPI_NAME) + "&cu=INR";
    if (s && s.amount) q += "&am=" + s.amount + "&tn=" + encodeURIComponent(s.name);
    return "upi://pay?" + q;
  }

  /* ---------- Contact details: show only what has been filled in ---------- */
  var LINKS = {
    email: EMAIL && "mailto:" + EMAIL,
    clinicemail: CLINIC_EMAIL && "mailto:" + CLINIC_EMAIL,
    phone: PHONE && "tel:" + PHONE.replace(/[^+0-9]/g, ""),
    whatsapp: WHATSAPP && "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Hello, I would like to book a consultation with Dr Anil Dhall."),
    booking: BOOKING_URL, practo: PRACTO_URL, linkedin: LINKEDIN, youtube: YOUTUBE, facebook: FACEBOOK, instagram: INSTAGRAM, twitter: TWITTER,
    bank: BANK_DETAILS, upi: UPI_ID && "upi://pay?pa=" + encodeURIComponent(UPI_ID) + "&pn=" + encodeURIComponent(UPI_NAME) + "&cu=INR"
  };
  var TEXT = { email: EMAIL, clinicemail: CLINIC_EMAIL, phone: PHONE, whatsapp: PHONE, bank: BANK_DETAILS, clinic: CLINIC, upi: UPI_ID };
  function external(a, url) { a.href = url; if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; } }
  function applyShow(scope) {
    $$("[data-show]", scope).forEach(function (el) {
      var k = el.getAttribute("data-show");
      if (!LINKS[k]) { el.hidden = true; return; }
      el.hidden = false;
      if (el.tagName === "A" && k !== "bank") external(el, LINKS[k]);
      $$("[data-fill]", el).forEach(function (f) { if (TEXT[k]) f.textContent = TEXT[k]; });
    });
    $$("[data-pay]", scope).forEach(function (el) {
      var url = PAYMENT[el.getAttribute("data-pay")];
      if (!url) { el.hidden = true; return; }
      el.hidden = false; external(el, url);
    });
    $$("[data-upi]", scope).forEach(function (el) {
      var url = upi(el.getAttribute("data-upi"));
      if (!url) { el.hidden = true; return; }
      el.hidden = false; el.href = url;
    });
  }
  applyShow();
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Hours: mark today (clinic Mon–Sat 4–8 pm, India time) ---------- */
  (function () {
    var rows = $$(".hours tr[data-day]"); if (!rows.length) return;
    var now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    var d = now.getDay();
    rows.forEach(function (r) { if (r.getAttribute("data-day").split(",").indexOf(String(d)) > -1) r.classList.add("today"); });
  })();

  /* ---------- Mobile menu ---------- */
  var toggle = $(".menu-btn"), nav = $("#site-nav");
  var ICON_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg><span class="sr-only">Open menu</span>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="sr-only">Close menu</span>';
  if (toggle && nav) {
    var setOpen = function (open) { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open ? "true" : "false"); toggle.innerHTML = open ? ICON_CLOSE : ICON_OPEN; document.body.style.overflow = open ? "hidden" : ""; };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); } });
    addEventListener("resize", function () { if (innerWidth >= 1100 && nav.classList.contains("open")) setOpen(false); });
  }

  /* ---------- Header shadow, reading progress, back-to-top, mobile bar ---------- */
  var header = $(".site-header"), bar = $(".progress"), toTop = $(".to-top"), mbar = $(".mbar");
  function onScroll() {
    var y = window.scrollY, h = doc.scrollHeight - innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", y > 900);
    if (mbar) mbar.classList.toggle("show", y > 420 && (h - y) > 200);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }); });

  /* ---------- Hero ECG: measure the trace so the draw animation fits it ---------- */
  $$(".ecg-line").forEach(function (p) { try { p.style.setProperty("--len", Math.ceil(p.getTotalLength()) + 1); } catch (e) {} });
  if (reduced()) $$(".ecg-runner").forEach(function (r) { r.remove(); });

  /* ---------- Toast ---------- */
  var toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var tt;
  function say(t) { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 3200); }

  /* ---------- Dialog helpers ---------- */
  var lastFocus;
  function openDlg(d) { if (!d) return; lastFocus = document.activeElement; if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", ""); }
  function closeDlg(d) { if (!d) return; if (d.close) d.close(); else d.removeAttribute("open"); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) closeDlg(d); });
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { closeDlg(d); }); });
  });

  /* ---------- Background video band: pause button + respect reduced motion ---------- */
  $$(".vband").forEach(function (band) {
    var v = $("video", band), b = $(".vplay", band);
    if (!v) return;
    if (reduced()) { v.removeAttribute("autoplay"); v.pause(); }
    var PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg><span class="sr-only">Pause background video</span>';
    var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg><span class="sr-only">Play background video</span>';
    function sync() { if (b) b.innerHTML = v.paused ? PLAY : PAUSE; }
    if (b) b.addEventListener("click", function () { if (v.paused) v.play(); else v.pause(); sync(); });
    v.addEventListener("play", sync); v.addEventListener("pause", sync); sync();
  });

  /* ---------- YouTube: load only when asked (privacy + speed) ---------- */
  $$("[data-yt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.parentNode, id = btn.getAttribute("data-yt");
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("aria-label") || "Video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      box.innerHTML = ""; box.appendChild(f);
    });
  });
  /* video filter chips */
  var vchips = $$(".vfilter .chip");
  vchips.forEach(function (c) {
    c.addEventListener("click", function () {
      var t = c.getAttribute("data-topic");
      vchips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
      $$(".vids .vid").forEach(function (v) { v.hidden = t !== "all" && (v.getAttribute("data-topic") || "").split(" ").indexOf(t) < 0; });
    });
  });

  /* ---------- Map: load Google Maps only when asked ---------- */
  $$("[data-map]").forEach(function (b) {
    b.addEventListener("click", function () {
      var box = b.closest(".map"), f = document.createElement("iframe");
      f.src = b.getAttribute("data-map"); f.title = "Map to The Heart Clinic Gurugram"; f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade";
      box.innerHTML = ""; box.appendChild(f);
    });
  });

  /* ---------- Letters viewer ---------- */
  var letterDlg = $("#letter-dlg");
  $$("[data-letter]").forEach(function (c) {
    c.addEventListener("click", function () {
      if (!letterDlg) return;
      var tpl = document.getElementById(c.getAttribute("data-letter"));
      if (!tpl) return;
      $(".ld-body", letterDlg).innerHTML = tpl.innerHTML;
      openDlg(letterDlg);
    });
  });

  /* ---------- Heart library: search + topic chips ---------- */
  var lib = $("#library");
  if (lib) {
    var q = $("#lib-q"), chips = $$(".lib-chips .chip"), empty = $(".lib-empty"), topic = "all";
    var run = function () {
      var term = (q.value || "").trim().toLowerCase(), any = false;
      $$(".lib-group", lib).forEach(function (g) {
        var gs = 0, gt = g.getAttribute("data-group");
        $$(".entry", g).forEach(function (e) {
          var ok = (topic === "all" || gt === topic) && (!term || e.textContent.toLowerCase().indexOf(term) > -1);
          e.hidden = !ok; if (ok) { gs++; if (term && term.length > 2) e.open = true; }
        });
        g.hidden = gs === 0; if (gs) any = true;
      });
      if (empty) empty.hidden = any;
    };
    q.addEventListener("input", run);
    chips.forEach(function (c) { c.addEventListener("click", function () { topic = c.getAttribute("data-group"); chips.forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); }); run(); }); });
    var openHash = function () {
      var h = location.hash.slice(1), t = h && document.getElementById(h);
      if (t && t.tagName === "DETAILS") { t.open = true; t.hidden = false; if (t.parentNode) t.parentNode.hidden = false; t.scrollIntoView({ block: "start" }); }
    };
    openHash(); addEventListener("hashchange", openHash);
  }

  /* ---------- BP checker (ESC 2024 office categories) ---------- */
  var bpf = $("#bp-form");
  if (bpf) {
    var out = $("#bp-out");
    var check = function (e) {
      if (e) e.preventDefault();
      var s = parseInt(bpf.sys.value, 10), d = parseInt(bpf.dia.value, 10);
      if (!s || !d || s < 60 || s > 260 || d < 30 || d > 160 || d >= s) { out.removeAttribute("data-level"); out.innerHTML = "<b>Enter both numbers</b><p>The top number (systolic) is always the higher one, e.g. 128 over 82.</p>"; return; }
      var lvl, title, txt;
      if (s >= 180 || d >= 110) { lvl = "crisis"; title = "Severely raised"; txt = "Sit quietly for 5 minutes and measure again. If it stays this high, or you have chest pain, breathlessness, a severe headache, weakness or vision change, call 112 or go to an emergency department now."; }
      else if (s >= 140 || d >= 90) { lvl = "high"; title = "In the hypertension range"; txt = "One reading is not a diagnosis. Check again on a few days (home readings ≥135/85 also count as high) and book a review — high blood pressure is very treatable."; }
      else if (s >= 120 || d >= 70) { lvl = "elev"; title = "Elevated"; txt = "Above the ideal range. Lifestyle changes help, and your overall heart risk decides whether medicine is needed."; }
      else { lvl = "ok"; title = "Non-elevated"; txt = "This reading is in the healthy range. Keep checking once in a while, especially if you have diabetes or a family history."; }
      out.setAttribute("data-level", lvl);
      out.innerHTML = "<b>" + s + "/" + d + " mmHg · " + title + "</b><p>" + txt + "</p>";
    };
    bpf.addEventListener("submit", check);
  }

  /* =================================================================
     BOOKING + CONTACT (no backend needed)
     ================================================================= */
  var sendDlg = $("#send-dlg");
  var lastMsg = { subject: "", body: "", service: "" };

  var sel = $("#bk-service");
  function pick(id) { if (!sel || !SERVICES[id]) return; sel.value = id; sel.dispatchEvent(new Event("change")); }
  if (sel) {
    var qs = new URLSearchParams(location.search).get("service");
    if (qs) pick(qs);
    sel.addEventListener("change", function () {
      var s = SERVICES[sel.value], box = $("#bk-picked");
      if (box) box.innerHTML = s ? "You're booking: <strong>" + esc(s.name) + "</strong>" + (s.price ? " · " + esc(s.price) : "") : "";
      var mode = $$("input[name=mode]");
      if (sel.value === "video" || sel.value === "second-opinion") mode.forEach(function (m) { if (m.value === "Video call") m.checked = true; });
      if (sel.value === "clinic" || sel.value === "holter" || sel.value === "abpm" || sel.value === "elr") mode.forEach(function (m) { if (m.value === "At the clinic") m.checked = true; });
    });
    sel.dispatchEvent(new Event("change"));
  }
  $$("[data-book]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("data-book");
      if (sel) { e.preventDefault(); pick(id); var t = $("#book"); if (t) t.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" }); setTimeout(function () { var n = $("#bk-name"); if (n) n.focus({ preventScroll: true }); }, 600); }
    });
  });

  function val(f, n) { var el = f.elements[n]; if (!el) return ""; if (el.length && !el.tagName) { for (var i = 0; i < el.length; i++) if (el[i].checked) return el[i].value; return ""; } return (el.value || "").trim(); }

  function compose(form) {
    var kind = form.getAttribute("data-form"), r = ref(), lines = [];
    if (kind === "booking") {
      var s = SERVICES[val(form, "service")] || { name: val(form, "service"), price: "" };
      lines.push("Appointment request " + r, "", "Service: " + s.name + (s.price ? " (" + s.price + ")" : ""), "How: " + (val(form, "mode") || "-"));
      lines.push("Preferred date: " + (val(form, "date") || "Flexible"), "Preferred time: " + (val(form, "time") || "Any"), "", "Patient: " + val(form, "name") + (val(form, "age") ? ", " + val(form, "age") + " yrs" : ""), "Phone: " + val(form, "phone"), "Email: " + (val(form, "email") || "-"));
      if (val(form, "note")) lines.push("", "Reason / reports: " + val(form, "note"));
      lastMsg = { subject: "Appointment request — " + s.name + " (" + r + ")", body: lines.join(NL), service: val(form, "service") };
    } else {
      lines.push("Message from the website " + r, "", "Name: " + val(form, "name"), "Phone: " + (val(form, "phone") || "-"), "Email: " + (val(form, "email") || "-"), "Topic: " + (val(form, "topic") || "General"), "", val(form, "message"));
      lastMsg = { subject: "Website enquiry — " + (val(form, "topic") || "General") + " (" + r + ")", body: lines.join(NL), service: "" };
    }
    return lastMsg;
  }

  function showSend(msg, sentOk) {
    if (!sendDlg) return;
    $(".msg-preview", sendDlg).textContent = msg.body;
    var ok = $("[data-sent]", sendDlg), pending = $("[data-unsent]", sendDlg);
    if (ok) ok.hidden = !sentOk; if (pending) pending.hidden = !!sentOk;
    var em = $("[data-send=email]", sendDlg), wa = $("[data-send=whatsapp]", sendDlg), fm = $("[data-send=form]", sendDlg);
    if (wa) { wa.hidden = !WHATSAPP || sentOk; wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg.body); wa.target = "_blank"; wa.rel = "noopener"; }
    if (em) { em.hidden = !EMAIL || sentOk; em.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(msg.subject) + "&body=" + encodeURIComponent(msg.body); }
    if (fm) { fm.hidden = !FORM_URL || !!SEND_URL || sentOk; if (FORM_URL) external(fm, FORM_URL); }
    var pay = $("[data-pay-now]", sendDlg), url = PAYMENT[msg.service];
    if (pay) { pay.hidden = !url; if (url) external(pay, url); }
    var up = $("[data-upi-now]", sendDlg), uurl = msg.service ? upi(msg.service) : "";
    if (up) { up.hidden = !uurl; if (uurl) up.href = uurl; }
    var bk = $("[data-show=booking]", sendDlg); if (bk) bk.hidden = !BOOKING_URL || msg.service === "";
    var bank = $("[data-bank-line]", sendDlg); if (bank) { bank.hidden = !BANK_DETAILS || !msg.service; $("span", bank).textContent = BANK_DETAILS; }
    openDlg(sendDlg);
  }

  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("[required]", form).filter(function (el) { return el.type === "checkbox" ? !el.checked : !el.value.trim(); });
      $$(".form-err", form).forEach(function (x) { x.remove(); });
      if (bad.length) {
        bad.forEach(function (el) { el.setAttribute("aria-invalid", "true"); });
        var p = document.createElement("p"); p.className = "form-err"; p.setAttribute("role", "alert");
        p.textContent = "Please fill in the highlighted fields."; form.querySelector("[type=submit]").insertAdjacentElement("beforebegin", p);
        bad[0].focus(); return;
      }
      var em = form.elements.email; if (em && em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { em.setAttribute("aria-invalid", "true"); em.focus(); say("Please check the email address"); return; }
      var ph = form.elements.phone; if (ph && ph.value && ph.value.replace(/[^0-9]/g, "").length < 8) { ph.setAttribute("aria-invalid", "true"); ph.focus(); say("Please check the phone number"); return; }
      $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
      var msg = compose(form);
      if (SEND_URL) {
        var btn = form.querySelector("[type=submit]"); btn.disabled = true; var old = btn.textContent; btn.textContent = "Sending…";
        var data = { _subject: msg.subject, message: msg.body, _template: "box", _captcha: "false" };
        if (form.elements.email && form.elements.email.value) data.email = form.elements.email.value;
        fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function () { showSend(msg, true); form.reset(); if (sel) sel.dispatchEvent(new Event("change")); })
          .catch(function () { showSend(msg, false); })
          .then(function () { btn.disabled = false; btn.textContent = old; });
      } else showSend(msg, false);
    });
    $$("input,select,textarea", form).forEach(function (el) { el.addEventListener("input", function () { el.removeAttribute("aria-invalid"); }); });
  });

  var copyBtn = sendDlg && $("[data-copy]", sendDlg);
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var t = lastMsg.body;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { say("Copied — paste it into WhatsApp or an email"); }, function () {
      var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); say("Copied"); } catch (e) {} ta.remove();
    });
  });

  /* contact page: ?about=... pre-fills the topic */
  var topicSel = $("#ct-topic"), about = new URLSearchParams(location.search).get("about");
  if (topicSel && about) { for (var i = 0; i < topicSel.options.length; i++) if (topicSel.options[i].value === about) topicSel.value = about; }

  /* Earliest date = tomorrow; Sundays are closed */
  $$("input[type=date]").forEach(function (d) {
    var t = new Date(); t.setDate(t.getDate() + 1); d.min = t.toISOString().slice(0, 10);
    d.addEventListener("change", function () { if (d.value && new Date(d.value + "T12:00:00").getDay() === 0) { say("The clinic is closed on Sundays — please pick Monday to Saturday"); d.value = ""; } });
  });
})();
