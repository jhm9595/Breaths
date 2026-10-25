const ws = new WebSocket('ws://[::1]:9222/devtools/page/1BCDE7893A838AA079EC44554F519B15');

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
