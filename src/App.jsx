import { useState, useEffect, useRef } from "react";
import BOOKS from "./books.json";
import BOOKS_DETAIL from "./books-detail.json";

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
const LOADING_MSGS = [
  "열심히 꾹꾹이하며 리포트를 빚는 중이다냥...",
  "키보드 위를 뒹굴며 데이터를 모으는 중이다냥...",
  "츄르 한 입 먹고 다시 힘내서 불러온다냥!",
  "꼬리로 로딩 바를 영차영차 채우는 중이다냥...",
  "잠깐 졸았지만 다시 눈 크게 뜨고 찾는 중이다냥!",
  "먼지 쌓인 마법 책을 조심조심 펼치는 중이다냥...",
  "도서관 구석구석에서 책들을 냄새 맡아 찾는 중이다냥...",
  "수많은 페이지 속에서 딱 맞는 단서를 찾는 중이다냥...",
  "주인공들을 제자리에 예쁘게 돌려놓는 중이다냥...",
  "우주 최고의 리포트를 위해 영혼을 갈아 넣고 있다냥!",
  "엄청난 데이터의 바다를 열심히 헤엄치는 중이다냥 💦",
  "AI 고양이의 두뇌가 풀가동 중이다냥! 지잉지잉...",
  "조금만 기다려달라냥! 발바닥에 땀나게 뛰고 있다냥!",
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

// ─── 장르 추측 (AR 기반) ───
function guessGenre(book) {
  const detail = BOOKS_DETAIL.find(d => d.title === book.title);
  if (detail?.genre) return detail.genre;
  const ar = parseFloat(book.ar) || 3.0;
  if (ar >= 5.5) return "adventure";
  if (ar >= 4.5) return "mystery";
  if (ar >= 3.0) return "comedy";
  return "emotion";
}

function getRewardItem(book) {
  const genre = guessGenre(book);
  const useBookItem = Math.random() < 0.3;
  if (useBookItem && JUNK_ITEMS_BOOK[genre]) {
    const bookItems = JUNK_ITEMS_BOOK[genre];
    return bookItems[Math.floor(Math.random() * bookItems.length)];
  }
  return JUNK_ITEMS_BASE[Math.floor(Math.random() * JUNK_ITEMS_BASE.length)];
}

// ─── 장르별 차차 모드 ───
const GENRE_CONFIG = {
  adventure: { openings: ["오늘 모험 어땠냥?", "읽다가 두근거렸냥?", "재밌었어?", "나 그 장면 읽다가 심장 쫄렸다냥!", "오늘 모험 진짜 스케일 크던데?"] },
  mystery:   { openings: ["잠깐, 이거 이상하지 않아?", "차차는 범인 딱 감 왔는데...", "너는 누구라고 생각했어?"] },
  comedy:    { openings: ["아 ㅋㅋㅋ 이거 완전 반칙 아니냐", "나 웃다가 책 떨어뜨림", "이거 읽다가 진짜 뒤집어졌다냥"] },
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
  mystery:   { chacha_says: ["차차는 여기서 계속 궁금해서 책을 못 덮었다냥!","너는 어떤 게 제일 궁금했어?"], choices: ["다음에 무슨 일이 생길지!","주인공이 왜 그랬는지!","결말이 어떻게 될지!"] },
  comedy:    { chacha_says: ["나 여기서 웃다가 책 떨어뜨림 ㅋㅋ", "제일 웃겼던 장면이 어디야?"], choices: ["처음부터 웃겼어!", "중간에 빵 터졌어", "끝이 제일 웃겼어"] },
  emotion: { chacha_says: ["차차도 읽다가 뭔가 마음이 찡했다냥...", "너는 어떤 장면이 제일 마음에 남았어?"], choices: ["처음 장면!", "중간 장면!", "마지막 장면!"] },
};
const SECOND_ROUND = {
  adventure: { chacha_says: ["오~ 그 장면이 그렇게 느껴졌구나냥", "어떤 생각이 들었어?"], choices: ["주인공이 용감해서!", "위험해 보여서", "나도 모르겠어"] },
  mystery:   { chacha_says: ["흠... 차차는 그 장면이 계속 생각나더라냥","어떤 부분이 제일 신기했어?"], choices: ["단서가 있었어!", "그냥 느낌!", "다른 캐릭터 때문에"] },
  comedy:    { chacha_says: ["ㅋㅋ 차차도 거기서 웃겼냥", "어느 부분이 제일 기억에 남았어?"], choices: ["너무 황당해서!", "주인공이 바보 같아서", "예상 밖이라서"] },
  emotion:   { chacha_says: ["그 장면... 차차도 좀 마음이 쓰였다냥", "그때 어떤 마음이었어?"], choices: ["주인공이 불쌍해서", "나도 비슷한 적 있어서", "결말이 슬퍼서"] },
};
const THIRD_ROUND = {
  adventure: { chacha_says: ["차차는 사실 겁쟁이라 못 했을 것 같은데냥 ㅠ", "너라면 어떻게 했을 것 같아?"], choices: ["나도 용감하게 했을 거야!", "솔직히 도망갔을 것 같아", "친구랑 같이 했을 거야"] },
  mystery:   { chacha_says: ["차차라면 끝까지 궁금해서 잠도 못 잤을 것 같다냥","너라면 어떻게 했을 것 같아?"], choices: ["응 나 맞출 수 있었어!", "아마 틀렸을 것 같아", "더 단서 모았을 거야"] },
  comedy:    { chacha_says: ["차차라면 거기서 완전 뻘쭘했을 것 같은데냥", "너라면 어떻게 했을 것 같아?"], choices: ["나도 웃겼을 것 같아!", "나는 안 그랬을 것 같은데", "더 웃기게 했을 거야"] },
  emotion:   { chacha_says: ["차차는 그 상황에서 어떻게 해야 할지 몰랐을 것 같다냥...", "너라면 어떻게 했을 것 같아?"], choices: ["옆에 있어줬을 거야", "도와주려고 했을 것 같아", "나도 어떻게 할지 몰랐을 것 같아"] },
};

function getEdgeResponse(input) {
  if (!input || input.trim() === "") return "어? 말하려다 멈췄냥? 괜찮아. 천천히냥.";
  if (/똥|방귀|poop/.test(input)) return "야! 그건 방귀어잖아 ㅋㅋ 진짜 버전도 들려줘냥!";
  if (/ㅋㅋ|ㅎㅎ/.test(input)) return "오 ㅋㅋ 뭐가 그렇게 웃겨? 나도 알고 싶다냥!";
  if (/모르겠|몰라/.test(input)) return "나도 사실 좀 헷갈렸다냥. 같이 생각해보자냥?";
  return null;
}

// ─── AR 기반 라운드 계산 ───
function getRounds(book) {
  const ar = parseFloat(book.ar) || 3.0;
  if (ar < 3.0) return 3;
  if (ar < 5.0) return 5;
  return 7;
}
function guessGenre(book) {
  let detail = BOOKS_DETAIL.find(d => d.title === book.title);
  if (!detail && book.seriesTitle) {
    detail = BOOKS_DETAIL.find(d => d.title === book.seriesTitle);
  }
  if (!detail) {
    detail = BOOKS_DETAIL.find(d => book.title.startsWith(d.title) || d.title.startsWith(book.title));
  }
  if (detail?.genre) return detail.genre;
  const ar = parseFloat(book.ar) || 3.0;
  if (ar >= 5.5) return "adventure";
  if (ar >= 4.5) return "mystery";
  if (ar >= 3.0) return "comedy";
  return "emotion";
}

// ─── AI 대화 생성 ───
async function generateDialogue(book, childName, prevAnswer, roundNum, totalRounds, allConversations = [], nextType = "") {
  const genre = guessGenre(book);
  const persona = detectPersona(prevAnswer);
  const reaction = PERSONA_REACTIONS[persona]?.[Math.floor(Math.random() * 3)] || "";
  const isLast = roundNum === totalRounds;
  const isSecondLast = roundNum === totalRounds - 1;
  const convHistory = allConversations.length > 0
   ? `\n[지금까지 대화 기록]\n${allConversations.map((c, i) => `Q${i+1}: ${c.q}\n아이: ${c.a}`).join("\n")}\n→ 위 질문들과 절대 겹치지 않는 완전히 새로운 각도의 질문을 만들어. 같은 단어, 같은 주제 반복 금지. 이전 질문이 "장면"을 물었으면 다음은 "감정"을, "감정"을 물었으면 "행동"을 물어봐. ${nextType ? `다음 질문은 반드시 "${nextType}"에 대해 물어봐.` : ""}`
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
[장르]: ${genre}
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
`당신은 리딩차차의 "차차 관찰 노트" 작성자입니다.

목표: 엄마가 오늘 저녁 아이에게 자연스럽게 한마디를 건네게 만드는 것.

[핵심 원칙]
모든 문장은 반드시 둘 중 하나:
- Evidence: 아이의 실제 발화·선택·반응 기반
- Action: 엄마가 오늘 바로 쓸 수 있는 문장
이 둘 중 어느 쪽도 아닌 문장은 삭제한다.

[Evidence 정의]
반드시 아래 중 하나여야 한다:
1. 아이가 실제로 말한 문장
2. 아이가 선택한 선택지
3. 외부에서 관측 가능한 행동 (반응·멈춤·반복 등)
해석이 섞이면 Evidence가 아니다. 추정·의도 해석 금지.

[관찰 우선순위]
1. 평소와 다른 반응 (의외성 최우선)
2. 반응 타이밍·속도·멈춤의 변화
3. 선택 방식의 변화
4. 반복 패턴
5. 일반 행동 (최후 수단)
→ 반드시 "평소와 다른 점" 1개 이상 포함. 없으면 "미세한 차이"를 선택.

[절대 금지]
- "~한 아이예요" (한 번의 대화로 아이를 정의 금지)
- "~입니다" 설명형 문장
- 감정 단정 ("행복해 보였다")
- 일반화 ("보통 아이들은")
- 책 줄거리 요약
- 엄마 훈계

${mailboxSection}

[대화 기록]
책: ${book.title} / 아이: ${childName}
${convText}

JSON만 반환. 설명 없이:
{
"child_quote": "아이 실제 발화 또는 선택을 그대로 기록한다. 수정·요약·의역 금지. 그 순간성이 가장 강한 것 1개만 선택한다. 비밀 우체통 쪽지가 있으면 최우선으로 사용한다.",
"discovery_insight": "말투: 반드시 ~했어요 / ~보였어요 / ~것 같아요 체로 끝낼 것. '~했다' '~지점이다' '~수 있다' 같은 보고서체는 절대 금지. 형식: '오늘 {이름}은 [구체적인 관찰 사실]. [그 관찰에서 조심스럽게 추측할 수 있는 해석 한 줄].' 최대 2문장. 실제 대화와 행동을 기반으로 작성하며 과도한 일반화·평가·칭찬·훈계는 금지한다. 발달 단계나 성격을 단정 짓지 말 것. 관찰되지 않은 감정이나 의도를 단정하지 말고, 실제 대화와 행동에서 확인된 내용만 바탕으로 작성할 것.",
"action_guide": "엄마가 저녁에 아이에게 그대로 말할 수 있는 자연스러운 대화 한 문장을 생성한다. 【핵심 원칙】1) 오늘 아이가 실제로 한 말에서 자연스럽게 이어져야 한다. 2) 그 말을 하지 않았다면 나올 수 없는 질문이어야 한다. 3) 엄마도 정답을 모르는 열린 질문이어야 한다. 【작성 규칙】4) 아이가 실제로 오늘 말한 문장 또는 핵심 표현을 그대로 또는 의미를 유지하는 범위에서 자연스럽게 인용해서 시작할 것. 5) 새로운 발화는 만들어내지 말 것. 6) 가능하면 '아까 ○○라고 했잖아' 형태로 시작할 것. 7) 엄마가 읽어도 어색하지 않을 것. 8) 아이가 자기 경험이나 생각을 편하게 이야기하기 쉬울 것. 9) 정답을 맞히는 느낌이 아니라 이야기를 이어가는 느낌일 것. 10) 아이를 이름이나 '너' 외의 3인칭으로 지칭하지 말 것. 11) 질문은 하나의 주제만 다룰 것. 12) 반드시 물음표로 끝날 것. 13) 설명이나 훈계 없이 딱 한 문장만 작성할 것.",
"chacha_memo": "차차 말투로 작성한다. 오늘 아이가 실제로 한 행동 또는 실제 발화 1개를 반드시 포함한다. 추상적인 표현이나 일반적인 칭찬은 사용하지 않는다.",
"polaroid_text": "차차가 오늘 가장 기억에 남은 아이의 실제 말이나 행동 하나를 떠올리며 남기는 한 줄 메모. 관찰하거나 기억하는 느낌으로 작성하고, 아이를 놀리거나 섭섭해하거나 평가하는 말투는 사용하지 않는다. 차차다운 귀엽고 가벼운 말투를 사용하며, 실제 대화 내용을 바탕으로 매번 다르게 작성한다. 반드시 '~냥'으로 끝낸다.",
"polaroid_emotion": "😹 또는 🤔 또는 🥺 또는 😳 또는 ❤️ 중 하나를 선택한다."

}
}`
        }]
      })
    });
    const data = await res.json();
    return JSON.parse(data.content[0].text.replace(/```json|```/g, "").trim());
 } catch {
    return {
      child_quote: mailboxNote || "재밌었어!",
      discovery_insight: "오늘 대화를 불러오지 못했어요. 다시 시도해주세요.",
      action_guide: "오늘은 가장 기억에 남는 장면을 물어보세요.\n→ 어떤 부분이 제일 재밌었어?",
      chacha_memo: "앗, 차차가 잠깐 졸았나봐냥... 다시 해줘냥!",
      polaroid_text: "오늘 대화 기억 저장 실패다냥...",
      polaroid_emotion: "😳",
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
 const [messages, setMessages] = useState([]); // {role: "chacha"|"child", text: string}
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
  const [bookTitle, setBookTitle] = useState("");
const [loadingMsg] = useState(() => LOADING_MSGS[Math.floor(Math.random() * LOADING_MSGS.length)]);
const bottomRef = useRef(null);
const [usedTypes, setUsedTypes] = useState([]);
const [showFreeText, setShowFreeText] = useState(false);
const [freeTextInput, setFreeTextInput] = useState("");
const [bookList] = useState(() => {
  const notRead = BOOKS.filter(b => !readBooks.includes(b.title));
  return [...notRead].sort(() => Math.random() - 0.5).slice(0, 5);
});  

  // ─── 시리즈물 감지 ───
  const isSeries = selectedBook ? selectedBook.type === "series" : false;

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
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);
  
  // ─── 유틸 ───
  const displayBooks = () => {
    const notRead = BOOKS.filter(b => !readBooks.includes(b.title));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return notRead.filter(b => b.title.toLowerCase().includes(q));
    }
    if (showAllBooks) return notRead;
const sliced = bookList;
if (selectedBook && !sliced.find(b => b.title === selectedBook.title)) {
  return [selectedBook, ...sliced.slice(0, 4)];
}
return sliced;
  };

  const getChachaEmoji = () => {
    if (tapCount <= 1) return "😴";
    if (tapCount <= 3) return "🐱";
    return "😺";
  };

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

    // ─── 책 파악 AI 호출 (1회) ───
    let chachaOpening = `${finalTitle} 읽었구나냥!`;
    
    // ─── aiHint 추출 ───
    const bookDetail = BOOKS_DETAIL.find(b => b.title === selectedBook.title);
    const hint = bookDetail?.aiHint || bookDetail?.tagline || "";
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 150,
          messages: [{ role: "user", content:
`너는 치즈냥이 차차야. 허술하고 능청스러운 고양이 친구.
"${finalTitle}" 책을 읽은 아이에게 첫 인사를 해줘.

책 정보: "${hint}"

규칙:
- 위 책 정보 외 내용 생성 금지
- 구체적인 장면이나 사건 절대 언급 금지
- 주인공 이름 + 전체 분위기 1문장
- 차차가 그 분위기에서 어떻게 느꼈는지 1문장
- 가끔 ~냥 사용
- 2문장 이내
- 질문 하지 마 (질문은 다음에 따로 나옴)
- 예시: "라모나는 뭔가 항상 터뜨리는 느낌이잖아냥 ㅋㅋ 차차는 그 에너지가 좋더라냥!"

2문장만 반환. JSON 아님. 그냥 텍스트.`
          }]
        })
      });
      const data = await res.json();
      chachaOpening = data.content?.[0]?.text?.trim() || chachaOpening;
    } catch {
      // 실패하면 기본 멘트로
    }

  const openingMsgs = [chachaOpening, ...(firstRound.chacha_says || [])].map(t => ({ role: "chacha", text: t }));
