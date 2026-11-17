(function () {
  "use strict";
  var D = window.RRPL_DATA, C = window.RRPL_CONFIG || {}, I = window.RRPL_I18N;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  /* ---------- Language ---------- */
  var lang = $("#lang");
  Object.keys(I).forEach(function (code) {
    var o = document.createElement("option");
    o.value = code; o.textContent = I[code]._name; lang.appendChild(o);
  });
  function applyLang(code) {
    var t = I[code] || I.en;
    document.documentElement.lang = code;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (t[k]) el.textContent = t[k]; else if (I.en[k]) el.textContent = I.en[k];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var k = el.getAttribute("data-i18n-ph"); el.placeholder = t[k] || I.en[k];
    });
    renderTabs();
  }
  lang.addEventListener("change", function () { store.set("rrpl-lang", lang.value); applyLang(lang.value); });

  /* ---------- Content sections ---------- */
  var list = function (arr) { return arr.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };

  /* Photos: hide the frame if a file is missing */
  document.addEventListener("error", function (e) {
    var el = e.target;
    if (!el || el.tagName !== "IMG") return;
    var remote = el.getAttribute("data-remote");
    if (remote && el.src !== remote) { el.setAttribute("data-remote", ""); el.src = remote; return; }
    var fig = el.closest("figure, .g-item"); if (fig) fig.hidden = true; else el.hidden = true;
  }, true);
  function photo(img, cls) {
    if (!img) return "";
    return '<figure class="' + cls + '"><img loading="lazy" decoding="async" src="' + esc(img.src) + '" data-remote="' + esc(img.remote || "") +
      '" alt="' + esc(img.alt) + '"></figure>';
  }

  /* Hero slider */
  var slidesEl = $("#hero-slides"), dotsEl = $("#hero-dots"), cur = 0, timer = null;
  slidesEl.innerHTML = D.hero.map(function (h, i) {
    return '<figure class="slide' + (i === 0 ? " is-on" : "") + '" aria-hidden="' + (i !== 0) + '"><img src="' + esc(h.src) + '" alt="' + esc(h.alt) + '"' + (i ? ' loading="lazy"' : "") + "></figure>";
  }).join("") + '<p class="slide-cap">Best Partner of Choice</p>';
  dotsEl.innerHTML = D.hero.map(function (h, i) { return '<button type="button" aria-label="Photo ' + (i + 1) + '" aria-pressed="' + (i === 0) + '"></button>'; }).join("");
  function show(i) {
    var s2 = slidesEl.querySelectorAll(".slide"), d2 = dotsEl.querySelectorAll("button");
    cur = (i + s2.length) % s2.length;
    s2.forEach(function (el, j) { el.classList.toggle("is-on", j === cur); el.setAttribute("aria-hidden", j !== cur); });
    d2.forEach(function (el, j) { el.setAttribute("aria-pressed", j === cur); });
  }
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function play() { if (!reduce) { clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 5000); } }
  dotsEl.addEventListener("click", function (e) { var b2 = e.target.closest("button"); if (!b2) return; show([].indexOf.call(dotsEl.children, b2)); play(); });
  $("#hero-slider").addEventListener("mouseenter", function () { clearInterval(timer); });
  $("#hero-slider").addEventListener("mouseleave", play);
  play();

  /* About */
  $("#about-tag").textContent = D.about.tagline + ".";
  $("#founder-quote").textContent = D.about.founderVision;
  $("#vision").innerHTML = D.about.vision.map(function (v) { return "<p>" + esc(v) + "</p>"; }).join("");
  $("#mission").textContent = D.about.mission;
  $("#values").innerHTML = D.about.values.map(function (v) { return "<p>" + esc(v) + "</p>"; }).join("");

  /* Stats */
  var stats = D.stats.filter(function (x) { return x.value != null && x.value !== ""; });
  if (stats.length) {
    $("#stats").innerHTML = stats.map(function (x) { return "<div><dt>" + esc(x.label) + "</dt><dd>" + esc(x.value) + "</dd></div>"; }).join("");
    $("#stats").hidden = false;
  }

  /* Services and expertise */
  $("#svc-grid").innerHTML = D.services.map(function (sv) {
    return '<article class="svc"><span class="svc-icon"><img src="assets/icons/service-' + sv.icon + '.svg" alt="" width="64" height="48"></span><h3>' +
      esc(sv.title) + "</h3><p>" + esc(sv.text) + "</p></article>";
  }).join("");
  $("#cargo-chips").innerHTML = list(D.cargo);

  /* Approach, features, HSSEQ */
  $("#pillars").innerHTML = D.approach.map(function (a2, i) {
    return '<article class="pillar">' + photo(a2.image, "pillar-photo") + '<span class="pillar-tag">' + String(i + 1).padStart(2, "0") + '</span><p class="pillar-label">' + esc(a2.label) +
      '</p><h3 data-i18n="' + a2.key + '">' + esc(a2.title) + "</h3><ul>" + list(a2.points) + "</ul></article>";
  }).join("");
  $("#feat-ops").innerHTML = list(D.features.operations);
  $("#feat-cust").innerHTML = list(D.features.customers);
  $("#hsseq").innerHTML = list(D.hsseq);

  /* Fleet */
  var maxLog = Math.log(41);
  $("#fleet-list").innerHTML = D.fleet.map(function (f) {
    var pct = Math.max(6, Math.round(Math.log(f.t + 1) / maxLog * 100));
    return '<li><span class="f-name">' + esc(f.name) + '</span><span class="f-bar" aria-hidden="true"><span style="width:' + pct +
      '%"></span></span><span class="f-cap">' + esc(f.capacity) + "</span></li>";
  }).join("");
  $("#fleet-makes").innerHTML = list(D.fleetMakes);
  $("#garage").textContent = D.garage;
  $("#hubs").textContent = D.hubs;

  /* Galleries with a shared viewer */
  var lb = $("#lightbox"), lbSet = [], lbIdx = 0;
  function lbShow(i) {
    lbIdx = (i + lbSet.length) % lbSet.length;
    var it = lbSet[lbIdx];
    $("#lb-img").src = it.src; $("#lb-img").alt = it.alt || "";
    $("#lb-cap").textContent = (it.cap ? it.cap + " · " : "") + (lbIdx + 1) + " of " + lbSet.length;
  }
  function lbOpen(set, i) {
    lbSet = set; lbShow(i);
    if (lb.showModal) { try { lb.showModal(); } catch (e) { lb.setAttribute("open", ""); } } else lb.setAttribute("open", "");
  }
  function lbClose() { if (lb.close) lb.close(); else lb.removeAttribute("open"); }
  $("#lb-close").addEventListener("click", lbClose);
  $("#lb-prev").addEventListener("click", function () { lbShow(lbIdx - 1); });
  $("#lb-next").addEventListener("click", function () { lbShow(lbIdx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.open) return;
    if (e.key === "ArrowLeft") lbShow(lbIdx - 1);
    if (e.key === "ArrowRight") lbShow(lbIdx + 1);
  });

  function gallery(el, items, capFn, limit) {
    var set = items.map(function (p, i) { return { src: p.src, alt: capFn(p, i), cap: capFn(p, i) }; });
    var expanded = !limit || items.length <= limit;
    function draw() {
      var shown = expanded ? items : items.slice(0, limit);
      el.innerHTML = shown.map(function (p, i) {
        return '<button type="button" class="g-item" data-i="' + i + '" aria-label="View ' + esc(set[i].cap) + ' full size"><img loading="lazy" decoding="async" src="' +
          esc(p.thumb) + '" alt="' + esc(set[i].alt) + '" width="' + p.w + '" height="' + p.h + '"></button>';
      }).join("") + (expanded ? "" : '<button type="button" class="btn btn-ghost-dark g-more">Show all ' + items.length + " photos</button>");
    }
    el.onclick = function (e) {
      if (e.target.closest(".g-more")) { expanded = true; draw(); var nxt = el.querySelector('.g-item[data-i="' + limit + '"]'); if (nxt) nxt.focus(); return; }
      var b2 = e.target.closest(".g-item"); if (b2) lbOpen(set, +b2.getAttribute("data-i"));
    };
    draw();
  }

  var fleetCat = "all";
  function renderFleet() {
    var cats = Object.keys(D.fleetCats);
    $("#fleet-tabs").innerHTML = [["all", "All", D.fleetPhotos.length]].concat(cats.map(function (c) {
      return [c, D.fleetCats[c], D.fleetPhotos.filter(function (p) { return p.cat === c; }).length];
    })).map(function (t) {
      return '<button class="tab" role="tab" type="button" data-cat="' + t[0] + '" aria-selected="' + (t[0] === fleetCat) + '">' + esc(t[1]) + '<span class="n">' + t[2] + "</span></button>";
    }).join("");
    var items = D.fleetPhotos.filter(function (p) { return fleetCat === "all" || p.cat === fleetCat; });
    gallery($("#fleet-gallery"), items, function (p) { return "RRPL " + D.fleetCats[p.cat].replace(/s$/, "").toLowerCase(); }, window.innerWidth < 640 ? 8 : 15);
  }
  $("#fleet-tabs").addEventListener("click", function (e) { var b2 = e.target.closest(".tab"); if (!b2) return; fleetCat = b2.getAttribute("data-cat"); renderFleet(); });
  renderFleet();
  gallery($("#team-gallery"), D.teamPhotos, function () { return "RRPL team"; }, window.innerWidth < 640 ? 6 : 10);

  /* Leadership */
  $("#people").innerHTML = D.messages.map(function (m) {
    return '<figure class="leader"><img src="assets/leaders/' + esc(m.photo) + '.jpg" alt="' + esc(m.name) + '" loading="lazy" width="300" height="300">' +
      "<blockquote>“" + esc(m.text) + '”</blockquote><figcaption><strong>' + esc(m.name) + "</strong><span>" + esc(m.role) + "</span></figcaption></figure>";
  }).join("");

  /* Awards and letters */
  var awardSet = D.awards.map(function (a2) { return { src: "assets/awards/" + a2.img + ".jpg", alt: a2.title || "RRPL award", cap: [a2.title, a2.text].filter(Boolean).join(": ") || "RRPL recognition" }; });
  $("#awards-grid").innerHTML = D.awards.map(function (a2, i) {
    return '<button type="button" class="award" data-i="' + i + '"><span class="award-img"><img loading="lazy" src="assets/awards/' + esc(a2.img) + '.jpg" alt="' + esc(awardSet[i].cap) + '"></span>' +
      (a2.title ? "<strong>" + esc(a2.title) + "</strong>" : "") + (a2.text ? "<span>" + esc(a2.text) + "</span>" : "") + "</button>";
  }).join("");
  $("#awards-grid").onclick = function (e) { var b2 = e.target.closest(".award"); if (b2) lbOpen(awardSet, +b2.getAttribute("data-i")); };
  var letterSet = D.letters.map(function (l) { return { src: "assets/awards/" + l.img + ".jpg", alt: l.from, cap: l.from }; });
  $("#letters").innerHTML = D.letters.map(function (l, i) {
    return '<figure class="letter"><button type="button" class="letter-img" data-i="' + i + '" aria-label="Read the letter from ' + esc(l.from) + '"><img loading="lazy" src="assets/awards/' + esc(l.img) +
      '.jpg" alt=""></button><figcaption><strong>' + esc(l.from) + "</strong><p>" + esc(l.text) + "</p></figcaption></figure>";
  }).join("");
  $("#letters").onclick = function (e) { var b2 = e.target.closest(".letter-img"); if (b2) lbOpen(letterSet, +b2.getAttribute("data-i")); };

  /* Offices and hours */
  var telOf = function (p) { var d = p.replace(/\D/g, ""); return "+91" + (d.length === 10 && /^[6-9]/.test(d) ? d : d.replace(/^0/, "")); };
  $("#offices").innerHTML = D.company.offices.map(function (o) {
    return '<div class="office"><h3>' + esc(o.name) + "</h3><p>" + esc(o.address) + '</p><p class="office-links">' +
      o.phones.map(function (p) { return '<a href="tel:' + telOf(p) + '">' + esc(p) + "</a>"; }).join(" · ") +
      ' · <a href="mailto:' + esc(o.email) + '">' + esc(o.email) + "</a></p></div>";
  }).join("");
  $("#hours").innerHTML = D.company.hours.map(function (h) { return "<div><dt>" + esc(h[0]) + "</dt><dd>" + esc(h[1]) + "</dd></div>"; }).join("");

  var soc = [];
  if (D.social.facebook) soc.push('<a href="' + esc(D.social.facebook) + '" target="_blank" rel="noopener">Facebook</a>');
  if (D.social.linkedin) soc.push('<a href="' + esc(D.social.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a>');
  $("#social").innerHTML = soc.join(" ");

  /* News: from the platform feed when configured, otherwise from data.js */
  var KIND_LABEL = { news: "News", route: "Route alert", monsoon: "Monsoon alert", holiday: "Holiday", service: "Service change" };
  function renderNews(items) {
    $("#news-list").innerHTML = items.length ? items.map(function (n) {
      var tag = n.kind ? '<span class="news-tag sev-' + esc(n.severity || "info") + '">' + esc(KIND_LABEL[n.kind] || n.kind) + "</span>" : "";
      var title = n.url ? '<a href="' + esc(n.url) + '" target="_blank" rel="noopener">' + esc(n.title) + "</a>" : esc(n.title);
      return '<li class="news-item"><p class="news-date">' + tag + esc(n.date || "") + "</p><h3>" + title + "</h3>" + (n.text ? "<p>" + esc(n.text) + "</p>" : "") + "</li>";
    }).join("") : '<li class="news-item"><p>No updates right now.</p></li>';
  }
  renderNews(D.news);
  if (C.updatesEndpoint) {
    fetch(C.updatesEndpoint, { headers: { Accept: "application/json" } }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.updates || !j.updates.length) return;
      renderNews(j.updates.map(function (u) {
        return { kind: u.kind, severity: u.severity, title: u.title, text: u.summary,
          date: new Date(u.startsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }) };
      }));
    }).catch(function () { /* keep the built-in news */ });
  }

  /* ---------- Network ---------- */
  var KIND = { office: "Branch", "area-office": "Area office", corporate: "Corporate office", doorstep: "Door-step delivery", representative: "Representative" };
  var regionLabel = {}; D.regions.forEach(function (r) { regionLabel[r.id] = r.label; });
  var activeRegion = "all";
  var norm = function (s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); };

  function telHref(p) {
    var d = p.replace(/\D/g, "");
    if (d.length === 10 && /^[6-9]/.test(d)) return "+91" + d;
    return "+91" + d.replace(/^0/, "");
  }

  function matches(b, q) {
    if (!q) return true;
    var hay = norm(b.town + " " + b.address + " " + regionLabel[b.region]);
    if (hay.indexOf(q) !== -1) return true;
    var alias = D.aliases[q];
    return !!alias && b.town === alias;
  }

  function renderTabs() {
    var all = (I[document.documentElement.lang] || I.en).all_regions || "All";
    var tabs = [{ id: "all", label: all, n: D.branches.length }].concat(D.regions.map(function (r) {
      return { id: r.id, label: r.label, n: D.branches.filter(function (b) { return b.region === r.id; }).length };
    }));
    $("#region-tabs").innerHTML = tabs.map(function (t) {
      return '<button class="tab" role="tab" type="button" data-region="' + t.id + '" aria-selected="' + (t.id === activeRegion) + '">' +
        esc(t.label) + '<span class="n">' + t.n + "</span></button>";
    }).join("");
  }
  $("#region-tabs").addEventListener("click", function (e) {
    var b = e.target.closest(".tab"); if (!b) return;
    activeRegion = b.getAttribute("data-region"); renderTabs(); renderBranches();
  });

  function renderBranches() {
    var q = norm($("#net-search").value);
    var list = D.branches.filter(function (b) { return (activeRegion === "all" || b.region === activeRegion) && matches(b, q); });
    $("#net-count").textContent = list.length + (list.length === 1 ? " location" : " locations") + (q ? " match “" + $("#net-search").value.trim() + "”" : "");
    if (!list.length) {
      $("#branches").innerHTML = '<div class="empty">No office in that town yet. We may still deliver there from a nearby branch: call <a href="tel:+912262284444">022-6228 4444</a> or <a href="#quote">send a request</a>.</div>';
      return;
    }
    $("#branches").innerHTML = list.map(function (b) {
      var phones = b.phones.length ? '<div class="phones">' + b.phones.map(function (p) { return '<a href="tel:' + telHref(p) + '">' + esc(p) + "</a>"; }).join("") + "</div>" :
        '<p class="addr">No office here. Book on 022-6228 4444.</p>';
      return '<article class="branch"><div class="meta"><span class="region-tag">' + esc(regionLabel[b.region]) + '</span><span class="kind kind-' + b.kind + '">' +
        KIND[b.kind] + "</span></div><h3>" + esc(b.town) + "</h3>" + (b.address ? '<p class="addr">' + esc(b.address) + "</p>" : "") + phones +
        (b.email ? '<p class="b-mail"><a href="mailto:' + esc(b.email) + '">' + esc(b.email) + "</a></p>" : "") + "</article>";
    }).join("");
  }
  $("#net-search").addEventListener("input", renderBranches);

  $("#towns").innerHTML = D.branches.filter(function (b) { return b.kind !== "corporate"; })
    .map(function (b) { return '<option value="' + esc(b.town.replace(/ \(.*\)$/, "")) + '">'; })
    .filter(function (v, i, a) { return a.indexOf(v) === i; }).join("");

  /* ---------- Track LR ---------- */
  var FIELDS = [["lrNumber", "LR number"], ["lrDate", "LR date"], ["lrType", "LR type"], ["partyInvoiceNumber", "Party invoice no."],
    ["fromStation", "From"], ["toStation", "To"], ["packages", "Packages"], ["weightKg", "Total weight (kg)"], ["branchAddress", "Delivery branch"]];
  function statusClass(s) {
    s = String(s || "").toLowerCase();
    if (/deliver/.test(s)) return "ok";
    if (/hold|short|damage|return|undeliver/.test(s)) return "bad";
    return "warn";
  }
  $("#track-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var branch = $("#t-branch").value.trim().toUpperCase(), lr = $("#t-lr").value.trim();
    var out = $("#track-result");
    $("#t-lr").setAttribute("aria-invalid", lr ? "false" : "true");
    if (!lr) { out.innerHTML = '<div class="result-box"><p class="form-status bad">Enter the LR number from your consignment note.</p></div>'; $("#t-lr").focus(); return; }

    if (!C.trackingEndpoint) {
      window.open(C.legacyTrackingUrl, "_blank", "noopener");
      out.innerHTML = '<div class="result-box"><p>RRPL tracking has opened in a new tab. Enter branch code <strong>' + esc(branch || "(from your LR)") +
        "</strong> and LR <strong>" + esc(lr) + '</strong> there. If it did not open, <a href="' + esc(C.legacyTrackingUrl) + '" target="_blank" rel="noopener">open tracking</a>.</p></div>';
      return;
    }
    out.innerHTML = '<div class="result-box"><p class="note">Looking up LR ' + esc(lr) + "…</p></div>";
    var ctrl = new AbortController(); var timer = setTimeout(function () { ctrl.abort(); }, 12000);
    fetch(C.trackingEndpoint + "?branch=" + encodeURIComponent(branch) + "&lr=" + encodeURIComponent(lr), { signal: ctrl.signal, headers: { Accept: "application/json" } })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        clearTimeout(timer);
        if (!res.ok || !res.j || res.j.error) {
          out.innerHTML = '<div class="result-box"><p class="form-status bad">' + esc((res.j && res.j.error) || "We could not find that LR.") +
            '</p><p class="note">Check the branch code and LR number, or call 022-6228 4444.</p></div>'; return;
        }
        var d = res.j;
        out.innerHTML = '<div class="result-box"><div class="result-head"><span class="pill ' + statusClass(d.status) + '">' + esc(d.status || "In transit") +
          '</span>' + (d.updatedAt ? '<span class="note">Updated ' + esc(d.updatedAt) + "</span>" : "") + '</div><dl class="result-grid">' +
          FIELDS.filter(function (f) { return d[f[0]] != null && d[f[0]] !== ""; }).map(function (f) { return "<div><dt>" + f[1] + "</dt><dd>" + esc(d[f[0]]) + "</dd></div>"; }).join("") +
          "</dl></div>";
      })
      .catch(function () {
        clearTimeout(timer);
        out.innerHTML = '<div class="result-box"><p class="form-status bad">Tracking is not responding right now.</p><p class="note">Try again in a minute or call 022-6228 4444.</p></div>';
      });
  });

  /* ---------- Quote / pickup ---------- */
  var qf = $("#quote-form"), qs = $("#q-status");
  function syncType() {
    var pickup = qf.type.value === "Pickup";
    document.querySelectorAll(".pickup-only").forEach(function (el) { el.hidden = !pickup; });
  }
  qf.addEventListener("change", function (e) { if (e.target.name === "type") syncType(); });
  syncType();
  var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  $("#q-date").min = today.toISOString().slice(0, 10);

  function collect() {
    var f = new FormData(qf), o = {};
    f.forEach(function (v, k) { o[k] = typeof v === "string" ? v.trim() : v; });
    o.hazardous = $("#q-haz").checked;
    return o;
  }
  function validate(o) {
    var bad = [];
    [["q-name", o.name], ["q-phone", /^[0-9+ -]{10,15}$/.test(o.phone || "") ? o.phone : ""], ["q-from", o.from], ["q-to", o.to]].forEach(function (p) {
      var el = document.getElementById(p[0]); var ok = !!p[1]; el.setAttribute("aria-invalid", ok ? "false" : "true"); if (!ok) bad.push(el);
    });
    if (o.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(o.email)) { $("#q-email").setAttribute("aria-invalid", "true"); bad.push($("#q-email")); }
    else $("#q-email").setAttribute("aria-invalid", "false");
    return bad;
  }
  function message(o) {
    var lines = [o.type + " request from rajeshrpl.in", "",
      "Name: " + o.name + (o.company ? " (" + o.company + ")" : ""), "Mobile: " + o.phone];
    if (o.email) lines.push("Email: " + o.email);
    lines.push("Route: " + o.from + " to " + o.to);
    if (o.goods) lines.push("Goods: " + o.goods);
    if (o.weight) lines.push("Weight: " + o.weight + " kg");
    if (o.packages) lines.push("Packages: " + o.packages);
    if (o.type === "Pickup" && o.date) lines.push("Pickup date: " + o.date);
    lines.push("Hazardous: " + (o.hazardous ? "Yes" : "No"));
    if (o.notes) lines.push("", o.notes);
    return lines.join("\n");
  }
  qf.addEventListener("submit", function (e) {
    e.preventDefault();
    var o = collect(), bad = validate(o);
    qs.className = "form-status";
    if (bad.length) { qs.textContent = "Please fill in your name, a 10-digit mobile number and both towns."; qs.classList.add("bad"); bad[0].focus(); return; }

    if (C.enquiryEndpoint) {
      qs.textContent = "Sending…";
      fetch(C.enquiryEndpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(o) })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json().catch(function () { return {}; }); })
        .then(function (j) {
          qs.textContent = "Request received" + (j.reference ? " (ref " + j.reference + ")" : "") + ". Our team will call you on " + o.phone + ".";
          qs.classList.add("ok"); qf.reset(); syncType();
        })
        .catch(function () { qs.textContent = "That did not go through. Please try again or call 022-6228 4444."; qs.classList.add("bad"); });
      return;
    }
    var href = "mailto:" + C.enquiryEmail + "?subject=" + encodeURIComponent(o.type + " request: " + o.from + " to " + o.to) + "&body=" + encodeURIComponent(message(o));
    window.location.href = href;
    qs.textContent = "Your email app should open with the request filled in. If it does not, email " + C.enquiryEmail + " or call 022-6228 4444.";
  });

  if (C.whatsappNumber) {
    var wa = $("#q-wa"); wa.hidden = false;
    wa.addEventListener("click", function () {
      var o = collect(), bad = validate(o);
      if (bad.length) { qs.className = "form-status bad"; qs.textContent = "Please fill in your name, mobile number and both towns first."; bad[0].focus(); return; }
      window.open("https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent(message(o)), "_blank", "noopener");
    });
  }

  /* ---------- Misc ---------- */
  $("#year").textContent = new Date().getFullYear();
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var t = document.querySelector(".corridor .truck"); if (t) t.remove();
  }

  var saved = store.get("rrpl-lang");
  var start = saved && I[saved] ? saved : "en";
  lang.value = start;
  applyLang(start);
  renderBranches();
})();
