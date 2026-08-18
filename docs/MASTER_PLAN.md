# NestPro - Poultry Farm Management System
## Master Plan

### Overview
NestPro is a fully-fledged, mobile-first poultry farm management system built with:
- **Backend:** Laravel 13 (PHP 8.5)
- **Frontend:** React + Inertia.js (SPA feel)
- **Styling:** Tailwind CSS v4
- **Database:** SQLite (dev) / MySQL (prod)
- **Auth:** Laravel Breeze (session-based)

---

## Modules

| # | Module | Status |
|---|--------|--------|
| 1 | Dashboard | ✅ Done |
| 2 | Farm Setup | ✅ Done |
| 3 | Flock Register | ✅ Done |
| 4 | Egg Production Log | ✅ Done |
| 5 | Sales (Egg/Manure/Meat) | ✅ Done |
| 6 | Feed Expense | ✅ Done |
| 7 | Feed Consumption | ✅ Done |
| 8 | Vet & Health | ✅ Done |
| 9 | Mortality Log | ✅ Done |
| 10 | Housing & Equipment | ✅ Done |
| 11 | Labour & Operations | ✅ Done |
| 12 | Reports & Analytics | ✅ Done |

---

## Database Schema

### farms
- id, name, owner_name, location, address, phone, email, established_date, farm_type (layer/broiler/dual), notes, logo, created_at, updated_at

### flocks
- id, farm_id, name, batch_no, bird_type (layer/broiler/cockerel/turkey/duck), breed, quantity, source (hatchery/purchase), source_name, arrival_date, age_weeks, house_id, status (active/sold/culled), notes, created_at, updated_at

### egg_productions
- id, flock_id, farm_id, production_date, total_eggs, whole_eggs, broken_eggs, collected_by, notes, created_at, updated_at

### sales
- id, farm_id, flock_id, sale_type (egg/meat/manure/live_bird), sale_date, quantity, unit, unit_price, total_amount, buyer_name, payment_status (paid/pending/partial), notes, created_at, updated_at

### feed_purchases
- id, farm_id, purchase_date, feed_type, brand, quantity_kg, unit_price, total_cost, supplier, invoice_no, notes, created_at, updated_at

### feed_consumptions
- id, flock_id, farm_id, consumption_date, feed_type, quantity_kg, recorded_by, notes, created_at, updated_at

### health_records
- id, flock_id, farm_id, record_date, record_type (vaccination/medication/checkup/deworming), disease_name, vaccine_drug_name, dosage, vet_name, cost, next_due_date, notes, created_at, updated_at

### mortality_logs
- id, flock_id, farm_id, log_date, quantity, cause (disease/injury/unknown/predator/heat_stress), notes, created_at, updated_at

### houses
- id, farm_id, name, house_type (deep_litter/battery_cage/free_range/pen), capacity, length_m, width_m, status (active/inactive/under_maintenance), notes, created_at, updated_at

### equipment
- id, farm_id, house_id, name, category (feeder/drinker/heater/incubator/other), quantity, condition (good/fair/poor), purchase_date, purchase_cost, notes, created_at, updated_at

### labour_records
- id, farm_id, worker_name, task, work_date, hours_worked, rate_per_hour, total_pay, notes, created_at, updated_at

---

## Frontend Structure (React/Inertia)

```
resources/js/
  Layouts/
    AppLayout.jsx        - Main app shell (sidebar + mobile nav)
    GuestLayout.jsx      - Auth pages shell
  Pages/
    Dashboard/Index.jsx
    Farm/Index.jsx, Edit.jsx
    Flock/Index.jsx, Create.jsx, Edit.jsx, Show.jsx
    EggProduction/Index.jsx, Create.jsx
    Sales/Index.jsx, Create.jsx
    FeedExpense/Index.jsx, Create.jsx
    FeedConsumption/Index.jsx, Create.jsx
    Health/Index.jsx, Create.jsx
    Mortality/Index.jsx, Create.jsx
    Housing/Index.jsx, Create.jsx, Edit.jsx
    Equipment/Index.jsx, Create.jsx
    Labour/Index.jsx, Create.jsx
    Reports/Index.jsx
  Components/
    StatCard.jsx
    DataTable.jsx
    PageHeader.jsx
    MobileNav.jsx
    Sidebar.jsx
    EmptyState.jsx
    ConfirmModal.jsx
```

---

## Routes

All routes under `/` with auth middleware.
- GET /dashboard
- Resource: /farm, /flocks, /egg-production, /sales, /feed-expenses, /feed-consumption, /health, /mortality, /housing, /equipment, /labour, /reports

---

## Build Order

1. [x] Laravel + Breeze scaffold
2. [x] Migrations (all tables)
3. [x] Models (all)
4. [x] Seeders (demo data)
5. [x] Controllers (all)
6. [x] Routes
7. [x] AppLayout (sidebar + mobile nav)
8. [x] Dashboard page
9. [x] Farm Setup
10. [x] Flock Register
11. [x] Egg Production
12. [x] Sales
13. [x] Feed Expense
14. [x] Feed Consumption
15. [x] Health & Vet
16. [x] Mortality Log
17. [x] Housing & Equipment
18. [x] Labour & Operations
19. [x] Reports
