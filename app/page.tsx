"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CouncilDemo from "./CouncilDemo";
import PvExperience from "./PvExperience";

type TabId = "home" | "case" | "people";
type PersonTone = "white" | "red" | "gray";
type RelationshipTone = "hostile" | "support" | "power" | "complicity" | "witness" | "obsession";
type CastMember = {
  name: string;
  role: string;
  tone: PersonTone;
  line: string;
  quote: string;
  trait: string;
  standing: string;
  relation: string;
  portrait?: { src: string; position: string; detailPosition: string; zoom: string };
};
type CharacterRelationship = {
  from: string;
  to: string;
  label: string;
  detail: string;
  tone: RelationshipTone;
  direction: "one-way" | "mutual";
  mapLabel?: string[];
  labelShiftX?: number;
  labelShiftY?: number;
};

const nav: Array<[string, Exclude<TabId, "home">]> = [
  ["시스템", "case"],
  ["인물", "people"],
];

const entryFragments = [
  ["08:40 / 2학년 3반 출석 완료", 6, 13, 0],
  ["교내 질서 : 정상", 70, 17, 2.1],
  ["신고 기록을 찾을 수 없습니다", 12, 74, 4.3],
  ["모두가 보았지만 아무도 보지 못했다", 67, 69, 6.2],
  ["침묵은 동의로 처리됩니다", 73, 37, 8.5],
  ["목격자 상태 : 침묵", 7, 42, 10.4],
  ["피해 사실 : 확인 불가", 58, 84, 12.2],
  ["학교의 명예를 훼손하지 마십시오", 31, 23, 14.1],
  ["누가 먼저 입을 열 것인가", 33, 82, 16.5],
] as const;

const heroPvFrames = [
  { image: "./pv/01-sohyeon-greeting.webp", text: "누구에게나 사랑받는 아이였다" },
  { image: "./pv/02-heeju-mock.webp", text: "쟤 또 저러네" },
  { image: "./pv/06-funeral.webp", text: "그날 케이크만 사달라고 하지 않았으면" },
  { image: "./pv/08-doyoon-rejected.webp", text: "증거도 붙였는데 이걸 반려한다고" },
  { image: "./pv/10-seonghoon-anger.webp", text: "진술이 있고 기록이 있고" },
  { image: "./pv/15-crying-smile.webp", text: "제발 그만해주세요" },
  { image: "./pv/18-desk-graffiti.webp", text: "도와주려고 하지도 마" },
  { image: "./pv/17-transfer-student.webp", text: "일년 동안 잘 부탁해" },
] as const;

