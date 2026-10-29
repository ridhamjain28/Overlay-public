// Overlay landing page: small progressive enhancements, no dependencies.
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reveal sections as they scroll into view.
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  // Copy buttons for code blocks.
  var status = document.getElementById("copy-status");
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok ? Promise.resolve() : Promise.reject(new Error("copy failed"));
  }
  document.querySelectorAll("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.getAttribute("data-copy-target"));
      if (!target) return;
      var text = target.textContent.trim();
      var copy = navigator.clipboard && window.isSecureContext
        ? navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); })
        : fallbackCopy(text);
      copy.then(function () {
        btn.textContent = "Copied";
        btn.classList.add("copied");
        if (status) status.textContent = "Commands copied to clipboard";
      }, function () {
        btn.textContent = "Press Ctrl+C";
        var range = document.createRange();
        range.selectNodeContents(target);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      });
      setTimeout(function () {
        btn.textContent = "Copy";
        btn.classList.remove("copied");
      }, 2000);
    });
  });

  // Screenshot lightbox.
  var dialog = document.getElementById("lightbox");
  if (dialog && typeof dialog.showModal === "function") {
    var bigImg = dialog.querySelector("img");
    var lastTrigger = null;
    document.querySelectorAll(".shot-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var thumb = btn.querySelector("img");
        bigImg.src = btn.getAttribute("data-full");
        bigImg.alt = thumb ? thumb.alt : "";
        lastTrigger = btn;
        dialog.showModal();
      });
    });
    dialog.querySelector(".lightbox-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("close", function () { if (lastTrigger) lastTrigger.focus(); });
  } else {
    // Older browsers: open the image directly.
    document.querySelectorAll(".shot-btn").forEach(function (btn) {
      btn.addEventListener("click", function () { window.open(btn.getAttribute("data-full"), "_blank", "noopener"); });
    });
  }
})();

// Contact form: send to Web3Forms without leaving the page, then show a "sent" animation.
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  if (!form) return;
  var card = form.closest(".contact-card");
  var sent = document.getElementById("cf-sent");
  var btn = document.getElementById("cf-submit");
  var err = document.getElementById("cf-error");
  var again = document.getElementById("cf-again");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    err.hidden = true;
    btn.disabled = true;
    var label = btn.textContent;
    btn.textContent = "Sending\u2026";
    fetch(form.action, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    }).then(function (res) { return res.json().then(function (d) { return { ok: res.ok && d.success, d: d }; }); })
      .then(function (r) {
        if (!r.ok) throw new Error("send failed");
        form.reset();
        card.classList.add("is-sent");
        sent.hidden = false;
      })
      .catch(function () { err.hidden = false; })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });

  again.addEventListener("click", function () {
    sent.hidden = true;
    card.classList.remove("is-sent");
    document.getElementById("cf-name").focus();
  });
})();