import fs from 'fs';

const src = fs.readFileSync('write_component_B.js', 'utf8');

// fetch 호출 URL 추출
const fetches = Array.from(src.matchAll(/fetch\s*\(\s*[`"']([^`"'$]+)/g)).map(m => m[1]);
console.log('API Endpoints (unique):');
console.log(Array.from(new Set(fetches)));

// 상태 변수 및 주요 키워드 검색
const keywords = [
  'coupang', 'toss', 'generate', 'thread', 'publish', 'persona', 'account', 'media', 'upload', 'smart'
];
console.log('\nKeyword occurrences:');
keywords.forEach(kw => {
  const count = (src.match(new RegExp(kw, 'gi')) || []).length;
  console.log(`${kw}: ${count}`);
});
