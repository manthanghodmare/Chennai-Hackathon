# 🏙️ Nexus Mobility: Project Documentation & System Architecture

This document provides a comprehensive overview of the **Nexus Mobility** platform—a Smart City Transit System designed to bridge the gap between citizens, drivers, and transport authorities.

---

## 🛠️ Technology Stack & Languages

### 1. Core Languages
- **HTML5**: Semi-semantic structure with meta tags optimized for SEO and mobile responsiveness.
- **JavaScript (ES6+)**: Powers all client-side logic using a **React-driven architecture**.
- **CSS3**: Implemented via **Tailwind CSS (utility-first)** and custom `@layer` styles for themes and components.

### 2. Frameworks & Libraries
- **React.js (v18)**: Used via CDN for component-based UI management (Hooks: `useState`, `useEffect`, `useContext`).
- **Babel Standalone**: Enables JSX and modern JS features directly in the browser.
- **Tailwind CSS**: Handle all styling, including dynamic Dark/Light mode transitions.
- **Capacitor**: Cross-platform runtime used to wrap the web application into a **native Android app**.
- **Lucide Icons**: Crisp, vector-based iconography used throughout all portals.

---

## 🛰️ Integrated APIs & Services

The platform connects to several cloud services to provide a real-time, intelligent experience:

1.  **Firebase Ecosystem (v9 Compat)**:
    *   **Authentication**: Secure, role-based login (Citizen, Driver, Admin).
    *   **Firestore**: Real-time NoSQL database using **Snapshot Listeners** for sub-second updates.
    *   **Hosting**: High-performance delivery of assets and applications.
2.  **Google Maps Platform**:
    *   **Maps JavaScript API**: Renders the live tracking interface and route previews.
    *   **Geometry Library**: Used for smooth vehicle movement and distance calculations.
3.  **Google Gemini AI (Generative AI)**:
    *   **Gemini Pro/Flash API**: Powers the **AI Chat Assistant** in the Passenger Dashboard for natural language queries about routes and schedules.

---

## 🚀 Key Modules & Portals

### 1. 🛡️ Login & Access Portal (`login-app.js`)
- **Role-Based Routing**: Centralized entry point that redirects users to their specific dashboard.
- **Security Protocols**: Multi-step password validation (Uppercase, Lowercase, Number, Symbol, 8+ chars).
- **Time-Based UX**: Dynamic greetings (Good Morning/Afternoon/Evening) based on local system time.

### 2. 📍 Passenger Dashboard (`tracker-app.js`)
- **Live Real-Time Map**: Dynamic vehicle markers synchronized with Firestore updates.
- **Route Planner**: Modal-based search and filtering for city transit paths.
- **Eco-Impact Widget**: Real-time calculator showing CO2 savings when choosing public transit.
- **Service Alerts**: Critical notification system for delays or maintenance.
- **AI Help Assistant**: Integrated chat for instant passenger support.

### 3. 🚌 Driver Cockpit (`driver-console.js`)
- **High-Visibility Interface**: Optimized for mobile/tablet use in sunlight with high-contrast themes.
- **Trip Management**: Large, color-coded "Start/End Trip" controls.
- **SOS System**: Two-step emergency activation to alert dispatchers instantly.
- **Delay Reporting**: One-tap buttons for reporting traffic or vehicle issues.

### 4. 📊 Admin Command Center (`admin-app.js`)
- **Fleet KPI Cards**: Real-time metrics for Fleet Capacity, On-Time Percentage, and Critical Alerts.
- **Analytics Charts**: Visualizes demand patterns and passenger load over time.
- **Cloud Broadcast**: Global alert system to send notifications to drivers or passengers.
- **Live Fleet Table**: A master list for tracking every active unit's telemetry and status.

---

## ✨ Specialized Features & "Small Details"

- **🌐 Multi-Language Support**: Complete localization for **English, Hindi, Marathi, and Tamil**.
- **🌗 Smart Theming**: System-level Dark Mode detection with manual override toggle.
- **🛡️ Hybrid Connectivity**: Transparent **Mock Mode** fallback that uses `localStorage` sync if Firebase keys are missing, ensuring the app works for demos anywhere.
- **🇮🇳 Statutory Branding**: Includes "Digital India" and "Ministry of Housing" official footers to ensure government-level trust.
- **📱 Responsiveness**: All components are built with a **Mobile-First** approach using Tailwind's responsive breakpoints.

---

## 📂 File Architecture (Quick Reference)

| File / Directory | Purpose |
| :--- | :--- |
| `index.html` | The main Login gateway. |
| `tracker.html` | Passenger app entry point. |
| `driver.html` | Driver portal entry point. |
| `admin.html` | Admin dashboard entry point. |
| `components/` | Reusable UI bits (Logo, Header, GoogleMap, AIChat). |
| `utils/` | Context providers, translations, and API configurations. |
| `DATABASE.md` | In-depth schema documentation for the Firestore collections. |

---
*Created for the Nexus Mobility Development Team*
