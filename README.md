# AuctionSite

En fullstacklösning för en auktionssajt byggd med React (frontend) och ASP.NET Core Web API (backend). Data lagras i SQL Server och autentisering hanteras med JWT.

## Teknikstack

- **Frontend:** React, TypeScript, Vite, React Router, Context API
- **Backend:** ASP.NET Core Web API, Entity Framework Core
- **Databas:** SQL Server (LocalDB)
- **Auth:** JWT (JSON Web Tokens)

## Kom igång

### Krav

- .NET 10 SDK
- Node.js (v18+)
- SQL Server / LocalDB (följer med Visual Studio)

### Backend

1. Klona repot
2. Skapa `AuctionSite.Api/appsettings.Development.json`:

```json
{
  "Jwt": {
    "Key": "din-hemliga-nyckel-minst-32-tecken",
    "Issuer": "AuctionSite",
    "Audience": "AuctionSite"
  }
}
```

3. Kör migrationer och starta backend:

```bash
cd AuctionSite.Api
dotnet ef database update
dotnet run
```

API:et körs på `https://localhost:7211`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend körs på `http://localhost:5173`

## Inloggning

### Admin

- **Email:** admin@admin.com
- **Lösenord:** admin123

### Testanvändare

Registrera en ny användare via appen.

## Funktionalitet

- Registrera och logga in som användare
- Skapa, redigera och söka auktioner
- Lägga och ångra bud
- Söka på avslutade auktioner
- Adminpanel för att inaktivera användare och auktioner
- Responsiv design för mobil och desktop
