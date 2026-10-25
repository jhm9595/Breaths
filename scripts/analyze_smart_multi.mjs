import fs from 'fs';

const src = fs.readFileSync('smart_multi_component.js', 'utf8');

// 모든 헤딩과 단계명 추출
const headings = Array.from(src.matchAll(/["']([0-9]\s*\|\s*[^"']+|발행[^"']+|설정[^"']+|대시보드[^"']+|에디터[^"']+)["']/g)).map(m => m[1]);
console.log('Headings & Steps:');
console.log(Array.from(new Set(headings)));

// API 엔드포인트 추출
const apis = Array.from(src.matchAll(/fetch\s*\(\s*[`"']([^`"'$]+)/g)).map(m => m[1]);
console.log('\nAPIs used:');
console.log(Array.from(new Set(apis)));
