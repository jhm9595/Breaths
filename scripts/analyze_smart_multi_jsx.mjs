import fs from 'fs';

const src = fs.readFileSync('smart_multi_component.js', 'utf8');

// JSX에서 텍스트 노드 추출
const textMatches = Array.from(src.matchAll(/children:\s*["']([^"']{2,50})["']/g)).map(m => m[1]);
console.log('JSX Text children (sample):');
console.log(Array.from(new Set(textMatches)).slice(0, 80).join('\n'));
