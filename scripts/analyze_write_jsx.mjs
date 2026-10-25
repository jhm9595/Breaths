import fs from 'fs';

const src = fs.readFileSync('write_component_B.js', 'utf8');

// 모든 한국어 문자열 추출
const koreanStrings = Array.from(src.matchAll(/["']([가-힣\s\d~!?@#$%^&*()_+=\-[\]{}|;:,.<>\/]{2,40})["']/g)).map(m => m[1].trim());
const uniqueKorean = Array.from(new Set(koreanStrings));

console.log('Total unique Korean UI strings:', uniqueKorean.length);
console.log('Sample UI strings:');
console.log(uniqueKorean.filter(s => s.length > 3).slice(0, 50).join('\n'));
