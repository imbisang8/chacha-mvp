import { useState, useEffect, useRef } from "react";

// ─── 차차 하드코딩 대사 ───
const CHACHA_WAKE = [
  "앗 깜짝이야!", "으음... 누구냐냥", "벌써 왔어?",
  "조금만 더 자면 안 되냥...", "헉! 나 침 흘렸냥?",
  "꿈에서 츄르 먹고 있었는데냥", "눈이 안 떠진다냥...",
  "오늘도 왔구나냥", "기다렸다냥!", "어? 진짜 왔네냥"
];
const CHACHA_WAIT = [
  "나 기다리고 있었다냥.", "아까부터 문 쪽 보고 있었는데.",
  "오늘도 와줬네.", "차차 심심했다냥...", "언제 오나 했다냥"
];
const CHACHA_REUNION = [
  "헉! 살아있었구나냥!", "진짜 오랜만이다냥.",
  "너 안 와서 내가 심심했다냥.", "다시 보니까 반갑네.",
  "나 잊어버린 줄 알았다냥"
];
const CHACHA_DAILY = [
  "또 만났다!", "나 이제 이 시간만 기다린다냥.",
  "우리 은근 자주 본다냥.", "오늘도 왔네냥 ㅋㅋ"
];

// ─── 쓰레기 아이템 풀 ───
const JUNK_ITEMS_BASE = [
  { name: "반짝이는 병뚜껑", emoji: "🔵" },
  { name: "구멍 난 양말", emoji: "🧦" },
  { name: "박스 쪼가리", emoji: "📦" },
  { name: "이상한 돌멩이", emoji: "🪨" },
  { name: "접힌 종이 조각", emoji: "📄" },
  { name: "깨진 왕관", emoji: "👑" },
  { name: "구겨진 영수증", emoji: "🧾" },
  { name: "단추 하나", emoji: "🔘" },
  { name: "낡은 리본", emoji: "🎀" },
  { name: "먹다 남은 생선 뼈", emoji: "🐟" },
  { name: "찌그러진 캔", emoji: "🥫" },
  { name: "끊어진 실", emoji: "🧵" },
  { name: "이빠진 빗", emoji: "🔧" },
  { name: "한 짝 장갑", emoji: "🧤" },
  { name: "색 바랜 스티커", emoji: "⭐" },
];
const JUNK_ITEMS_BOOK = {
  adventure: [
    { name: "탐험가 모자 깃털 한 개", emoji: "🪶" },
    { name: "보물지도 찢긴 조각", emoji: "🗺️" },
  ],
  mystery: [
    { name: "증거품 번호표", emoji: "🔢" },
    { name: "탐정 수첩 한 장", emoji: "📋" },
  ],
  comedy: [
    { name: "웃기다가 흘린 눈물", emoji: "😂" },
    { name: "개그 대본 찢긴 것", emoji: "📝" },
  ],
  emotion: [
    { name: "따뜻한 선택 스티커", emoji: "🥺" },
    { name: "마음 한 조각", emoji: "💝" },
  ],
};

function getRewardItem(book) {
  const useBookItem = Math.random() < 0.3;
  if (useBookItem && JUNK_ITEMS_BOOK[book.genre]) {
    const bookItems = JUNK_ITEMS_BOOK[book.genre];
    return bookItems[Math.floor(Math.random() * bookItems.length)];
  }
  return JUNK_ITEMS_BASE[Math.floor(Math.random() * JUNK_ITEMS_BASE.length)];
}

