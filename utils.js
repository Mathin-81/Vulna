const AdmZip = require('adm-zip');
const fs = require('fs-extra');
const path = require('path');

/**
 * Extracts a zip file to the specified directory.
 */
function extractZip(zipPath, extractTo) {
    try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractTo, true);
        return true;
    } catch (err) {
        console.error(`Error extracting zip: ${err.message}`);
        return false;
    }
}

/**
 * Deletes all files and folders inside a given directory.
 */
function clearDirectory(directoryPath) {
    if (fs.existsSync(directoryPath)) {
        fs.emptyDirSync(directoryPath);
    }
}

module.exports = { extractZip, clearDirectory };
