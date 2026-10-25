const ws = new WebSocket('ws://[::1]:9222/devtools/page/1BCDE7893A838AA079EC44554F519B15');

ws.onopen = () => {
  const code = `(() => {
    // 모든 카드 / 섹션 구조 분석
    const sections = Array.from(document.querySelectorAll('section, main > div, div[class*="border"], div[class*="rounded"]')).filter(el => {
      const h = el.querySelector('h1, h2, h3, h4, h5');
      return h && h.innerText.trim();
    }).map(el => {
      const h = el.querySelector('h1, h2, h3, h4, h5');
      return {
        heading: h ? h.innerText.trim() : '',
        inputs: Array.from(el.querySelectorAll('input, select, textarea')).map(i => ({
          type: i.type,
          placeholder: i.placeholder,
          value: i.value
        })),
        buttons: Array.from(el.querySelectorAll('button')).map(b => b.innerText.trim().replace(/\\n/g, ' ')).filter(Boolean)
      };
    });

    return { sections: sections.slice(0, 15) };
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
