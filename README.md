# ✳️ a3sixty CRM Live Executive Dashboard

A real-time executive CRM dashboard and analytics system for tracking lead pipelines, agent performance, conversion rates, and daily trend analytics in Saudi Arabia.

## 🚀 Features

- **Live Google Sheet Sync**: Connects directly to Google Sheets CSV export for real-time lead updates.
- **Salesforce Dark Theme & a3sixty Branding**: Dark mode styling (`#0f1115`), neon green accents (`#95f029`), and responsive master-detail lead panel.
- **Executive Scorecards**: Real-time KPI metrics for Total Leads, Open Follow-ups, Conversion Rates, and Converted Revenue in SAR.
- **Multi-Status Daily Trend Analytics**: Interactive Chart.js timeline tracking all 5 status stages (Follow-up, Not Interested, Converted, Link Sent, Unanswered).
- **Python Sheet Auto-Sync Script**: `sync_sheet.py` background watcher script to keep local JavaScript datasets synchronized with Google Sheets.

## 📁 Repository Structure

- `crm_dashboard.html`: Main interactive live dashboard page.
- `sync_sheet.py`: Python live sheet auto-sync script.
- `leads_data.js`: JavaScript lead dataset.
- `leads_data.json`: Structured JSON lead dataset.
- `GoogleAppsScript_CreateDashboard.gs`: Google Apps Script dashboard generator.
- `CRM_Dashboard.xls`: Pre-formatted offline spreadsheet workbook.
- `salesforce_crm_ui.html`: Salesforce UI reference page.

## ⚡ Quick Start

### Option 1: Serve locally (Recommended for live HTTP fetch)
```bash
python3 -m http.server 8000
```
Open `http://localhost:8000/crm_dashboard.html` in your browser.

### Option 2: Live Background Sheet Watcher
```bash
python3 sync_sheet.py --watch
```
# a360crm_view