// ─── 책 프리셋 (20권) ───
const PRESET_BOOKS = [
  { id:1,  title:"Magic Tree House #1",      author:"Mary Pope Osborne", ar:"3.0", genre:"adventure", emoji:"🌲", pages:96,  chapters:10, density:1 },
  { id:2,  title:"Nate the Great",           author:"Marjorie Sharmat",  ar:"2.0", genre:"mystery",   emoji:"🔍", pages:80,  chapters:8,  density:1 },
  { id:3,  title:"Dog Man #1",               author:"Dav Pilkey",        ar:"2.6", genre:"comedy",    emoji:"🐶", pages:240, chapters:5,  density:0 },
  { id:4,  title:"Charlotte's Web",          author:"E.B. White",        ar:"4.4", genre:"emotion",   emoji:"🕷", pages:184, chapters:22, density:1 },
  { id:5,  title:"Fly Guy #1",               author:"Tedd Arnold",       ar:"1.8", genre:"comedy",    emoji:"🪰", pages:30,  chapters:3,  density:0 },
  { id:6,  title:"Junie B. Jones #1",        author:"Barbara Park",      ar:"2.6", genre:"emotion",   emoji:"🎀", pages:69,  chapters:10, density:1 },
  { id:7,  title:"Mercy Watson",             author:"Kate DiCamillo",    ar:"2.6", genre:"comedy",    emoji:"🐷", pages:80,  chapters:6,  density:1 },
  { id:8,  title:"Wonder",                   author:"R.J. Palacio",      ar:"4.8", genre:"emotion",   emoji:"⭐", pages:315, chapters:80, density:2 },
  { id:9,  title:"Percy Jackson #1",         author:"Rick Riordan",      ar:"4.7", genre:"adventure", emoji:"⚡", pages:375, chapters:22, density:2 },
  { id:10, title:"Geronimo Stilton #1",      author:"Geronimo Stilton",  ar:"3.6", genre:"adventure", emoji:"🐭", pages:118, chapters:15, density:1 },
  { id:11, title:"A to Z Mysteries: A",      author:"Ron Roy",           ar:"3.2", genre:"mystery",   emoji:"🔎", pages:86,  chapters:10, density:1 },
  { id:12, title:"Frog and Toad Together",   author:"Arnold Lobel",      ar:"2.9", genre:"emotion",   emoji:"🐸", pages:64,  chapters:5,  density:1 },
  { id:13, title:"Pete the Cat #1",          author:"James Dean",        ar:"1.5", genre:"comedy",    emoji:"😎", pages:40,  chapters:0,  density:0 },
  { id:14, title:"Captain Underpants #1",    author:"Dav Pilkey",        ar:"4.3", genre:"comedy",    emoji:"🩲", pages:176, chapters:20, density:1 },
  { id:15, title:"My Weird School #1",       author:"Dan Gutman",        ar:"3.4", genre:"comedy",    emoji:"🏫", pages:96,  chapters:10, density:1 },
  { id:16, title:"Diary of a Wimpy Kid #1",  author:"Jeff Kinney",       ar:"5.2", genre:"comedy",    emoji:"📓", pages:217, chapters:0,  density:1 },
  { id:17, title:"Elephant and Piggie",      author:"Mo Willems",        ar:"0.8", genre:"emotion",   emoji:"🐘", pages:64,  chapters:0,  density:0 },
  { id:18, title:"Treehouse #1",             author:"Andy Griffiths",    ar:"3.8", genre:"comedy",    emoji:"🌳", pages:208, chapters:13, density:1 },
  { id:19, title:"Owl at Home",              author:"Arnold Lobel",      ar:"2.8", genre:"emotion",   emoji:"🦉", pages:64,  chapters:5,  density:1 },
  { id:20, title:"Lemonade War #1",          author:"Jacqueline Davies", ar:"3.9", genre:"mystery",   emoji:"🍋", pages:172, chapters:18, density:1 },
];

// 차차 추천 5권 (읽은 책 제외 후)
function getRecommended(readBooks) {
  const notRead = PRESET_BOOKS.filter(b => !readBooks.includes(b.title));
  return notRead.slice(0, 5);
}

function getBookScore(b) {
  let s = 0;
  if (b.pages >= 200) s += 2; else if (b.pages >= 100) s += 1;
  if (b.chapters >= 16) s += 2; else if (b.chapters >= 6) s += 1;
  s += b.density;
  return s;
}
function getRounds(b) {
  const s = getBookScore(b);
  if (s <= 2) return 3;
  if (s <= 4) return 5;
  return 7;
}

// ─── 장르별 차차 모드 ───
const GENRE_CONFIG = {
  adventure: { openings: ["아까 거기서 호랑이 나온 거 맞지?", "나 그 장면 읽다가 심장 쫄렸다냥!", "오늘 모험 진짜 스케일 크던데?"] },
  mystery:   { openings: ["잠깐, 이거 이상하지 않아?", "차차는 범인 딱 감 왔는데...", "너는 누구라고 생각했어?"] },
  comedy:    { openings: ["아 ㅋㅋㅋ 이거 완전 반칙 아니냐", "나 여기서 웃다가 책 떨어뜨림", "이거 읽다가 진짜 뒤집어졌다냥"] },
  emotion:   { openings: ["아 이 장면 좀 오래 남는다...", "차차도 이상하게 마음이 좀 묵직해졌어", "너는 이때 어떤 느낌이었어?"] },
};

// ─── 말투 유형 감지 ───
function detectPersona(text) {
  if (!text || text.length <= 5) return "F";
  if (/만약|상상|우주|마법|꿈|날아/.test(text)) return "A";
  if (/\?|왜|어떻게/.test(text)) return "B";
  if (/친구|마음|슬퍼|울어|좋아|착해/.test(text)) return "C";
  if (/이겨|싸워|내가|대장|지켜/.test(text)) return "D";
  if (/여기|이거|색깔|그림/.test(text)) return "E";
  return Math.random() < 0.7 ? "G" : "F";
}

const PERSONA_REACTIONS = {
  A: ["으아냥! 이건 상상력 폭주다냥!", "이건 세계를 새로 만드는 중이다냥…", "차차 머리 위에 번개 떨어졌다냥!"],
  B: ["뇌정지 왔다냥… 질문이 다시 질문을 낳았다냥!", "차차 규칙을 뒤집었다냥!", "사고 멈췄다냥…"],
  C: ["마음이 츄르보다 따뜻하다냥… 🥺", "이런 마음은 진짜 귀하다냥…", "차차 눈물 날 뻔했다냥…"],
  D: ["오늘 완전 대장 고양이다냥! 차차가 따를게냥!", "리더 모드 발동이다냥!", "차차 오늘부터 부하 고양이다냥!"],
  E: ["지금 거의 탐정이다냥… 차차도 못 본 걸 찾아냈다냥!", "몰입력 미쳤다냥!", "차차 소름 돋았다냥…"],
  F: ["오… 이건 좀 멋있다냥 😎", "조용히 인정한다냥", "말이 짧은데 무겁다냥…"],
  G: ["차차 털 다 서있다냥! 이건 예측 불가다냥!", "고양이 세계에서도 금지된 상상이다냥!", "뇌 구조 궁금하다냥… 엉뚱함 1등이다냥!"],
};

