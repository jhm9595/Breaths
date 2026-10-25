const ws = new WebSocket('ws://[::1]:9222/devtools/page/B3BC4F24435C0D33BA21F5E0B83C83D8');

ws.onopen = () => {
  const code = `(async () => {
    async function safeFetch(url) {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        return null;
      }
    }

    const datalab = await safeFetch('/api/trends/datalab');
    const realtime = await safeFetch('/api/trends/realtime');
    const google = await safeFetch('/api/trends/google');
    const categories = await safeFetch('/api/trends/shopping/categories?type=ISSUE');
    const keywords = await safeFetch('/api/trends/shopping/keywords?type=ISSUE&category1=' + encodeURIComponent('패션의류'));
    
    return {
      datalab: datalab?.datalab || [],
      realtime: realtime || {},
      google: google?.google || [],
      categories: categories?.categories || [],
      shoppingKeywords: keywords?.keywords || []
    };
  })()`;

  ws.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: { expression: code, awaitPromise: true, returnByValue: true }
  }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  const val = data.result.result.value;
  import('fs').then(fs => {
    fs.writeFileSync('breaths-app/seed_data.json', JSON.stringify(val, null, 2));
    console.log('Saved breaths-app/seed_data.json successfully!');
    ws.close();
  });
};
