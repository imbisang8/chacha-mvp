import { useState, useEffect } from "react";
import BOOKS from "./books.json";

// ─── 차차 오늘 한마디 시스템 ───
const DAILY_MSGS = {
  monday:    { morning: ["월요일이라 아직 눈이 반쯤 감겼다냥...", "주말이 어디로 사라졌는지 모르겠다냥...", "하품이 벌써 스물세 번째다냥..."], afternoon: ["오후가 되니까 좀 살 것 같다냥...", "점심 먹고 나니까 또 졸리다냥..."], evening: ["오늘 하루 어떻게 버텼는지 모르겠다냥...", "월요일 저녁은 특별히 더 피곤하다냥..."] },
  tuesday:   { morning: ["화요일... 아직 주중이 많이 남았다냥...", "월요일보다는 낫다냥. 조금."], afternoon: ["오후 햇살이 차차 눈을 자꾸 감기게 한다냥...", "오늘 오후는 좀 나른하다냥..."], evening: ["저녁이 되니까 살 것 같다냥...", "이제 중간은 왔다냥..."] },
  wednesday: { morning: ["딱 중간이다냥. 조금만 더 버티면 된다냥!", "수요일이라 살짝 기운이 난다냥..."], afternoon: ["오늘 반 왔다냥. 차차 할 수 있다냥!", "수요일 오후는 뭔가 여유롭다냥..."], evening: ["이번 주 절반 완료다냥!", "내일부터는 내리막이라냥..."] },
  thursday:  { morning: ["내일이 금요일이라는 게 차차한테 힘이 된다냥...", "목요일 아침... 거의 다 왔다냥!"], afternoon: ["금요일 냄새가 살짝 난다냥...", "내일만 버티면 된다냥!"], evening: ["오늘 하루도 잘 버텼다냥...", "내일은 금요일이다냥!"] },
  friday:    { morning: ["드디어 금요일이다냥!!!", "이번 주도 살아남았다냥..."], afternoon: ["금요일 오후는 공기가 다르다냥...", "퇴근... 아니 방과 후가 기다려진다냥!"], evening: ["오늘은 츄르 꿈 꿀 예정이다냥...", "괜히 기분이 들뜬다냥...", "이번 주도 살아남았다냥..."] },
  saturday:  { morning: ["주말이다냥!!!", "오늘은 늦잠 자도 되는 날이다냥..."], afternoon: ["토요일 오후는 차차가 제일 좋아하는 시간이다냥...", "오늘은 뭐 할까냥?"], evening: ["주말 저녁... 아직 내일이 있다냥!", "오늘 하루 어땠냥?"] },
  sunday:    { morning: ["일요일이다냥... 내일이 살짝 걱정되기 시작하는 날이다냥...", "오늘은 최대한 여유롭게 있을 예정이다냥."], afternoon: ["일요일 오후는 묘하게 쓸쓸하다냥...", "오늘을 최대한 즐겨야 한다냥!"], evening: ["내일 또 월요일이다냥... 그래도 괜찮다냥.", "일요일 저녁... 차차는 벌써 눈이 감긴다냥..."] },
};

const SMALLTALK = [
  { q: "평생 투명인간 되기 vs 평생 날아다니기 중 뭐가 좋냥?", a: "차차는 아직도 고민 중이다냥..." },
  { q: "초콜릿 산 만들기 vs 젤리 바다 만들기 뭐가 좋냥?", a: "둘 다 먹고 싶다냥..." },
  { q: "고양이가 말을 할 수 있으면 제일 먼저 뭐라고 할 것 같냥?", a: "츄르 달라고 할 것 같다냥..." },
  { q: "하루 종일 잠만 자기 vs 하루 종일 놀기 중 뭐가 좋냥?", a: "차차는 둘 다 좋다냥..." },
  { q: "책 속으로 들어갈 수 있으면 어디 가고 싶냥?", a: "차차는 마법 나무집 가보고 싶다냥..." },
];

function getDailyMsg() {
  const now = new Date();
  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const day = days[now.getDay()];
  const hour = now.getHours();
  const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const msgs = DAILY_MSGS[day]?.[timeOfDay] || ["오늘도 왔구나냥..."];
  return msgs[Math.floor(Math.random() * msgs.length)];
}

// ─── 상수 ───
const CHURU_REACTIONS = [
  "휴우... 오늘도 굶을 뻔했다냥!",
  "이걸로 하루 더 버틴다냥!",
  "차차 생존 성공이다냥!",
];
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