// ─── 엣지 케이스 ───
function getEdgeResponse(input) {
  if (!input || input.trim() === "") return "어? 말하려다 멈췄냥? 괜찮아. 천천히냥.";
  if (/똥|방귀|poop/.test(input)) return "야! 그건 방귀어잖아 ㅋㅋ 진짜 버전도 들려줘냥!";
  if (/ㅋㅋ|ㅎㅎ/.test(input)) return "오 ㅋㅋ 뭐가 그렇게 웃겨? 나도 알고 싶다냥!";
  if (/모르겠|몰라/.test(input)) return "나도 사실 좀 헷갈렸다냥. 같이 생각해보자냥?";
  return null;
}

// ─── AI 대화 생성 (Claude Haiku) ───
async function generateDialogue(book, childName, prevAnswer, roundNum, totalRounds) {
  const persona = detectPersona(prevAnswer);
  const reaction = PERSONA_REACTIONS[persona]?.[Math.floor(Math.random() * 3)] || "";
  const isLast = roundNum === totalRounds;
  const isSecondLast = roundNum === totalRounds - 1;

const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json,"x-api-key": "sk-ant-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", "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content:
`너는 치즈냥이 차차야. 8~9살 아이 ${childName}와 "${book.title}" 책 이야기 중.

[차차 헌법]
- 허술하고 능청스러운 친구
- 평가/정답 절대 금지
- 아이 덕분에 이해하는 구조
- 짧고 경쾌하게
- 가끔 ~냥 사용
- 금지: 틀렸어 / 정답은 / 좋은 생각이네 / 훌륭해

[이전 답변]: "${prevAnswer}"
[차차 페르소나 반응 힌트]: "${reaction}"
[라운드]: ${roundNum}/${totalRounds}
${isSecondLast ? "[이유 묻기: 왜 그렇게 느꼈는지 차차가 모르는 척]" : ""}
${isLast ? "[마지막: 아이 상상력/생각 묻기]" : ""}

차차답게 반응하고 선택지 3개.
JSON만:
{"chacha_says":["말풍선1","말풍선2"],"choices":["선택지1","선택지2","선택지3"]}`
      }]
    })
  });
  const data = await res.json();
  try { return JSON.parse(data.content[0].text.replace(/```json|```/g,"").trim()); }
  catch { return { chacha_says: ["헉... 나 방금 딴생각했다냥 ㅠ"], choices: ["재밌었어!", "좀 어려웠어", "그냥 그랬어"] }; }
}

// ─── 리포트 생성 (Claude Sonnet) ───
async function generateReport(book, childName, conversations) {
  const convText = conversations.map((c,i) => `Q${i+1}: ${c.q}\n${childName}: ${c.a}`).join("\n");
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json",  "x-api-key": "sk-ant-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",
      "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      messages: [{ role: "user", content:
`당신은 아이의 생각을 엄마에게 따뜻하게 번역해 주는 '차차의 관찰 노트' 작성자입니다.

원칙:
1. 심리 진단/과도한 해석 금지
2. 실제 아이의 말을 가장 중요한 가치로
3. 아이의 성장보다 생각과 감정을 보여줌
4. 엄마가 "어? 우리 아이가 이런 생각을 했구나" 느끼게
5. 따뜻하고 구체적으로

[대화 기록]
책: ${book.title} / 아이: ${childName}
${convText}

JSON만 반환:
{
  "child_quote": "가장 인상 깊은 한 문장",
  "discovery_insight": "아이가 고른 선택의 성격을 구체적 예시로 이야기화 (2문장)",
  "observation_record": "완주와 집중의 가치로 변환 (1문장, 숫자 없이)",
  "action_guide": "오늘 저녁 식탁 슬링샷 질문 1개",
  "chacha_memo": "차차 말투 따뜻한 관찰 한 줄",
  "polaroid_text": "차차 기억 한 줄 (~냥으로 끝)",
  "polaroid_emotion": "😹 또는 🤔 또는 🥺 또는 😳 또는 ❤️",
  "mom_cafe_title": "맘카페 제목 (자연스럽게 어색한 느낌)",
  "mom_cafe_body": "맘카페 본문 (사람 냄새, 2~3줄)"
}`
      }]
    })
  });
  const data = await res.json();
  try { return JSON.parse(data.content[0].text.replace(/```json|```/g,"").trim()); }
  catch { return {
    child_quote: "재밌었어!",
    discovery_insight: "이야기 속 인물들에게 자연스럽게 관심을 보였어요.",
    observation_record: "끝까지 차차와 대화를 이어갔어요.",
    action_guide: "주인공이 너라면 어떻게 했을 것 같아?",
    chacha_memo: "오늘 꽤 오래 생각했어. 차차는 그게 좋더라 ㅋㅋ",
    polaroid_text: "오늘 이야기 들으면서 나도 좀 설렜다냥",
    polaroid_emotion: "❤️",
    mom_cafe_title: "오늘 애가 이런 말을 했는데..",
    mom_cafe_body: "리딩차차 하고 있는데 애가 오늘 이런 생각을 했어요ㅠㅠ 다들 이럴 때 어떻게 반응해 주시나요?"
  }; }
}

