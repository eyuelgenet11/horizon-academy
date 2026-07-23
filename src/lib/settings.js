import fs from 'fs';
import path from 'path';

const settingsPath = path.join(process.cwd(), 'settings.json');

export function getSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    }
  } catch (e) {
    console.error('Error reading settings.json:', e);
  }
  
  // Default settings
  return {
    chapaStatus: 'INACTIVE', // INACTIVE, UNDER_REVIEW, ACTIVE
    mode: 'SANDBOX', // SANDBOX, LIVE
    businessLicense: null, // metadata about uploaded license
    proofOfAddress: null, // metadata about uploaded proof of address
  };
}

export function saveSettings(settings) {
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing settings.json:', e);
    return false;
  }
}
