# DriveEasy — Car Rental Booking App

A full-stack car rental search and booking application built with Next.js 16 (App Router), React 19, and TypeScript.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4 |
| Forms | react-hook-form + zod |
| HTTP client | axios |
| JWT signing | jose (HS256) |
| Language | TypeScript |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                      # Home / landing page
│   ├── search/page.tsx               # Search results page
│   ├── booking/
│   │   ├── page.tsx                  # Booking page shell
│   │   └── BookingView.tsx           # Booking form + confirmation (client)
│   ├── bookings/page.tsx             # "My Bookings" lookup page
│   └── api/
│       ├── search/
│       │   ├── route.ts              # GET  /api/search — location autocomplete
│       │   ├── create-search/route.ts# POST /api/search/create-search
│       │   └── [guid]/route.ts       # GET  /api/search/[guid] — paginated results
│       ├── booking/
│       │   ├── offer/route.ts        # POST/GET /api/booking/offer — sign/verify OCID
│       │   └── confirm/route.ts      # POST /api/booking/confirm
│       ├── bookings/
│       │   └── search/route.ts       # GET  /api/bookings/search — lookup by doc/code
│       └── countries/route.ts        # GET  /api/countries — country list
├── components/
│   ├── SearchForm.tsx                # Home page search form
│   ├── LocationSection.tsx           # Pickup / drop-off location inputs
│   ├── LocationAutocomplete.tsx      # Autocomplete input widget
│   ├── SearchHeader.tsx              # Sticky header on search page
│   ├── SearchResults.tsx             # Paginated offer list (client)
│   ├── OfferCard.tsx                 # Individual car offer card
│   ├── Pagination.tsx                # Page navigation controls
│   ├── BackButton.tsx                # Browser back navigation
│   └── BookingResultItem.tsx         # Booking entry in "My Bookings"
├── lib/
│   ├── bookingApi.ts                 # Axios client for the external Booking API
│   ├── bookingMappers.ts             # Maps internal params → external API format
│   ├── offerToken.ts                 # JWT sign/verify helpers (OCID tokens)
│   ├── bookingsStore.ts              # In-memory bookings store
│   ├── searchSchema.ts               # Zod schema for the search form
│   └── utils.ts                      # Shared utilities
└── types/
    └── booking.ts                    # Shared TypeScript types
```

---

## Architecture & Data Flow

### 1. Search

```
Home page (SearchForm)
  │  User selects location (autocomplete via GET /api/search)
  │  User picks dates
  │
  ▼
POST /api/search/create-search
  │  Proxies to external Booking API → returns a search session guid
  │
  ▼
Navigate to /search?guid=...&location=...&pickup=...&return=...
  │
  ▼
SearchResults (client component)
  │  GET /api/search/[guid]?page=&pageSize=&sort=
  │  Server fetches from external API on first request, caches results in-memory
  │  Applies sort (recommended / price asc / price desc / rating), paginates
  │
  ▼
OfferCard × N  (with Pagination)
```

### 2. Booking

```
OfferCard — "Book" button
  │  POST /api/booking/offer  (sign offer details as a JWT → ocid)
  │
  ▼
Navigate to /booking?ocid=<jwt>
  │
  ▼
BookingView (client component)
  │  GET /api/booking/offer?ocid=  → verifies JWT, returns offer payload
  │  GET /api/countries            → populates country selector
  │  User fills driver details form
  │
  ▼
POST /api/booking/confirm
  │  Verifies the OCID JWT (guards against tampered/expired offers)
  │  Generates booking code: BK-XXXXXXXX
  │  Stores entry in in-memory bookingsStore:
  │    identityDoc → Map(bookingCode → { ocid, details })
  │
  ▼
Confirmation screen showing booking code
```

### 3. My Bookings Lookup

```
/bookings page
  │  User enters identity doc number or booking code (BK-...)
  │
  ▼
GET /api/bookings/search?q=
  │  Searches bookingsStore by identity doc or booking code
  │  Re-verifies each stored OCID JWT to return offer details
  │
  ▼
BookingResultItem × N
```

---

## Key Design Decisions

**Offer token (OCID):** When a user clicks "Book" on a search result, the offer data (price, car, dates, supplier) is signed into a short-lived JWT (2-hour expiry) using HS256 via `jose`. This token is passed as `?ocid=` in the URL. The booking confirmation endpoint re-verifies the JWT before accepting a booking, preventing price/offer tampering.

**In-memory stores:** Both the offer/results cache (`offerCache` in `[guid]/route.ts`) and the bookings store (`bookingsStore`) are plain `Map` objects held in the Node.js process. They reset on server restart and are not shared across multiple server instances. For production, replace these with a database.

**BFF pattern:** All calls to the external Booking API go through Next.js API routes. The browser never calls the external API directly, keeping API credentials server-side and allowing server-side caching and request shaping.

**Form validation:** The home search form uses `react-hook-form` with a `zod` resolver (`searchSchema.ts`) for client-side validation before submission.

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `BOOKING_API_URL` | Base URL for the external car rental API | — |
| `OFFER_TOKEN_SECRET` | Secret key for signing OCID JWTs | `dev-secret-change-in-production` |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run production build
npm run lint    # ESLint
```