// ─── 하드코딩 라운드 데이터 ───
const FIRST_ROUND = {
  adventure: { chacha_says: ["나 그 장면 읽다가 심장 쫄렸다냥!", "너는 어땠어?"], choices: ["엄청 긴장됐어!", "별로 안 무서웠어", "나도 심장 쫄렸어!"] },
  mystery:   { chacha_says: ["차차는 범인 딱 감 왔는데...", "너는 누구라고 생각했어?"], choices: ["나도 맞췄어!", "완전 몰랐어", "중간에 바꿨어"] },
  comedy:    { chacha_says: ["나 여기서 웃다가 책 떨어뜨림 ㅋㅋ", "제일 웃겼던 장면이 어디야?"], choices: ["처음부터 웃겼어!", "중간에 빵 터졌어", "끝이 제일 웃겼어"] },
  emotion:   { chacha_says: ["차차도 이상하게 마음이 좀 묵직해졌어...", "너는 어떤 장면이 제일 마음에 걸렸어?"], choices: ["처음 장면!", "중간 장면!", "마지막 장면!"] },
};
const SECOND_ROUND = {
  adventure: { chacha_says: ["오~ 그 장면이 그렇게 느껴졌구나냥", "근데 왜 그랬을 것 같아?"], choices: ["주인공이 용감해서!", "위험해 보여서", "나도 모르겠어"] },
  mystery:   { chacha_says: ["흠... 차차는 그 부분이 좀 이상하더라냥", "왜 그렇게 생각했어?"], choices: ["단서가 있었어!", "그냥 느낌!", "다른 캐릭터 때문에"] },
  comedy:    { chacha_says: ["ㅋㅋ 차차도 거기서 웃겼냥", "근데 왜 그게 그렇게 웃겼어?"], choices: ["너무 황당해서!", "주인공이 바보 같아서", "예상 밖이라서"] },
  emotion:   { chacha_says: ["그 장면... 차차도 좀 마음이 쓰였다냥", "왜 그 장면이 마음에 걸렸어?"], choices: ["주인공이 불쌍해서", "나도 비슷한 적 있어서", "결말이 슬퍼서"] },
};
const THIRD_ROUND = {
  adventure: { chacha_says: ["차차는 사실 겁쟁이라 못 했을 것 같은데냥 ㅠ", "너라면 어떻게 했을 것 같아?"], choices: ["나도 용감하게 했을 거야!", "솔직히 도망갔을 것 같아", "친구랑 같이 했을 거야"] },
  mystery:   { chacha_says: ["차차가 탐정이었으면 완전 틀렸을 것 같다냥 ㅋㅋ", "너라면 범인 맞출 수 있었을 것 같아?"], choices: ["응 나 맞출 수 있었어!", "아마 틀렸을 것 같아", "더 단서 모았을 거야"] },
  comedy:    { chacha_says: ["차차라면 거기서 완전 뻘쭘했을 것 같은데냥", "너라면 어떻게 했을 것 같아?"], choices: ["나도 웃겼을 것 같아!", "나는 안 그랬을 것 같은데", "더 웃기게 했을 거야"] },
  emotion:   { chacha_says: ["차차는 그 상황에서 어떻게 해야 할지 몰랐을 것 같다냥...", "너라면 어떻게 했을 것 같아?"], choices: ["옆에 있어줬을 거야", "뭔가 해주려고 했을 거야", "나도 어떻게 할지 몰랐을 것 같아"] },
};

function getEdgeResponse(input) {
  if (!input || input.trim() === "") return "어? 말하려다 멈췄냥? 괜찮아. 천천히냥.";
  if (/똥|방귀|poop/.test(input)) return "야! 그건 방귀어잖아 ㅋㅋ 진짜 버전도 들려줘냥!";
  if (/ㅋㅋ|ㅎㅎ/.test(input)) return "오 ㅋㅋ 뭐가 그렇게 웃겨? 나도 알고 싶다냥!";
  if (/모르겠|몰라/.test(input)) return "나도 사실 좀 헷갈렸다냥. 같이 생각해보자냥?";
  return null;
}

// ─── AI 대화 생성 ───
async function generateDialogue(book, childName, prevAnswer, roundNum, totalRounds, allConversations = []) {
  const persona = detectPersona(prevAnswer);
  const reaction = PERSONA_REACTIONS[persona]?.[Math.floor(Math.random() * 3)] || "";
  const isLast = roundNum === totalRounds;
  const isSecondLast = roundNum === totalRounds - 1;
  const convHistory = allConversations.length > 0
    ? `\n[지금까지 대화 기록]\n${allConversations.map((c, i) => `Q${i+1}: ${c.q}\n아이: ${c.a}`).join("\n")}\n→ 위 질문들과 겹치지 않는 새로운 질문을 만들어.`
    : "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
${convHistory}
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
    return JSON.parse(data.content[0].text.replace(/```json|```/g, "").trim());
  } catch {
    return { chacha_says: ["헉... 나 방금 딴생각했다냥 ㅠ"], choices: ["재밌었어!", "좀 어려웠어", "그냥 그랬어"] };
  }
}