const cast: readonly CastMember[] = [
  { name: "이소현", role: "자발적 고립", tone: "white", line: "학업·품행·생활관리까지 완벽했던 엄친딸. 자신을 돕던 사람들이 보복으로 무너지는 것을 본 뒤 관계를 약점으로 판단해 스스로 외톨이가 되었다.", quote: "…신경 꺼. 너까지 망가지는 건 보기 싫어.", trait: "ISFJ · 6w5 · sp/sx", standing: "2학년 3반 · 피해 학생", relation: "도움을 밀어내면서도 곁을 바람", portrait: { src: "./characters/lee-sohyeon.png?v=7513771c15fd", position: "50% 20%", detailPosition: "50% 14%", zoom: "320%" } },
  { name: "김도윤", role: "증언을 삼킨 방관자", tone: "gray", line: "중학교 때 소현의 피해를 신고했다가 은폐와 보복을 겪었다. 진실과 조직적 은폐를 알지만 다시 표적이 될 공포와 죄책감 때문에 침묵한다.", quote: "저항하면 더 망가져. 난 이미 봤어.", trait: "INTP · 5w6 · sp/so", standing: "2학년 3반 · 중립 우등생", relation: "죄책감을 숨긴 회피", portrait: { src: "./characters/kim-doyoon.webp", position: "50% 24%", detailPosition: "50% 0%", zoom: "265%" } },
  { name: "진희주", role: "권력의 얼굴", tone: "red", line: "대담하고 충동적인 학폭 카르텔의 정점. 공개적인 굴복과 충성을 요구하며 통제권을 잃으면 과잉대응하지만 결국 아버지의 권력에 의존한다.", quote: "우리 아빠가 누군지 알고 까불어?", trait: "ESTP · 8w7 · so/sx", standing: "학폭 카르텔 서열 1위", relation: "복종을 요구하는 적대", portrait: { src: "./characters/jin-heeju.webp", position: "50% 16%", detailPosition: "50% 0%", zoom: "310%" } },
  { name: "서은정", role: "정치와 궤변", tone: "red", line: "불우한 가정을 숨기고 성공하기 위해 진희주의 권력을 동앗줄로 선택한 우등생. 말과 정치질, 가스라이팅으로 폭력을 질서처럼 보이게 만든다.", quote: "다들 조용히 지내면 아무 문제도 없잖아.", trait: "ENTP · 3w4 · so/sp", standing: "학폭 카르텔 서열 2위", relation: "논리전을 가장한 통제", portrait: { src: "./characters/seo-eunjeong.webp", position: "54% 34%", detailPosition: "54% 12%", zoom: "270%" } },
  { name: "윤서아", role: "체스판의 설계자", tone: "red", line: "진희주를 일진으로 부추기고 강태호를 끌어들인 실질적 흑막. 타인의 정신이 무너지는 과정을 즐기지만 판단력은 결국 오만한 고등학생 수준이다.", quote: "글쎄… 네가 이겼다고 생각해?", trait: "INTJ · 5w6 · sp/so", standing: "학폭 카르텔 서열 3위", relation: "관찰과 심리적 압박", portrait: { src: "./characters/yoon-seoa.webp", position: "50% 23%", detailPosition: "50% 0%", zoom: "300%" } },
  { name: "강태호", role: "원치 않는 무력", tone: "gray", line: "조폭인 부친이 진동욱과 얽혀 억지로 무리에 속했다. 위압과 폭력을 쓰기도 하지만 일진짓과 약자·여학생 괴롭힘을 혐오하며 소현은 건드리지 않는다.", quote: "꺼져라.", trait: "조폭 아들 · 과묵함 · 오토바이", standing: "학폭 카르텔 무력 1위", relation: "가담을 혐오하지만 이탈하지 못함", portrait: { src: "./characters/kang-taeho.webp", position: "80% 5%", detailPosition: "80% 0%", zoom: "360%" } },
  { name: "최유리", role: "불안한 동조자", tone: "gray", line: "교우관계와 소문을 잘 기억하지만 표적이 되는 것이 두려워 강자에게 동조한다. 죄책감을 느끼면서도 안전을 위해 진실을 잘라 말하거나 타인을 배신할 수 있다.", quote: "나까지 찍히면… 어떡해.", trait: "ESFJ · 6w7 · so/sp", standing: "2학년 3반 · 부분적 목격자", relation: "죄책감과 자기보호 사이의 동요", portrait: { src: "./characters/choi-yuri.webp", position: "50% 28%", detailPosition: "50% 8%", zoom: "285%" } },
  { name: "이도현", role: "학생회장", tone: "red", line: "경찰청장 아들이자 학생회장. 진희주와 결탁해 학생회 권한으로 학생들을 압박하며 소현을 자기 소유처럼 여기고 거절당할수록 통제를 강화한다.", quote: "학생회가 정한 질서에는 이유가 있어.", trait: "ESTJ · 3w2 · so/sp", standing: "학생회장 · 경찰청장 아들", relation: "체면과 소유욕에 기반한 집착", portrait: { src: "./characters/lee-dohyeon.png", position: "50% 14%", detailPosition: "50% 0%", zoom: "320%" } },
  { name: "안수진", role: "관찰자", tone: "white", line: "일진 무리를 모두 한심하게 보는 대기업 회장 딸이자 최상위권 천재. 소현을 돕지 않고 구원자가 나타나는 비극을 구경하며, 자신을 논리로 꺾은 상대에게 복종하고 집착하길 갈망한다.", quote: "더 보여주시겠어요? 어디까지 옳을 수 있는지.", trait: "ENFJ · 2w1 · so/sx", standing: "대기업 회장 딸 · 최상위권", relation: "지적 호기심이 집착으로 변할 가능성", portrait: { src: "./characters/ahn-sujin.webp", position: "54% 31%", detailPosition: "54% 7%", zoom: "280%" } },
  { name: "박성훈", role: "세 번 반려된 담임", tone: "gray", line: "소현을 지키기 위해 학폭위 자료를 세 차례 제출했지만 모두 반려되고 보복만 심해지는 것을 보았다. 체념했으나 카르텔을 끝내고 싶은 의지는 남아 있다.", quote: "하아… 그만둬라. 제발, 너까지는.", trait: "2학년 3반 담임 · 안경 없음", standing: "체념한 내부자", relation: "만류 뒤에 남은 죄책감과 의지", portrait: { src: "./characters/park-seonghoon.webp", position: "56% 31%", detailPosition: "56% 10%", zoom: "275%" } },
  { name: "서동환", role: "학교의 문지기", tone: "red", line: "진동욱의 권력에 복종하는 부패한 교장. 학교의 명예와 질서를 명분으로 폭력을 은폐하고 학생과 교사에게는 위압적이지만 권력자 앞에서는 비굴하다.", quote: "학교의 명예를 먼저 생각해야 합니다.", trait: "한빛고등학교 교장", standing: "진동욱 카르텔의 교내 하수인", relation: "가식적인 압박과 책임 회피", portrait: { src: "./characters/seo-donghwan.webp", position: "44% 13%", detailPosition: "44% 0%", zoom: "300%" } },
  { name: "진동욱", role: "국회의원", tone: "red", line: "진희주의 친부인 현역 국회의원. 딸보다 자신의 정치 생명을 먼저 지키며 권력·인맥·돈을 도구로 삼고, 필요하면 가족과 측근도 버린다.", quote: "학생, 선을 넘으면 서로 피곤해집니다.", trait: "현역 국회의원 · 진희주 친부", standing: "권력과 은폐의 정점", relation: "회유 가능한 위험요소로 판단", portrait: { src: "./characters/jin-dongwook.webp", position: "50% 17%", detailPosition: "50% 18%", zoom: "310%" } },
];

