import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3800;
const SEED_FILE = path.join(__dirname, 'seed_data.json');

let seedData = {
  datalab: [],
  realtime: { keywords: [], news: [], cached_at: new Date().toISOString() },
  google: [],
  categories: [],
  shoppingKeywords: []
};

if (fs.existsSync(SEED_FILE)) {
  try {
    seedData = JSON.parse(fs.readFileSync(SEED_FILE, 'utf8'));
  } catch (err) {
    console.error('Failed to parse seed_data.json:', err);
  }
}

// 벤치마킹 보관함
const BENCHMARK_FILE = path.join(__dirname, 'benchmarks.json');
let benchmarks = [];
if (fs.existsSync(BENCHMARK_FILE)) {
  try {
    benchmarks = JSON.parse(fs.readFileSync(BENCHMARK_FILE, 'utf8'));
  } catch (e) {
    benchmarks = [];
  }
}

function saveBenchmarks() {
  fs.writeFileSync(BENCHMARK_FILE, JSON.stringify(benchmarks, null, 2), 'utf8');
}

// 임시 저장된 스레드 초안
const DRAFTS_FILE = path.join(__dirname, 'drafts.json');
let drafts = [];
if (fs.existsSync(DRAFTS_FILE)) {
  try {
    drafts = JSON.parse(fs.readFileSync(DRAFTS_FILE, 'utf8'));
  } catch (e) {
    drafts = [];
  }
}

// 예약 및 발행 완료된 글
const PUBLISHED_FILE = path.join(__dirname, 'published.json');
let published = [];
if (fs.existsSync(PUBLISHED_FILE)) {
  try {
    published = JSON.parse(fs.readFileSync(PUBLISHED_FILE, 'utf8'));
  } catch (e) {
    published = [];
  }
}

// 기본 페르소나 목록
const mockPersonas = [
  { id: 'p_1', name: '트렌드 얼리어답터', tone: '친근하고 빠른 정보 전달, 이모지 다수 활용', hookStyle: '🔥 지금 가장 핫한' },
  { id: 'p_2', name: '냉철한 분석가', tone: '데이터와 팩트 중심, 차분하고 전문적인 문체', hookStyle: '📌 3분 만에 요약하는 핵심' },
  { id: 'p_3', name: '수익화 큐레이터', tone: '실질적인 가성비와 구매 꿀팁, 진정성 있는 후기형', hookStyle: '💡 품절되기 전에 꼭 봐야 할' }
];

