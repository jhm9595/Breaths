import { execSync } from 'child_process';
import fs from 'fs';

try {
  const out = execSync('npx -y rea-agents@latest inspect-web-page http://[::1]:9222 1BCDE7893A838AA079EC44554F519B15 --include-accessibility-text --include-console-text --format json', { maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('smart_multi_inspection.json', out);
  console.log('Saved smart_multi_inspection.json, size:', out.length);
} catch (e) {
  console.error('REA Error:', e.message);
}
