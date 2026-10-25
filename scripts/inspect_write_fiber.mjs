const ws = new WebSocket('ws://[::1]:9222/devtools/page/B9FBF4A35ECB2FF29C67CDD0CEC265A3');

ws.onopen = () => {
  const code = `(() => {
    // React Fiber 루트 찾기
    const rootEl = document.querySelector('#__next') || document.body.firstElementChild;
    function findFiber(el) {
      if (!el) return null;
      const key = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      return key ? el[key] : null;
    }

    let fiber = findFiber(document.querySelector('h1, h2, h3, button, main, div'));
    const components = [];
    while (fiber) {
      if (typeof fiber.type === 'function') {
        components.push({
          name: fiber.type.name || fiber.type.displayName || 'Anon',
          src: fiber.type.toString().slice(0, 300)
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
  console.log(JSON.stringify(data.result?.result?.value, null, 2));
  ws.close();
};