const characterGallery: Record<string, string[]> = {
  "이소현": ["./characters/lee-sohyeon-scene-01.webp", "./characters/lee-sohyeon-scene-02.png", "./characters/lee-sohyeon-scene-03.webp", "./characters/lee-sohyeon-scene-04.webp"],
  "김도윤": ["./characters/kim-doyoon-scene-01.webp", "./characters/kim-doyoon-scene-02.webp", "./characters/kim-doyoon-scene-03.webp", "./characters/kim-doyoon-scene-04.webp"],
  "진희주": ["./characters/jin-heeju-scene-01.webp", "./characters/jin-heeju-scene-02.webp", "./characters/jin-heeju-scene-03.webp", "./characters/jin-heeju-scene-04.webp"],
  "서은정": ["./characters/seo-eunjeong-scene-01.webp", "./characters/seo-eunjeong-scene-02.webp", "./characters/seo-eunjeong-scene-03.webp", "./characters/seo-eunjeong-scene-04.webp"],
  "윤서아": ["./characters/yoon-seoa-scene-01.webp", "./characters/yoon-seoa-scene-02.webp", "./characters/yoon-seoa-scene-03.webp", "./characters/yoon-seoa-scene-04.webp"],
  "강태호": ["./characters/kang-taeho-scene-01.webp", "./characters/kang-taeho-scene-02.webp", "./characters/kang-taeho-scene-03.webp", "./characters/kang-taeho-scene-04.webp"],
  "최유리": ["./characters/choi-yuri-scene-01.webp", "./characters/choi-yuri-scene-02.webp", "./characters/choi-yuri-scene-03.webp", "./characters/choi-yuri-scene-04.webp"],
  "이도현": ["./characters/lee-dohyeon-scene-01.webp", "./characters/lee-dohyeon-scene-02.webp", "./characters/lee-dohyeon-scene-03.webp", "./characters/lee-dohyeon-scene-04.webp"],
  "안수진": ["./characters/ahn-sujin-scene-01.webp", "./characters/ahn-sujin-scene-02.webp", "./characters/ahn-sujin-scene-03.webp", "./characters/ahn-sujin-scene-04.webp"],
  "박성훈": ["./characters/park-seonghoon-scene-01.webp", "./characters/park-seonghoon-scene-02.webp", "./characters/park-seonghoon-scene-03.webp", "./characters/park-seonghoon-scene-04.webp"],
  "서동환": ["./characters/seo-donghwan-scene-01.webp", "./characters/seo-donghwan-scene-02.webp", "./characters/seo-donghwan-scene-03.webp", "./characters/seo-donghwan-scene-04.webp"],
  "진동욱": ["./characters/jin-dongwook-scene-01.webp", "./characters/jin-dongwook-scene-02.webp", "./characters/jin-dongwook-scene-03.webp", "./characters/jin-dongwook-scene-04.webp"],
};

