import fs from 'fs';

const ws = new WebSocket('ws://[::1]:9222/devtools/page/B3BC4F24435C0D33BA21F5E0B83C83D8');

ws.onopen = () => {
  const code = `(() => {
    function getReactFiber(el) {
      const key = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      return key ? el[key] : null;
    }

    const buttons = Array.from(document.querySelectorAll('button'));
    const writeBtn = buttons.find(b => b.innerText.trim() === '글쓰기');

    let curr = getReactFiber(writeBtn);
    while (curr) {
      if (typeof curr.type === 'function' && curr.type.name === 'u') {
        return curr.type.toString();
      }
      curr = curr.return;
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
  const src = data.result.result.value;
  fs.writeFileSync('page_component_u.js', src || '');
  console.log('Saved page_component_u.js, size:', (src || '').length);
  ws.close();
};
