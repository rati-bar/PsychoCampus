# PsychoCampus — Functional Specification (Logic Behind the Wireframes)

> **Purpose of this document.** It captures **all the behavior, data, flows and business rules** behind the interactive wireframes in `wireframes/` so that a fresh build can implement the real application **with a completely new/redesigned frontend**. The wireframes' visual design (layout, colours, components) is **illustrative and replaceable** — this spec is the source of truth for *what the app does*, not *how it looks*.
>
> Client: **შპს ფინა2 / ი/მ ანნა ზედგინიძე**. Working prototype: `wireframes/public.html`, `wireframes/consultant.html`, `wireframes/admin.html` (open `index.html` first).

---

## 1. Product overview

PsychoCampus is a bilingual (Georgian / English) online psychological‑support platform with **two customer‑facing directions**:

1. **ფსიქო განათლება (Psycho Education)** — a marketplace of **individually‑priced, Udemy‑style video courses** (multi‑section, mid‑course quizzes, completion certificate).
2. **ფსიქო ნავიგაცია (Psycho Navigation)** — a paid **online video interview** with a professional who **helps the beneficiary find the right therapist / direction**. Bookings use a single "incognito" calendar (the user never picks a specific consultant).

On top of these there are **three monthly subscription packages** that grant discounts or fully‑free access, a **user cabinet**, a **consultant panel**, and an **admin panel**.

> **Terminology note.** Earlier iterations called direction 2 "ფსიქო კონსულტაცია"; the current, canonical name is **ფსიქო ნავიგაცია**. Treat any remaining "consultation" wording as "navigation".

---

## 2. Tech stack & non‑functional requirements

Backend stack is **fixed** (per the technical task); the **frontend is being redesigned** and may use any framework.

