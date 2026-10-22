# Mamma Mia – Pizza mit Amore

Eine eigenständige Portfolio-Demo auf Basis von React, TypeScript, Redux Toolkit und React Router. Stelle Teig, Größe und Belag zusammen und lege eine lokale Demo-Bestellung an.

## Start

```bash
npm ci
npm run start
```

Die Anwendung läuft unter `http://localhost:4000`.

## Demo-Funktionen

- Klassischer, Vollkorn- und glutenfreier Teig als separate Optionen
- Drei Größen sowie vegetarische, Käse-, Pilz-, Fleisch- und Fischbeläge
- Redux-basierte Auswahl, Preisberechnung und lokale Bestellbestätigung
- Lokale Demo-Bestellhistorie und Profilansichten im Browser
- Keine Verbindung zur Stellar-Burgers-API oder zu einem Bestellserver

Demo-Bestellungen und das Demo-Profil werden lokal im Browser gespeichert. Es wird keine echte Bestellung übermittelt. Passwortfelder dienen nur der Demonstration und Passwörter werden nicht gespeichert. Für echte Konten, Zahlungen oder Bestellungen wäre ein eigener sicherer Backend-Service erforderlich.

## Prüfungen

```bash
npx tsc --noEmit -p tsconfig.app.json
npm run check
npm test -- --runInBand
npm run build
npm run e2e
```

Playwright startet den Vite-Server für E2E-Tests automatisch. Falls der Chromium-Testbrowser noch fehlt, lässt er sich einmalig mit `npx playwright install chromium` installieren.
