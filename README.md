# Karibu Leo

Location-based dating MVP for Kenya. Nearby profiles by county and distance, swipe / like, matches, chat demo, safety reports, and a Plus plan placeholder for M-Pesa.

## Stack

- Static frontend (HTML, CSS, JS)
- Hosted on **Netlify**
- Source on **GitHub**
- Data stored in the browser (`localStorage`) so the demo works without a backend

## Features in this demo

1. Registration / login
2. Profile setup (county, town, tribe, faith, mode, photo upload)
3. GPS permission + county filters
4. Nearby ranking and swipe
5. Mutual-like matches + chat
6. Report / hide
7. Plus (demo unlock, wider radius)

## Production next steps

- Backend: Node or Django + PostgreSQL
- Real auth (email / phone OTP)
- Photo storage (Cloudinary / S3)
- PostGIS or similar for true distance queries
- WebSockets for live chat
- M-Pesa Daraja for Plus
- Moderation queue for reports

## Local

Open `index.html` or serve the folder:

```bash
npx serve .
```