const characterRelationships: CharacterRelationship[] = [
  { from: "김도윤", to: "이소현", label: "죄책감 · 침묵", detail: "과거 소현의 피해를 신고했다가 보복당한 뒤, 다시 표적이 될 공포 때문에 진실을 알고도 침묵한다.", tone: "witness", direction: "one-way", labelShiftY: -30 },
  { from: "진희주", to: "이소현", label: "지배 · 공개적 폭력", detail: "소현을 굴복시켜 자신의 서열과 아버지의 권력이 건재하다는 것을 교실 전체에 증명하려 한다.", tone: "hostile", direction: "one-way", labelShiftX: -52, labelShiftY: -28 },
  { from: "최유리", to: "이소현", label: "동조 · 죄책감", detail: "피해를 알면서도 자신이 표적이 될까 두려워 진실을 잘라 말한다. 외면할수록 죄책감은 깊어진다.", tone: "witness", direction: "one-way", labelShiftX: 0, labelShiftY: -24 },
  { from: "이도현", to: "이소현", label: "소유 · 학생회 통제", detail: "소현의 거절을 관계의 끝이 아니라 자신의 권위에 대한 모욕으로 받아들이며 학생회 권한까지 동원한다.", tone: "obsession", direction: "one-way", labelShiftY: -30 },
  { from: "안수진", to: "이소현", label: "관찰 · 비극 소비", detail: "소현을 돕지 않은 채 그녀를 구할 누군가가 등장하는 비극적 구도를 가장 가까이서 관찰한다.", tone: "obsession", direction: "one-way", labelShiftX: 25, labelShiftY: -18 },
  { from: "박성훈", to: "이소현", label: "죄책감 · 보호 의지", detail: "세 차례 반려된 신고 뒤 체념했지만, 소현을 지키지 못했다는 죄책감과 카르텔을 끝내려는 의지는 남아 있다.", tone: "support", direction: "one-way", labelShiftX: -25, labelShiftY: -18 },
  { from: "진동욱", to: "진희주", label: "권력 · 조건부 보호", detail: "딸보다 정치 생명을 우선한다. 진희주를 보호하지만 자신에게 위험해지는 순간에는 언제든 버릴 수 있다.", tone: "power", direction: "one-way", labelShiftX: 74, labelShiftY: -8 },
  { from: "진동욱", to: "서동환", label: "외압 · 복종", detail: "진동욱의 외압은 서동환을 거쳐 학교의 명예, 교칙, 행정 절차라는 얼굴로 교내에 집행된다.", tone: "power", direction: "one-way", labelShiftX: -20, labelShiftY: -18 },
  { from: "진동욱", to: "강태호", label: "부친 연결 · 강제 편입", detail: "강태호는 부친과 진동욱의 이해관계 때문에 진희주 무리에 묶여 있으며 쉽게 이탈하지 못한다.", tone: "power", direction: "one-way", mapLabel: ["부친 연결", "강제 편입"], labelShiftX: 54, labelShiftY: -12 },
  { from: "진희주", to: "서은정", label: "권력과 지능의 공생", detail: "진희주는 빽과 서열을, 서은정은 궤변과 여론 조작을 제공하며 서로의 폭력을 효율적으로 만든다.", tone: "complicity", direction: "mutual", labelShiftX: 0, labelShiftY: -108 },
  { from: "윤서아", to: "진희주", label: "부추김 · 체스말", detail: "윤서아는 진희주가 군림할 판을 짰다고 자만하며, 진희주의 권력을 자신의 설계가 낳은 결과처럼 여긴다.", tone: "complicity", direction: "one-way", labelShiftX: -18, labelShiftY: -68 },
  { from: "진희주", to: "강태호", label: "명령 · 불쾌한 복종", detail: "진희주는 강태호의 무력을 자기 권력으로 취급하지만, 강태호는 가담 자체와 약자 괴롭힘을 혐오한다.", tone: "complicity", direction: "one-way", labelShiftX: 96, labelShiftY: -74 },
  { from: "진희주", to: "이도현", label: "학생회 결탁", detail: "두 사람은 서로의 집안과 교내 권한을 이용해 폭력과 통제를 공식적인 질서처럼 포장한다.", tone: "complicity", direction: "mutual", labelShiftX: 34, labelShiftY: -58 },
  { from: "서은정", to: "이소현", label: "지배 · 공개적 모욕", detail: "서은정은 궤변과 가스라이팅과 여론몰이로 소현을 고립시키고 공개적인 모욕을 폭력의 도구로 삼는다.", tone: "hostile", direction: "one-way", labelShiftX: 92, labelShiftY: 2 },
  { from: "윤서아", to: "이소현", label: "지배 · 공개적 모욕", detail: "윤서아는 소현의 심리를 파고들어 반응을 유도하고 공개적인 모욕으로 정신적 지배를 시도한다.", tone: "hostile", direction: "one-way", labelShiftX: -92, labelShiftY: 2 },
  { from: "윤서아", to: "안수진", label: "까탈스러운 존재", detail: "안수진은 일진 무리를 모두 한심하게 여기며, 윤서아는 자기 심리전과 설계에 쉽게 휘둘리지 않는 안수진을 까탈스러운 존재로 본다.", tone: "complicity", direction: "one-way", labelShiftX: 18, labelShiftY: -36 },
  { from: "박성훈", to: "서동환", label: "반려된 저항", detail: "박성훈이 제출한 학폭위 자료는 서동환의 학교 행정과 외압 앞에서 세 차례 반려되었다.", tone: "hostile", direction: "one-way", labelShiftX: -14, labelShiftY: 8 },
];

const relationshipPositions: Record<string, { x: number; y: number }> = {
  "이소현": { x: 50, y: 48 },
  "진동욱": { x: 69, y: 12 },
  "서동환": { x: 32, y: 13 },
  "박성훈": { x: 17, y: 31 },
  "안수진": { x: 83, y: 30 },
  "김도윤": { x: 11, y: 53 },
  "이도현": { x: 89, y: 53 },
  "최유리": { x: 12, y: 74 },
  "강태호": { x: 83, y: 76 },
  "윤서아": { x: 35, y: 88 },
  "진희주": { x: 50, y: 86 },
  "서은정": { x: 70, y: 84 },
};

const relationshipLegend: Array<[string, RelationshipTone]> = [
  ["적대", "hostile"],
  ["조력", "support"],
  ["권력", "power"],
  ["공모", "complicity"],
  ["방관", "witness"],
  ["집착", "obsession"],
];

