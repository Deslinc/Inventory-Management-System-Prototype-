# Inventory Management System
Built with React + AG Grid Enterprise + Node.js + PostgreSQL

## Quick start (development)

### 1. Install frontend dependencies
```bash
npm install
npm start
```
Opens at http://localhost:3000

### 2. Install and run the backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your DATABASE_URL
node index.js
```
API runs at http://localhost:4000

### 3. Set up the database
- Install PostgreSQL (or use a free cloud DB at neon.tech)
- Create a database called `inventory_db`
- Run `server/schema.sql` to create the table
- Import your Excel data (export as CSV, then import with TablePlus)

## Deploying to Vercel (frontend)
1. Push this repo to GitHub
2. Go to vercel.com → New Project → select your repo
3. Click Deploy — done!

## Deploying the backend to Render
1. Go to render.com → New Web Service → connect your GitHub repo
2. Set Root Directory to `server`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variable: `DATABASE_URL` = your PostgreSQL connection string
6. Click Deploy

## AG Grid Enterprise license
Add your license key in `src/index.js`:
```js
LicenseManager.setLicenseKey('YOUR_LICENSE_KEY_HERE');
```
Get a license at: https://www.ag-grid.com/license-pricing/
The app works without a key but shows a watermark.

## Project structure
```
inventory-app/
├── public/
│   └── index.html
├── src/
│   ├── index.js      ← React entry point + AG Grid license
│   ├── index.css     ← Global styles
│   ├── App.jsx       ← Main app with all 4 tabs
│   └── data.js       ← Sample data (replace with API call)
├── server/
│   ├── index.js      ← Express API
│   ├── schema.sql    ← Database table setup
│   ├── package.json
│   └── .env.example  ← Copy to .env and fill in
├── package.json
└── README.md
```
