const ws = new WebSocket('ws://[::1]:9222/devtools/page/B3BC4F24435C0D33BA21F5E0B83C83D8');

ws.onopen = () => {
  const code = `(() => {
    function getReactProps(el) {
      const key = Object.keys(el).find(k => k.startsWith('__reactProps'));
      return key ? el[key] : null;
    }

    const buttons = Array.from(document.querySelectorAll('button'));
    const targets = ['스마트 멀티에디터', '스마트 에디터 작성', '멀티 에디터 작성', 'DREATHS 아카이브', '벤치마킹 보관함', '글쓰기', '데이터랩', '구글 트렌드', '쇼핑 트렌드', '실시간 뉴스'];

    const results = [];
    for (const b of buttons) {
      const text = b.innerText.replace(/\\s+/g, ' ').trim();
      for (const t of targets) {
        if (text.includes(t)) {
          const props = getReactProps(b);
          results.push({
            text,
            targetMatch: t,
            hasOnClick: !!(props && props.onClick),
            onClickString: props && props.onClick ? props.onClick.toString() : null
          });
          break;
        }
      }
    }
    return results;
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