// 기본 계정 목록
const mockAccounts = [
  { id: 'acc_1', username: 'breaths_official', name: 'Breaths Official (메인)', isConnected: true },
  { id: 'acc_2', username: 'trend_daily_kr', name: '트렌드 데일리', isConnected: true }
];

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;

  // CORS 헤더
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- 기존 API ---
  if (pathname === '/api/trends/datalab' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ datalab: seedData.datalab }));
    return;
  }

  if (pathname === '/api/trends/realtime' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(seedData.realtime));
    return;
  }

  if (pathname === '/api/trends/google' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ google: seedData.google }));
    return;
  }

  if (pathname === '/api/trends/shopping/categories' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ categories: seedData.categories }));
    return;
  }

  if (pathname === '/api/trends/shopping/keywords' && req.method === 'GET') {
    const category1 = reqUrl.searchParams.get('category1') || '패션의류';
    const matched = seedData.datalab.find(d => d.categoryName === category1);
    let keywords = [];
    if (matched && matched.keywords) {
      keywords = matched.keywords.slice(0, 50).map(k => ({ keyword: k }));
    } else {
      keywords = seedData.shoppingKeywords;
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ keywords }));
    return;
  }

  if (pathname === '/api/threads-manage/search' && req.method === 'GET') {
    const q = reqUrl.searchParams.get('q') || '';
    const mockThreads = [
      {
        id: 'th_' + Math.random().toString(36).substring(2, 9),
        username: 'marketing_pro',
        timestamp: new Date().toISOString(),
        permalink: 'https://www.threads.net/@marketing_pro',
        text: `🔥 요즘 화제인 [${q}] 관련 최신 트렌드 분석!\n\n1. 대중들의 즉각적인 반응\n2. 트래픽 전환 및 바이럴 포인트\n3. Breaths 스마트 에디터로 작성한 타래 글 분석 🧵👇`,
        media_url: null,
        children: { data: [] }
      },
      {
        id: 'th_' + Math.random().toString(36).substring(2, 9),
        username: 'trend_curator',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        permalink: 'https://www.threads.net/@trend_curator',
        text: `오늘자 [${q}] 핵심 요약 정리합니다.\n지금 스레드 알고리즘에서 가장 빠르게 노출되고 있는 키워드입니다. 참고해서 타래 작성해보세요!`,
        media_url: null,
        children: { data: [] }
      }
    ];

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ results: mockThreads }));
    return;
  }

  if (pathname === '/api/reference/scrap' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const item = JSON.parse(body);
        item.id = 'scrap_' + Date.now();
        item.createdAt = new Date().toISOString();
        benchmarks.unshift(item);
        saveBenchmarks();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, item }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/reference/benchmarks' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ benchmarks }));
    return;
  }

  // --- 스마트 에디터 (/write) 관련 신규 API ---

  // 1. 페르소나 목록
  if (pathname === '/api/personas' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ personas: mockPersonas }));
    return;
  }

  // 2. 계정 목록
  if (pathname === '/api/keys/accounts' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ accounts: mockAccounts }));
    return;
  }

  // 3. AI 글 초벌 생성 엔드포인트
  if (pathname === '/api/ai/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { keyword, mode, personaId, source } = JSON.parse(body);
        const persona = mockPersonas.find(p => p.id === personaId) || mockPersonas[0];
        
        let thread1 = '', thread2 = '', thread3 = '';

        if (mode === 'coupang') {
          thread1 = `${persona.hookStyle} 요즘 품절 대란이라는 [${keyword || '인기 상품'}] 직접 써본 솔직 후기 공유합니다 📦✨\n\n다들 왜 이렇게 추천하나 했더니 실제로 써보니까 확실히 다르네요.`;
          thread2 = `가장 마음에 들었던 3가지 포인트:\n1. 독보적인 가성비와 퀄리티\n2. 실사용 편의성 (기대 이상!)\n3. 쿠팡 로켓배송으로 주문 다음 날 바로 도착\n\n비슷한 제품 고민 중이시라면 아래 정보 꼭 참고해보세요.`;
          thread3 = `자세한 최저가 할인 정보 및 구매 링크는 아래 댓글(타래)에 남겨둘게요! 👇\n\n(이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.)`;
        } else if (mode === 'toss') {
          thread1 = `${persona.hookStyle} 토스쇼핑 쉐어링크 특가로 뜬 [${keyword || '화제의 상품'}] 발견했습니다 🔵\n\n공동구매 할인율이 역대급이라 빠르게 공유드려요.`;
          thread2 = `토스 포인트 페이백까지 받으면 시중가 대비 거의 반값 수준이네요.\n주변 지인들한테도 이미 단톡방에 뿌렸습니다 ㅎㅎ`;
          thread3 = `특가 구매 좌표는 아래 타래 링크 확인해주세요! 조기 마감될 수 있습니다 👇`;
        } else if (mode === 'general') {
          thread1 = `[${keyword || '트렌드 인사이트'}] 지금 놓치면 안 되는 핵심 흐름 3가지 🧵👇\n\n최근 급변하는 트렌드 속에서 우리가 주목해야 할 인사이트를 정리했습니다.`;
          thread2 = `1. 시장의 변화: 대중의 소비 패턴이 기존과 완전히 다른 방향으로 이동 중입니다.\n2. 실전 적용점: 지금 바로 실행해볼 수 있는 구체적인 전략 2가지.\n\n단순 유행이 아닌 구조적인 변화로 보입니다.`;
          thread3 = `여러분은 어떻게 생각하시나요? 댓글로 의견 남겨주시면 소통하겠습니다! 💬\n도움이 되셨다면 재게시(Repost) 부탁드립니다 ✨`;
        } else {
          // realtime / 간편 모드
          thread1 = `요즘 [${keyword || '핫이슈'}] 얘기 진짜 많이 나오네요! 다들 어떻게 보시나요? 👀⚡\n\n${source ? source.slice(0, 100) + '...' : '오늘 실시간 검색어에도 계속 올라오고 있길래 가져와 봤습니다.'}`;
          thread2 = `개인적으로는 앞으로 이 흐름이 더 커질 것 같은데, 지켜볼 만한 포인트들이 꽤 있네요.\n\n다들 관심 있게 보고 계신가요?`;
          thread3 = `타래 팔로우해두시면 매일 가장 빠른 트렌드 요약을 받아보실 수 있습니다 🧵✨`;
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          success: true,
          threads: [
            { id: 1, content: thread1, media: [] },
            { id: 2, content: thread2, media: [] },
            { id: 3, content: thread3, media: [] }
          ]
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 4. 쿠팡 파트너스 상품 검색 모의 API
  if (pathname === '/api/coupang/search' && req.method === 'GET') {
    const kw = reqUrl.searchParams.get('keyword') || '패딩';
    const mockProducts = [
      {
        productId: 'cp_101',
        title: `[로켓배송] ${kw} 프리미엄 베스트 상품`,
        price: '39,800원',
        discount: '35%',
        rating: 4.8,
        reviews: 1420,
        imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=300&q=80',
        deeplink: 'https://link.coupang.com/a/breaths_sample_1'
      },
      {
        productId: 'cp_102',
        title: `${kw} 데일리 에센셜 특가 추천`,
        price: '24,500원',
        discount: '20%',
        rating: 4.6,
        reviews: 890,
        imageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=300&q=80',
        deeplink: 'https://link.coupang.com/a/breaths_sample_2'
      }
    ];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ products: mockProducts }));
    return;
  }

  // 5. 스레드 즉시 발행
  if (pathname === '/api/threads-manage/publish-single' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const item = {
          id: 'pub_' + Date.now(),
          type: 'INSTANT',
          threads: payload.threads,
          account: payload.account,
          publishedAt: new Date().toISOString()
        };
        published.unshift(item);
        fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(published, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: '스레드가 성공적으로 발행되었습니다!', item }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 6. 스레드 예약 발행
  if (pathname === '/api/threads/schedule' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const item = {
          id: 'sched_' + Date.now(),
          type: 'SCHEDULED',
          scheduledAt: payload.scheduledAt,
          threads: payload.threads,
          account: payload.account,
          createdAt: new Date().toISOString()
        };
        published.unshift(item);
        fs.writeFileSync(PUBLISHED_FILE, JSON.stringify(published, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: '스레드 예약이 등록되었습니다!', item }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 7. 초안 저장 및 조회
  if (pathname === '/api/threads/drafts' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        drafts.unshift({ id: 'draft_' + Date.now(), ...payload, updatedAt: new Date().toISOString() });
        fs.writeFileSync(DRAFTS_FILE, JSON.stringify(drafts, null, 2), 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // 정적 파일 서빙 (public 디렉토리)
  let fileName = pathname === '/' ? 'index.html' : pathname;
  if (fileName === '/write') fileName = '/write.html';
  if (fileName === '/smart-multi-write') fileName = '/smart-multi-write.html';
  if (fileName.startsWith('/')) fileName = fileName.slice(1);

  let filePath = path.join(__dirname, 'public', fileName);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'public', 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`[Breaths] Server is running at http://localhost:${PORT}`);
});
