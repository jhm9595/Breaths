const ws = new WebSocket('ws://[::1]:9222/devtools/page/B3BC4F24435C0D33BA21F5E0B83C83D8');

ws.onopen = () => {
  const code = `(() => {
    // 탭 버튼 및 활성화 상태 확인
    const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
      text: b.innerText.trim(),
      className: b.className,
      disabled: b.disabled
    })).filter(b => b.text.length > 0 && b.text.length < 50);

    // 상위 카드 및 헤더 텍스트
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5')).map(h => h.innerText.trim());

    // 링크 확인
    const links = Array.from(document.querySelectorAll('a')).map(a => ({
      text: a.innerText.trim(),
      href: a.href
    })).filter(a => a.href);

    // 테이블 또는 리스트 아이템 구조 확인
    const tableItems = Array.from(document.querySelectorAll('tbody tr, div[role="row"], .grid, .flex')).slice(0, 10).map(el => el.innerText.trim().replace(/\\n+/g, ' | '));

    return { buttons: buttons.slice(0, 35), headings, links: links.slice(0, 30), sampleRows: tableItems.filter(t => t.includes('1 |') || t.includes('경량패딩')) };
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

ws.onerror = (e) => {
  console.error('WS Error:', e);
};
