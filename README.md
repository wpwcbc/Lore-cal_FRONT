# Lore-cal (Mobile App)

Expo / React Native client for Lore-cal, a location-based social storytelling app. This app consumes the REST API provided by the backend repo: [Lore-cal_BACK](https://github.com/wpwcbc/Lore-cal_BACK).

Every story (“Lore”) must be pinned to a real-world location, encouraging people to explore the city by walking instead of endlessly scrolling a feed.

---

## Features

### Implemented

- **Location-anchored stories**
    - Users create stories that must be pinned to a specific map location.
    - Stories can be tagged as `Historic`, `Anecdotal`, `HiddenGem`, or `Memorable`.
    - Each story has its own comment thread.

- **Map-based feed**
    - Map-first UI showing story pins around the user’s current location.
    - Clustering for nearby stories to keep the map readable.

- **User profiles and “turf” map**
    - Each user has a profile with a map of locations where they have posted.
    - The app highlights the user’s main “turf” (areas where they post most frequently).

### Planned

- **Ephemeral stories**
    - 24-hour stories for lightweight, in-the-moment posts.

- **Following and filtered map**
    - Follow other users and filter the map to show stories only from followed accounts.

- **Curated exploration feed**
    - Instead of ranking by popularity, the app surfaces districts to explore each day to encourage offline exploration.

---

## Screenshots

<!--
TODO: Add real screenshots in docs/screenshots and update paths.
-->

Map view with clustered stories:

![Map screen](./docs/screenshots/map-screen.png)

Story details and comments:

![Story screen](./docs/screenshots/story-screen.png)

User profile with “turf” map:

![Profile screen](./docs/screenshots/profile-screen.png)

---

## Download (Android Test Build)

An Android test build (APK) is available under GitHub Releases:

- 👉 [Releases for Lore-cal_FRONT](https://github.com/wpwcbc/Lore-cal_FRONT/releases)

Notes:

- You may need to enable “Install from unknown sources” on your device.
- This is a test build; expect some rough edges and known issues (see below).

---

## Tech Stack (Frontend)

- **Core**
    - Expo (React Native, TypeScript)
    - expo-router for file-based routing (tabs + nested stacks)

- **Maps & location**
    - `@rnmapbox/maps` for map rendering, clustering, and user location
    - Mapbox styles for the base map

- **Data & state**
    - TanStack Query (React Query) for server state and caching
    - JWT-based auth via the Lore-cal backend API

- **Tooling**
    - TypeScript
    - ESLint, Prettier
    - Git + GitHub

Backend API: [Lore-cal_BACK](https://github.com/wpwcbc/Lore-cal_BACK) (Node.js, Express, MongoDB, Cloudinary, JWT).

---

## Related Repositories

For more detailed documentation please visit backend repo: [Lore-cal_BACK](https://github.com/wpwcbc/Lore-cal_BACK)
