const ws = new WebSocket('ws://[::1]:9222/devtools/page/B3BC4F24435C0D33BA21F5E0B83C83D8');

ws.onopen = () => {
  const code = `(() => {
    function getReactFiber(el) {
      const key = Object.keys(el).find(k => k.startsWith('__reactFiber'));
      return key ? el[key] : null;
    }

    // 첫 번째 글쓰기 버튼 찾기
    const buttons = Array.from(document.querySelectorAll('button'));
    const writeBtn = buttons.find(b => b.innerText.trim() === '글쓰기');
    const dlBtn = buttons.find(b => b.innerText.includes('데이터랩'));

    let writeHandler = null;
    if (writeBtn) {
      const fiber = getReactFiber(writeBtn);
      writeHandler = fiber?.memoizedProps?.onClick?.toString();
    }

    return {
      writeHandler,
      location: window.location.href
    };
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
