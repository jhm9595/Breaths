const ws = new WebSocket('ws://[::1]:9222/devtools/page/B9FBF4A35ECB2FF29C67CDD0CEC265A3');

ws.onopen = () => {
  const code = `(() => {
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.src).filter(Boolean);
    return scripts;
  })()`;

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: code, returnByValue: true }
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log(data.result?.result?.value);
  ws.close();
};
