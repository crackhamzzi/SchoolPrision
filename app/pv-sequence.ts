export type PvLine = {
  speaker: string;
  text: string;
  tone: "white" | "black";
};

export type PvBeat = {
  id: string;
  chapter: string;
  kind: "black" | "image" | "title";
  duration: number;
  image?: string;
  titleUpper?: string;
  titleLower?: string;
  focus?: string;
  motion?: "push" | "pull" | "drift-left" | "drift-right" | "still";
  narration?: string;
  lines?: PvLine[];
  emphasis?: "quiet" | "critical" | "memory";
};

const white = (speaker: string, text: string): PvLine => ({ speaker, text, tone: "white" });
const black = (speaker: string, text: string): PvLine => ({ speaker, text, tone: "black" });

export const pvBeats: readonly PvBeat[] = [
  { id: "opening", chapter: "PROLOGUE 01", kind: "black", duration: 3300, narration: "누구에게나 사랑받는 아이였다.", emphasis: "memory" },
  { id: "greeting", chapter: "BEFORE THE FALL", kind: "image", duration: 4800, image: "/pv/01-sohyeon-greeting.webp", focus: "50% 42%", motion: "pull", lines: [white("이소현", "응 내일 봐!"), white("이소현", "조심해서 가!")] },
  { id: "heeju-mock", chapter: "THE FIRST CRACK", kind: "image", duration: 6500, image: "/pv/02-heeju-mock.webp", focus: "52% 35%", motion: "drift-left", lines: [black("진희주", "쟤 또 저러네."), black("진희주", "남자애들 앞에서\n아주 살살 녹는다?"), black("진희주", "얼굴 좀 된다고\n처 나대고 다니는 거야?")] },
  { id: "unbothered-note", chapter: "BEFORE THE FALL", kind: "black", duration: 2500, narration: "별로 신경 쓰지 않았다.", emphasis: "quiet" },
  { id: "unbothered", chapter: "BEFORE THE FALL", kind: "image", duration: 5000, image: "/pv/03-sohyeon-unbothered.webp", focus: "50% 40%", motion: "drift-right", lines: [white("이소현", "뭐."), white("이소현", "내가 예쁘게 태어난 걸\n나보고 어쩌라고.")] },
  { id: "heeju-scheming", chapter: "THE FIRST CRACK", kind: "image", duration: 3000, image: "/pv/04-heeju-scheming.webp", focus: "57% 38%", motion: "push", lines: [black("진희주", "저 새끼가 진짜…….")] },

  { id: "pride", chapter: "PROLOGUE 02", kind: "black", duration: 6000, narration: "가식 떠는 법도 몰랐다.\n어디 가서 지는 것도 싫었다.\n\n공부도 친구도 학교생활도.", emphasis: "memory" },
  { id: "brilliant", chapter: "THE BRILLIANT DAYS", kind: "image", duration: 4300, image: "/pv/05-sohyeon-brilliant.webp", focus: "45% 42%", motion: "drift-left", narration: "그때까지의 나는—\n정말 찬란했다.", emphasis: "memory" },
  { id: "christmas", chapter: "DECEMBER 25", kind: "black", duration: 2800, narration: "중학교 때의 크리스마스.", emphasis: "quiet" },
  { id: "parents", chapter: "ACCIDENT RECORD", kind: "black", duration: 4000, narration: "부모님이\n교통사고로 돌아가셨다.\n\n나 혼자 남겨두고.", emphasis: "critical" },
  { id: "funeral-guilt", chapter: "ACCIDENT RECORD", kind: "black", duration: 4200, narration: "아니.\n\n사실은 내가 죽인 거다.", emphasis: "critical" },
  { id: "funeral-if", chapter: "ACCIDENT RECORD", kind: "image", duration: 5600, image: "/pv/06-funeral.webp", focus: "50% 34%", motion: "push", narration: "그날 케이크만 사달라고 하지 않았으면\n\n이런 일 없었을 텐데", emphasis: "quiet" },
  { id: "uncle-call", chapter: "UNKNOWN VOICE", kind: "black", duration: 1800, narration: "소현아.", emphasis: "quiet" },
  { id: "uncle", chapter: "UNKNOWN GUARDIAN", kind: "image", duration: 2600, image: "/pv/07-breakdown.webp", focus: "50% 38%", motion: "push", lines: [white("이주원", "삼촌이야.")] },
  { id: "hell-begins", chapter: "PROLOGUE 02", kind: "black", duration: 5000, narration: "그 이후였다.\n\n내 학창생활이\n지옥이 된 것은.", emphasis: "critical" },

  { id: "no-strength", chapter: "PROLOGUE 03", kind: "black", duration: 4300, narration: "막을 힘이\n없었던 건 아니다.\n\n싸울 수도 있었다.\n따질 수도 있었다.", emphasis: "quiet" },
  { id: "no-strength-after", chapter: "PROLOGUE 03", kind: "black", duration: 4500, narration: "하지만 그때의 나는\n\n그런 유치한 싸움에 쓸 힘조차\n남아 있지 않았다.", emphasis: "critical" },
  { id: "escalation", chapter: "CASE ESCALATION", kind: "black", duration: 3700, narration: "그런데 내가 꺾이지 않자\n괴롭힘은 점점 더 심해졌다.", emphasis: "critical" },
  { id: "doyoon-rejected", chapter: "REPORT REJECTED", kind: "image", duration: 6000, image: "/pv/08-doyoon-rejected.webp", focus: "51% 43%", motion: "drift-right", lines: [white("김도윤", "…반려?"), white("김도윤", "증거도 붙였는데?"), white("김도윤", "…이걸 반려한다고?")] },
  { id: "heeju-retaliation", chapter: "RETALIATION", kind: "image", duration: 6500, image: "/pv/09-heeju-retaliation.webp", focus: "50% 39%", motion: "push", lines: [black("진희주", "야 김도윤.\n너 학폭위 넣었더라?"), black("진희주", "정의의 사도 납셨네?"), black("진희주", "그래서.\n뭐 좀 달라졌어?")] },

  { id: "teacher-anger", chapter: "PROLOGUE 04", kind: "image", duration: 5300, image: "/pv/10-seonghoon-anger.webp", focus: "48% 38%", motion: "drift-right", lines: [white("박성훈", "아니 이게 어떻게\n반려입니까?"), white("박성훈", "진술이 있고!\n기록이 있고!")] },
  { id: "principal-confrontation", chapter: "ADMINISTRATION", kind: "image", duration: 8200, image: "/pv/11-principal-confrontation.webp", focus: "53% 46%", motion: "push", lines: [white("교장", "박 선생.\n조금 진정하세요."), white("교장", "학생들 사이의 다툼을\n너무 크게—"), black("박성훈", "다툼?\n이 씨발……."), black("박성훈", "넌 저게 장난으로 보여?\n네 딸 상태가 저래도\n장난이야? 어?")] },
  { id: "helpers-break", chapter: "WITNESS MEMORY", kind: "black", duration: 5300, narration: "이상했다.\n\n나를 괴롭히는 사람보다—\n나를 도와주는 사람들이\n더 망가지고 있었다.", emphasis: "critical" },
  { id: "endure", chapter: "WITNESS MEMORY", kind: "black", duration: 2400, narration: "학교폭력 자체는 버틸 수 있었다.", emphasis: "quiet" },
  { id: "endure-hit", chapter: "WITNESS MEMORY", kind: "black", duration: 950, narration: "맞아도.", emphasis: "critical" },
  { id: "endure-insult", chapter: "WITNESS MEMORY", kind: "black", duration: 950, narration: "욕을 먹어도.", emphasis: "critical" },
  { id: "endure-alone", chapter: "WITNESS MEMORY", kind: "black", duration: 1250, narration: "혼자가 되어도.", emphasis: "critical" },
  { id: "cannot-endure", chapter: "WITNESS MEMORY", kind: "black", duration: 4700, narration: "그런데—\n\n나 때문에\n다른 사람이 무너지는 건\n견딜 수 없었다.", emphasis: "critical" },

  { id: "teacher-documents", chapter: "REPORT 03", kind: "image", duration: 2600, image: "/pv/12-seonghoon-documents.webp", focus: "52% 44%", motion: "drift-left", lines: [white("이소현", "…선생님.")] },
  { id: "this-time", chapter: "REPORT 03", kind: "image", duration: 7000, image: "/pv/13-this-time.webp", focus: "59% 43%", motion: "push", lines: [white("박성훈", "어 소현아.\n이번엔 진짜야."), white("박성훈", "자료 다시 만들었어."), white("박성훈", "교육청에도 직접 넣을 거고."), white("박성훈", "이번엔… 진짜 된다.")] },

  { id: "stop-teacher", chapter: "PROLOGUE 06", kind: "image", duration: 6700, image: "/pv/14-stop-teacher.webp", focus: "48% 38%", motion: "pull", lines: [white("이소현", "선생님.\n…이제 그만해주세요."), white("박성훈", "뭐?\n그게 무슨 말이야."), white("박성훈", "거의 다 됐어.\n소현아 이번엔 진짜로—")] },
  { id: "long-pause", chapter: "SILENCE", kind: "black", duration: 1900, narration: "……", emphasis: "quiet" },
  { id: "please-stop", chapter: "SURRENDER", kind: "image", duration: 3600, image: "/pv/15-crying-smile.webp", focus: "50% 40%", motion: "push", lines: [black("이소현", "제발…….\n그만해주세요.")] },
  { id: "i-am-fine", chapter: "SURRENDER", kind: "black", duration: 4600, narration: "저 괜찮아요\n\n이 정도는 버틸 수 있어요", emphasis: "quiet" },

  { id: "teacher-collapse", chapter: "PROLOGUE 07", kind: "image", duration: 8200, image: "/pv/16-seonghoon-collapse.webp", focus: "58% 39%", motion: "drift-left", lines: [white("이소현", "선생님이\n더 힘들어지잖아요."), white("이소현", "저 때문에 또 누가 다치는 거…\n이제 싫어요."), white("이소현", "그러니까\n그만해주세요."), white("이소현", "그래도.\n챙겨주셔서 고마웠어요 선생님.")] },
  { id: "alone", chapter: "SELF DEFENSE", kind: "black", duration: 4000, narration: "괜찮아.\n\n아무도 도와주지 않아도 돼.", emphasis: "quiet" },
  { id: "desk", chapter: "DAILY RECORD", kind: "image", duration: 3900, image: "/pv/18-desk-graffiti.webp", focus: "50% 50%", motion: "drift-right", narration: "신경 쓰지 마.\n\n쳐다보지도 마.", emphasis: "critical" },
  { id: "tray", chapter: "DAILY RECORD", kind: "image", duration: 3900, image: "/pv/19-lunch-tray.webp", focus: "50% 45%", motion: "push", narration: "도와주려고 하지도 마.\n\n나는 혼자서도 괜찮으니까.", emphasis: "critical" },

  { id: "transfer-warning", chapter: "PROLOGUE 08", kind: "image", duration: 5800, image: "/pv/17-transfer-student.webp", focus: "50% 48%", motion: "pull", narration: "그러니까 너도—\n\n빨리 알아챘으면 좋겠어.\n\n이 교실에서는", emphasis: "quiet" },
  { id: "every-choice", chapter: "PROLOGUE 08", kind: "image", duration: 5000, image: "/pv/17-transfer-student.webp", focus: "50% 45%", motion: "push", narration: "누구와 친해지는지도\n누구에게 말을 거는지도\n\n전부 의미가 있는 걸.", emphasis: "critical" },
  { id: "welcome", chapter: "TRANSFER STUDENT", kind: "black", duration: 3600, narration: "일년 동안 잘 부탁해", emphasis: "critical" },
  { id: "title", chapter: "COMPLETE EDITION", kind: "title", duration: 5200, titleUpper: "/pv/title-upper.webp", titleLower: "/pv/title-lower.webp", emphasis: "critical" },
] as const;

export const totalPvDuration = pvBeats.reduce((total, beat) => total + beat.duration, 0);