const relationshipEdgeStyle = ({ from, to }: CharacterRelationship) => {
  const start = relationshipPositions[from];
  const end = relationshipPositions[to];
  const deltaX = end.x - start.x;
  const deltaY = (end.y - start.y) * 0.625;
  const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  return {
    "--edge-x": `${start.x}%`,
    "--edge-y": `${start.y}%`,
    "--edge-length": `${length}%`,
    "--edge-angle": `${angle}deg`,
  } as React.CSSProperties;
};

const relationshipEdgeLabelStyle = ({ from, to, labelShiftX = 0, labelShiftY = -34 }: CharacterRelationship) => {
  const start = relationshipPositions[from];
  const end = relationshipPositions[to];
  return {
    "--edge-label-x": `${(start.x + end.x) / 2}%`,
    "--edge-label-y": `${(start.y + end.y) / 2}%`,
    "--edge-label-shift-x": `${labelShiftX}px`,
    "--edge-label-shift-y": `${labelShiftY}px`,
  } as React.CSSProperties;
};

const publicAssetUrl = (source: string) =>
  `${import.meta.env.BASE_URL}${source.replace(/^\.?\//, "")}`;

const portraitStyle = (person: CastMember): React.CSSProperties | undefined => person.portrait ? ({
  "--portrait-image": `url("${publicAssetUrl(person.portrait.src)}")`,
  "--portrait-position": person.portrait.position,
  "--portrait-detail-position": person.portrait.detailPosition,
  "--portrait-zoom": person.portrait.zoom,
} as React.CSSProperties) : undefined;

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [pvOpen, setPvOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [activePerson, setActivePerson] = useState(0);
  const [personView, setPersonView] = useState<"files" | "relations">("files");
  const [relationshipFocus, setRelationshipFocus] = useState("이소현");
  const [lightboxImage, setLightboxImage] = useState<{ src: string; index: number; person: string } | null>(null);
  const [heroPvIndex, setHeroPvIndex] = useState(0);

  useEffect(() => {
    if (!entered) return;
    const timer = window.setTimeout(() => setIntroHidden(true), 720);
    return () => window.clearTimeout(timer);
  }, [entered]);

  useEffect(() => {
    const syncFromHash = () => {
      const next = window.location.hash.slice(1) as TabId;
      setActiveTab(nav.some(([, id]) => id === next) ? next : "home");
    };
    syncFromHash();
    window.addEventListener("popstate", syncFromHash);
    return () => window.removeEventListener("popstate", syncFromHash);
  }, []);

  useEffect(() => {
    if (!entered || activeTab !== "home") return;
    const timer = window.setInterval(() => setHeroPvIndex((current) => (current + 1) % heroPvFrames.length), 3200);
    return () => window.clearInterval(timer);
  }, [activeTab, entered]);

  useEffect(() => {
    if (!lightboxImage) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxImage(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [lightboxImage]);

  const activePersonData = cast[activePerson] ?? cast[0];
  const personInitial = useMemo(() => activePersonData.name.slice(-2), [activePersonData.name]);
  const focusedRelationshipPerson = cast.find((person) => person.name === relationshipFocus) ?? cast[0];
  const focusedRelationships = characterRelationships.filter((relationship) => relationship.from === relationshipFocus || relationship.to === relationshipFocus);

  const openPerson = (name: string) => {
    const index = cast.findIndex((person) => person.name === name);
    if (index < 0) return;
    setActivePerson(index);
    setPersonView("files");
  };

  const changeTab = (next: TabId) => {
    setActiveTab(next);
    window.history.pushState(null, "", next === "home" ? window.location.pathname : `#${next}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const closePv = useCallback(() => setPvOpen(false), []);
  const enterFromPv = useCallback(() => setEntered(true), []);

  return (
    <main id="top" className="archive-root">
      {!introHidden && (
        <section className={`entry-screen ${entered ? "entry-screen--exit" : ""}`} aria-label="학교라는 이름의 감옥 진입 화면" aria-hidden={pvOpen || undefined} inert={pvOpen || undefined}>
          <div className="entry-noise" aria-hidden="true" />
          <div className="entry-scan" aria-hidden="true" />
          <div className="entry-fragments" aria-hidden="true">
            {entryFragments.map(([text, x, y, delay]) => (
              <p key={text} style={{ "--entry-x": `${x}%`, "--entry-y": `${y}%`, "--entry-delay": `${delay}s`, "--entry-steps": text.length } as React.CSSProperties}><span>{text}</span></p>
            ))}
          </div>
          <div className="entry-meta entry-meta--right"><i />교내 기록 연결 중</div>
          <div className="entry-content">
            <h1 className="sr-only">학교라는 이름의 감옥</h1>
            <span className="entry-logo-image" aria-hidden="true" />
            <p>침묵이 질서가 된 교실</p>
            <div className="entry-actions">
              <button className="entry-action entry-action--pv" type="button" onClick={() => setPvOpen(true)}>PV 영상 보기</button>
              <button className="entry-action" type="button" onClick={() => setEntered(true)}>사건 기록 열람</button>
            </div>
          </div>
        </section>
      )}

      {pvOpen && <PvExperience onCancel={closePv} onEnterSite={enterFromPv} onComplete={closePv} />}

      <div className={`site-shell tab-${activeTab}`} aria-hidden={!entered || pvOpen || undefined} inert={!entered || pvOpen || undefined}>
        <header className="topbar">
          <button className="brand" type="button" onClick={() => changeTab("home")} aria-label="학교라는 이름의 감옥 홈 화면으로 이동"><span className="brand-logo-image" aria-hidden="true" /></button>
          <nav aria-label="주요 메뉴">
            {nav.map(([label, id]) => <button type="button" key={id} className={activeTab === id ? "active" : ""} aria-current={activeTab === id ? "page" : undefined} onClick={() => changeTab(id)}>{label}</button>)}
          </nav>
        </header>

        <section className="hero tab-panel" data-panel="home" aria-labelledby="hero-title">
          <div className="grain" aria-hidden="true" />
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-title-lockup hero-title-lockup--image">
                <h1 id="hero-title" className="sr-only">학교라는 이름의 감옥</h1>
                <span className="hero-logo-crop" aria-hidden="true" />
              </div>
              <p className="hero-lede">모두가 알고 있다. 교사도, 학생도, 피해자도.<br />다만 누구도 먼저 입을 열지 않을 뿐이다.</p>
              <div className="hero-actions">
                <button className="primary-action" type="button" onClick={() => changeTab("case")}>사건 기록 열람 <b>→</b></button>
                <button className="text-action" type="button" onClick={() => changeTab("people")}>등장인물 조회 <b>→</b></button>
                <button className="text-action" type="button" onClick={() => setPvOpen(true)}>PV 다시보기 <b>↗</b></button>
              </div>
            </div>

            <aside className="surveillance" aria-label="프롤로그 PV 무한 반복 미리보기">
              <button className="hero-pv-loop" type="button" onClick={() => setPvOpen(true)} aria-label="프롤로그 PV 전체 화면으로 보기">
                <span className="hero-pv-visual" key={heroPvFrames[heroPvIndex].image}>
                  <img src={heroPvFrames[heroPvIndex].image} alt="" />
                  <span className="hero-pv-shade" aria-hidden="true" />
                  <strong>{heroPvFrames[heroPvIndex].text}</strong>
                </span>
                <span className="hero-pv-control"><b>프롤로그 PV</b><i>{String(heroPvIndex + 1).padStart(2, "0")} / {String(heroPvFrames.length).padStart(2, "0")}</i></span>
              </button>
            </aside>
          </div>
          <div className="hero-index" aria-hidden="true"><span>02</span><i /><span>03</span><i /><span>17</span></div>
        </section>

        <div className="tab-panel case-panel" data-panel="case">
          <section className="incident-system section-shell" aria-labelledby="incident-title">
            <div className="incident-heading">
              <h2 id="incident-title">한 사건은 끝나지 않고<br /><em>다음 충돌의 이유가 된다</em></h2>
              <p>수업과 시험은 평범하게 이어지지만 직전 장면에서 생긴 상처와 소문과 선택은 사라지지 않는다</p>
            </div>
            <ol className="incident-flow" aria-label="사건 진행 흐름">
              <li><span>01</span><b>사건</b><p>평범한 학교 일상 속 감시와 소문과 압박이 실제 행동으로 드러난다</p></li>
              <li><span>02</span><b>선택</b><p>누구의 편에 서고 무엇을 감수할지 당신이 직접 결정한다</p></li>
              <li><span>03</span><b>대립</b><p>학급의회와 물리적 충돌 등 상황에 맞는 방식으로 갈등이 표면화된다</p></li>
              <li><span>04</span><b>후속 결과</b><p>평판과 관계와 부상과 정보가 다음 인물의 행동과 사건을 바꾼다</p></li>
            </ol>
            <div className="conflict-mode-grid" aria-label="작품의 핵심 시스템">
              <article><span>±</span><h3>평판</h3><p>선악이 아닌 전교생의 신뢰와 공포와 인정이 공개된 사건의 결과로 움직인다</p></article>
              <article><span>📜</span><h3>학급의회</h3><p>논리와 증거뿐 아니라 궤변과 조롱과 공포까지 청중의 판단을 흔든다</p></article>
              <article><span>⚔️</span><h3>물리적 충돌</h3><p>부상과 거리와 기습과 수적 차이가 승패뿐 아니라 이후 행동에도 남는다</p></article>
              <article><span>◎</span><h3>관계와 정보</h3><p>쌓인 신뢰와 적대 그리고 각자가 실제로 아는 범위가 협력과 배신을 결정한다</p></article>
            </div>
            <aside className="reputation-note" aria-label="교내 평판 설명">
              <div><strong>-100%</strong><i>—</i><strong>100%</strong></div>
              <p><b>평판은 전교생의 지지율이다</b> 옳고 그름의 점수가 아니라 학생들이 당신을 얼마나 믿고 두려워하며 강한 인물로 보는지를 나타낸다 공개적인 압도와 학급의회 결과와 부상과 교사의 처분 같은 사건의 파장으로 변한다</p>
            </aside>
          </section>
          <section className="council-section" aria-labelledby="council-title">
            <div className="section-shell council-layout"><div className="council-copy"><h2 id="council-title">학급의회</h2><p className="council-lede">학생들 앞에서 즉시 시작되는 공개 여론전. 공격자는 압박하고 방어자는 대응한 뒤 공격권을 이어받는다.</p><ul><li>개인전과 팀전 모두 가능</li><li>논리와 증거와 궤변과 권력 과시를 모두 판정</li><li>공포로 얻은 지지도 역시 실제 여론으로 작동</li><li>같은 수법도 상대와 청중에 따라 결과가 달라짐</li></ul></div><CouncilDemo /></div>
          </section>
          <section className="case-strip" aria-label="사건 개요">
            <p>교실의 침묵은 공개토론과 충돌을 거쳐 학교 밖 권력으로 번진다</p>
            <dl>
              <div><dt>장소</dt><dd>한빛고등학교 2학년 3반</dd></div>
              <div><dt>핵심 위협</dt><dd>학폭 카르텔 / 부패 권력 / 침묵</dd></div>
              <div><dt>사건 구조</dt><dd>선택 → 충돌 → 평판 → 후속 결과</dd></div>
            </dl>
          </section>
        </div>

        <section className="people-section tab-panel" data-panel="people" aria-labelledby="people-title">
          <div className="section-shell">
            <div className="section-heading-row"><div><h2 id="people-title">교실 안과 밖의 사람들</h2></div><p>친구, 가해자, 방관자, 조력자.<br />한 사람에게도 한 가지 얼굴만 있지는 않다.</p></div>
            <div className="character-view-tabs" role="tablist" aria-label="인물 정보 보기">
              <button type="button" role="tab" aria-selected={personView === "files"} className={personView === "files" ? "active" : ""} onClick={() => setPersonView("files")}><b>인물 기록</b></button>
              <button type="button" role="tab" aria-selected={personView === "relations"} className={personView === "relations" ? "active" : ""} onClick={() => { setPersonView("relations"); setRelationshipFocus("이소현"); }}><b>관계 추적</b></button>
            </div>
            {personView === "files" ? (
              <div className="character-browser">
                <div className="character-roster" aria-label="인물 명부"><h3 className="mobile-roster-title">인물 선택</h3>{cast.map((person, index) => <button type="button" key={person.name} className={`roster-card tone-${person.tone} ${activePerson === index ? "active" : ""}`} style={{ "--delay": `${index * 35}ms` } as React.CSSProperties} aria-pressed={activePerson === index} onClick={() => setActivePerson(index)}><span className={`roster-mark ${person.portrait ? "has-portrait" : ""}`} style={portraitStyle(person)} aria-hidden="true">{person.portrait ? "" : person.name.slice(-1)}</span><span className="roster-meta"><b>{person.name}</b><i>{person.role}</i></span></button>)}</div>
                <aside className={`character-dossier tone-${activePersonData.tone}`} aria-live="polite">
                  <div className="dossier-hero">{activePersonData.portrait ? <span className="dossier-portrait" role="img" aria-label={`${activePersonData.name} 얼굴 프로필`} style={portraitStyle(activePersonData)} /> : <span className="dossier-initial" aria-hidden="true">{personInitial}</span>}<div><small>{activePersonData.standing}</small><h3>{activePersonData.name}</h3><p>{activePersonData.role}</p><blockquote className="dossier-hero-quote">“{activePersonData.quote}”</blockquote></div></div>
                  <article><span>인물 기록</span><p>{activePersonData.line}</p></article>
                  <section className="dossier-gallery" aria-label={`${activePersonData.name} 장면 사진`}>
                    <div className="dossier-gallery-head"><span>이미지 미리보기</span><b>4장</b></div>
                    <div>
                      {characterGallery[activePersonData.name].map((image, index) => (
                        <figure key={image}>
                          <button className="gallery-open" type="button" onClick={() => setLightboxImage({ src: image, index, person: activePersonData.name })} aria-label={`${activePersonData.name} 장면 ${index + 1} 크게 보기`}>
                            <img src={image} alt={`${activePersonData.name} 장면 ${index + 1}`} loading="lazy" />
                            <span aria-hidden="true">확대</span>
                          </button>
                          <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
                        </figure>
                      ))}
                    </div>
                  </section>
                  <button className="dossier-next" type="button" onClick={() => setActivePerson((activePerson + 1) % cast.length)}>다음 인물 파일 <b>→</b></button>
                </aside>
              </div>
            ) : (
              <section className="relationship-panel" role="tabpanel" aria-label="인물 관계 추적">
                <div className="relationship-panel-head">
                  <div><h3>이소현을 중심으로 얽힌 침묵과 권력</h3><p>인물을 선택하면 해당 인물과 연결된 관계선과 기록만 강조됩니다.</p></div>
                  <div className="relationship-legend" aria-label="관계 유형">{relationshipLegend.map(([label, tone]) => <span className={`tone-${tone}`} key={tone}><i />{label}</span>)}</div>
                </div>
                <div className="relationship-map" role="group" aria-label="이소현 중심 인물 관계도">
                  <div className="relationship-radar" aria-hidden="true"><i /><i /><i /><i /></div>
                  {characterRelationships.map((relationship) => {
                    const isActive = relationship.from === relationshipFocus || relationship.to === relationshipFocus;
                    return <span className={`relationship-edge tone-${relationship.tone} ${isActive ? "is-active" : ""}`} data-direction={relationship.direction} style={relationshipEdgeStyle(relationship)} key={`edge-${relationship.from}-${relationship.to}`} aria-hidden="true" />;
                  })}
                  {characterRelationships.map((relationship) => {
                    const isActive = relationship.from === relationshipFocus || relationship.to === relationshipFocus;
                    return <span className={`relationship-edge-label tone-${relationship.tone} ${relationship.mapLabel ? "is-multiline" : ""} ${isActive ? "is-active" : ""}`} style={relationshipEdgeLabelStyle(relationship)} key={`label-${relationship.from}-${relationship.to}`} aria-hidden="true">{(relationship.mapLabel ?? [relationship.label]).map((line) => <span key={line}>{line}</span>)}</span>;
                  })}
                  {cast.map((person) => {
                    const position = relationshipPositions[person.name];
                    const isActive = relationshipFocus === person.name;
                    const isConnected = focusedRelationships.some((relationship) => relationship.from === person.name || relationship.to === person.name);
                    return (
                      <button className={`relationship-node tone-${person.tone} ${person.name === "이소현" ? "is-root" : ""} ${isActive ? "active" : ""} ${!isActive && !isConnected ? "is-muted" : ""}`} type="button" aria-label={`${person.name} 관계 보기`} aria-pressed={isActive} onClick={() => setRelationshipFocus(person.name)} style={{ "--node-x": `${position.x}%`, "--node-y": `${position.y}%` } as React.CSSProperties} key={person.name}>
                        <span className="relationship-node-portrait" style={portraitStyle(person)} aria-hidden="true" />
                        <b>{person.name}</b><small>{person.role}</small>
                      </button>
                    );
                  })}
                </div>
                <aside className={`relationship-inspector tone-${focusedRelationshipPerson.tone}`} aria-live="polite">
                  <div className="relationship-inspector-profile">
                    <span className="relationship-inspector-portrait" style={portraitStyle(focusedRelationshipPerson)} aria-hidden="true" />
                    <div><h3>{focusedRelationshipPerson.name}</h3><p>{focusedRelationshipPerson.standing}<i> · </i>{focusedRelationshipPerson.role}</p></div>
                    <button type="button" onClick={() => openPerson(focusedRelationshipPerson.name)}>인물 자세히 보기 <b>→</b></button>
                  </div>
                  <ul className="relationship-records">
                    {focusedRelationships.map((relationship) => {
                      const otherName = relationship.from === relationshipFocus ? relationship.to : relationship.from;
                      const direction = relationship.direction === "mutual" ? "↔" : relationship.from === relationshipFocus ? "→" : "←";
                      return <li className={`tone-${relationship.tone}`} key={`${relationship.from}-${relationship.to}-detail`}><div><button type="button" onClick={() => setRelationshipFocus(otherName)}>{relationshipFocus} {direction} {otherName}</button><b>{relationship.label}</b></div><p>{relationship.detail}</p></li>;
                    })}
                  </ul>
                </aside>
              </section>
            )}
          </div>
        </section>

        <footer><div><strong>학교라는 이름의 감옥</strong></div><button type="button" onClick={() => changeTab("home")}>처음으로 ↑</button></footer>
      </div>

      {lightboxImage && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`${lightboxImage.person} 확대 이미지`}>
          <button className="image-lightbox-backdrop" type="button" onClick={() => setLightboxImage(null)} aria-label="확대 이미지 닫기" />
          <div className="image-lightbox-panel">
            <div className="image-lightbox-head">
              <span>{lightboxImage.person} · 장면 {lightboxImage.index + 1}</span>
              <button type="button" onClick={() => setLightboxImage(null)} aria-label="확대 이미지 닫기">닫기 <b>×</b></button>
            </div>
            <img src={lightboxImage.src} alt={`${lightboxImage.person} 확대 장면 ${lightboxImage.index + 1}`} />
            <p>이미지 바깥을 클릭하거나 ESC 키를 누르면 닫힙니다</p>
          </div>
        </div>
      )}
    </main>
  );
}
