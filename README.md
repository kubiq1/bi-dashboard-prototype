# BI Dashboard Prototype

This repository contains the prototype of a data-driven web dashboard built using modern frontend technologies. The project is designed as a proof of concept to visualize structured hosting and billing data, with an emphasis on clean design, performance, and reusability.

## ✨ Features

- Modular UI built with **React**, **Tailwind CSS**, and **shadcn/ui**
- Custom font integration using locally hosted `.woff2` files
- Responsive design with dark-mode-ready components
- Clickable prototype using mock data and placeholder structures
- Table views with filtering, sorting, and status indicators
- Layouts prepared for future integration of API-based data sources

## 🧱 Tech Stack

- **React** (Vite or Next.js recommended)
- **Tailwind CSS**
- **shadcn/ui** component library
- **Builder.io** for visual prototyping and UI iteration
- Fonts: Custom font-face declarations for typography consistency

## 🗂️ Folder Structure (sample)

/public/fonts/ → Local fonts (.woff2) for Boehringer styles
/src/components/ → Reusable UI components
/src/pages/ → Screen templates (e.g. Billing Overview)
/src/styles/ → Global styles, Tailwind setup

markdown
Kopieren
Bearbeiten

## 🛠 Setup

1. Clone the repo
2. Install dependencies

```bash
npm install
Start the dev server

bash
Kopieren
Bearbeiten
npm run dev
Fonts are already included under /public/fonts/ and registered via @font-face in global styles.

📦 Deployment
To deploy this prototype, push the project to a platform such as:

Vercel

Netlify

GitHub Pages (for static builds)

📄 License
This project is for prototyping and internal demonstration purposes.
No production use intended. Fonts are subject to their respective license terms.
