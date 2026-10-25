import fs from 'fs';

const data = JSON.parse(fs.readFileSync('smart_multi_inspection.json', 'utf8'));
const res = data.normalized_result;

console.log('Title:', res.target.title);
console.log('URL:', res.target.url);

if (res.accessibility?.nodes) {
  const nodes = res.accessibility.nodes.filter(n => n.name && n.name.trim().length > 0);
  const uniqueTexts = Array.from(new Set(nodes.map(n => n.role + ': ' + n.name.trim())));
  console.log('Unique accessibility elements (' + uniqueTexts.length + '):');
  console.log(uniqueTexts.slice(0, 100).join('\n'));
}