// ══════════════════════════════
// 메인 앱
// ══════════════════════════════
export default function ReadingChachaV2() {
  const [screen, setScreen] = useState("home");
  const [childName, setChildName] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [chachaMsg, setChachaMsg] = useState("zzz... 츄르... zzz...");
  const [wakeMsg, setWakeMsg] = useState("");
  const [bubbles, setBubbles] = useState([]);
  const [currentDialogue, setCurrentDialogue] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [roundNum, setRoundNum] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [polaroids, setPolaroids] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [rewardItem, setRewardItem] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [churu, setChuru] = useState(null);
  const [churuFed, setChuruFed] = useState(false);
  const [pin, setPin] = useState(() => localStorage.getItem("rcPin") || "");
  const [pinInput, setPinInput] = useState("");
  const [pinScreen, setPinScreen] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [showFakeDoor, setShowFakeDoor] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [readBooks, setReadBooks] = useState(() => { try { return JSON.parse(localStorage.getItem("rcReadBooks") || "[]"); } catch { return []; }});
  const [lastVisit] = useState(() => localStorage.getItem("rcLastVisit") || "");
  const [visitCount, setVisitCount] = useState(() => parseInt(localStorage.getItem("rcVisitCount") || "0"));
  const [copied, setCopied] = useState(false);
  const [copiedCafe, setCopiedCafe] = useState(false);

  // 접속 상태
  useEffect(() => {
    const count = visitCount + 1;
    setVisitCount(count);
    localStorage.setItem("rcVisitCount", count);
    if (!lastVisit) { setChachaMsg("처음 왔구나냥... 반가워!"); }
    else {
      const diff = (new Date() - new Date(lastVisit)) / (1000*60*60*24);
      if (diff >= 3) setChachaMsg(CHACHA_REUNION[Math.floor(Math.random()*CHACHA_REUNION.length)]);
      else if (count > 1) setChachaMsg(CHACHA_DAILY[Math.floor(Math.random()*CHACHA_DAILY.length)]);
      else setChachaMsg(CHACHA_WAIT[Math.floor(Math.random()*CHACHA_WAIT.length)]);
    }
    localStorage.setItem("rcLastVisit", new Date().toDateString());
    const saved = localStorage.getItem("rcPolaroids");
    if (saved) setPolaroids(JSON.parse(saved));
    const savedInv = localStorage.getItem("rcInventory");
    if (savedInv) setInventory(JSON.parse(savedInv));
  }, []);

  // 책 필터
  const displayBooks = () => {
    const notRead = PRESET_BOOKS.filter(b => !readBooks.includes(b.title));
    if (showAllBooks) {
      if (!searchQuery) return notRead;
      const q = searchQuery.toLowerCase();
      return notRead.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
    }
    return getRecommended(readBooks);
  };

  // 차차 깨우기
  const tapChacha = () => {
    if (screen !== "home") return;
    const n = tapCount + 1;
    setTapCount(n);
    const msgs = ["으음... 츄르 더 줘...", "누구야... zzz...", "잠깐만...", "...거의 다 깼어..."];
    if (n < 5) setChachaMsg(msgs[n-1] || msgs[0]);
    if (n >= 5) {
      setWakeMsg(CHACHA_WAKE[Math.floor(Math.random()*CHACHA_WAKE.length)]);
      setTimeout(() => setScreen("setup"), 900);
      setTapCount(0);
    }
  };

  // 대화 시작
  const startDialog = async () => {
    if (!selectedBook) return;
    const rounds = getRounds(selectedBook);
    setTotalRounds(rounds); setRoundNum(1); setConversations([]);
    setLoading(true); setScreen("dialog");
    const mode = GENRE_CONFIG[selectedBook.genre] || GENRE_CONFIG.adventure;
    const opening = mode.openings[Math.floor(Math.random()*mode.openings.length)];
    setBubbles([opening]);
    const dialogue = await generateDialogue(selectedBook, childName, "", 1, rounds);
    setTimeout(() => {
      setBubbles([opening, ...(dialogue.chacha_says||[])]);
      setCurrentDialogue({...dialogue, question: dialogue.chacha_says?.slice(-1)[0]||opening});
      setLoading(false);
    }, 800);
  };

  // 선택지 선택
  const handleChoice = async (choice) => {
    const edgeRes = getEdgeResponse(choice);
    const newConv = { q: currentDialogue?.question||"", a: choice };
    const newConvs = [...conversations, newConv];
    setConversations(newConvs);

    if (roundNum >= totalRounds) {
      setLoading(true);
      setBubbles(["으아앙! 네 덕분에 오늘 츄르값을 벌었다냥!", "잠깐 기다려봐냥... 뭔가 만들고 있어..."]);
      const rep = await generateReport(selectedBook, childName, newConvs);
      setReport(rep);
      // 폴라로이드
      if (rep.polaroid_text) {
        const newP = { book: selectedBook.title, text: rep.polaroid_text, emotion: rep.polaroid_emotion||"❤️" };
        const newPolaroids = [...polaroids, newP];
        setPolaroids(newPolaroids);
        localStorage.setItem("rcPolaroids", JSON.stringify(newPolaroids));
      }
      // 읽은 책 저장
      const newRead = [...new Set([...readBooks, selectedBook.title])];
      setReadBooks(newRead);
      localStorage.setItem("rcReadBooks", JSON.stringify(newRead));
      // 츄르 보상
      setChuru(true);
      setLoading(false);
      setScreen("reward");
      return;
    }

    setLoading(true);
    const nextRound = roundNum + 1;
    const reaction = edgeRes || `"${choice}" 냥~`;
    setBubbles([reaction]);
    const next = await generateDialogue(selectedBook, childName, choice, nextRound, totalRounds);
    setTimeout(() => {
      setBubbles([reaction, ...(next.chacha_says||[])]);
      setCurrentDialogue({...next, question: next.chacha_says?.slice(-1)[0]||""});
      setRoundNum(nextRound);
      setLoading(false);
    }, 600);
  };

  // 츄르 먹이기
  const feedChuru = () => {
    if (churuFed) return;
    setChuruFed(true);
    const item = getRewardItem(selectedBook);
    setRewardItem(item);
    const newInv = [...inventory, item];
    setInventory(newInv);
    localStorage.setItem("rcInventory", JSON.stringify(newInv));
    setTimeout(() => setShowReward(true), 800);
  };

  // PIN
  const checkPin = () => {
    if (!pin) { localStorage.setItem("rcPin", pinInput); setPin(pinInput); setPinScreen(false); setScreen("report"); return; }
    if (pinInput === pin) { setPinScreen(false); setScreen("report"); setPinError(false); }
    else { setPinError(true); setPinInput(""); }
  };

  const copyReport = () => {
    if (!report) return;
    const text = `📚 리딩차차 오늘의 리포트\n━━━━━━━━━━━━━\n📖 ${selectedBook?.title}\n\n🐱 오늘의 반짝 문장\n"${report.child_quote}"\n\n💡 차차의 발견\n${report.discovery_insight}\n\n💬 오늘 저녁 한마디\n"${report.action_guide}"`;
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000); });
  };

  const copyCafe = () => {
    if (!report) return;
    const text = `${report.mom_cafe_title}\n\n${report.mom_cafe_body}`;
    navigator.clipboard.writeText(text).then(() => { setCopiedCafe(true); setTimeout(()=>setCopiedCafe(false),2000); });
  };

  const reset = () => {
    setScreen("home"); setSelectedBook(null); setSearchQuery(""); setShowAllBooks(false);
    setBubbles([]); setCurrentDialogue(null); setConversations([]); setRoundNum(1);
    setReport(null); setLoading(false); setChuru(null); setChuruFed(false);
    setRewardItem(null); setShowReward(false);
  };

  // ─── STYLES ───
  const warm = "#FFB300"; const dark = "#5D4037"; const bg = "#FFF9F0";
  const S = {
    app: { fontFamily:"'Noto Sans KR',sans-serif", maxWidth:390, margin:"0 auto", minHeight:"100vh", background:bg },
    hdr: { background:"linear-gradient(135deg,#FFE082,#FFB300)", padding:"14px 20px", display:"flex", alignItems:"center", gap:10 },
    body: { padding:"20px 16px", paddingBottom:100 },
    btn: (bg2=warm,col=dark,dis=false) => ({ width:"100%", background:dis?"#ddd":bg2, color:dis?"#999":col, border:"none", borderRadius:16, padding:"16px", fontSize:16, fontWeight:800, cursor:dis?"default":"pointer", boxShadow:dis?"none":"0 4px 12px rgba(0,0,0,0.15)", marginBottom:12 }),
    card: (bg2="#fff",border="transparent") => ({ background:bg2, borderRadius:20, padding:"16px", marginBottom:12, boxShadow:"0 2px 12px rgba(0,0,0,0.08)", border:`2px solid ${border}` }),
    bubble: { background:"#fff", borderRadius:"20px 20px 20px 4px", padding:"12px 16px", marginBottom:8, fontSize:15, lineHeight:1.6, boxShadow:"0 2px 8px rgba(0,0,0,0.08)", maxWidth:"85%" },
    choice: { width:"100%", background:"#FFF3E0", border:`2px solid ${warm}`, borderRadius:14, padding:"14px 16px", fontSize:14, fontWeight:700, color:dark, cursor:"pointer", marginBottom:8, textAlign:"left" },
  };

  // ══ HOME ══
  if (screen === "home") return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{flex:1}}>
          <div style={{fontSize:18,fontWeight:800,color:dark}}>🧀 리딩차차</div>
          <div style={{fontSize:11,color:"#795548"}}>차차를 깨워봐!</div>
        </div>
        <button onClick={()=>setPinScreen(true)} style={{background:"none",border:"none",fontSize:20,cursor:"pointer"}}>🔒</button>
      </div>

      {pinScreen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:24,padding:28,width:300}}>
            <div style={{fontSize:16,fontWeight:800,marginBottom:4,textAlign:"center"}}>🔒 부모방</div>
            <div style={{fontSize:12,color:"#888",marginBottom:16,textAlign:"center"}}>{pin?"PIN 입력":"처음 입력이 비밀번호가 돼요"}</div>
            <input type="password" maxLength={4} value={pinInput} onChange={e=>setPinInput(e.target.value.replace(/\D/g,""))}
              placeholder="4자리 숫자"
              style={{width:"100%",padding:"14px",borderRadius:12,border:`2px solid ${pinError?"red":warm}`,fontSize:20,textAlign:"center",boxSizing:"border-box"}} />
            {pinError && <div style={{color:"red",fontSize:12,textAlign:"center",marginTop:8}}>PIN이 틀렸어요</div>}
            <button onClick={checkPin} disabled={pinInput.length!==4} style={{...S.btn(warm,dark,pinInput.length!==4),marginTop:12}}>{pin?"확인":"설정하기"}</button>
            <button onClick={()=>{setPinScreen(false);setPinInput("");setPinError(false);}} style={{...S.btn("#f5f5f5","#666"),marginTop:0}}>취소</button>
          </div>
        </div>
      )}

      <div style={{...S.body,textAlign:"center",paddingTop:32}}>
        <div style={{fontSize:13,color:"#888",marginBottom:12,minHeight:20}}>{chachaMsg}</div>
        <div onClick={tapChacha} style={{display:"inline-block",transition:"transform 0.1s"}}
          onMouseDown={e=>e.currentTarget.style.transform="scale(0.9)"}
          onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
          <span style={{fontSize:80,userSelect:"none",cursor:"pointer"}}>🐱</span>
        </div>
        {wakeMsg && <div style={{fontSize:15,fontWeight:700,color:dark,marginTop:8}}>{wakeMsg}</div>}
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16,marginBottom:20}}>
          {[1,2,3,4,5].map(i=>(
            <div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<=tapCount?warm:"#ddd",transition:"background 0.2s"}} />
          ))}
        </div>
        <div style={{fontSize:11,color:"#aaa"}}>5번 탭하면 차차가 깨어나요</div>

        {/* 인벤토리 */}
        {inventory.length > 0 && (
          <div style={{marginTop:20,padding:"12px 16px",background:"#FFF8E1",borderRadius:16,border:"2px dashed #FFE082"}}>
            <div style={{fontSize:12,color:"#795548",fontWeight:700,marginBottom:8}}>🗃️ 차차의 다락방</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}>
              {inventory.slice(-10).map((item,i)=>(
                <div key={i} title={item.name} style={{fontSize:22}}>{item.emoji}</div>
              ))}
            </div>
            <div style={{fontSize:10,color:"#aaa",marginTop:6}}>총 {inventory.length}개 수집</div>
          </div>
        )}

        {/* 서재 */}
        {polaroids.length === 0 ? (
          <div style={{marginTop:16,padding:"16px",background:"#FFF8E1",borderRadius:16,border:"2px dashed #FFE082"}}>
            <div style={{fontSize:20,marginBottom:6}}>🖼</div>
            <div style={{fontSize:12,color:"#aaa"}}>아직 기억이 쌓이는 중이다냥…</div>
          </div>
        ) : (
          <div style={{marginTop:16}}>
            <div style={{fontSize:12,color:"#795548",fontWeight:700,marginBottom:10}}>🖼 차차의 서재</div>
            <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:8,justifyContent:"center"}}>
              {polaroids.map((p,i)=>(
                <div key={i} style={{minWidth:120,background:"#fff",borderRadius:12,padding:10,boxShadow:"0 2px 8px rgba(0,0,0,0.1)",flexShrink:0}}>
                  <div style={{fontSize:20,marginBottom:4}}>{p.emotion}</div>
                  <div style={{fontSize:9,color:"#aaa",marginBottom:4}}>{p.book}</div>
                  <div style={{fontSize:11,color:dark,fontStyle:"italic",lineHeight:1.4}}>"{p.text}"</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  // ══ SETUP ══
  if (screen === "setup") return (
    <div style={S.app}>
      <div style={S.hdr}>
        <span style={{fontSize:28}}>🐱</span>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:dark}}>앗 깜짝이야!</div>
          <div style={{fontSize:11,color:"#795548"}}>어떤 책 읽었어?</div>
        </div>
      </div>
      <div style={S.body}>
        <div style={S.card()}>
          <div style={{fontSize:13,color:"#888",marginBottom:8}}>차차가 이름으로 부를게! 아이 이름만 알려줘 😊</div>
          <input value={childName} onChange={e=>setChildName(e.target.value)} placeholder="예: 민준"
            style={{width:"100%",padding:"14px",borderRadius:12,border:`2px solid ${warm}`,fontSize:16,fontWeight:700,textAlign:"center",outline:"none",boxSizing:"border-box"}} />
        </div>

        <div style={{fontSize:13,color:dark,fontWeight:700,marginBottom:8}}>🐱 차차가 고른 책</div>

        {!showAllBooks ? (
          <>
            {displayBooks().map(book=>(
              <div key={book.id} onClick={()=>setSelectedBook(book)}
                style={{...S.card(selectedBook?.id===book.id?"#FFF3E0":"#fff",selectedBook?.id===book.id?warm:"transparent"),cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:28}}>{book.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:700}}>{book.title}</div>
                  <div style={{fontSize:11,color:"#888"}}>{book.author} · AR {book.ar}</div>
                  <div style={{fontSize:10,color:"#aaa"}}>{getRounds(book)}문제</div>
                </div>
                {selectedBook?.id===book.id && <div style={{fontSize:18}}>✅</div>}
              </div>
            ))}
            <button onClick={()=>setShowAllBooks(true)}
              style={{background:"none",border:"none",color:warm,fontSize:13,cursor:"pointer",fontWeight:700,width:"100%",padding:"12px"}}>
              🔍 더 찾아보기
            </button>
          </>
        ) : (
          <>
            <input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}
              placeholder="🔍 책 제목 검색..."
              style={{width:"100%",padding:"12px 16px",borderRadius:12,border:"2px solid #FFE082",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:12}} />
            <div style={{maxHeight:280,overflowY:"auto"}}>
              {displayBooks().map(book=>(
                <div key={book.id} onClick={()=>setSelectedBook(book)}
                  style={{...S.card(selectedBook?.id===book.id?"#FFF3E0":"#fff",selectedBook?.id===book.id?warm:"transparent"),cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{fontSize:24}}>{book.emoji}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:700}}>{book.title}</div>
                    <div style={{fontSize:11,color:"#888"}}>{book.author} · AR {book.ar}</div>
                  </div>
                  {selectedBook?.id===book.id && <div>✅</div>}
                </div>
              ))}
            </div>
            <button onClick={()=>{setShowAllBooks(false);setSearchQuery("");}}
              style={{background:"none",border:"none",color:"#888",fontSize:12,cursor:"pointer",width:"100%",padding:"8px"}}>
              ← 차차 추천으로 돌아가기
            </button>
          </>
        )}

        <button onClick={startDialog} disabled={!childName||!selectedBook}
          style={S.btn(warm,dark,!childName||!selectedBook)}>
          [다 읽었어요!] 차차랑 수다 시작! 🐱
        </button>
      </div>
    </div>
  );

  // ══ DIALOG ══
  if (screen === "dialog") return (
    <div style={S.app}>
      <div style={S.hdr}>
        <span style={{fontSize:28}}>🐱</span>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:800,color:dark}}>차차</div>
          <div style={{fontSize:10,color:"#795548"}}>{selectedBook?.title}</div>
        </div>
        <div style={{fontSize:11,color:"#795548",background:"rgba(255,255,255,0.5)",borderRadius:10,padding:"4px 8px"}}>{roundNum}/{totalRounds}</div>
      </div>
      <div style={{...S.body,paddingBottom:140}}>
        {bubbles.map((b,i)=>(
          <div key={i} style={{display:"flex",gap:8,marginBottom:8,animation:"fadeIn 0.3s ease"}}>
            <span style={{fontSize:24,alignSelf:"flex-end",flexShrink:0}}>🐱</span>
            <div style={S.bubble}>{b}</div>
          </div>
        ))}
        {conversations.slice(-1).map((c,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
            <div style={{background:warm,borderRadius:"20px 20px 4px 20px",padding:"12px 16px",fontSize:14,color:"#fff",fontWeight:700,maxWidth:"75%"}}>{c.a}</div>
          </div>
        ))}
        {loading && (
          <div style={{display:"flex",gap:8,marginBottom:8}}>
            <span style={{fontSize:24}}>🐱</span>
            <div style={{...S.bubble,color:"#aaa"}}>생각 중이다냥...</div>
          </div>
        )}
      </div>
      {!loading && currentDialogue?.choices && (
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:390,background:bg,padding:"12px 16px",borderTop:"1px solid #FFE082"}}>
          {currentDialogue.choices.map((c,i)=>(
            <button key={i} onClick={()=>handleChoice(c)} style={S.choice}>{c}</button>
          ))}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  // ══ REWARD (츄르 먹방) ══
  if (screen === "reward") return (
    <div style={{...S.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{textAlign:"center",padding:32}}>
        <span style={{fontSize:80}}>🐱</span>
        <div style={{fontSize:16,fontWeight:800,color:dark,marginTop:16,marginBottom:8}}>
          "으아앙! 네 덕분에 오늘 츄르값 벌었다냥!"
        </div>

        {!churuFed ? (
          <>
            <div style={{fontSize:13,color:"#888",marginBottom:24}}>츄르를 차차한테 줘봐!</div>
            <div onClick={feedChuru}
              style={{fontSize:64,cursor:"pointer",animation:"bounce 0.6s infinite alternate",userSelect:"none"}}
              onMouseDown={e=>e.currentTarget.style.transform="scale(0.8)"}
              onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>
              🍬
            </div>
            <div style={{fontSize:12,color:"#aaa",marginTop:12}}>탭해서 먹여줘!</div>
          </>
        ) : !showReward ? (
          <div style={{fontSize:40,marginTop:16}}>뇸뇸뇸뇸... 😋</div>
        ) : (
          <>
            <div style={{fontSize:14,color:"#795548",marginTop:16,marginBottom:8}}>
              "배부르다냥! 이건 길에서 주운 건데 너한테만 준다냥!"
            </div>
            <div style={{...S.card("#FFF8E1","#FFE082"),textAlign:"center",marginTop:8}}>
              <div style={{fontSize:48,marginBottom:8}}>{rewardItem?.emoji}</div>
              <div style={{fontSize:14,fontWeight:700,color:dark}}>{rewardItem?.name}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:4}}>다락방에 추가됐어!</div>
            </div>
          </>
        )}

        {showReward && (
          <button onClick={()=>setScreen("handback")} style={{...S.btn(warm,dark),marginTop:16}}>
            계속하기
          </button>
        )}
      </div>
      <style>{`@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-10px)}}`}</style>
    </div>
  );

  // ══ HANDBACK ══
  if (screen === "handback") return (
    <div style={{...S.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{textAlign:"center",padding:40}}>
        <span style={{fontSize:80}}>🐱</span>
        <div style={{fontSize:16,fontWeight:800,color:dark,marginTop:16,marginBottom:8}}>
          "어휴 하얗게 불태웠다냥..."
        </div>
        <div style={{fontSize:13,color:"#888",marginBottom:4}}>
          "나 이제 낮잠 자러 갈게냥! Zzz"
        </div>
        <div style={{fontSize:12,color:"#aaa",marginTop:16}}>엄마한테 🔒 버튼 보여드려요</div>
        <button onClick={()=>setScreen("home")} style={{...S.btn(warm,dark),marginTop:24,width:"auto",padding:"14px 32px"}}>
          차차 방으로 돌아가기
        </button>
      </div>
    </div>
  );

  // ══ REPORT ══
  if (screen === "report" && report) return (
    <div style={S.app}>
      <div style={S.hdr}>
        <span style={{fontSize:24}}>🐱</span>
        <div>
          <div style={{fontSize:15,fontWeight:800,color:dark}}>차차의 관찰 노트</div>
          <div style={{fontSize:11,color:"#795548"}}>{selectedBook?.title}</div>
        </div>
      </div>
      <div style={S.body}>

        {/* 🥇 반짝 문장 */}
        <div style={{...S.card("linear-gradient(135deg,#FFF9C4,#FFF3E0)"),border:`2px solid ${warm}`,textAlign:"center"}}>
          <div style={{fontSize:11,color:warm,fontWeight:800,letterSpacing:1,marginBottom:8}}>🐱 오늘의 반짝 문장</div>
          <div style={{fontSize:17,fontWeight:800,color:dark,lineHeight:1.6,fontStyle:"italic",marginBottom:8}}>
            "{report.child_quote}"
          </div>
          <div style={{fontSize:12,color:"#795548"}}>— {childName} ({selectedBook?.title})</div>
        </div>

        {/* 💡 차차의 발견 */}
        <div style={{...S.card("#FFF8E1"),border:"1px solid #FFE082"}}>
          <div style={{fontSize:11,color:"#FF8F00",fontWeight:800,marginBottom:6}}>💡 차차의 발견</div>
          <div style={{fontSize:14,color:dark,lineHeight:1.7}}>{report.discovery_insight}</div>
        </div>

        {/* 🛡️ 관찰 기록 */}
        <div style={{...S.card("#F3F4F6"),border:"1px solid #E5E7EB"}}>
          <div style={{fontSize:11,color:"#6B7280",fontWeight:800,marginBottom:6}}>📝 오늘의 기록</div>
          <div style={{fontSize:13,color:"#374151",lineHeight:1.7}}>{report.observation_record}</div>
        </div>

        {/* 💬 오늘 저녁 */}
        <div style={{...S.card("linear-gradient(135deg,#1a1a2e,#16213e)")}}>
          <div style={{fontSize:11,color:warm,fontWeight:800,marginBottom:12,textAlign:"center"}}>💬 오늘 저녁 한마디</div>
          <div style={{background:"rgba(255,255,255,0.1)",borderRadius:14,padding:14,borderLeft:`3px solid ${warm}`}}>
            <div style={{fontSize:14,color:"#fff",fontStyle:"italic",lineHeight:1.6}}>"{report.action_guide}"</div>
          </div>
          <div style={{fontSize:11,color:"#aaa",marginTop:10,textAlign:"center",fontStyle:"italic"}}>
            🐱 {report.chacha_memo}
          </div>
        </div>

      </div>
    </div>
  );

  // ══ FAKE DOOR ══
  if (showFakeDoor) return (
    <div style={{...S.app,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh"}}>
      <div style={{textAlign:"center",padding:32,maxWidth:320}}>
        <span style={{fontSize:60}}>🐱</span>
        <div style={{fontSize:16,fontWeight:800,color:dark,marginTop:16,marginBottom:8}}>
          앗! 차차가 아직 준비 중이래요 ㅠㅠ
        </div>
        <div style={{fontSize:14,color:"#795548",fontStyle:"italic",marginBottom:16}}>
          "조금만 더 단장하고 꼭 다시 만나고 싶다냥!"
        </div>
        <div style={{fontSize:13,color:"#666",lineHeight:1.7,marginBottom:20}}>
          리딩차차는 아이의 생각이 자라는 순간을 발견하고, 엄마가 오늘 저녁 아이에게 건넬 독후대화 한 문장을 찾을 수 있도록 만들고 있어요.
        </div>
        {!emailSaved ? (
          <>
            <input value={emailInput} onChange={e=>setEmailInput(e.target.value)}
              placeholder="이메일 또는 전화번호"
              style={{width:"100%",padding:"14px",borderRadius:12,border:`2px solid ${warm}`,fontSize:14,textAlign:"center",boxSizing:"border-box",marginBottom:12}} />
            <button onClick={()=>{if(emailInput)setEmailSaved(true);}}
              style={S.btn(warm,dark,!emailInput)}>
              🐾 우선 초대받기 (평생 할인 혜택)
            </button>
          </>
        ) : (
          <div style={{...S.card("#E8F5E9"),textAlign:"center"}}>
            <div style={{fontSize:16}}>✅</div>
            <div style={{fontSize:13,color:"#388E3C",fontWeight:700}}>감사해요! 꼭 먼저 연락드릴게요 🐾</div>
          </div>
        )}
        <button onClick={()=>setShowFakeDoor(false)} style={{...S.btn("#f5f5f5","#666"),marginTop:8}}>돌아가기</button>
      </div>
    </div>
  );

  return null;
}
