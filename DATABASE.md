# Nexus Mobility: Real-Time Database Architecture

This document outlines the database schema and real-time synchronization strategy used in the Nexus Mobility platform. This architecture is designed for high availability, low latency, and seamless transitions between online and offline modes.

## 🏗️ Core Collections

### 1. `vehicles`
Stores the real-time telemetry and state of all active transit units in the fleet.
- **`id`**: Unique vehicle identifier (e.g., `v1`).
- **`routeId`**: Reference to the assigned route.
- **`latitude` / `longitude`**: Real-time GPS coordinates.
- **`speed`**: Current velocity in KM/H.
- **`capacity`**: Occupancy level (`Low`, `Medium`, `High`).
- **`status`**: Current operational status (`On Time`, `Delayed`, `Idle`).
- **`lastUpdated`**: Server-side timestamp for freshness validation.

### 2. `routes`
Static and dynamic data regarding city transit paths.
- **`id`**: Unique route number.
- **`name`**: Common name (e.g., "Downtown Loop").
- **`stops`**: Array of objects containing stop IDs, names, and time offsets.
- **`color`**: Brand color used for UI mapping.

### 3. `alerts`
System-wide notifications for passengers and drivers.
- **`type`**: Severity level (`warning`, `info`, `emergency`).
- **`message`**: Human-readable alert text.
- **`routeId`**: Impacted route (or `all`).

---

## 🛰️ Real-Time Strategy: "Snapshot Listeners"

Nexus Mobility uses a **Reactive State Pattern**. Instead of polling the server every few seconds, the client applications (Passenger, Driver, Admin) attach **Firestore Snapshot Listeners**.
1. **Low Latency**: UI updates within milliseconds of a database change.
2. **Reduced Overhead**: Data is only transmitted when a change occurs.
3. **Synchronization**: Drivers updating occupancy levels in the **Driver's Cockpit** instantly reflect on the **Passenger Tracker** map.

---

## 🛡️ Resilience: Hybrid Mock Fallback

To ensure the platform always works during high-stakes presentations (even with poor connectivity), Nexus implements a **Transparent Mock Layer**:
- **Automatic Detection**: If Firebase keys are missing, the system falls back to `localStorage` sync.
- **Same API**: The `db` object uses the same Firestore-style syntax (e.g., `db.collection().onSnapshot()`), requiring zero changes to the front-end components.
- **Inter-Tab Communication**: In mock mode, the system uses `storage` events to sync data across different browser tabs simultaneously.
