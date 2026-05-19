# Szakdolgozat Frontend

Ez a könyvtár tartalmazza a szakdolgozathoz készült éttermi (Pizzaház) webalkalmazás kliensoldalát (frontend). A projekt a legmodernebb **Vue 3** (Composition API / Options API), **Vite**, **TypeScript** és **Pinia** (állapotkezelés) technológiákra épül.

## Előfeltételek (Prerequisites)

A projekt futtatásához szükség lesz a következő szoftverekre a számítógépen:
- **Node.js** (Ajánlott verzió: v18 / v20 vagy újabb LTS)
- **NPM** (A Node.js telepítése alapértelmezetten tartalmazza)

Ellenőrzés parancssorban:
```bash
node -v
npm -v
```

## Telepítés és Futtatás

A projekt kicsomagolása vagy letöltése után egy terminált (parancssort) kell nyitni a projekt gyökérmappájában (`szakdolgozat-frontend`), majd a következő lépéseket végrehajtani:

### 1. Függőségek telepítése
Első lépésként telepíteni kell a szükséges csomagokat.
```bash
npm install
```

### 2. Fejlesztői szerver indítása
Fejlesztéshez és a projekt megtekintéséhez ezt a parancsot kell futtatni:
```bash
npm run dev
```
Ennek hatására a rendszer elindít egy helyi fejlesztői szervert, ami böngészőből elérhető lesz. (Alapértelmezetten: **http://localhost:5173/** vagy amit a terminál kiír).

## Fejlesztési ág és commit információ

A projekt fejlesztése a `main` ágon történt.

- Branch: `main`
- Commit: `c806cd2c948fd635c00c5467e56e14c0275e44bc`

## Tesztelés (Cypress E2E)

A projekt rendelkezik automatizált **End-to-End (E2E) tesztekkel**, melyek valós böngészőkörnyezetben (Cypress segítségével) szimulálják a felhasználói interakciókat.

### Vizuális teszt futtatás (Ajánlott!)
Megnyitja a Cypress grafikus felületét, ahol valós időben, lépésről lépésre megfigyelhető az automatizált kattintgatás és navigáció.
```bash
npm run test:e2e:dev
```
*(A felnyíló ablakban az **E2E Testing** opciót, majd egy böngészőt választva futtathatóak a `.cy.ts` kiterjesztésű tesztfájlok.)*

### Parancssoros (Headless) tesztfuttatás
Háttérben futtatja le a teszteket (először lefordítja a projektet).
```bash
npm run build
npm run test:e2e
```

## Élesítés / Build

Ha a projektet produkciós (éles) környezetbe szeretnénk telepíteni, ezzel a paranccsal fordítható le:
```bash
npm run build
```
A kimenet a `dist` mappába fog kerülni, amely bármilyen statikus webszerveren (pl. Nginx, Apache) hosztolható. Az elkészült build lokális megtekintéséhez használható az `npm run preview` parancs.

## Kód karbantartás

A kód formázásához és az estleges hibák (Linter) kereséséhez a következő beépített parancsok állnak rendelkezésre:
```bash
# Hibakeresés és automatikus javítás (ESLint + Oxlint)
npm run lint

# Kódformázás (Prettier)
npm run format
```
