# Store Operation Management System

A web-based Store Operations Management System designed to simplify daily store activities, monitor operational performance, visualize location-based data, and improve decision-making.

## Overview

The Store Operation project provides a centralized platform for managing and analyzing store-related operations through an interactive web interface.

The project is developed using Google Apps Script and HTML, with GitHub used for source code management and automatic deployment.

## Key Features

- Interactive store operations interface
- Centralized operational data management
- Store-related information visualization
- Easy-to-use web-based interface
- Google Apps Script backend integration
- Maintainable and version-controlled source code
- Automatic deployment from GitHub to Google Apps Script

## Technology Stack

| Technology | Purpose |
|---|---|
| Google Apps Script | Backend and server-side logic |
| HTML | Frontend structure |
| JavaScript | Application functionality |
| GitHub | Source code management |
| GitHub Actions | Automated deployment |
| Google clasp | Google Apps Script synchronization |

## Project Structure

```text
store-operation/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── Code.gs
├── Index.html
├── appsscript.json
├── .clasp.json
└── README.md
```

## Automatic Deployment

This project is integrated with Google Apps Script using GitHub Actions and Google clasp.

Whenever supported project files are updated and pushed to the `main` branch, GitHub Actions automatically deploys the latest code to Google Apps Script.

### Deployment Triggers

Automatic deployment runs when changes are pushed to the `main` branch involving:

- `Code.gs`
- `Index.html`
- `appsscript.json`
- `.clasp.json`
- GitHub deployment workflow

Publishing a GitHub Release also triggers deployment.

### Deployment Process

1. Developer updates the project files.
2. Changes are committed to GitHub.
3. Changes are pushed to the `main` branch.
4. GitHub Actions starts the deployment workflow.
5. Google clasp pushes the updated files to Google Apps Script.
6. GitHub Actions reports deployment success or failure.

## Deployment Status

- **Deployment Method:** Automated
- **Source Control:** GitHub
- **Deployment Platform:** Google Apps Script
- **Deployment Tool:** Google clasp
- **Workflow:** GitHub Actions
- **Main Branch:** `main`

## How to Update the Project

1. Make the required changes to the source code.
2. Commit the changes.
3. Push the changes to the `main` branch.
4. Open the GitHub Actions tab.
5. Verify that the deployment workflow completes successfully.

## Security

- Google authentication credentials are stored in GitHub Actions Secrets.
- Sensitive authentication files should never be committed to the repository.
- The `.clasprc.json` file must remain private.

## Repository

GitHub: https://github.com/aslamscode-ops/store-operation

---

**Store Operation Management System**

*Built to make store operations smarter, simpler, and more efficient.*
