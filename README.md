# Store Operations Map

A Google Apps Script-based store operations and geospatial visualization dashboard. It helps visualize store locations, delivery service areas, order distribution, rider activity, and operational performance on an interactive map.

## Overview

Store Operations Map connects Google Sheets with an interactive web-based map to help operations teams monitor store coverage areas and order activity.

The application uses:
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Google Apps Script
- **Database:** Google Sheets
- **Map Engine:** Leaflet.js
- **Charts & Reports:** JavaScript charting and PDF export libraries

## Features

### 1. Store Polygon Management
- View store locations and delivery service areas.
- Visualize store coverage through polygons.
- Filter stores by cluster and store.
- Draw new store delivery areas directly on the map.
- Add and save store details and coordinates.
- Export store polygon boundaries as KML.
- Delete store records.

### 2. Order Heatmap
- Visualize order locations on an interactive map.
- View order distribution through heatmap and thermal layers.
- Switch between point and hexbin visualization.
- Filter order data by store and status.
- Identify areas with delivery anomalies.

### 3. Rider Tracking & Metrics
- View rider routes and delivery-related metrics.
- Analyze rider activity and delivery performance.
- Explore order and rider location data.

### 4. Map Tools
- Street and satellite map views.
- Traffic layer.
- Weather radar layer.
- Location search.
- Current location support.
- Full-screen map mode.
- Distance measurement and map interaction tools.

### 5. Reports & Data Management
- Download PDF reports.
- Submit operational issue reports.
- Upload CSV order data.
- Import CSV or JSON polygon-related data.
- Automatic data refresh with polling fallback.
- Optional Firebase-based update notification integration.

### 6. Automated Anomaly Alerts
The backend includes an anomaly-checking function that can detect clusters of unsuccessful or attempted orders within a defined geographic radius and send email alerts when configured with an Apps Script time-driven trigger.

## Project Structure

```text
store-operation/
│
├── Code.gs       # Google Apps Script backend
├── Index.html    # Frontend interface and map
└── README.md     # Project documentation
```

## Google Sheets Integration

The application uses Google Sheets as its data source.

Important sheet tabs:

| Sheet Name | Purpose |
|---|---|
| Polygon | Store locations and delivery boundaries |
| Heat Map Dump | Order location and status data |
| Order Dump | Order data uploads |
| Stores | Store master information |
| Reports | Submitted operational issues |
| JSON | Imported polygon-related data |

Some sheets are created automatically by the backend when required. The `Polygon` and `Heat Map Dump` tabs must exist for their respective map views to load data.

## Setup & Deployment

### Step 1 — Create Google Apps Script Project
1. Open [Google Apps Script](https://script.google.com/).
2. Create or open a project.
3. Add the backend code from `Code.gs`.
4. Add an HTML file named `Index`.
5. Paste the frontend code from `Index.html`.

### Step 2 — Configure Google Sheets
1. Connect the correct Google Spreadsheet in the backend.
2. Verify the required sheet tabs and column structure.
3. Make sure the Apps Script account has permission to access the spreadsheet.

### Step 3 — Deploy as Web App
1. Click **Deploy → New deployment**.
2. Select **Web app**.
3. Set the execution permissions as required.
4. Select the appropriate access level.
5. Click **Deploy** and authorize the required permissions.

### Step 4 — Open the Application
Use the generated Google Apps Script Web App URL to access the Store Operations Map.

## Important Notes

- This project is designed to run through Google Apps Script. GitHub stores and tracks the source code; GitHub Pages alone will not run the Google Apps Script backend.
- Changes committed to GitHub do not automatically update the deployed Apps Script project.
- Keep spreadsheet access permissions and deployment settings secure.
- Configure optional Firebase integration before using Firebase-based real-time notifications.
- Automated anomaly alerts require an appropriate time-driven trigger.
- Do not commit passwords, private credentials, access tokens, or sensitive spreadsheet information to a public repository.

## Future Improvements

- Advanced operational analytics.
- Enhanced store and rider performance dashboards.
- Improved real-time data synchronization.
- Additional reporting and visualization tools.

## Project

**Name:** Store Operations Map  
**Repository:** [store-operation](https://github.com/aslamscode-ops/store-operation)  
**Platform:** Google Apps Script + Google Sheets

---

Developed to support better store visibility, delivery-area analysis, and data-driven operations.
