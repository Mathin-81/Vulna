const fs = require('fs-extra');
const path = require('path');
const { analyzeCodeWithAI } = require('./aiService');

/**
 * Recursively scans the directory, reads text-based files, and calls AI analyzer.
 */
async function scanDirectory(directoryPath) {
    let scannedFilesCount = 0;
    let allVulnerabilities = [];

    const walk = async (dir) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                await walk(filePath);
            } else {
                try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const relativePath = path.relative(directoryPath, filePath);

                    console.log(`Analyzing ${relativePath}...`);
                    const vulns = await analyzeCodeWithAI(relativePath, content);

                    if (Array.isArray(vulns)) {
                        allVulnerabilities.push(...vulns);
                    } else if (vulns && typeof vulns === 'object') {
                        allVulnerabilities.push(vulns);
                    }

                    scannedFilesCount++;
                } catch (err) {
                    console.error(`Skipping binary or error file: ${filePath}`);
                }
            }
        }
    };

    await walk(directoryPath);

    return {
        total_files: scannedFilesCount,
        vulnerabilities: allVulnerabilities
    };
}

module.exports = { scanDirectory };
