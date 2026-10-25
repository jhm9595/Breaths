import fs from 'fs';

const ws = new WebSocket('ws://[::1]:9222/devtools/page/B9FBF4A35ECB2FF29C67CDD0CEC265A3');

ws.onopen = () => {
  const code = `(() => {
    function findFiber(el) {
      if (!el) return null;
      const key = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      return key ? el[key] : null;
    }

    let fiber = findFiber(document.querySelector('h1, h2, h3, button, main, div'));
    while (fiber) {
      if (typeof fiber.type === 'function' && fiber.type.name === 'B') {
        return fiber.type.toString();
      }
      fiber = fiber.return;
    }
    return null;
  })()`;

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: code, returnByValue: true }
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  const src = data.result?.result?.value;
  fs.writeFileSync('write_component_B.js', src || '');
  console.log('Saved write_component_B.js, size:', (src || '').length);
  ws.close();
};
