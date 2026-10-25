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
    const parentComponents = [];
    while (curr) {
      if (typeof curr.type === 'function') {
        parentComponents.push({
          name: curr.type.displayName || curr.type.name || 'Anonymous',
          props: Object.keys(curr.memoizedProps || {}),
          // hooks state
        });
      }
      curr = curr.return;
    }

    return { parentComponents: parentComponents.slice(0, 10) };
  })()`;

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: code, returnByValue: true }
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log(JSON.stringify(data.result.result.value, null, 2));
  ws.close();
};
