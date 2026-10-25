import { execSync } from 'child_process';
import fs from 'fs';

try {
  const out = execSync('npx -y rea-agents@latest inspect-web-page http://[::1]:9222 B9FBF4A35ECB2FF29C67CDD0CEC265A3 --include-accessibility-text --include-console-text --format json', { maxBuffer: 50 * 1024 * 1024 });
  fs.writeFileSync('write_page_inspection.json', out);
  console.log('Saved write_page_inspection.json, size:', out.length);
} catch (e) {
  console.error('REA Error:', e.message);
}