// ─── 리포트 생성 ───
async function generateReport(book, childName, conversations, mailboxNote = "") {
  const convText = conversations.map((c, i) => `Q${i+1}: ${c.q}\n${childName}: ${c.a}`).join("\n");
  const mailboxSection = mailboxNote
    ? `\n[비밀 우체통 쪽지 - 아이가 직접 쓴 말]\n"${mailboxNote}"\n→ 이 문장을 child_quote에 우선 반영하고 리포트에 자연스럽게 녹여주세요.`
    : "";

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
${mailboxSection}

[대화 기록]
책: ${book.title} / 아이: ${childName}
${convText}

JSON만 반환:
{
  "child_quote": "가장 인상 깊은 한 문장 (비밀 쪽지 있으면 우선 반영)",
  "discovery_insight": "아이가 고른 선택의 성격을 구체적 예시로 이야기화 (2문장)",
  "observation_record": "완주와 집중의 가치로 변환 (1문장, 숫자 없이)",
  "action_guide": "오늘 저녁 엄마가 아이에게 건넬 한 문장. 아래 4가지 패턴 중 하나를 랜덤으로 선택해서 생성해. 직전과 같은 패턴 피하기. 반드시 물음표로 끝내야 함. 책의 구체적인 캐릭터 이름을 1개 이상 포함해야 함. 설명/가르침 금지. 딱 한 문장만.\n패턴1: '차차가 몰래 알려줬는데, [캐릭터]가 [상황]에서 네가 떠올랐대, 너는 그때 어떻게 했을 것 같아?'\n패턴2: '엄마가 어릴 때 [비슷한 상황] 나오면 꼭 [감정/행동]했거든, 너는 [캐릭터] 보면서 어땠어?'\n패턴3: '만약 네가 [캐릭터] 대신 그 장면에 있었다면, 제일 먼저 뭐 했을 것 같아?'\n패턴4: '[캐릭터]가 사실 [엉뚱한 상상]이었다면 어땠을까, 유니는 어떻게 생각해?'",
  "chacha_memo": "차차 말투 따뜻한 관찰 한 줄",
  "polaroid_text": "차차 기억 한 줄 (~냥으로 끝)",
  "polaroid_emotion": "😹 또는 🤔 또는 🥺 또는 😳 또는 ❤️"
}`
        }]
      })
    });
    const data = await res.json();
    return JSON.parse(data.content[0].text.replace(/```json|```/g, "").trim());
  } catch {
    return {
      child_quote: mailboxNote || "재밌었어!",
      discovery_insight: "이야기 속 인물들에게 자연스럽게 관심을 보였어요.",
      observation_record: "끝까지 차차와 대화를 이어갔어요.",
      action_guide: "주인공이 너라면 어떻게 했을 것 같아?",
      chacha_memo: "오늘 꽤 오래 생각했어. 차차는 그게 좋더라 ㅋㅋ",
      polaroid_text: "오늘 이야기 들으면서 나도 좀 설렜다냥",
      polaroid_emotion: "❤️",
    };
  }
}

// ══════════════════════════════
// 메인 앱
// ══════════════════════════════
export default function ReadingChachaV2() {
  const [screen, setScreen] = useState("home");
  const [childName, setChildName] = useState(() => localStorage.getItem("rcChildName") || "");
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [chachaMsg, setChachaMsg] = useState("zzz... 츄르... zzz...");
  const [wakeMsg, setWakeMsg] = useState("");
  const [dailyMsg, setDailyMsg] = useState("");
  const [smalltalk, setSmalltalk] = useState(null);
  const [showSmalltalk, setShowSmalltalk] = useState(false);
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
  const [churuFed, setChuruFed] = useState(false);
  const [churuReaction, setChuruReaction] = useState("");
  const [showMailbox, setShowMailbox] = useState(false);
  const [mailboxText, setMailboxText] = useState("");
  const [pin, setPin] = useState(() => localStorage.getItem("rcPin") || "");
  const [pinInput, setPinInput] = useState("");
  const [pinScreen, setPinScreen] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [showFakeDoor, setShowFakeDoor] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [emailSaved, setEmailSaved] = useState(false);
  const [readBooks, setReadBooks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("rcReadBooks") || "[]"); }
    catch { return []; }
  });
  const [lastVisit] = useState(() => localStorage.getItem("rcLastVisit") || "");
  const [visitCount, setVisitCount] = useState(() => parseInt(localStorage.getItem("rcVisitCount") || "0"));
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("rcStreak") || "0"));
  const [firstVisitDate] = useState(() => localStorage.getItem("rcFirstVisit") || new Date().toDateString());
  const [showSpecialDay, setShowSpecialDay] = useState(false);
  const [specialDayMsg, setSpecialDayMsg] = useState("");
const [specialDayMsg, setSpecialDayMsg] = useState("");
const [bookTitle, setBookTitle] = useState("");  //
  

  // ─── 라운드 계산 ───
  const getBookScore = (b) => {
    let s = 0;
    if (b.pages >= 200) s += 2; else if (b.pages >= 100) s += 1;
    if (b.chapters >= 16) s += 2; else if (b.chapters >= 6) s += 1;
    s += b.density;
    return s;
  };
  const getRounds = (b) => {
    const s = getBookScore(b);
    if (s <= 2) return 3;
    if (s <= 4) return 5;
    return 7;
  };

  // ─── 방 성장 단계 ───
  const getRoomStage = (inv) => {
    const count = inv.length;
    if (count >= 15) return { name: "아늑한 방 🏠", emoji: "🏠" };
    if (count >= 10) return { name: "캣타워 🗼", emoji: "🗼" };
    if (count >= 6)  return { name: "쿠션 🛋", emoji: "🛋" };
    if (count >= 3)  return { name: "종이박스 📦", emoji: "📦" };
    return { name: "빈 방", emoji: "🕳️" };
  };

  // ─── 초기 접속 처리 ───
  useEffect(() => {
    const count = visitCount + 1;
    setVisitCount(count);
    localStorage.setItem("rcVisitCount", count);
    if (!localStorage.getItem("rcFirstVisit")) {
      localStorage.setItem("rcFirstVisit", new Date().toDateString());
    }

    const diff = lastVisit ? (new Date() - new Date(lastVisit)) / (1000 * 60 * 60 * 24) : 0;
    let newStreak = streak;
    if (!lastVisit || diff < 1) { /* 같은 날 */ }
    else if (diff < 2) { newStreak = streak + 1; }
    else { newStreak = 1; }
    setStreak(newStreak);
    localStorage.setItem("rcStreak", newStreak);

    if (newStreak === 3) { setSpecialDayMsg("3일째다냥!!! 뭔가 이상한 느낌 난다냥!!! 🌟"); setShowSpecialDay(true); }
    else if (newStreak === 7) { setSpecialDayMsg("7일째다냥... 너 진짜 꾸준하다냥! 다락방이 더 자랄 것 같다냥! 🏠"); setShowSpecialDay(true); }

    const firstDate = new Date(firstVisitDate);
    if ((new Date() - firstDate) / (1000 * 60 * 60 * 24) >= 30) setShowFakeDoor(true);

    if (!lastVisit) { setChachaMsg("처음 왔구나냥... 반가워!"); }
    else if (diff >= 3) { setChachaMsg(CHACHA_REUNION[Math.floor(Math.random() * CHACHA_REUNION.length)]); }
    else if (count > 1) { setChachaMsg(CHACHA_DAILY[Math.floor(Math.random() * CHACHA_DAILY.length)]); }
    else { setChachaMsg(CHACHA_WAIT[Math.floor(Math.random() * CHACHA_WAIT.length)]); }

    localStorage.setItem("rcLastVisit", new Date().toDateString());

    const saved = localStorage.getItem("rcPolaroids");
    if (saved) { try { setPolaroids(JSON.parse(saved)); } catch { } }
    const savedInv = localStorage.getItem("rcInventory");
    if (savedInv) { try { setInventory(JSON.parse(savedInv)); } catch { } }

    if (!navigator.onLine) setChachaMsg("오늘은 인터넷이 없다냥... 나중에 다시 와줘냥 🐱");
    setDailyMsg(getDailyMsg());
    if (Math.random() < 0.25) setSmalltalk(SMALLTALK[Math.floor(Math.random() * SMALLTALK.length)]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── 유틸 ───
  const displayBooks = () => {
    const notRead = BOOKS.filter(b => !readBooks.includes(b.title));
    if (showAllBooks) {
      if (!searchQuery) return notRead;
      const q = searchQuery.toLowerCase();
      return notRead.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.series && b.series.toLowerCase().includes(q))
      );
    }
    // 차차 추천: 읽지 않은 책 중 5권
    return notRead.slice(0, 5);
  };

  const getChachaEmoji = () => {
    if (tapCount <= 1) return "😴";
    if (tapCount <= 3) return "🐱";
    return "😺";
  };

  // ─── tapChacha: 단일 정의 ───
  const tapChacha = () => {
    if (screen !== "home") return;
    const n = tapCount + 1;
    setTapCount(n);
    const msgs = ["으음... 츄르 더 줘...", "누구야... zzz...", "잠깐만...", "...거의 다 깼어..."];
    if (n < 5) {
      setChachaMsg(msgs[n - 1] || msgs[0]);
    } else {
      setWakeMsg(CHACHA_WAKE[Math.floor(Math.random() * CHACHA_WAKE.length)]);
      setTapCount(0);
      setTimeout(() => setScreen("setup"), 900);
    }
  };

  // ─── 대화 시작 ───
  const startDialog = async () => {
    if (!selectedBook) return;
    const rounds = getRounds(selectedBook);
    setTotalRounds(rounds);
    setRoundNum(1);
    setConversations([]);
    setLoading(true);
    setScreen("dialog");

    const mode = GENRE_CONFIG[selectedBook.genre] || GENRE_CONFIG.adventure;
    const opening = mode.openings[Math.floor(Math.random() * mode.openings.length)];
    const firstRound = FIRST_ROUND[selectedBook.genre] || FIRST_ROUND.adventure;

    const titleMention = bookTitle ? `${bookTitle} 읽었구나냥! ` : "";
    setTimeout(() => {
      setBubbles([titleMention + opening, ...(firstRound.chacha_says || [])]);
      setCurrentDialogue({ ...firstRound, question: firstRound.chacha_says?.slice(-1)[0] || opening });
      setLoading(false);
    }, 800);
  };

  // ─── 하드코딩 라운드 ───
  const getHardcodedRound = (rNum, genre) => {
    const g = genre || "adventure";
    if (rNum === 1) return FIRST_ROUND[g] || FIRST_ROUND.adventure;
    if (rNum === 2) return SECOND_ROUND[g] || SECOND_ROUND.adventure;
    if (rNum === 3) return THIRD_ROUND[g] || THIRD_ROUND.adventure;
    return null;
  };

  // ─── 선택지 클릭: newConvs 단일 선언 ───
  const handleChoice = async (choice) => {
    const edgeRes = getEdgeResponse(choice);
    const newConv = { q: currentDialogue?.question || "", a: choice };
    const newConvs = [...conversations, newConv]; // 단 한 번만 선언
    setConversations(newConvs);

    if (roundNum >= totalRounds) {
      setBubbles(["으아앙! 네 덕분에 오늘 츄르값을 벌었다냥!", "잠깐 기다려봐냥... 뭔가 만들고 있어..."]);
      setScreen("reward");
      return;
    }

    setLoading(true);
    const nextRound = roundNum + 1;
    const reaction = edgeRes || `"${choice}" 냥~`;
    setBubbles([reaction]);

    const hardcoded = getHardcodedRound(nextRound, selectedBook.genre);
    if (hardcoded) {
      setTimeout(() => {
        setBubbles([reaction, ...(hardcoded.chacha_says || [])]);
        setCurrentDialogue({ ...hardcoded, question: hardcoded.chacha_says?.slice(-1)[0] || "" });
        setRoundNum(nextRound);
        setLoading(false);
      }, 600);
    } else {
      const next = await generateDialogue(selectedBook, childName, choice, nextRound, totalRounds, newConvs);
      setTimeout(() => {
        setBubbles([reaction, ...(next.chacha_says || [])]);
        setCurrentDialogue({ ...next, question: next.chacha_says?.slice(-1)[0] || "" });
        setRoundNum(nextRound);
        setLoading(false);
      }, 600);
    }
  };

  // ─── 츄르 먹이기 ───
  const feedChuru = () => {
    if (churuFed) return;
    setChuruFed(true);
    const item = getRewardItem(selectedBook);
    setRewardItem(item);
    const newInv = [...inventory, item];
    setInventory(newInv);
    localStorage.setItem("rcInventory", JSON.stringify(newInv));
    setChuruReaction(CHURU_REACTIONS[Math.floor(Math.random() * CHURU_REACTIONS.length)]);
    setTimeout(() => setShowReward(true), 800);
  };

  // ─── 리포트 공통 생성 로직 ───
  const finishSession = async (note = "") => {
    setLoading(true);
    setScreen("handback");
    const rep = await generateReport(selectedBook, childName, conversations, note);
    setReport(rep);
    if (rep.polaroid_text) {
      const newP = { book: selectedBook.title, text: rep.polaroid_text, emotion: rep.polaroid_emotion || "❤️", date: new Date().toLocaleDateString("ko-KR") };
      const newPolaroids = [...polaroids, newP];
      setPolaroids(newPolaroids);
      localStorage.setItem("rcPolaroids", JSON.stringify(newPolaroids));
    }
    const newRead = [...new Set([...readBooks, selectedBook.title])];
    setReadBooks(newRead);
    localStorage.setItem("rcReadBooks", JSON.stringify(newRead));
    setLoading(false);
  };

  // ─── PIN 체크 ───
  const checkPin = () => {
    if (!pin) {
      localStorage.setItem("rcPin", pinInput);
      setPin(pinInput);
      setPinScreen(false);
      setScreen("report");
      return;
    }
    if (pinInput === pin) { setPinScreen(false); setScreen("report"); setPinError(false); }
    else { setPinError(true); setPinInput(""); }
  };

  // ─── 홈 리셋 ───
  const reset = () => {
    setScreen("home"); setSelectedBook(null); setSearchQuery(""); setShowAllBooks(false);
    setBubbles([]); setCurrentDialogue(null); setConversations([]); setRoundNum(1);
    setReport(null); setLoading(false); setChuruFed(false);
    setRewardItem(null); setShowReward(false); setChuruReaction("");
    setShowMailbox(false); setMailboxText(""); setBookTitle("");
  };

  // ─── 리포트 복사 ───
  const copyReport = () => {
    if (!report) return;
    const text = `📚 리딩차차 오늘의 리포트\n━━━━━━━━━━━━━\n📖 ${selectedBook?.title}\n\n🐱 오늘의 반짝 문장\n"${report.child_quote}"\n\n💡 차차의 발견\n${report.discovery_insight}\n\n💬 오늘 저녁 한마디\n"${report.action_guide}"`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  // ─── STYLES ───
  const warm = "#FFB300";
  const dark = "#5D4037";
  const bg = "#FFF9F0";
  const S = {
    app:    { fontFamily: "'Noto Sans KR',sans-serif", maxWidth: 390, margin: "0 auto", minHeight: "100vh", background: bg },
    hdr:    { background: "linear-gradient(135deg,#FFE082,#FFB300)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 10 },
    body:   { padding: "20px 16px", paddingBottom: 100 },
    btn:    (bg2, col, dis = false) => ({ width: "100%", background: dis ? "#ddd" : (bg2 || warm), color: dis ? "#999" : (col || dark), border: "none", borderRadius: 16, padding: "16px", fontSize: 16, fontWeight: 800, cursor: dis ? "not-allowed" : "pointer", boxShadow: dis ? "none" : "0 4px 12px rgba(0,0,0,0.15)", marginBottom: 12 }),
    card:   (bg2 = "#fff", border = "transparent") => ({ background: bg2, borderRadius: 20, padding: "16px", marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: `2px solid ${border}` }),
    bubble: { background: "#fff", borderRadius: "20px 20px 20px 4px", padding: "12px 16px", marginBottom: 8, fontSize: 15, lineHeight: 1.6, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", maxWidth: "85%" },
    choice: { width: "100%", background: "#FFF3E0", border: `2px solid ${warm}`, borderRadius: 14, padding: "14px 16px", fontSize: 14, fontWeight: 700, color: dark, cursor: "pointer", marginBottom: 8, textAlign: "left" },
  };

  // ══ FAKE DOOR (페이월) — 최우선 렌더 ══
  if (showFakeDoor) return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: 32, maxWidth: 320 }}>
        <span style={{ fontSize: 60 }}>🐱</span>
        <div style={{ fontSize: 16, fontWeight: 800, color: dark, marginTop: 16, marginBottom: 8 }}>앗! 차차가 아직 준비 중이래요 ㅠㅠ</div>
        <div style={{ fontSize: 14, color: "#795548", fontStyle: "italic", marginBottom: 16 }}>"조금만 더 단장하고 꼭 다시 만나고 싶다냥!"</div>
        <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, marginBottom: 20 }}>
          리딩차차는 아이의 생각이 자라는 순간을 발견하고, 엄마가 오늘 저녁 아이에게 건넬 독후대화 한 문장을 찾을 수 있도록 만들고 있어요.
        </div>
        {!emailSaved ? (
          <>
            <input value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="이메일 또는 전화번호"
              style={{ width: "100%", padding: "14px", borderRadius: 12, border: `2px solid ${warm}`, fontSize: 14, textAlign: "center", boxSizing: "border-box", marginBottom: 12 }} />
            <button onClick={() => { if (emailInput) setEmailSaved(true); }} disabled={!emailInput} style={S.btn(warm, dark, !emailInput)}>
              🐾 우선 초대받기 (평생 할인 혜택)
            </button>
          </>
        ) : (
          <div style={{ ...S.card("#E8F5E9"), textAlign: "center" }}>
            <div style={{ fontSize: 16 }}>✅</div>
            <div style={{ fontSize: 13, color: "#388E3C", fontWeight: 700 }}>감사해요! 꼭 먼저 연락드릴게요 🐾</div>
          </div>
        )}
        <button onClick={() => setShowFakeDoor(false)} style={{ ...S.btn("#f5f5f5", "#666"), marginTop: 8 }}>돌아가기</button>
      </div>
    </div>
  );

  // ══ HOME ══
  if (screen === "home") return (
    <div style={S.app}>
      <div style={S.hdr}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: dark }}>🧀 리딩차차</div>
          <div style={{ fontSize: 11, color: "#795548" }}>차차를 깨워봐!</div>
        </div>
        <button onClick={() => setPinScreen(true)} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer" }}>🔒</button>
      </div>

      {pinScreen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 28, width: 300 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, textAlign: "center" }}>🔒 부모방</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 16, textAlign: "center" }}>{pin ? "PIN 입력" : "처음 입력이 비밀번호가 돼요"}</div>
            <input type="password" maxLength={4} value={pinInput}
              onChange={e => setPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="4자리 숫자"
              style={{ width: "100%", padding: "14px", borderRadius: 12, border: `2px solid ${pinError ? "red" : warm}`, fontSize: 20, textAlign: "center", boxSizing: "border-box" }} />
            {pinError && <div style={{ color: "red", fontSize: 12, textAlign: "center", marginTop: 8 }}>PIN이 틀렸어요</div>}
            <button onClick={checkPin} disabled={pinInput.length !== 4} style={{ ...S.btn(warm, dark, pinInput.length !== 4), marginTop: 12 }}>{pin ? "확인" : "설정하기"}</button>
            <button onClick={() => { setPinScreen(false); setPinInput(""); setPinError(false); }} style={{ ...S.btn("#f5f5f5", "#666"), marginTop: 0 }}>취소</button>
          </div>
        </div>
      )}

      <div style={{ ...S.body, textAlign: "center", paddingTop: 32 }}>
        {showSpecialDay && (
          <div style={{ background: "linear-gradient(135deg,#FFE082,#FFB300)", borderRadius: 16, padding: "12px 16px", marginBottom: 16, position: "relative" }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#5D4037" }}>{specialDayMsg}</div>
            <button onClick={() => setShowSpecialDay(false)} style={{ position: "absolute", top: 8, right: 12, background: "none", border: "none", fontSize: 16, cursor: "pointer" }}>✕</button>
          </div>
        )}

        <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>
          {getRoomStage(inventory).emoji} {getRoomStage(inventory).name}
          {streak > 1 && <span style={{ marginLeft: 8, color: warm }}>🔥 {streak}일 연속</span>}
        </div>

        <div style={{ fontSize: 13, color: "#888", marginBottom: 12, minHeight: 20 }}>{chachaMsg}</div>
        <div onClick={tapChacha}
          style={{ display: "inline-block", transition: "transform 0.1s" }}
          onMouseDown={e => e.currentTarget.style.transform = "scale(0.9)"}
          onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
          <span style={{ fontSize: 80, userSelect: "none", cursor: "pointer" }}>{getChachaEmoji()}</span>
        </div>
        {wakeMsg && <div style={{ fontSize: 15, fontWeight: 700, color: dark, marginTop: 8 }}>{wakeMsg}</div>}

        {dailyMsg && (
          <div style={{ marginTop: 16, padding: "12px 16px", background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: 13, color: dark, lineHeight: 1.6 }}>
            🐱 {dailyMsg}
            {smalltalk && !showSmalltalk && (
              <div onClick={() => setShowSmalltalk(true)} style={{ marginTop: 8, fontSize: 12, color: warm, cursor: "pointer", fontWeight: 700 }}>
                💬 차차가 궁금한 게 있다냥 →
              </div>
            )}
            {smalltalk && showSmalltalk && (
              <div style={{ marginTop: 8, padding: "10px 12px", background: "#FFF3E0", borderRadius: 12, fontSize: 12, color: dark }}>
                "{smalltalk.q}"
                <div style={{ marginTop: 6, color: "#aaa", fontStyle: "italic" }}>{smalltalk.a}</div>
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16, marginBottom: 20 }}>
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= tapCount ? warm : "#ddd", transition: "background 0.2s" }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: "#aaa" }}>5번 탭하면 차차가 깨어나요</div>

        {inventory.length > 0 && (
          <div style={{ marginTop: 20, padding: "12px 16px", background: "#FFF8E1", borderRadius: 16, border: "2px dashed #FFE082" }}>
            <div style={{ fontSize: 12, color: "#795548", fontWeight: 700, marginBottom: 8 }}>🗃️ 차차의 다락방</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
              {inventory.slice(-10).map((item, i) => (
                <div key={i} title={item.name} style={{ fontSize: 22 }}>{item.emoji}</div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "#aaa", marginTop: 6 }}>총 {inventory.length}개 수집</div>
            <div onClick={() => alert("캣타워는 아직 준비 중이다냥...\n츄르를 더 모아야 한다냥! 🐱")}
              style={{ marginTop: 12, padding: "10px 12px", background: "rgba(0,0,0,0.05)", borderRadius: 12, border: "2px dashed #ddd", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>🔒</div>
              <div style={{ fontSize: 11, color: "#aaa", fontWeight: 700 }}>차차의 꿈: 캣타워</div>
              <div style={{ fontSize: 10, color: "#ccc" }}>아직 츄르가 부족하다냥!</div>
            </div>
          </div>
        )}

        {polaroids.length === 0 ? (
          <div style={{ marginTop: 16, padding: "16px", background: "#FFF8E1", borderRadius: 16, border: "2px dashed #FFE082" }}>
            <div style={{ fontSize: 20, marginBottom: 6 }}>🖼</div>
            <div style={{ fontSize: 12, color: "#aaa" }}>아직 기억이 쌓이는 중이다냥…</div>
          </div>
        ) : (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, color: "#795548", fontWeight: 700, marginBottom: 10 }}>🖼 차차의 서재</div>
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, justifyContent: "center" }}>
              {polaroids.map((p, i) => (
                <div key={i} style={{ minWidth: 120, background: "#fff", borderRadius: 12, padding: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", flexShrink: 0 }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>{p.emotion}</div>
                  <div style={{ fontSize: 9, color: "#aaa", marginBottom: 2 }}>{p.book}</div>
                  <div style={{ fontSize: 8, color: "#ccc", marginBottom: 4 }}>{p.date}</div>
                  <div style={{ fontSize: 11, color: dark, fontStyle: "italic", lineHeight: 1.4 }}>"{p.text}"</div>
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
        <span style={{ fontSize: 28 }}>🐱</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: dark }}>앗 깜짝이야!</div>
          <div style={{ fontSize: 11, color: "#795548" }}>어떤 책 읽었어?</div>
        </div>
      </div>
      <div style={S.body}>
        <div style={S.card()}>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>차차가 이름으로 부를게! 아이 이름만 알려줘 😊</div>
          <input value={childName}
            onChange={e => { setChildName(e.target.value); localStorage.setItem("rcChildName", e.target.value); }}
            placeholder="예: 민준"
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: `2px solid ${warm}`, fontSize: 16, fontWeight: 700, textAlign: "center", outline: "none", boxSizing: "border-box" }} />
        </div>

        {!showAllBooks ? (
          <>
            <div style={{ fontSize: 13, color: dark, fontWeight: 700, marginBottom: 8 }}>🐱 차차가 고른 책</div>
            {displayBooks().length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>
                읽을 책이 없다냥... 전체 목록을 확인해봐!
              </div>
            ) : displayBooks().map(book => (
              <div key={book.id} onClick={() => setSelectedBook(book)}
                style={{ ...S.card(selectedBook?.id === book.id ? "#FFF3E0" : "#fff", selectedBook?.id === book.id ? warm : "transparent"), cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>{book.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{book.title}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{book.author} · AR {book.ar}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{getRounds(book)}문제</div>
                </div>
                {selectedBook?.id === book.id && <div style={{ fontSize: 18 }}>✅</div>}
              </div>
            ))}
            <button onClick={() => setShowAllBooks(true)}
              style={{ background: "none", border: "none", color: warm, fontSize: 13, cursor: "pointer", fontWeight: 700, width: "100%", padding: "12px" }}>
              🔍 더 찾아보기
            </button>
          </>
        ) : (
          <>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="🔍 제목 / 저자 / 시리즈 검색..."
              autoFocus
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `2px solid ${warm}`, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {(() => {
                const notRead = BOOKS.filter(b => !readBooks.includes(b.title));
                const q = searchQuery.toLowerCase();
                const filtered = q
                  ? notRead.filter(b =>
                      b.title.toLowerCase().includes(q) ||
                      b.author.toLowerCase().includes(q) ||
                      (b.series && b.series.toLowerCase().includes(q))
                    )
                  : notRead;
                return filtered.length > 0
                  ? filtered.map(book => (
                    <div key={book.id} onClick={() => setSelectedBook(book)}
                      style={{ ...S.card(selectedBook?.id === book.id ? "#FFF3E0" : "#fff", selectedBook?.id === book.id ? warm : "transparent"), cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 24 }}>{book.emoji}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{book.title}</div>
                        <div style={{ fontSize: 11, color: "#888" }}>{book.author} · AR {book.ar}</div>
                        <div style={{ fontSize: 10, color: "#aaa" }}>{getRounds(book)}문제</div>
                      </div>
                      {selectedBook?.id === book.id && <div>✅</div>}
                    </div>
                  ))
                  : <div style={{ textAlign: "center", padding: 20, color: "#aaa", fontSize: 13 }}>검색 결과가 없어요.<br />다른 제목으로 찾아봐요!</div>;
              })()}
            </div>
            <button onClick={() => { setShowAllBooks(false); setSearchQuery(""); }}
              style={{ background: "none", border: "none", color: "#888", fontSize: 12, cursor: "pointer", width: "100%", padding: "8px" }}>
              ← 차차 추천으로 돌아가기
            </button>
          </>
        )}

        {selectedBook && (
  <div style={S.card()}>
    <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
      📖 오늘 읽은 책 제목이 뭐야? <span style={{ color: "#FF8F00", fontSize: 11 }}>*필수</span>
    </div>
    <input
      value={bookTitle}
      onChange={e => setBookTitle(e.target.value)}
      placeholder={`예: The Magic Key, 더 매직 키`}
      style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `2px solid #FFE082`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
    />
    <div style={{ fontSize: 11, color: "#aaa", marginTop: 6 }}>한글로 써도 괜찮아냥!</div>
  </div>
)}
        <button onClick={startDialog} disabled={!childName || !selectedBook|| !bookTitle.trim()} style={S.btn(warm, dark, !childName || !selectedBook|| !bookTitle.trim())}>
          이제 차차랑 놀래! 🐾
        </button>
      </div>
    </div>
  );

  // ══ DIALOG ══
  if (screen === "dialog") return (
    <div style={S.app}>
      <div style={S.hdr}>
        <span style={{ fontSize: 28 }}>🐱</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: dark }}>차차</div>
          <div style={{ fontSize: 10, color: "#795548" }}>{selectedBook?.title}</div>
        </div>
        <div style={{ fontSize: 11, color: "#795548", background: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "4px 8px" }}>{roundNum}/{totalRounds}</div>
      </div>
      <div style={{ ...S.body, paddingBottom: 140 }}>
        {bubbles.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, animation: "fadeIn 0.3s ease" }}>
            <span style={{ fontSize: 24, alignSelf: "flex-end", flexShrink: 0 }}>🐱</span>
            <div style={S.bubble}>{b}</div>
          </div>
        ))}
        {conversations.slice(-1).map((c, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
            <div style={{ background: warm, borderRadius: "20px 20px 4px 20px", padding: "12px 16px", fontSize: 14, color: "#fff", fontWeight: 700, maxWidth: "75%" }}>{c.a}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🐱</span>
            <div style={{ ...S.bubble, color: "#aaa" }}>생각 중이다냥...</div>
          </div>
        )}
      </div>
      {!loading && currentDialogue?.choices && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, background: bg, padding: "12px 16px", borderTop: "1px solid #FFE082" }}>
          {currentDialogue.choices.map((c, i) => (
            <button key={i} onClick={() => handleChoice(c)} style={S.choice}>{c}</button>
          ))}
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );

  // ══ REWARD ══
  if (screen === "reward") return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: 32 }}>
        <span style={{ fontSize: 80 }}>🐱</span>
        <div style={{ fontSize: 16, fontWeight: 800, color: dark, marginTop: 16, marginBottom: 8 }}>
          {churuReaction || "으아앙! 네 덕분에 오늘 츄르값 벌었다냥!"}
        </div>
        {!churuFed ? (
          <>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>츄르를 차차한테 줘봐!</div>
            <div onClick={feedChuru}
              style={{ fontSize: 64, cursor: "pointer", animation: "bounce 0.6s infinite alternate", userSelect: "none" }}
              onMouseDown={e => e.currentTarget.style.transform = "scale(0.8)"}
              onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}>
              🍬
            </div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 12 }}>탭해서 먹여줘!</div>
          </>
        ) : !showReward ? (
          <div style={{ fontSize: 40, marginTop: 16 }}>뇸뇸뇸뇸... 😋</div>
        ) : (
          <>
            <div style={{ fontSize: 14, color: "#795548", marginTop: 16, marginBottom: 8 }}>
              "배부르다냥! 이건 길에서 주운 건데 너한테만 준다냥!"
            </div>
            <div style={{ ...S.card("#FFF8E1", "#FFE082"), textAlign: "center", marginTop: 8 }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>{rewardItem?.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: dark }}>{rewardItem?.name}</div>
              <div style={{ fontSize: 11, color: "#aaa", marginTop: 4 }}>다락방에 추가됐어!</div>
            </div>
          </>
        )}
        {showReward && (
          <button onClick={() => setScreen("mailbox")} style={{ ...S.btn(warm, dark), marginTop: 16 }}>
            계속하기
          </button>
        )}
      </div>
      <style>{`@keyframes bounce{from{transform:translateY(0)}to{transform:translateY(-10px)}}`}</style>
    </div>
  );

  // ══ MAILBOX ══
  if (screen === "mailbox") return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: 32, width: "100%", maxWidth: 340 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📮</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: dark, marginBottom: 8 }}>차차 우체통</div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>"하고 싶은 말이 있으면 넣어도 된다냥!"</div>
        {!showMailbox ? (
          <>
            <button onClick={() => setShowMailbox(true)} style={{ ...S.btn(warm, dark), marginBottom: 8 }}>
              📝 비밀 쪽지 남기기
            </button>
            <button onClick={() => finishSession("")} style={S.btn("#f5f5f5", "#666")}>
              그냥 종료하기
            </button>
          </>
        ) : (
          <>
            <textarea value={mailboxText} onChange={e => setMailboxText(e.target.value)}
              placeholder="차차한테만 보이는 비밀 쪽지야..."
              style={{ width: "100%", height: 120, padding: "12px", borderRadius: 12, border: `2px solid ${warm}`, fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "'Noto Sans KR',sans-serif", marginBottom: 12 }} />
            <button onClick={() => {
              if (mailboxText) {
                try {
                  const saved = JSON.parse(localStorage.getItem("rcMailbox") || "[]");
                  saved.push({ text: mailboxText, book: selectedBook?.title, date: new Date().toLocaleDateString() });
                  localStorage.setItem("rcMailbox", JSON.stringify(saved));
                } catch { }
              }
              finishSession(mailboxText);
            }} style={S.btn(warm, dark)}>
              📮 우체통에 넣기
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ══ HANDBACK ══
  if (screen === "handback") return (
    <div style={{ ...S.app, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: 40 }}>
        <span style={{ fontSize: 80 }}>🐱</span>
        <div style={{ fontSize: 16, fontWeight: 800, color: dark, marginTop: 16, marginBottom: 8 }}>
          "어휴 하얗게 불태웠다냥..."
        </div>
        <div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>
          "나 이제 낮잠 자러 갈게냥! Zzz"
        </div>
        {loading ? (
          <div style={{ fontSize: 13, color: "#aaa", marginTop: 24 }}>리포트 만드는 중이다냥... 🐾</div>
        ) : (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
            {report && (
              <button onClick={() => { setPinScreen(true); }} style={S.btn(warm, dark)}>
                🔒 부모님 리포트 보기
              </button>
            )}
            <button onClick={reset} style={S.btn("#f5f5f5", "#666")}>
              차차 방으로 돌아가기
            </button>
          </div>
        )}
      </div>

      {/* PIN 모달 — handback 화면에서도 사용 */}
      {pinScreen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: 28, width: 300 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4, textAlign: "center" }}>🔒 부모방</div>
            <div style={{ fontSize: 12, color: "#888", marginBottom: 16, textAlign: "center" }}>{pin ? "PIN 입력" : "처음 입력이 비밀번호가 돼요"}</div>
            <input type="password" maxLength={4} value={pinInput}
              onChange={e => setPinInput(e.target.value.replace(/\D/g, ""))}
              placeholder="4자리 숫자"
              style={{ width: "100%", padding: "14px", borderRadius: 12, border: `2px solid ${pinError ? "red" : warm}`, fontSize: 20, textAlign: "center", boxSizing: "border-box" }} />
            {pinError && <div style={{ color: "red", fontSize: 12, textAlign: "center", marginTop: 8 }}>PIN이 틀렸어요</div>}
            <button onClick={checkPin} disabled={pinInput.length !== 4} style={{ ...S.btn(warm, dark, pinInput.length !== 4), marginTop: 12 }}>{pin ? "확인" : "설정하기"}</button>
            <button onClick={() => { setPinScreen(false); setPinInput(""); setPinError(false); }} style={{ ...S.btn("#f5f5f5", "#666"), marginTop: 0 }}>취소</button>
          </div>
        </div>
      )}
    </div>
  );

  // ══ REPORT ══
  if (screen === "report" && !report) return (
    <div style={{ ...S.app, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
      <div style={{ textAlign: "center", color: "#aaa", fontSize: 13 }}>리포트 불러오는 중이다냥... 🐾</div>
    </div>
  );
  if (screen === "report" && report) return (
    <div style={S.app}>
      <div style={S.hdr}>
        <span style={{ fontSize: 24 }}>🐱</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: dark }}>차차의 관찰 노트</div>
          <div style={{ fontSize: 11, color: "#795548" }}>{selectedBook?.title}</div>
        </div>
        <button onClick={copyReport} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>📋</button>
      </div>
      <div style={S.body}>
        <div style={{ ...S.card("linear-gradient(135deg,#FFF9C4,#FFF3E0)"), border: `2px solid ${warm}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: warm, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>🐱 오늘의 반짝 문장</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: dark, lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 }}>"{report.child_quote}"</div>
          <div style={{ fontSize: 12, color: "#795548" }}>— {childName} ({selectedBook?.title})</div>
        </div>

        <div style={{ ...S.card("#FFF8E1"), border: "1px solid #FFE082" }}>
          <div style={{ fontSize: 11, color: "#FF8F00", fontWeight: 800, marginBottom: 6 }}>💡 차차의 발견</div>
          <div style={{ fontSize: 14, color: dark, lineHeight: 1.7 }}>{report.discovery_insight}</div>
        </div>

        <div style={{ ...S.card("#F3F4F6"), border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 800, marginBottom: 6 }}>📝 오늘의 기록</div>
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{report.observation_record}</div>
        </div>

        <div style={{ ...S.card("#1a1a2e") }}>
          <div style={{ fontSize: 11, color: warm, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>💬 오늘 저녁, 아이에게 건네볼 한마디</div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: 14, borderLeft: `3px solid ${warm}` }}>
            <div style={{ fontSize: 14, color: "#fff", fontStyle: "italic", lineHeight: 1.6 }}>"{report.action_guide}"</div>
          </div>
        </div>

        {polaroids.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, color: "#795548", fontWeight: 700, marginBottom: 12 }}>📸 차차의 서재 — {childName}의 생각 흔적</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
              {polaroids.map((p, i) => (
                <div key={i} onClick={() => alert(`📖 ${p.book}\n\n"${p.text}"`)}
                  style={{ background: "#fff", borderRadius: 12, padding: "10px 8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{p.emotion}</div>
                  <div style={{ fontSize: 8, color: "#aaa", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.book}</div>
                  <div style={{ fontSize: 8, color: "#ccc", marginBottom: 4 }}>{p.date}</div>
                  <div style={{ fontSize: 9, color: dark, fontStyle: "italic", lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>"{p.text}"</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button onClick={reset} style={{ ...S.btn("#f5f5f5", "#666"), marginTop: 16 }}>차차 방으로 돌아가기</button>
      </div>
    </div>
  );

  return null;
}
