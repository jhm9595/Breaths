import fs from 'fs';

const ws = new WebSocket('ws://[::1]:9222/devtools/page/1BCDE7893A838AA079EC44554F519B15');

ws.onopen = () => {
  const code = `(() => {
    function findFiber(el) {
      if (!el) return null;
      const key = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      return key ? el[key] : null;
    }

    let fiber = findFiber(document.querySelector('h1, h2, h3, main, form, div'));
    const components = [];
    while (fiber) {
      if (typeof fiber.type === 'function') {
        const name = fiber.type.name || fiber.type.displayName || 'Anon';
        components.push({
          name,
          src: fiber.type.toString()
        });
      }
      fiber = fiber.return;
    }
    return components;
  })()`;

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: code, returnByValue: true }
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  const comps = data.result?.result?.value || [];
  console.log('Found components:', comps.map(c => c.name));
  
  // 첫 번째 주요 컴포넌트 저장
  if (comps.length > 0) {
    fs.writeFileSync('smart_multi_component.js', comps[0].src);
    console.log('Saved smart_multi_component.js, size:', comps[0].src.length);
  }
  ws.close();
};
