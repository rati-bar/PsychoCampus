/* ============================================================
   PsychoCampus — Wireframe shell
   Injects the left navigation rail + topbar + device toggle.
   Each page sets window.WF = { id, title, section } before this loads,
   and provides its content inside <main id="wf-content">…</main>.
   ============================================================ */
(function () {
  var NAV = [
    { group: "საჯარო საიტი · Public", items: [
      { id: "home",         label: "მთავარი / Home",            href: "home.html" },
      { id: "about",        label: "ჩვენს შესახებ / About",     href: "about.html" },
      { id: "services",     label: "სერვისები / Services",       href: "services.html" },
      { id: "video-catalog",label: "ვიდეო კატალოგი / Videos",    href: "video-catalog.html" },
      { id: "video-single", label: "ვიდეო + Paywall",            href: "video-single.html" },
      { id: "booking",      label: "ჯავშანი / Booking",          href: "consultation-booking.html" },
      { id: "booking-confirm", label: "ჯავშნის დადასტურება",     href: "booking-confirm.html" },
      { id: "auth",         label: "რეგისტრაცია / Auth",         href: "auth.html" },
      { id: "contact",      label: "კონტაქტი / Contact",         href: "contact.html" },
      { id: "legal",        label: "წესები & პოლიტიკა / Legal",   href: "legal.html" },
    ]},
    { group: "მომხმარებელი · User", items: [
      { id: "user-profile", label: "პროფილი & შეკვეთები",        href: "user-profile.html" },
    ]},
    { group: "კონსულტანტი · Operator", items: [
      { id: "consultant",   label: "კონსულტანტის Dashboard",     href: "consultant-dashboard.html" },
    ]},
    { group: "ადმინ პანელი · Admin", items: [
      { id: "admin-dash",   label: "მიმოხილვა / Overview",        href: "admin-dashboard.html" },
      { id: "admin-orders", label: "შეკვეთები & გადახდები",       href: "admin-orders.html" },
      { id: "admin-bookings",label:"ჯავშნები & კონსულტანტები",    href: "admin-bookings.html" },
      { id: "admin-content",label: "კონტენტი & SEO",             href: "admin-content.html" },
      { id: "admin-users",  label: "მომხმარებლები",              href: "admin-users.html" },
      { id: "admin-roles",  label: "როლები & ნებართვები",         href: "admin-roles.html" },
    ]},
  ];

  var cfg = window.WF || {};
  // path prefix so the rail works from /pages, /admin etc. Everything lives flat in /pages.
  var railHTML = '<div class="wf-rail__brand"><b>PsychoCampus</b><span>Wireframes · v0.1 · low-fi</span>' +
    '<a href="../index.html" style="display:inline-block;margin-top:8px;padding:0;color:#8a919c;font-size:12px">← ყველა ეკრანი / All screens</a></div>';
  NAV.forEach(function (g) {
    railHTML += '<div class="wf-rail__group"><h4>' + g.group + '</h4>';
    g.items.forEach(function (it) {
      var active = it.id === cfg.id ? ' class="is-active"' : "";
      railHTML += '<a' + active + ' href="' + it.href + '">' + it.label + "</a>";
    });
    railHTML += "</div>";
  });

  var topHTML =
    '<div class="crumb"><b>' + (cfg.section || "") + "</b> ›</div>" +
    '<div class="screen-title">' + (cfg.title || "") + "</div>" +
    '<div class="spacer"></div>' +
    '<div class="wf-toggle" id="wf-device">' +
      '<button data-w="desktop" class="is-active">🖥 Desktop</button>' +
      '<button data-w="mobile">📱 Mobile</button>' +
    "</div>";

  var content = document.getElementById("wf-content");
  var contentHTML = content ? content.innerHTML : "";

  var legendHTML =
    '<div class="wf-legend">' +
    "<span><b>Legend:</b></span>" +
    '<span>▨ = სურათი/მედია</span>' +
    "<span>▬ = ტექსტის ბლოკი</span>" +
    '<span><span class="wf-tag wf-tag--accent" style="padding:1px 7px">Primary</span> = მთავარი ქმედება</span>' +
    '<span><span class="wf-note" style="display:inline;padding:1px 8px 1px 22px;margin:0">note</span> = ლოგიკის კომენტარი</span>' +
    "</div>";

  document.body.innerHTML =
    '<div class="wf-app">' +
      '<aside class="wf-rail">' + railHTML + "</aside>" +
      '<div class="wf-main">' +
        '<div class="wf-topbar">' + topHTML + "</div>" +
        '<div class="wf-canvas">' + legendHTML +
          '<div class="wf-frame is-desktop" id="wf-frame">' + contentHTML + "</div>" +
        "</div>" +
      "</div>" +
    "</div>";

  var frame = document.getElementById("wf-frame");
  var dev = document.getElementById("wf-device");
  dev.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    [].forEach.call(dev.querySelectorAll("button"), function (x) { x.classList.remove("is-active"); });
    b.classList.add("is-active");
    frame.classList.remove("is-mobile", "is-desktop");
    frame.classList.add(b.dataset.w === "mobile" ? "is-mobile" : "is-desktop");
  });
})();
