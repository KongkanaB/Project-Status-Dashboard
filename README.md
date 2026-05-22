# Weekly Project Status Dashboard

A professional dashboard for tracking project status, milestones, blockers, and decisions with automatic markdown export.

## Features

- 📊 Portfolio overview with KPIs
- 📈 Interactive charts (RAG distribution, milestone stages)
- 📝 Six tab views: Summary, Completed, Upcoming, Blockers, Milestones, Decisions
- 🔗 JIRA ticket tracking in Summary tab
- 📄 PDF & Excel export for each tab
- 📋 Auto-save to markdown file
- 💾 JSON import/export for backups
- 🎨 Professional, responsive UI

## Setup

### 1. Install Dependencies

```bash
cd ~/Documents/Claude
npm install
```

### 2. Start the Server

```bash
npm start
```

You'll see:
```
📊 Status Dashboard Server running at http://localhost:3000
✓ Open your browser to: http://localhost:3000/status_dashboard.html
✓ Data will auto-save to: ~/Documents/Claude/status_dashboard.md
```

### 3. Open in Browser

Navigate to: **http://localhost:3000/status_dashboard.html**

## How It Works

### Data Storage

- **Local Storage**: Data is saved in your browser's localStorage for immediate access
- **Markdown File**: Each time you make changes, data auto-saves to `status_dashboard.md`
- **JSON Backup**: Export as JSON anytime via the "Export JSON" button

### Tabs

| Tab | Purpose |
|-----|---------|
| **Summary** | Portfolio overview, project status, JIRA tickets |
| **Completed** | Work delivered this week |
| **Upcoming** | Priorities for next 1-2 weeks |
| **Blockers** | Active risks and impediments |
| **Milestones** | Delivery pipeline tracker |
| **Decisions** | Decisions awaiting input |

### Export Options

- **PDF/Excel**: Export any tab as PDF or Excel (buttons in each tab header)
- **JSON**: Full data backup in JSON format
- **Markdown**: Auto-saved to `status_dashboard.md` whenever you make changes

### JIRA Integration

Add JIRA ticket links to projects in the Summary tab:
1. Click "+ Add project" or edit an existing project
2. Enter the JIRA ticket URL in the "JIRA Ticket" field
3. The link displays as a clickable shorthand in the table

## File Locations

- **Dashboard**: `~/Documents/Claude/status_dashboard.html`
- **Server**: `~/Documents/Claude/server.js`
- **Markdown Export**: `~/Documents/Claude/status_dashboard.md` (auto-created)
- **Config**: `~/Documents/Claude/package.json`

## Troubleshooting

### Tabs Not Clickable / Export Buttons Not Working

**Problem**: You opened the file with `file://` protocol instead of serving it.

**Solution**: Always use `npm start` and access via `http://localhost:3000`

### Data Not Saving to Markdown

**Problem**: Server might not be running.

**Solution**: 
- Ensure `npm start` is running in a terminal
- Check that Express server is listening on port 3000
- Data will still be saved locally in browser storage

### Lost Previous Data

**Problem**: Opened in different browser or private window.

**Solution**:
- If you exported as JSON before, use "Import JSON" button to restore
- Check `status_dashboard.md` for previous data
- Keep browser session open or use same browser

## Development

The server provides two API endpoints:

```
POST /api/save       - Save state to markdown
GET  /api/load       - Load state from markdown
```

These are called automatically by the dashboard.
