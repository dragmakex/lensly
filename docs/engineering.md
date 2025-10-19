# Engineering Documentation

## Table of Contents

- [System Architecture](#system-architecture)
- [Requirements](#requirements)
- [Tech Stack](#tech-stack)
- [Database](#database)
  - [Entity Relations Diagram](#entity-relations-diagram)

## System Architecture

```mermaid
flowchart LR
LenslyApp[Lensly App]
EdgeAPI[Edge API]
Database[Database]
MiniApp[Mini App]
LenslySDK[Lensly SDK]
User[User]

User --"uses"--> LenslyApp
LenslyApp --"fetches data"--> EdgeAPI
EdgeAPI --"read & write"--> Database
User --"uses"--> MiniApp
MiniApp --"contains"--> LenslySDK
LenslySDK --"posts data"-->EdgeAPI
```

## Requirements

- The lensly sdk shall be compatible with farcaster apps.
- The lensly sdk shall post context data to the database.
- The database shall be able to receive and store all contet data of the sdk.
- The edge api shall cache requests by the dashboard.
- The edge api shall fetch app context from the database.
- The edge api shall expose get and post endpoints to the lensly app
- The lensly app shall be accessible via Web.
- The lensly app shall be accessible via Farcaster.
- The lensly app shall be accessible via Base.
- The lensly app shall be usable on all common devices.
- The lensly app shall feature a search bar for mini app and farcaster ids.
- The lensly app shall provide metrics about farcaster mini apps and users.

## Tech Stack

| Component     | Technology                                                 |
| ------------- | ---------------------------------------------------------- |
| Lensly App    | Typescript; Next.js; React.js; Tailwind; ShadCN; HTML, CSS |
| Lensly SDK    | Typescript;                                                |
| Edge API      | Hasura; Caddy;                                             |
| Database      | Postgres;                                                  |
| Orchestration | Docker; Vercel, GitHub                                     |
| Toolings      | Husky; Mise; EsLint; CommitLint, GitHub Action, NPM        |

## Database

### Entity Relations Diagram

The Entity Relations Diagram below is normalized to 3NF.

```mermaid
    erDiagram
    %% Entities
  Users {
    id uuid PK
    username text
    displayName text
    pfpUrl text
    farcaster_id text UK
  }
  Sources {
    id uuid PK
    miniapp_id text
    source_type text
    recorded_at timestamptz
    features_haptics boolean
    features_camera_and_microphone_access boolean
    user_id uuid FK
    client_miniapp_platform_type text
    client_farcaster_id integer
  }
  %% Relations
  Users ||--o{ Sources : "has events"
```
