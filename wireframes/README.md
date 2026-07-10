# PsychoCampus — Interactive Prototype

Hi-fidelity, **clickable** prototype of the PsychoCampus platform (client: შპს ფინა2 / ი/მ ანნა ზედგინიძე), built as **3 self-contained HTML files** — one per interface. No build step, no internet, no dependencies: open any file directly in a browser.

```
index.html            # front page — pick an interface (start here)
wireframes/
├── public.html       # 1️⃣ public website (visitors & registered users)
├── consultant.html   # 2️⃣ consultant workspace
└── admin.html        # 3️⃣ admin panel
```

**Start at the root `index.html`** — it's the single front page linking to all three profiles.

Each file is a small single-page app: real navigation, tabs, modals, a working booking calendar, filters, and form feedback — styled with a calm, professional palette ("მშვიდი, პროფესიული სტილი") matching the proposal.

## 1️⃣ public.html — Public website
Client-side routed views, all in one file:
- **Home** — hero, service hub, featured videos, live-chat widget
- **About / Services** — company info + the two directions (video, consultation) and extra services
- **Video library** — grid with free preview vs 🔒 subscription-locked full video; single-video paywall page
- **Video subscription checkout** — 3-step monthly-subscription flow (plan & account → bank/card payment → confirmation) that activates access to the whole library; access auto-closes when payment stops
- **Consultation booking** — 4-step flow (calendar → contact → payment → confirmation) with a working month calendar, slot capacity, live summary
- **Auth** — login / registration modal (personal number, name, email = unique ID, phone); logging in reveals the **user profile** (bookings with reschedule/cancel, subscription, payments & invoices, personal data)
- **Contact / Legal** — form + map; terms, privacy, cookie & refund tabs
- **GEO / ENG** language toggle, responsive mobile menu, chat panel

## 2️⃣ consultant.html — Consultant workspace
Login → dashboard with sidebar navigation:
- **My bookings** — stat tiles + assigned-only booking list, booking-detail modal (incognito model: sees only own bookings)
- **My schedule** — working hours + weekly grid
- **Availability** — active/inactive toggle (synced to the top bar), force-majeure explanation, time-off request
- **Profile**

## 3️⃣ admin.html — Admin panel
Login → full management panel:
- **Overview** — KPIs, revenue bar chart, source donut, recent orders, live status
- **Orders & payments** — filters, table, order-detail modal, Excel export, refund action
- **Bookings & consultants** — consultant table with working **force-majeure toggle** (reassign logic), time management (global / per-operator / manual), buffer, unified load calendar
- **Content & SEO** — tabs for videos / services / pages / SEO; content editor with bilingual toggle + SEO panel (auto-generate, OG banner); sitemap, JSON-LD, Meta Pixel, GA4 switches
- **Users** — searchable table + user detail modal (personal data, linked payments)
- **Chat / operators** — queue, operator status
- **Settings** — general, languages, payment/pricing, cancellation & refund policy

## Try it
- **public.html** → click through the nav; open the booking flow and pick a day + time slot; click "რეგისტრაცია" then log in to reveal the profile; toggle GEO/ENG.
- **consultant.html / admin.html** → click "შესვლა" on the login screen; use the sidebar; toggle a consultant's force-majeure; edit the permission matrix.

> Prototype content is representative placeholder data. Layout, flows and logic reflect the technical task and commercial proposal; details are expected to be refined.