- **Backend:** Laravel 12 (PHP). Full CRUD over all site content from the admin panel.
- **Frontend (to be redesigned):** the technical task names HTML + Tailwind CSS + JS (Alpine, jQuery); the new build may choose differently. Whatever is chosen must implement the flows below.
- **Responsive:** all screens must work across phone / tablet / desktop.
- **Bilingual:** Georgian (default) + English. Every user‑facing string, content entity and SEO field is translatable. A language switch is available in the public header.
- **SEO:** per‑entity editable SEO `title` / `description` with **auto‑generation fallback** when left blank; per‑menu‑item Open‑Graph share banner (falls back to the entity's main photo); `sitemap.xml` auto‑generation; Open Graph + social meta tags; Google **structured data (JSON‑LD)**.
- **Analytics/marketing:** Google Analytics 4, Meta Pixel (toggles + IDs configured in admin).
- **Legal:** Terms & Conditions, Privacy Policy, Cookie Policy, Refund Policy pages + a cookie‑consent banner (required because the platform handles personal data and payments).
- **Integrations:** Georgian **bank payment gateway** (card + bank app; recurring for subscriptions, one‑time for courses/interviews), **SMS gateway** (booking confirmation + meeting link), **Google & Facebook OAuth**, video hosting/streaming with access control (paywall), **online chat** (internal or third‑party, multi‑operator), Google Maps embed (contact page).

---

## 3. Actors / roles

| Role | Where | Notes |
|---|---|---|
| **Visitor** | Public site | Unauthenticated. Can browse, watch free previews, and start a booking/purchase (registers during checkout). |
| **Beneficiary (registered user)** | Public site + **User cabinet** | The customer. Buys courses, books interviews, subscribes to packages, receives messages. |
| **Consultant (operator)** | **Consultant panel** (separate app/area) | Conducts the online interviews. Sees only bookings assigned to them ("incognito"), composes their own availability, messages users. |
| **Admin (site manager)** | **Admin panel** | Manages content, courses, packages, orders/payments, users, consultants and their schedules, settings. |

> **Roles & permissions (multi‑admin) is intentionally out of scope for this stage** (removed from the prototype). Design the admin as a single privileged role, but keep the data model open to reintroducing granular role/permission control later. Consultants always have their **own separate panel** — they are never "admins".

---

## 4. Domain model (entities & key fields)

Illustrative — adapt names to Laravel conventions. Bold = primary identifier / notable rule.

- **User** — `first_name`, `last_name`, **`email` (unique, primary identifier)**, `personal_number`, `phone`, `password`, `oauth_provider` (google/facebook/null), `region`, `locale`, `created_at`. Access to paid content is gated on payment state.
- **Region** — enum/lookup: თბილისი, აჭარა, იმერეთი, კახეთი, სამეგრელო, ქვემო ქართლი, … (extensible). Used for a **region‑based discount** rule (historically keyed off personal number; now captured via the region field).
- **Course** — `title`, `category`, `description`, `price` (₾, one‑time), `main_photo`, `cover_video`, `status` (draft/published), `certificate_enabled` (bool), SEO fields, translations. Has many **Sections**.
- **Section** — belongs to Course; `title`, `order`. Has many **Lectures** and **Quizzes** (quizzes are interspersed, typically at section end + a final quiz).
- **Lecture** — belongs to Section; `title`, `video`, `duration`, `is_free_preview` (bool; usually the first lecture).
- **Quiz** — belongs to Section (or Course for the final); `title`, `questions[]`, `is_final` (final quiz gates the certificate).
- **Enrollment (CourseAccess)** — `user_id`, `course_id`, `purchased_at`, `progress_pct`, `completed_at`. Permanent access once purchased.
- **Certificate** — `user_id`, `course_id`, `cert_id` (e.g. CERT‑4821), `issued_at`, `pdf`. Auto‑generated when the final quiz is passed / course completed.
- **Package** — `name` (პაკეტი 1/2/3), `price` (₾/month, recurring), `course_discount_pct`, `consultation_discount_pct`, `courses_free` (bool), `consultations_free` (bool), `status`, media (video + photos), benefits[], description, translations.
  - Package 1: discounts on courses **and** navigation (e.g. −20% / −15%).
  - Package 2: bigger discounts (e.g. −50% / −40%).
  - Package 3: **courses and navigation fully free** (`courses_free = consultations_free = true`).
- **Subscription** — `user_id`, `package_id`, `status` (active/none/cancelled), `next_billing_at`, `started_at`. Recurring monthly, cancellable anytime; access auto‑closes when billing lapses.
- **Booking (Navigation interview)** — `code` (#BK‑…), `slot_datetime`, `duration` (30 min) + `buffer` (15 min), `user_contact` (name?, phone, email?, region), `assigned_consultant_id`, `status` (planned/completed/cancelled), `payment_id`, `meeting_link`.
- **ConsultantSchedule** — `consultant_id`, `month`, `availability` = map of `date → set of hours` (from a **24‑hour** grid), `status` (pending/approved/returned), `submitted_at`, `approved_by`, `approved_at`.
- **Consultant** — `user`/profile, `specialization`, `active` (bool; force‑majeure toggle), working schedule (derived from approved ConsultantSchedule).
- **Module** — a unit of the structured program (`title`, `order`); groups **program Lectures** (physical classes). *(Distinct from an online Course's Sections.)*
- **Lecturer** — `name`, `specialization`, `contact`. Teaches lessons.
- **Auditorium** — `name`, `capacity`, `location`.
- **Lesson (timetable entry)** — `module_id`, `date`, `time`, `lecturer_id`, `auditorium_id`, `status` (planned/draft). Shown in the student timetable; the detail view exposes module, lecturer, time, auditorium.
- **Attendance** — `student_id`, `module_id`, `lecture_id/lesson_id`, `status` (present/absent/late). Aggregated into the student's e‑journal (per‑module %).
- **Library (external)** — *not an internal entity*; a single **external platform URL** in SiteSettings that the cabinet's Library tab links to. No book records stored locally.
- **Message (cabinet notification)** — `user_id`, `type` (meeting_link / certificate / payment / recommendation / system), `title`, `body` (rich, can be long), `from` (consultant / PsychoCampus), `sent_at`, `read` (bool), `reaction` (one emoji, nullable), optional `meeting_link`, optional `related_certificate_id`.
- **Order / Payment** — `user_id`, `type` (course / navigation / package), `amount`, `status` (paid/pending/refunded), `bank_transaction_id`, `invoice/payment_details_pdf`, `created_at`.
- **Service (marketing entry)** — general list of offered services (name, short description, image, type) shown in admin "Content".
- **Page (info page)** — About, legal pages, etc. (title, slug/url, body, status).
- **SiteSettings** — languages, contact info, bank integration status, prices (navigation price, package prices), cancellation window (hours), refund policy (full/partial/admin), SEO toggles, GA4 ID, Meta Pixel ID.

---

## 5. Core business rules & algorithms

### 5.1 Navigation availability ("incognito" model)
- The user is shown **one unified calendar** and **cannot choose a specific consultant**.
- A time **slot is available while**: `bookings_on_slot < number_of_active_consultants_available_at_that_slot`. Example: with 3 active consultants available at 14:00, the 14:00 slot stays open until 3 bookings land on it.
- **Consultant availability is derived from approved ConsultantSchedules** (see 5.5) plus the consultant's active/inactive flag — *not* from a global admin‑generated grid (that older mechanism was removed).
- On booking, the system **auto‑assigns the booking round‑robin to a free consultant** ("рიგრიგობით" / by order). The consultant only ever sees **their own** assigned bookings.

### 5.2 Navigation booking flow (online interview)
Steps: **Time → Contact info → Payment → Confirmation.**
1. **Time:** month + year selectable calendar; pick a day, then a time slot (slots show remaining capacity).
2. **Contact info (minimal):** `name` **optional (clearly marked)**, `phone` **required (used for SMS)**, `email` **optional (clearly marked)**, `region` **required**. **No personal number, no surname.** Consent checkbox for terms/privacy.
3. **Payment:** one‑time; card or bank app. **Package discount/free applies** (pkg 1/2 discount, pkg 3 free). Positive bank transaction confirms the booking automatically.
4. **Confirmation:** delivered by **SMS to the phone, containing the meeting link** — only after the service is purchased (the beneficiary must pay). The confirmation screen **also shows the meeting link on‑screen and offers a PDF download**. The interview is an **online video meeting**.
- **Reschedule / cancel** from the cabinet within a configurable window; refunds per policy (5.6).

### 5.3 Course purchase & certificates (Psycho Education)
- Each course is **sold individually** (one‑time price). **Free preview** = first lecture, visible to everyone.
- Package holders: pkg 1/2 → discount, pkg 3 → free.
- On purchase → **permanent access** to that course. Progress tracked (%).
- Course = **Sections → Lectures + interspersed Quizzes**; a **final quiz** gates completion.
- On completion → **certificate auto‑generated**, appears in the cabinet "Certificates" tab and triggers a cabinet **message** ("certificate issued").

### 5.4 Packages
- Three monthly tiers (see entity rules in §4). **Purchase flow:** select a package → **service‑details page first** (video + photo media, full benefits, description) → **then** checkout (account → payment → confirmation). Recurring monthly; cancel anytime from the profile.
- Active package's discount/free is **auto‑applied** at course and navigation checkout.

### 5.5 Consultant self‑scheduling + admin approval
- Each consultant **composes their own availability a month ahead**: a **month calendar** where, **per day**, they mark the hours they can work, chosen from a **full 24‑hour grid (00:00–23:00)**. Each day cell shows the selected hours (compact ranges, e.g. "09–11, 14–15", collapsing to "00–23" for all‑day).
- The consultant **submits the month for admin approval**; status flows **pending → approved** (admin can also return/reject). Availability only counts toward navigation slots once **approved**.
- While composing, the consultant **sees bookings already placed** and, per booking, an indicator of whether it is **already covered by another consultant's schedule (🟢)** or **still needs coverage (🟠)**.
- **Admin review:** the admin opens the submitted month as a **read‑only month calendar showing each day's selected hours** and approves it. (Admin no longer generates schedules or picks a generation mode — those cards were removed.)

### 5.6 Payments, refunds, region discount
- Bank e‑commerce integration. **Positive transaction → auto‑activate** the user's profile/access (course access, package, or confirmed booking).
- **Recurring** billing for packages/subscriptions; **one‑time** for courses and navigation interviews. Access **auto‑closes when a subscription lapses**.
- **Refunds:** automatic where the bank supports it; otherwise a **manual payout request** is created and the user is notified that the refund is being processed. Admin can resolve edge cases individually.
- **Cancellation window** (e.g. 24h) and **refund policy** (full / partial / admin‑decided) are configurable in settings.
- **Region‑based discount** is supported (historically via personal number; now via the `region` field / navigation region select).

### 5.7 Force majeure (consultant unavailable)
Admin flips a consultant to **inactive** (one action). The system reacts in priority order:
1. **Auto‑reassign** the booking to another free consultant (no user involvement).
2. If no free resource → **send the user a reschedule link**.
3. If neither works → **refund**, or admin resolves the case individually.

### 5.8 Access control summary
- Free: course previews, marketing pages, browsing.
- Gated on **purchase/subscription + positive payment**: full course videos, package benefits, confirmed navigation interview + meeting link (link released only after payment).

### 5.9 Academic / LMS dimension (structured program with physical classes)
Beyond the self‑paced online courses, PsychoCampus runs a **structured program** taught as **modules** made of **lectures** held **in person** (physical auditoriums). This drives three student features and their admin management:
- **Timetable (სასწავლო ცხრილი):** a schedule of **lessons**; each lesson = { module/subject, date, time, **lecturer**, **auditorium** }. Students view it; **clicking a lesson opens its details** (module, lecturer, time, auditorium, attendance state).
- **E‑journal / attendance (ელექტრონული ჟურნალი):** the student sees **attendance recorded for each lecture of each module** (present / absent / late) plus a per‑module attendance %. Attendance is entered by staff (admin, or a lecturer if a lecturer panel is later added) against a specific module‑lecture.
- **Library (ბიბლიოთეკა):** **physical books already live on a separate existing platform**. The library tab **only links out** to that platform (search happens there). **No internal book catalogue / no separate book entry is built.** The external URL is a site setting.
- **Lecturers** and **auditoriums** are managed entities; a lesson references one of each. Modules group lectures.

> **Consultant vs lecturer.** The existing **consultant panel** is for ფსიქო ნავიგაცია interviews only. Teaching/attendance belongs to **lecturers**. For this stage, timetable + attendance are **managed in the admin panel** and there is **no separate lecturer login**; add a lecturer role/panel later if lecturers must mark their own attendance.

---

## 6. Public site — screens & logic

Prototype: `wireframes/public.html` (single‑page client‑routed; the real app can use real routes/SSR).

**Header / nav order (canonical):** მთავარი · ფსიქო განათლება · ფსიქო ნავიგაცია · პაკეტები · კონტაქტი · **ჩვენ შესახებ (last)**. Plus language switch (GEO/ENG) and login / register. Persistent **online chat** widget (multi‑operator).

### 6.1 Home (ordered sections)
1. **Hero = the two directions first** — prominent cards for ფსიქო განათლება and ფსიქო ნავიგაცია (this is the first thing visitors see).
2. **ფსიქო განათლება — courses** strip.
3. **ფსიქო ნავიგაცია description** — image + attention‑grabbing copy ("**კონსულტაცია პროფესიონალთან, რომელიც დაგეხმარება სწორი თერაპევტის მოძიებაში**") + link to booking; clearly flagged as an **online interview**.
4. **Packages** teaser.

### 6.2 ფსიქო განათლება — catalog & course detail
- **Catalog:** searchable/filterable course cards, each with **price**, rating, section/lecture/quiz counts, certificate badge; a package‑upsell banner (discount/free).
- **Course detail (Udemy‑style):** preview player (first lecture free), tabs **Overview / Syllabus / Quizzes**, multi‑section **curriculum** (lectures + quizzes, locked vs free‑preview), purchase card (price, buy, package upsell, **certificate‑on‑completion** note). After purchase → progress + continue.

### 6.3 ფსიქო ნავიგაცია — booking
As specified in §5.1–5.2. Clearly presented as an **online video interview**; header carries badges (📹 online, ⏱ 30 min, 🔗 link via SMS). Availability formula note visible.

### 6.4 Packages & package detail
- **Packages page:** 3 tiers with price + benefits.
- Selecting a package opens a **package‑details page** (video + photo media, benefits, description) **before** checkout (§5.4).

### 6.5 Checkout (course or package)
Shared flow: **Account → Payment → Confirmation**. Account step supports **register‑during‑payment** (register first, then payment link; no bounce back) and **Google/Facebook** buttons. On success → access/subscription activated; course → "go to course"; package → package activated (discount/free live).

### 6.6 Auth
- **Register:** first name, last name, personal number, **email (unique identifier)**, phone, password. **Google & Facebook** social login in the auth modal and in checkout.
- **Register‑during‑payment** as above. Bank positive transaction → profile auto‑activated.

### 6.7 User cabinet ("student profile" — tab order matters)
The beneficiary is also a **student**, so the cabinet carries academic tabs alongside the commerce ones.
1. **Messages (first tab)** — **master–detail**: list on one side, full reading pane on the other; **long bodies supported**; message types include **meeting link (from consultant)**, certificate issued, payment received, course recommendation, system. **Emoji reactions** per message; unread badge/count. The meeting‑link message exposes a "join meeting" action.
2. **სასწავლო ცხრილი (Timetable)** — the student's class schedule (weekly grid of lessons). **Clicking a lesson shows its details: module/subject, lecturer, time, auditorium** (and attendance state). See §5.9.
3. **ელ. ჟურნალი (E‑journal)** — **attendance record per lecture of each module**: modules → lectures with date + attendance status (present / absent / late) and per‑module attendance %.
4. **My courses** — purchased online courses with **progress**; continue / view certificate.
5. **ბიბლიოთეკა (Library)** — **physical books live on an existing external library platform**; this tab is just a link/redirect to that platform (**no internal book catalogue is built** — "ცალკე დამატება არ იქნება საჭირო"). The external URL is configured in admin settings.
6. **Certificates** — earned certificates; view / download PDF.
7. **Bookings** — status (planned/completed/cancelled); **reschedule**, **cancel**; **"გადახდის დეტალები" (payment details) PDF downloadable on ANY status** (planned or completed); meeting‑link shortcut.
8. **Package & payments** — current package (+cancel); payments table with **"გადახდის დეტალები" PDF** (this label replaces the word "invoice/ინვოისი" everywhere).
9. **Personal data** — edit profile.

### 6.8 Contact & Legal
- **Contact:** feedback form, contact info, **map** (Google Maps).
- **Legal:** Terms, Privacy, Cookie, Refund tabs + cookie‑consent banner.

---

## 7. Consultant panel

Prototype: `wireframes/consultant.html`. Login → dashboard with its own nav.

- **My bookings (assigned‑only / incognito):** the consultant sees **only bookings assigned to them** — never the full calendar or other consultants' bookings. Columns: **date + time** (both), user, contact, status, actions. **Booking code is shown only in the detail view**, not as a list column.
- **Message user:** per booking, a **"✉ მიწერა"** action opens a compose modal with an **auto‑generated meeting link** + message text; sending delivers it to the **user's cabinet messages** (§6.7).
- **My schedule (self‑composed, 24h, needs approval):** month calendar; pick a day → mark available hours from the **24‑hour grid**; per‑day selected hours shown on the month; **submit for admin approval** (pending → approved). Existing bookings show the **coverage indicator** (🟢 covered by another consultant / 🟠 needs coverage). See §5.5.
- **Availability / status:** active ⇄ inactive toggle; force‑majeure explanation; time‑off request.
- **Profile.**

---

## 8. Admin panel

Prototype: `wireframes/admin.html`. Login → panel. **Single admin role for now.**

- **Overview:** KPIs (monthly revenue, active packages/subscriptions, weekly bookings, new users), revenue chart, source split, recent orders, live status (active consultants, force‑majeure today, refund requests, **schedules pending approval**).
- **Orders & payments:** filterable table (type/status/period/search); **order detail modal** with **payment‑details PDF** and **refund** action; **Excel export**.
- **Bookings & consultants:**
  - **Consultants table** with **force‑majeure toggle** (reassign logic per §5.7).
  - **Consultant schedule‑approval queue** → **review modal = read‑only month calendar showing each day's selected hours** → **approve** (the only action in that modal; "return" was removed at the client's request).
  - **Unified load calendar** (bookings per day).
  - *(Removed: "დროის მართვა" time‑management and "გენერაციის რეჟიმი" generation‑mode cards — consultants self‑schedule now.)*
- **Content & SEO:** tabs for **Courses** (title, category, **price**, **Udemy curriculum**: sections/lectures/quizzes, **certificate toggle**, media, bilingual + per‑entity SEO), **Services**, **Info pages**, and **SEO** (sitemap auto‑gen, Open Graph, JSON‑LD, Meta Pixel, GA4, auto‑generate‑when‑blank, GA4/Pixel IDs). Full CRUD.
- **Packages:** manage the 3 tiers (price, course/navigation discount % **or** full‑free flags), active‑subscriber counts, media/benefits.
- **სასწავლო პროცესი (Academic):** tabs for **Timetable** (lessons — module, date/time, **lecturer**, **auditorium**, CRUD), **Journal / attendance** (pick module + lecture, mark each student present/absent/late → feeds the student e‑journal), **Lecturers** (CRUD), **Auditoriums** (CRUD). Lecturer/auditorium lists feed the lesson editor's dropdowns.
- **Users:** searchable registered‑users table (personal + contact data, package, payments) + **user detail modal** (linked payments & bookings).
- **Settings:** general (site name, languages, contact email, **external library platform URL**), payment & pricing (bank integration status, navigation price, package prices, **cancellation window**, **refund policy**), region‑discount note.
- *(Removed for this stage: "ჩატი / ოპერატორები" admin view and "Roles & permissions". The public online‑chat feature itself still exists; only its admin management screen was dropped for now.)*

---

## 9. Status enumerations (for consistency)

- **Booking:** `planned` (დაგეგმილი) · `completed` (დასრულებული) · `cancelled` (გაუქმებული). Reschedule keeps the booking, changes the slot.
- **Payment/Order:** `paid` (გადახდილი) · `pending` (მოლოდინში) · `refunded` (დაბრუნებული).
- **Course:** `draft` (დრაფტი) · `published` (გამოქვეყნებული).
- **Consultant:** `active` (🟢 აქტიური) · `inactive` (⏸ არააქტიური).
- **ConsultantSchedule:** `pending` (⏳ მოლოდინში) · `approved` (✓ დადასტურებული) · `returned/rejected`.
- **Subscription/Package:** `active` · `none` · `cancelled`.
- **Message:** `read` · `unread`; optional single `reaction`.
- **Booking coverage (consultant scheduling view):** `covered` (🟢) · `needs_coverage` (🟠).

---

## 10. Notifications & messaging

- **In‑cabinet messages** (§6.7) — the primary channel; master‑detail, long bodies, reactions. Types: `meeting_link` (from a consultant, includes the join link), `certificate`, `payment`, `recommendation`, `system`.
- **SMS** — navigation booking **confirmation including the meeting link** (sent after payment). Phone is therefore mandatory for booking.
- **Email** — invoices/payment‑details and general notifications (email is optional for a navigation booking but is the account's unique identifier when registered).

---

## 11. Screen inventory → prototype reference

| Area | Screens | Prototype file |
|---|---|---|
| Public | Home, ფსიქო განათლება (catalog + course detail), ფსიქო ნავიგაცია booking, Packages + package detail, Checkout, Auth, Cabinet (Messages / **Timetable** / **E‑journal** / Courses / **Library** / Certificates / Bookings / Package&Payments / Personal), Contact, Legal, Chat | `wireframes/public.html` |
| Consultant | Login, My bookings, Message‑user modal, My schedule (24h month composer), Availability, Profile | `wireframes/consultant.html` |
| Admin | Login, Overview, Orders & payments, Bookings & consultants (force‑majeure + schedule approval), Content & SEO, Packages, **Academic (timetable / attendance / lecturers / auditoriums)**, Users, Settings (incl. **library URL**) | `wireframes/admin.html` |
| Entry | Landing linking the three | `index.html` (+ `wireframes/index.html`) |

---

## 12. Notes for the new frontend build

- **Design is free to change.** The prototype's calm teal/violet palette, cards and typography are only a reference; re‑theme freely. Keep the *information architecture, flows and states* above.
- Preserve the **canonical naming** (ფსიქო ნავიგაცია; "გადახდის დეტალები" not "ინვოისი"), the **home section order**, the **cabinet tab order (Messages first)**, and the **consultant‑self‑scheduling + admin‑approval** model.
- Everything content‑ish (courses, curriculum, services, pages, packages, prices, SEO, translations) is **admin‑managed** — build real CRUD, not hardcoded content.
- Enforce **access control** server‑side (previews vs paid), **payment‑gated activation**, and the **availability formula + round‑robin assignment** on the backend; the frontend only reflects state.
- Open items to confirm with the client during build: exact discount percentages per package, cancellation window length, refund split (full/partial), quiz pass thresholds, and whether multi‑admin roles/permissions return.
