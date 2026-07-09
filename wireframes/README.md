# PsychoCampus — Wireframes

Low-fidelity, clickable wireframes for the **PsychoCampus** platform (client: შპს ფინა2 / ი/მ ანნა ზედგინიძე), based on the technical task and commercial proposal documents.

The wireframes deliberately stay **low-fidelity**: the goal is to lock down *structure, navigation and business logic* before visual design. Grayscale boxes, placeholder text bars (`▬`) and media placeholders (`▨`) stand in for real content; yellow ✎ notes explain the logic behind each screen.

## How to view

Open **`index.html`** in any browser — it is the hub linking every screen. No build step, no internet connection, no dependencies.

```
wireframes/
├── index.html              # gallery / navigation hub — start here
├── assets/
│   ├── wireframe.css       # self-contained wireframe design system
│   └── shell.js            # injects the left nav rail + Desktop/Mobile toggle
└── pages/                  # one HTML file per screen
```

Each screen has:
- a **left navigation rail** to jump between all 18 screens;
- a **🖥 Desktop / 📱 Mobile** toggle (top-right) to preview responsive layout;
- inline **✎ notes** describing the underlying logic.

## Screens (18)

### Public site
| Screen | Covers |
| --- | --- |
| Home | Slider, company intro, services hub, featured videos, live-chat widget |
| About | History, goals, team, media |
| Services | Two directions (paid video + consultation) + general services list |
| Video catalog | Grid, filters, preview vs 🔒 locked (subscription) |
| Video + paywall | Player with paywall overlay, subscription CTA, access logic |
| Consultation booking | Unified "incognito" calendar, slot capacity by active-consultant count |
| Booking confirm | Contact/registration step, payment summary, success state |
| Auth | Register (personal number, name, email = unique ID, phone), login, in-payment registration |
| Contact | Feedback form, contact info, map |
| Legal | Terms, privacy, cookie policy + consent banner |

### User & Operator
| Screen | Covers |
| --- | --- |
| User profile | Bookings (reschedule/cancel), subscription, payments & invoices |
| Consultant dashboard | Only own assigned bookings, personal schedule, availability |

### Admin panel
| Screen | Covers |
| --- | --- |
| Overview | KPIs, revenue trend, status widgets, Excel export |
| Orders & payments | Filterable table, order detail, payment status, Excel export |
| Bookings & consultants | Consultant list, force-majeure toggle, global/individual/manual time management, buffer, unified load calendar |
| Content & SEO | CRUD for videos/services/pages, bilingual editor, SEO title/description (+auto-generate), OG banner, sitemap, structured data, Meta Pixel/GA4 |
| Users | Registered users with personal/contact data, linked payments |
| Roles & permissions | Permission matrix for site admins (operators have their own panel) |

## Key logic reflected

- **Incognito consultation model** — users never pick a specific consultant; a single calendar shows availability computed as `bookings < active consultants` per slot; bookings auto-distribute round-robin to free consultants.
- **Time management** — three modes: global auto-generation, per-operator schedules, manual. Configurable slot length + mandatory buffer between meetings.
- **Force majeure** — one-click deactivate a consultant → auto-reassign → reschedule link → refund / manual resolution.
- **Paid video** — public preview; full video and monthly subscription behind registration + bank payment; access auto-toggles on payment status.
- **Payments** — bank integration; profile/access auto-activated on a positive transaction; refunds automatic where the bank allows, otherwise a manual payout request.
- **Bilingual (GEO/ENG), Responsive, SEO** (sitemap.xml, Open Graph, JSON-LD, Meta Pixel, GA4).

> This is a first draft ("პირველადი ზოგადი მონახაზი") and is expected to change as requirements are refined.