setMessages(openingMsgs);
setCurrentDialogue({ ...firstRound, question: firstRound.chacha_says?.join(" ") || "" });
setLoading(false);
  };

  // ─── 하드코딩 라운드 ───
  const getHardcodedRound = (rNum, book) => {
    const g = guessGenre(book);
    if (rNum === 1) return FIRST_ROUND[g] || FIRST_ROUND.adventure;
    if (rNum === 2) return SECOND_ROUND[g] || SECOND_ROUND.adventure;
    if (rNum === 3) return THIRD_ROUND[g] || THIRD_ROUND.adventure;
    return null;
  };

// ─── 선택지 클릭 ───
  const handleChoice = async (choice) => {
    const edgeRes = getEdgeResponse(choice);
    const newConv = { q: currentDialogue?.question || "", a: choice };
    const newConvs = [...conversations, newConv];
    setConversations(newConvs);
    setMessages([{ role: "child", text: choice }]);
    if (roundNum >= totalRounds) {
      setMessages(prev => [...prev,
        { role: "chacha", text: "으아앙! 네 덕분에 오늘 츄르값을 벌었다냥!" },
        { role: "chacha", text: "잠깐 기다려봐냥... 뭔가 만들고 있어..." }
      ]);
      setScreen("reward");
      return;
    }

setLoading(true);
const nextRound = roundNum + 1;
const reaction = edgeRes || `"${choice}" 냥~`;
setMessages(prev => [...prev, { role: "chacha", text: reaction }]);

const hardcoded = getHardcodedRound(nextRound, selectedBook);
if (hardcoded) {
  setTimeout(() => {
    setMessages(prev => [...prev, ...(hardcoded.chacha_says || []).map(t => ({ role: "chacha", text: t }))]);
    setCurrentDialogue({ ...hardcoded, question: hardcoded.chacha_says?.join(" ") || "" });
    setRoundNum(nextRound);
    setLoading(false);
  }, 600);
} else {
  const types = ["장면", "감정", "행동", "상상"];
  const nextType = types.find(t => !usedTypes.includes(t)) || "상상";
  setUsedTypes(prev => [...prev, nextType]);
  const next = await generateDialogue(selectedBook, childName, choice, nextRound, totalRounds, newConvs, nextType);
  setTimeout(() => {
    setMessages(prev => [...prev, ...(next.chacha_says || []).map(t => ({ role: "chacha", text: t }))]);
    setCurrentDialogue({ ...next, question: next.chacha_says?.join(" ") || "" });
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
const newP = { 
  book: selectedBook.seriesTitle ? `${selectedBook.seriesTitle} - ${selectedBook.title}` : selectedBook.title, 
  text: rep.polaroid_text, 
  emotion: rep.polaroid_emotion || "❤️", 
  date: new Date().toLocaleDateString("ko-KR") 
};
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
setShowFreeText(false); setFreeTextInput("");
    setUsedTypes([]);
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

  // ─── AR 표시 텍스트 ───
  const arDisplay = (ar) => `AR ${ar}`;

  // ─── 방 성장 단계 ───
  const getRoomStage = (inv) => {
    const count = inv.length;
    if (count >= 15) return { name: "아늑한 방 🏠", emoji: "🏠" };
    if (count >= 10) return { name: "캣타워 🗼", emoji: "🗼" };
    if (count >= 6)  return { name: "쿠션 🛋", emoji: "🛋" };
    if (count >= 3)  return { name: "종이박스 📦", emoji: "📦" };
    return { name: "빈 방", emoji: "🕳️" };
  };

  // ══ FAKE DOOR ══
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
  <div style={{ fontSize: 9, color: "#888", marginBottom: 2, fontWeight: 700 }}>📖 {p.book}</div>
  <div style={{ fontSize: 8, color: "#ccc", marginBottom: 6 }}>{p.date}</div>
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
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>우리 이제 친구인데, 뭐라고 부르면 될까? 😸</div>
          <input value={childName}
            onChange={e => { setChildName(e.target.value); localStorage.setItem("rcChildName", e.target.value); }}
            placeholder="닉네임!"
            style={{ width: "100%", padding: "14px", borderRadius: 12, border: `2px solid ${warm}`, fontSize: 16, fontWeight: 700, textAlign: "center", outline: "none", boxSizing: "border-box" }} />
        </div>

        {!showAllBooks ? (
          <>
            <div style={{ fontSize: 13, color: dark, fontWeight: 700, marginBottom: 8 }}>🐱 차차가 고른 책</div>
            {displayBooks().length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#aaa", fontSize: 13 }}>
                읽을 책이 없다냥... 전체 목록을 확인해봐!
              </div>
            ) : displayBooks().map((book, idx) => (
              <div key={idx} onClick={() => setSelectedBook(book)}
                style={{ ...S.card(selectedBook?.title === book.title ? "#FFF3E0" : "#fff", selectedBook?.title === book.title ? warm : "transparent"), cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>📚</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{book.title}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{arDisplay(book.ar)}</div>
                  <div style={{ fontSize: 10, color: "#aaa" }}>{getRounds(book)}문제 · {book.type === "series" ? "시리즈" : "단행본"}</div>
                </div>
                {selectedBook?.title === book.title && <div style={{ fontSize: 18 }}>✅</div>}
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
              placeholder="🔍 책 제목 검색..."
              autoFocus
              style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `2px solid ${warm}`, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              {(() => {
                const notRead = BOOKS.filter(b => !readBooks.includes(b.title));
                const q = searchQuery.toLowerCase();
                const filtered = q ? notRead.filter(b => b.title.toLowerCase().includes(q)) : notRead;
                return filtered.length > 0
                  ? filtered.map((book, idx) => (
                      <div key={idx} onClick={() => setSelectedBook(book)}
                        style={{ ...S.card(selectedBook?.title === book.title ? "#FFF3E0" : "#fff", selectedBook?.title === book.title ? warm : "transparent"), cursor: "pointer", display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ fontSize: 24 }}>📚</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{book.title}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>{arDisplay(book.ar)}</div>
                          <div style={{ fontSize: 10, color: "#aaa" }}>{getRounds(book)}문제 · {book.type === "series" ? "시리즈" : "단행본"}</div>
                        </div>
                        {selectedBook?.title === book.title && <div>✅</div>}
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

        {selectedBook && isSeries && (
          <div style={S.card()}>
            <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>
              📖 {selectedBook.type === "series" && selectedBook.seriesType === "numbered"
                ? `${selectedBook.title} 몇 번 읽었어?`
                : `${selectedBook.title} 어떤 책 읽었어?`}
              <span style={{ color: "#FF8F00", fontSize: 11 }}> *필수</span>
            </div>
            <input
              value={bookTitle}
              onChange={e => setBookTitle(e.target.value)}
              placeholder={selectedBook.seriesType === "numbered" ? "예: 5권, Book 5" : "예: Ramona the Brave"}
             style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: `2px solid ${warm}`, fontSize: 14, outline: "none", boxSizing: "border-box", background: "#FFF9C4" }}
            />
           
          </div>
        )}

        <button
          onClick={startDialog}
          disabled={!childName || !selectedBook || (isSeries && !bookTitle.trim())}
          style={S.btn(warm, dark, !childName || !selectedBook || (isSeries && !bookTitle.trim()))}>
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
    <div style={{ fontSize: 10, color: "#795548" }}>
  {selectedBook?.seriesTitle ? `${selectedBook.seriesTitle} ${selectedBook.title}` : selectedBook?.title}
</div>
        </div>
        <div style={{ fontSize: 11, color: "#795548", background: "rgba(255,255,255,0.5)", borderRadius: 10, padding: "4px 8px" }}>{roundNum}/{totalRounds}</div>
      </div>
      <div style={{ ...S.body, paddingBottom: 140 }}>
        {messages.map((m, i) => (
          m.role === "chacha" ? (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, animation: "fadeIn 0.3s ease" }}>
              <span style={{ fontSize: 24, alignSelf: "flex-end", flexShrink: 0 }}>🐱</span>
              <div style={S.bubble}>{m.text}</div>
            </div>
          ) : (
            <div key={i} style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
              <div style={{ background: warm, borderRadius: "20px 20px 4px 20px", padding: "12px 16px", fontSize: 14, color: "#fff", fontWeight: 700, maxWidth: "75%" }}>{m.text}</div>
            </div>
          )
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🐱</span>
            <div style={{ ...S.bubble, color: "#aaa" }}>생각 중이다냥...</div>
          </div>
        )}
      </div>
      <div ref={bottomRef} />
     {!loading && currentDialogue?.choices && (
  <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 390, background: bg, padding: "12px 16px", borderTop: "1px solid #FFE082" }}>
    {!showFreeText ? (
      <>
        {currentDialogue.choices.map((c, i) => (
          <button key={i} onClick={() => handleChoice(c)} style={S.choice}>{c}</button>
        ))}
        <button onClick={() => setShowFreeText(true)} style={{ ...S.choice, background: "#F3F0FF", border: "2px solid #B39DDB", color: "#5E35B1" }}>
          ✏️ 내 생각 쓰기
        </button>
      </>
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <textarea
          value={freeTextInput}
          onChange={e => setFreeTextInput(e.target.value)}
          placeholder="내 생각을 써봐!"
          autoFocus
          style={{ width: "100%", padding: "12px", borderRadius: 12, border: "2px solid #B39DDB", fontSize: 14, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "'Noto Sans KR',sans-serif", height: 80 }}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setShowFreeText(false); setFreeTextInput(""); }} style={{ ...S.choice, flex: 1, textAlign: "center", background: "#f5f5f5", border: "2px solid #ddd", color: "#888" }}>
            ← 돌아가기
          </button>
          <button
            onClick={() => { if (freeTextInput.trim()) { handleChoice(freeTextInput.trim()); setShowFreeText(false); setFreeTextInput(""); } }}
            disabled={!freeTextInput.trim()}
            style={{ ...S.choice, flex: 2, textAlign: "center", background: freeTextInput.trim() ? "#5E35B1" : "#ddd", color: freeTextInput.trim() ? "#fff" : "#999", border: "none" }}>
            전송 🐾
          </button>
        </div>
      </div>
    )}
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
              style={{ fontSize: 64, cursor: "pointer", userSelect: "none" }}
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
          <div style={{ fontSize: 13, color: "#aaa", marginTop: 24 }}>{loadingMsg}</div>
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
          <div style={{ fontSize: 11, color: "#795548" }}>
  {selectedBook?.seriesTitle ? `${selectedBook.seriesTitle} ${selectedBook.title}` : selectedBook?.title}
</div>
        </div>
        <button onClick={copyReport} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>📋</button>
      </div>
      <div style={S.body}>
        <div style={{ ...S.card("linear-gradient(135deg,#FFF9C4,#FFF3E0)"), border: `2px solid ${warm}`, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: warm, fontWeight: 800, letterSpacing: 1, marginBottom: 8 }}>🐱 오늘의 반짝 문장</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: dark, lineHeight: 1.6, fontStyle: "italic", marginBottom: 8 }}>"{report.child_quote}"</div>
          <div style={{ fontSize: 12, color: "#795548" }}>—  {childName} ({selectedBook?.seriesTitle ? `${selectedBook.seriesTitle} ${selectedBook.title}` : selectedBook?.title})</div>
        </div>

        <div style={{ ...S.card("#FFF8E1"), border: "1px solid #FFE082" }}>
          <div style={{ fontSize: 11, color: "#FF8F00", fontWeight: 800, marginBottom: 6 }}>💡 차차의 발견</div>
          <div style={{ fontSize: 14, color: dark, lineHeight: 1.7 }}>{report.discovery_insight}</div>
        </div>

        <div style={{ ...S.card("#1a1a2e") }}>
          <div style={{ fontSize: 11, color: warm, fontWeight: 800, marginBottom: 12, textAlign: "center" }}>💬 오늘 저녁, 이렇게 말해보세요</div>
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
