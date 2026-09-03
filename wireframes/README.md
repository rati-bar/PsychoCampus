# PsychoCampus — Interactive Prototype

> **Building the real app?** See **[`../SPEC.md`](../SPEC.md)** — a design-agnostic functional specification of all the logic, data model, flows and business rules behind these wireframes.

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
- **Home** — hero, the two directions, packages teaser, featured courses, live-chat widget
- **ფსიქო განათლება (Psycho Education)** — catalog of **individually priced** Udemy-style video courses (free preview + per-course price)
- **Course detail** — Udemy-style: player, tabs (overview / syllabus / quizzes), multi-section curriculum with lectures and mid-course quizzes, purchase card, certificate-on-completion note
- **Packages** — 3 monthly tiers: packages 1 & 2 give discounts on courses + consultations, package 3 makes both free
- **Checkout** — shared 3-step flow (account → bank/card payment → confirmation) for both a single course purchase and a package subscription
- **ფსიქო ნავიგაცია (Psycho Navigation) booking** — 4-step flow (calendar → contact → payment → confirmation); month/year-selectable calendar, slot capacity; minimal contact fields (phone + region required, name/email optional, no personal-number/surname); confirmation delivered by **SMS with meeting link** + on-screen link and PDF download
- **Auth** — login / registration modal incl. **Google & Facebook** social login (plus personal number, name, email = unique ID, phone); logging in reveals the **user cabinet**
- **User cabinet** — tabs: bookings (reschedule/cancel), my courses (progress), 🎓 certificates, 🔔 messages (consultant meeting link etc.), package & payments/invoices, personal data
- **Contact / Legal** — form + map; terms, privacy, cookie & refund tabs
- **GEO / ENG** language toggle, responsive mobile menu, chat panel

## 2️⃣ consultant.html — Consultant workspace
Login → dashboard with sidebar navigation:
- **My bookings** — stat tiles + assigned-only booking list, **✉ message-user button** (send meeting link → appears in the user's cabinet), booking-detail modal (incognito model: sees only own bookings)
- **My schedule** — self-composed availability (mark working hours a month ahead) that requires **admin approval**; shows existing bookings with a coverage indicator (already covered by another consultant vs. still needs coverage)
- **Availability** — active/inactive toggle (synced to the top bar), force-majeure explanation, time-off request
- **Profile**

## 3️⃣ admin.html — Admin panel
Login → full management panel:
- **Overview** — KPIs, revenue bar chart, source donut, recent orders, live status
- **Orders & payments** — filters, table, order-detail modal, Excel export, refund action
- **Bookings & consultants** — consultant table with working **force-majeure toggle** (reassign logic), **consultant schedule-approval** queue (approve/reject self-submitted availability), unified load calendar
- **Content & SEO** — tabs for courses / services / pages / SEO; course editor with **per-course price**, Udemy-style curriculum (sections/lectures/quizzes) and certificate toggle, bilingual + SEO panel; sitemap, JSON-LD, Meta Pixel, GA4 switches
- **Packages** — manage the 3 tiers (price, course/consultation discount %, or full-free), active-subscriber counts
- **Users** — searchable table + user detail modal (personal data, linked payments)
- **Settings** — general, languages, payment/pricing, cancellation & refund policy

## Try it
- **public.html** → click through the nav; open the booking flow and pick a day + time slot; click "რეგისტრაცია" then log in to reveal the profile; toggle GEO/ENG.
- **consultant.html / admin.html** → click "შესვლა" on the login screen; use the sidebar; toggle a consultant's force-majeure; edit the permission matrix.

> Prototype content is representative placeholder data. Layout, flows and logic reflect the technical task and commercial proposal; details are expected to be refined.
