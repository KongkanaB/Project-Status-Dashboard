const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

const MARKDOWN_FILE = path.join(__dirname, 'status_dashboard.md');

// Load data from markdown
function loadFromMarkdown() {
  if (!fs.existsSync(MARKDOWN_FILE)) {
    return null;
  }
  try {
    const content = fs.readFileSync(MARKDOWN_FILE, 'utf8');
    const match = content.match(/```json\n([\s\S]*?)\n```/);
    if (match) {
      return JSON.parse(match[1]);
    }
  } catch (e) {
    console.error('Error loading markdown:', e.message);
  }
  return null;
}

// Helper to format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

// Save data to markdown
function saveToMarkdown(data) {
  try {
    const timestamp = new Date().toISOString();
    let markdown = `# Weekly Project Status Dashboard\n\n`;
    markdown += `**Last Updated:** ${timestamp}\n\n`;

    if (data.meta) {
      markdown += `## Metadata\n\n`;
      markdown += `- **Reporting Period:** ${data.meta.period || 'N/A'}\n`;
      markdown += `- **Prepared By:** ${data.meta.author || 'N/A'}\n`;
      markdown += `- **Sprint Start Date:** ${formatDate(data.meta.sprintStart)}\n`;
      markdown += `- **Sprint End Date:** ${formatDate(data.meta.sprintEnd)}\n\n`;

      if (data.meta.execSummary) {
        markdown += `## Executive Summary\n\n${data.meta.execSummary}\n\n`;
      }
    }

    if (data.projects && data.projects.length > 0) {
      markdown += `## Projects\n\n`;
      markdown += `| Project | Owner | Phase | RAG | % | JIRA Ticket | Notes |\n`;
      markdown += `|---------|-------|-------|-----|---|-------------|-------|\n`;
      data.projects.forEach(p => {
        markdown += `| ${p.name || ''} | ${p.owner || ''} | ${p.milestone || ''} | ${p.rag || ''} | ${p.pct || 0}% | ${p.jiraTicket || ''} | ${p.notes || ''} |\n`;
      });
      markdown += `\n`;
    }

    if (data.completed && data.completed.length > 0) {
      markdown += `## Completed This Week\n\n`;
      markdown += `| Project | Milestone | Task | Owner | Date | Outcome |\n`;
      markdown += `|---------|-----------|------|-------|------|----------|\n`;
      data.completed.forEach(x => {
        markdown += `| ${x.project || ''} | ${x.milestone || ''} | ${x.task || ''} | ${x.owner || ''} | ${x.date || ''} | ${x.outcome || ''} |\n`;
      });
      markdown += `\n`;
    }

    if (data.upcoming && data.upcoming.length > 0) {
      markdown += `## Upcoming Priorities\n\n`;
      markdown += `| Priority | Project | Milestone | Task | Owner | Target | Dependencies | Status |\n`;
      markdown += `|----------|---------|-----------|------|-------|--------|---------------|---------|\n`;
      data.upcoming.forEach(x => {
        markdown += `| ${x.priority || ''} | ${x.project || ''} | ${x.milestone || ''} | ${x.task || ''} | ${x.owner || ''} | ${x.target || ''} | ${x.dependencies || ''} | ${x.status || ''} |\n`;
      });
      markdown += `\n`;
    }

    if (data.blockers && data.blockers.length > 0) {
      markdown += `## Active Blockers & Risks\n\n`;
      markdown += `| Project | Milestone | Description | Severity | Owner | Ask | Target |\n`;
      markdown += `|---------|-----------|-------------|----------|-------|-----|--------|\n`;
      data.blockers.forEach(x => {
        const desc = (x.description || '').replace(/\|/g, '\\|');
        const ask = (x.ask || '').replace(/\|/g, '\\|');
        markdown += `| ${x.project || ''} | ${x.milestone || ''} | ${desc} | ${x.severity || ''} | ${x.owner || ''} | ${ask} | ${x.target || ''} |\n`;
      });
      markdown += `\n`;
    }

    if (data.milestones && data.milestones.length > 0) {
      markdown += `## Milestones\n\n`;
      markdown += `| Project | Milestone | Stage | Owner | Start | Target | Status | Notes |\n`;
      markdown += `|---------|-----------|-------|-------|-------|--------|--------|-------|\n`;
      data.milestones.forEach(x => {
        markdown += `| ${x.project || ''} | ${x.milestone || ''} | ${x.stage || ''} | ${x.owner || ''} | ${x.start || ''} | ${x.target || ''} | ${x.status || ''} | ${x.notes || ''} |\n`;
      });
      markdown += `\n`;
    }

    if (data.decisions && data.decisions.length > 0) {
      markdown += `## Decisions Needed\n\n`;
      markdown += `| Project | Decision | Owner | Needed By | Status |\n`;
      markdown += `|---------|----------|-------|-----------|--------|\n`;
      data.decisions.forEach(x => {
        const decision = (x.decision || '').replace(/\|/g, '\\|');
        markdown += `| ${x.project || ''} | ${decision} | ${x.owner || ''} | ${x.needed || ''} | ${x.status || ''} |\n`;
      });
      markdown += `\n`;
    }

    markdown += `\n## Raw Data\n\n`;
    markdown += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n`;

    fs.writeFileSync(MARKDOWN_FILE, markdown, 'utf8');
    console.log(`✓ Data saved to ${MARKDOWN_FILE}`);
  } catch (e) {
    console.error('Error saving markdown:', e.message);
  }
}

// API endpoint to save data
app.post('/api/save', (req, res) => {
  saveToMarkdown(req.body);
  res.json({ success: true });
});

// API endpoint to load data
app.get('/api/load', (req, res) => {
  const data = loadFromMarkdown();
  res.json(data || {});
});

app.listen(PORT, () => {
  console.log(`\n📊 Status Dashboard Server running at http://localhost:${PORT}\n`);
  console.log(`✓ Open your browser to: http://localhost:${PORT}/status_dashboard.html`);
  console.log(`✓ Data will auto-save to: ${MARKDOWN_FILE}\n`);
});
