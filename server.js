const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const { extractZip, clearDirectory } = require('./utils');
const { scanDirectory } = require('./scanner');
const { getAICount, getScanInsights, getCriticalOpsCount } = require('./aiService');

const app = express();
const PORT = 8000;

// CORS configuration for Cloudflare Tunnel
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'x-goog-api-key'],
    credentials: true
}));
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
fs.ensureDirSync(UPLOAD_DIR);

// Middleware to clear previous uploads before new one
const clearUploads = (req, res, next) => {
    try {
        clearDirectory(UPLOAD_DIR);
        next();
    } catch (err) {
        next(err);
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// In-memory data store
let scanResultsDB = {
    latest: { total_files: 0, vulnerabilities_found: 0, issues: [], ai_issue_count: 0, critical_ops_count: 0 },
    summary: {
        answers: ["Waiting for analysis...", "Waiting for analysis...", "Waiting for analysis..."],
        score: 0,
        recommendation: "Scan a project to see AI insights.",
        health_status: "Secure"
    },
    global_stats: { programs_assessed: 1248, zero_days_isolated: 89, patch_rate: 99.4 }
};

app.get('/', (req, res) => {
    res.json({ status: "ok", message: "Express AI Vulnerability Scanner is running." });
});

app.post('/upload-folder', clearUploads, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    const fileLocation = path.join(UPLOAD_DIR, req.file.filename);
    const extractPath = path.join(UPLOAD_DIR, `extracted_${uuidv4().substring(0, 8)}`);
    fs.ensureDirSync(extractPath);

    try {
        if (req.file.filename.endsWith('.zip')) {
            const success = extractZip(fileLocation, extractPath);
            if (!success) throw new Error("Failed to extract zip file.");
            fs.removeSync(fileLocation);
        } else {
            fs.moveSync(fileLocation, path.join(extractPath, req.file.filename));
        }
        res.json({ message: "File uploaded and processed successfully", extract_path: extractPath });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/scan', async (req, res) => {
    const extractedDirs = fs.readdirSync(UPLOAD_DIR)
        .map(d => path.join(UPLOAD_DIR, d))
        .filter(d => fs.statSync(d).isDirectory());

    if (extractedDirs.length === 0) {
        return res.status(400).json({ detail: "No source code found. Please upload first." });
    }

    const targetDir = extractedDirs[0];
    const scanOutput = await scanDirectory(targetDir);

    const severityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    const issues = scanOutput.vulnerabilities.map(v => {
        severityCounts[v.severity || "Medium"]++;
        return {
            file: v.file || "unknown",
            type: v.type || v.vulnerability || "Unknown Issue",
            severity: v.severity || "Medium",
            fix: v.fix || "No fix suggested by AI.",
            line: v.line || null,
            description: v.description || v.explanation || ""
        };
    });

    const result = {
        total_files: scanOutput.total_files,
        vulnerabilities_found: issues.length,
        issues: issues
    };

    try {
        console.log("[SCAN] Total issues found:", issues.length);

        const aiDirectCount = getAICount(issues);
        const aiCriticalCount = getCriticalOpsCount(issues);

        console.log("[SCAN] AI Direct Count:", aiDirectCount);
        console.log("[SCAN] AI Critical Count:", aiCriticalCount);

        result.ai_issue_count = aiDirectCount;
        result.critical_ops_count = aiCriticalCount;

        scanResultsDB.latest = result;

        const summaryData = await getScanInsights(issues.length, severityCounts);
        console.log("[SCAN] Summary Data:", summaryData);
        scanResultsDB.summary = summaryData;
    } catch (err) {
        console.error("Error generating insights:", err.message);
    }

    res.json(result);
});

app.get('/results', (req, res) => res.json(scanResultsDB.latest));
app.get('/summary', (req, res) => res.json(scanResultsDB.summary));
app.get('/ai-count', (req, res) => res.json({ total: scanResultsDB.latest.ai_issue_count || 0 }));
app.get('/critical-ops', (req, res) => res.json({ total: scanResultsDB.latest.critical_ops_count || 0 }));
app.get('/global-stats', (req, res) => res.json(scanResultsDB.global_stats));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express AI Scanner running on http://localhost:${PORT}`);
});
