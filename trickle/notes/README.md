# CityTransit - Public Transport Ecosystem

## Project Overview
CityTransit is a comprehensive public transport tracking platform designed for small cities. It connects passengers, drivers, and transport authorities through a unified real-time system.

## Ecosystem Modules

### 1. Passenger Portal (index.html)
- **Target**: Commuters
- **Features**: Live tracking, route visualization, ETA predictions, search, service alerts, and eco-impact tracking.
- **Key Components**: `RouteDetail`, `EcoWidget`, `DashboardStats`.

### 2. Authority Dashboard (admin.html)
- **Target**: Transport Managers / Dispatchers
- **Features**: Fleet overview, performance analytics (charts), route management (simulated), and alert dissemination.
- **Key Components**: `FleetTable`, `AnalyticsCharts`.

### 3. Driver Console (driver.html)
- **Target**: Bus Drivers
- **Features**: Simplified touch interface, trip management (Start/End), delay reporting, and SOS signaling.
- **Design**: High contrast, large buttons for safety.

### 4. Authentication (login.html)
- **Entry Point**: Dedicated login page with split-screen design.
- **Roles**: Passenger, Admin, Driver.
- **Mechanism**: LocalStorage-based session management with `Auth` utility.

## Tech Stack
- **Frontend**: React 18, Tailwind CSS
- **Visualization**: Chart.js (Admin Analytics), Custom Linear Maps
- **Icons**: Lucide Static
- **State**: React Context API

## Maintenance Rules
1. **Mock Data**: `utils/mockData.js` serves as the central "database" for all three apps. Changes here affect all views.
2. **Shared Components**: `components/Icons.js` is used across all pages.
3. **Navigation**: Footer links facilitate movement between modules.

## Update Log
- **2026-02-11**: Added dedicated Login Page (`login.html`) and implemented Role-Based Access Control (RBAC).
- **2026-02-11**: Expanded to 3-module architecture (Passenger, Admin, Driver). Added Chart.js for analytics and Eco-Impact widgets.