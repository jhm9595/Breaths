const ws = new WebSocket('ws://[::1]:9222/devtools/page/B9FBF4A35ECB2FF29C67CDD0CEC265A3');

ws.onopen = () => {
  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      expression: 'document.title + " | " + window.location.href'
    }
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log('Location:', data.result?.result?.value);
  ws.close();
};

ws.onerror = (e) => console.error('WS Error:', e);
