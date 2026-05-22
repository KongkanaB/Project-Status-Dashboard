require('dotenv').config({ path: '.env.local' });

const express = require('express');
const path = require('path');
const { kv } = require('@vercel/kv');

const app = express();
const PORT = process.env.PORT || 3000;
const KV_KEY = 'dashboard:data';

app.use(express.json());
app.use(express.static(__dirname));

// Seed data migrated from status_dashboard.md
const SEED_DATA = {
  "meta": {
    "period": "Week of 18/05/2026",
    "author": "Kongkana Bayan",
    "distribution": "Sanjoy, Dibya, Gyan, Champak",
    "issued": "",
    "execSummary": "All 2 projects are tracking well (Green/Blue). No critical blockers or pending decisions.",
    "sprintStart": "2026-05-18",
    "sprintEnd": "2026-05-29"
  },
  "projects": [
    {
      "id": "yyxahx39",
      "name": "Self Nomination Enhancement - Backend",
      "owner": "Sanjoy Debnath",
      "milestone": "In development",
      "rag": "Green",
      "pct": 75,
      "notes": "",
      "jiraTicket": "https://vantagecirclejira.atlassian.net/browse/VC-16072"
    },
    {
      "id": "tknftvrz",
      "name": "Self Nomination Enhancement - Frontend",
      "owner": "Dibya Choudhury",
      "milestone": "In development",
      "rag": "Red",
      "pct": 50,
      "notes": "",
      "jiraTicket": "https://vantagecirclejira.atlassian.net/browse/VC-16098"
    }
  ],
  "completed": [],
  "upcoming": [
    {
      "id": "hrkbofih",
      "priority": "P1 - High",
      "project": "MBRDI - Approval App API Integration",
      "milestone": "Not started",
      "task": "API Integration",
      "owner": "Gyanangkush Borgohain",
      "target": "2026-06-30",
      "dependencies": "Commercial to be finalised by PX Team and Client",
      "status": "Not started"
    },
    {
      "id": "ohh8vugk",
      "priority": "P1 - High",
      "project": "Amdocs SYB Customisation",
      "milestone": "Not started",
      "task": "SYB Customisation",
      "owner": "Champak Barman",
      "target": "2026-06-09",
      "dependencies": "Pending information not shared by Nitika",
      "status": "Not started"
    }
  ],
  "blockers": [],
  "milestones": [
    {
      "id": "nim10ryp",
      "project": "Self Nomination Enhancement - Backend",
      "milestone": "In development",
      "stage": "In Review",
      "owner": "Sanjoy Debnath",
      "start": "2026-05-18",
      "target": "2026-05-22",
      "actual": "",
      "status": "On track",
      "notes": ""
    },
    {
      "id": "accjasue",
      "project": "Self Nomination Enhancement - Frontend",
      "milestone": "In development",
      "stage": "In Dev",
      "owner": "Dibya Choudhury",
      "start": "2026-05-19",
      "target": "2026-05-20",
      "actual": "",
      "status": "Delayed",
      "notes": ""
    }
  ],
  "decisions": [
    {
      "id": "hb6jxz4v",
      "project": "MBRDI - Approval App API Integration",
      "decision": "The objective of this integration is to enable approvers from the Mercedes-Benz system to securely view and take action on external award approvals app through API-based communication with Vantage Circle.",
      "owner": "Anjan Pathak",
      "needed": "2026-05-15",
      "status": "Decided"
    }
  ],
  "archive": []
};

async function load() {
  const data = await kv.get(KV_KEY);
  if (!data) {
    await kv.set(KV_KEY, SEED_DATA);
    console.log('✓ Seeded Vercel KV with existing dashboard data');
    return SEED_DATA;
  }
  return data;
}

async function save(data) {
  await kv.set(KV_KEY, data);
  console.log('✓ Data saved to Vercel KV');
}

app.post('/api/save', async (req, res) => {
  try {
    await save(req.body);
    res.json({ success: true });
  } catch (e) {
    console.error('Error saving to KV:', e.message);
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/api/load', async (req, res) => {
  try {
    const data = await load();
    res.json(data || {});
  } catch (e) {
    console.error('Error loading from KV:', e.message);
    res.status(500).json({});
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n📊 Status Dashboard running at http://localhost:${PORT}`);
    console.log(`✓ Storage: Vercel KV (key: ${KV_KEY})\n`);
  });
}
