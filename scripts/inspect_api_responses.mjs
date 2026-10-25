const ws = new WebSocket('ws://[::1]:9222/devtools/page/B3BC4F24435C0D33BA21F5E0B83C83D8');

ws.onopen = () => {
  const code = `(async () => {
    async function safeFetch(url) {
      try {
        const res = await fetch(url);
        if (!res.ok) return { error: res.status + ' ' + res.statusText };
        return await res.json();
      } catch (e) {
        return { error: e.message };
      }
    }

    const datalab = await safeFetch('/api/trends/datalab');
    const realtime = await safeFetch('/api/trends/realtime');
    const google = await safeFetch('/api/trends/google');
    const categories = await safeFetch('/api/trends/shopping/categories?type=ISSUE');
    
    return {
      datalabSample: datalab?.datalab?.slice(0, 2),
      realtimeSample: {
        keywords: realtime?.keywords?.slice(0, 10),
        newsCount: realtime?.news?.length,
        newsSample: realtime?.news?.slice(0, 2),
        cached_at: realtime?.cached_at
      },
      googleSample: google?.google?.slice(0, 2),
      categoriesSample: categories
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
  console.log(JSON.stringify(data.result.result.value, null, 2));
  ws.close();
};
