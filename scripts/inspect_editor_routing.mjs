const ws = new WebSocket('ws://[::1]:9222/devtools/page/B3BC4F24435C0D33BA21F5E0B83C83D8');

ws.onopen = () => {
  const code = `(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    
    // 스마트 멀티에디터, 스마트 에디터 작성, 멀티 에디터 작성 버튼
    const editorBtns = buttons.filter(b => b.innerText.includes('에디터') || b.innerText.includes('글쓰기') || b.innerText.includes('아카이브') || b.innerText.includes('보관함') || b.innerText.includes('페르소나'));

    const btnInfo = editorBtns.map(b => {
      // 부모 a 태그 확인
      const parentA = b.closest('a');
      return {
        text: b.innerText.replace(/\\n/g, ' '),
        parentHref: parentA ? parentA.href : null,
        onclick: b.onclick ? b.onclick.toString() : null,
        dataset: Object.assign({}, b.dataset)
      };
    });

    return btnInfo;
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
