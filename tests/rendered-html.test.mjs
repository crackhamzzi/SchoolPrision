import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the school suspense archive", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /학교라는 이름의 감옥/);
  assert.match(html, /침묵이 질서가 된 교실/);
  assert.match(html, /class="surveillance(?:\s|")/);
  assert.match(html, /class="case-strip"/);
  assert.match(html, /선택 → 충돌 → 평판 → 후속 결과/);
  assert.match(html, /한빛고등학교 2학년 3반/);
  assert.doesNotMatch(html, /크랙고등학교/);
  assert.match(html, /학교라는 이름의 감옥 진입 화면/);
  assert.match(html, /교내 기록 연결 중/);
  assert.doesNotMatch(html, /COMPLETE EDITION|FICTIONAL STORY ARCHIVE|RELATIONSHIP CHART|SELECTED IDENTITY|ACTIVE RECORD|OBSESSION/);
  assert.doesNotMatch(html, /본 작품은 학교폭력과 권력형 은폐를 다루는 허구의 심리 서스펜스입니다/);
  assert.doesNotMatch(html, /CASE FILE|CASE 02-03|01 \/ CASE/);
  assert.doesNotMatch(html, />위협<\/button>|>기록<\/button>|이주원/);
  for (const addedName of ["강태호", "최유리", "이도현", "안수진", "서동환"]) {
    assert.match(html, new RegExp(addedName));
  }
});

test("ships the archive template with the full-screen prologue PV", async () => {
  const [page, pv, sequence] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/PvExperience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/pv-sequence.ts", import.meta.url), "utf8"),
  ]);

  for (const tab of ["시스템", "인물"]) {
    assert.match(page, new RegExp(`\\["${tab}"`));
  }
  assert.doesNotMatch(page, /\["학급의회", "council"\]/);
  assert.doesNotMatch(page, /type TabId = [^;]*"council"/);
  assert.match(page, /data-panel="case"[\s\S]*<CouncilDemo \/>/);
  assert.ok(page.indexOf('className="case-strip"') > page.indexOf('className="council-section"'));
  assert.match(page, /trait: "한빛고등학교 교장"/);
  assert.doesNotMatch(page, /크랙고등학교/);
  assert.doesNotMatch(pv, /prison-pv-hud|한빛고등학교 비공개 기록|장면 \{index \+ 1\}/);
  assert.match(pv, /className="prison-pv-controls"/);
  assert.doesNotMatch(pv, /크랙고등학교/);
  assert.doesNotMatch(page, /폭력보다 오래 남는 것은|모두가 외면했다는 기억/);
  for (const mode of ["평판", "학급의회", "물리적 충돌", "관계와 정보"]) {
    assert.match(page, new RegExp(`<h3>${mode}<\\/h3>`));
  }
  assert.doesNotMatch(page, /PUBLIC TRIAL|<h3>법정<\/h3>/);
  assert.match(page, /className="brand"[\s\S]*className="brand-logo-image"/);
  assert.doesNotMatch(page, /className="brand"[\s\S]*<i>완전판<\/i>/);
  assert.match(page, /className="hero-logo-crop"/);
  assert.match(page, /className="entry-logo-image"/);
  assert.doesNotMatch(page, /className="hero-edition"/);
  assert.doesNotMatch(page, /INCIDENT PROGRESSION|PUBLIC ARGUMENT SYSTEM|PUBLIC ARGUMENT|SCHOOL REPUTATION|PHYSICAL CONFLICT|RELATION & KNOWLEDGE/);
  assert.match(page, /평판은 전교생의 지지율이다/);
  assert.doesNotMatch(page, /\["위협", "pressure"\]|\["기록", "records"\]/);
  assert.match(page, /entryFragments/);
  assert.match(page, /heroPvFrames/);
  assert.match(page, /setInterval[\s\S]*heroPvFrames\.length/);
  assert.match(page, /className="hero-pv-loop"/);
  assert.doesNotMatch(page, /terminalMessages|2학년 3반 기억 기록|기록 중/);
  assert.match(page, /personView/);
  assert.match(page, /PvExperience/);
  assert.match(page, /PV 영상 보기/);
  assert.match(page, /PV 다시보기/);
  assert.match(pv, /role="dialog"/);
  assert.match(pv, /aria-label="다음 장면">다음<\/button>/);
  assert.match(pv, /const stripSentenceMarks = \(text: string\) => text\.replace\(\/\[\.,\]\/g, ""\)/);
  assert.match(pv, /stripSentenceMarks\(beat\.narration\)/);
  assert.match(pv, /stripSentenceMarks\(line\.text\)/);
  assert.match(pv, /prison-pv-beat-\$\{beat\.id\}/);
  assert.match(pv, />마지막<\/button>/);
  assert.match(sequence, /누구에게나 사랑받는 아이였다/);
  assert.match(sequence, /일년 동안 잘 부탁해/);
  assert.doesNotMatch(sequence, /아무것도 들리지 않던 장례식장|funeral-silence/);
  assert.doesNotMatch(sequence, /엄마도|아빠도/);
  assert.doesNotMatch(sequence, /소현은 들었지만|며칠 후/);
  assert.match(sequence, /id: "funeral-guilt"[\s\S]*kind: "black"[\s\S]*사실은 내가 죽인 거다/);
  assert.match(sequence, /중학교 때의 크리스마스/);
  assert.match(sequence, /id: "funeral-if"[\s\S]*kind: "image"[\s\S]*\/pv\/06-funeral\.webp[\s\S]*그날 케이크만 사달라고 하지 않았으면[\s\S]*이런 일 없었을 텐데/);
  for (const commaText of ["응, 내일", "공부도, 친구도", "꺾이지 않자,", "야, 김도윤", "아니, 이게", "어, 소현아", "소현아, 이번엔", "고마웠어요, 선생님"]) {
    assert.doesNotMatch(sequence, new RegExp(commaText));
  }
  assert.match(sequence, /id: "no-strength-after"[\s\S]*하지만 그때의 나는[\s\S]*남아 있지 않았다/);
  assert.match(sequence, /id: "endure"[\s\S]*narration: "학교폭력 자체는 버틸 수 있었다\."/);
  assert.match(sequence, /id: "endure-hit"[\s\S]*duration: 950[\s\S]*narration: "맞아도\."/);
  assert.match(sequence, /id: "endure-insult"[\s\S]*duration: 950[\s\S]*narration: "욕을 먹어도\."/);
  assert.match(sequence, /id: "endure-alone"[\s\S]*duration: 1250[\s\S]*narration: "혼자가 되어도\."/);
  assert.match(sequence, /id: "i-am-fine"[\s\S]*kind: "black"[\s\S]*저 괜찮아요[\s\S]*버틸 수 있어요/);
  assert.doesNotMatch(sequence, /저 괜찮아요[^"\n]*진짜로/);
  assert.match(sequence, /id: "uncle-call"[\s\S]*narration: "소현아\."/);
  assert.match(sequence, /id: "uncle"[\s\S]*lines: \[white\("이주원", "삼촌이야\."\)\]/);
  assert.doesNotMatch(pv, /<b>\{line\.speaker\}<\/b>/);
  assert.match(pv, /prison-pv-typewriter-text/);
  assert.doesNotMatch(pv, />당신이 소현의 편에 서는 순간<|>THE SILENCE IS THE SYSTEM</);
  assert.match(pv, /prison-pv-title-half--upper/);
  assert.match(pv, /prison-pv-title-half--lower/);
  assert.match(pv, /prison-pv-title-rule/);
  assert.match(sequence, /\/pv\/title-upper\.webp/);
  assert.match(sequence, /\/pv\/title-lower\.webp/);
});

test("ships the complete core cast", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  for (const name of [
    "이소현", "김도윤", "진희주", "서은정", "윤서아", "강태호", "최유리",
    "이도현", "안수진", "박성훈", "서동환", "진동욱",
  ]) {
    assert.match(page, new RegExp(name));
  }
  assert.doesNotMatch(page, /이주원|최민혁/);
  assert.match(page, /이소현 중심 인물 관계도/);
  assert.match(page, /characterRelationships/);
  assert.doesNotMatch(page, /<dt>PROFILE<\/dt>|activePersonData\.trait/);
  assert.doesNotMatch(page, /className="dossier-head"|IDENTITY FILE<\/span>/);
  assert.match(page, /<p>\{activePersonData\.role\}<\/p><blockquote className="dossier-hero-quote">/);
  assert.match(page, /"진동욱": \{ x: 69, y: 12 \}/);
  assert.match(page, /"최유리": \{ x: 12, y: 74 \}/);
  assert.match(page, /"윤서아": \{ x: 35, y: 88 \}/);
  assert.match(page, /name: "안수진", role: "관찰자"/);
  assert.match(page, /name: "이도현", role: "학생회장"/);
  assert.match(page, /name: "진동욱", role: "국회의원"/);
  assert.match(page, /label: "권력과 지능의 공생"[\s\S]*?labelShiftX: 0, labelShiftY: -108/);
  assert.match(page, /label: "명령 · 불쾌한 복종"[\s\S]*?labelShiftX: 96, labelShiftY: -74/);
  assert.match(page, /label: "학생회 결탁"[\s\S]*?labelShiftX: 34, labelShiftY: -58/);
  assert.match(page, /from: "서은정", to: "이소현", label: "지배 · 공개적 모욕"/);
  assert.match(page, /from: "윤서아", to: "이소현", label: "지배 · 공개적 모욕"/);
  assert.match(page, /from: "최유리", to: "이소현", label: "동조 · 죄책감"[\s\S]*?labelShiftX: 0, labelShiftY: -24/);
  assert.match(page, /from: "윤서아", to: "안수진", label: "까탈스러운 존재"/);
  assert.match(page, /일진 무리를 모두 한심하게 보는/);
  assert.match(css, /\.character-view-tabs button b[^}]*font-size:\s*24px/);
  assert.match(css, /\.character-dossier article > span[^}]*font:\s*800 18px/);
  assert.doesNotMatch(page, /cast\.slice\(/);
});

test("ships four Seoul2043-style scene images and an enlarge viewer for every character", async () => {
  const [page, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  const slugs = [
    "lee-sohyeon", "kim-doyoon", "jin-heeju", "seo-eunjeong", "yoon-seoa", "kang-taeho",
    "choi-yuri", "lee-dohyeon", "ahn-sujin", "park-seonghoon", "seo-donghwan", "jin-dongwook",
  ];

  assert.match(page, /이미지 미리보기/);
  assert.match(page, />4장<\/b>/);
  assert.match(page, /className="gallery-open"/);
  assert.match(page, /className="image-lightbox"/);
  assert.match(page, /event\.key === "Escape"/);
  assert.match(css, /\.dossier-gallery > div:last-child[^}]*grid-template-columns:\s*repeat\(2/);
  assert.match(css, /\.gallery-open > span/);
  assert.match(css, /\.image-lightbox-panel/);

  for (const slug of slugs) {
    for (let index = 1; index <= 4; index += 1) {
      const extension = slug === "lee-sohyeon" && index === 2 ? "png" : "webp";
      const filename = `${slug}-scene-${String(index).padStart(2, "0")}.${extension}`;
      assert.match(page, new RegExp(filename.replaceAll(".", "\\.")));
      await access(new URL(`../public/characters/${filename}`, import.meta.url));
      await access(new URL(`../dist/client/characters/${filename}`, import.meta.url));
    }
  }
});

test("keeps public assets inside the GitHub Pages project path", async () => {
  const [page, sequence, css, response] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/pv-sequence.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    render(),
  ]);
  const html = await response.text();

  assert.doesNotMatch(page, /["']\/(?:pv|characters)\//);
  assert.doesNotMatch(sequence, /["']\/(?:pv|characters)\//);
  assert.match(page, /["']\.\/(?:pv|characters)\//);
  assert.match(sequence, /["']\.\/pv\//);
  assert.match(css, /url\("\.\.\/\.\.\/\.\.\/title-logo\.png"\)/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:pv|characters)\//);
  assert.match(html, /--portrait-image:url\(&quot;\/SchoolPrision\/characters\/lee-sohyeon\.png\?v=7513771c15fd&quot;\)/);
  assert.doesNotMatch(html, /--portrait-image:url\(&quot;\.\/characters\//);
});

test("ships the supplied face-focused character portraits", async () => {
  const [page, response] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    render(),
  ]);
  const html = await response.text();
  const portraits = [
    "lee-sohyeon.png",
    "kim-doyoon.webp", "kang-taeho.webp", "park-seonghoon.webp", "seo-donghwan.webp",
    "seo-eunjeong.webp", "ahn-sujin.webp", "yoon-seoa.webp", "lee-dohyeon.png",
    "jin-dongwook.webp", "jin-heeju.webp", "choi-yuri.webp",
  ];

  assert.match(html, /roster-mark has-portrait/);
  assert.match(page, /--portrait-position/);
  assert.match(page, /--portrait-detail-position/);
  assert.match(page, /lee-sohyeon\.png\?v=7513771c15fd", position: "50% 20%", detailPosition: "50% 14%", zoom: "320%"/);
  assert.match(page, /lee-dohyeon\.png", position: "50% 14%", detailPosition: "50% 0%"/);
  assert.match(page, /jin-dongwook\.webp", position: "50% 17%", detailPosition: "50% 18%"/);
  for (const portrait of portraits) {
    assert.match(page, new RegExp(portrait.replace(".", "\\.")));
    await access(new URL(`../public/characters/${portrait}`, import.meta.url));
    await access(new URL(`../dist/client/characters/${portrait}`, import.meta.url));
  }
});

test("renders the interactive class council simulation", async () => {
  const [response, component] = await Promise.all([
    render(),
    readFile(new URL("../app/CouncilDemo.tsx", import.meta.url), "utf8"),
  ]);
  const html = await response.text();

  assert.match(html, /학급의회/);
  assert.match(html, /당신 측 현장 여론 42%/);
  assert.match(html, /기록의 모순 지적/);
  assert.match(component, /useState\(42\)/);
  assert.match(component, /aria-live="polite"/);
  assert.match(component, /Math\.max\(5, Math\.min\(95,/);
});

test("keeps the responsive and reduced-motion safeguards", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(css, /:root\s*\{[^}]*color-scheme:\s*only light/);
  assert.match(css, /@media \(max-width:\s*860px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /\.prison-pv-beat-uncle::before/);
  assert.match(css, /\.prison-pv-beat-uncle-call::before/);
  assert.match(css, /@keyframes prison-pv-uncle-call-voice/);
  assert.match(css, /@keyframes prison-pv-uncle-call-stain/);
  assert.match(css, /@keyframes prison-pv-uncle-shudder/);
  assert.match(css, /@keyframes prison-pv-uncle-red/);
  assert.match(css, /@keyframes prison-pv-impact-copy/);
  assert.match(css, /@keyframes prison-pv-typewriter/);
  assert.match(css, /@keyframes prison-pv-title-open-up/);
  assert.match(css, /@keyframes prison-pv-title-open-down/);
  assert.match(css, /@keyframes prison-pv-title-rule-draw/);
  assert.match(css, /\.prison-pv-title-rule[^}]*top:\s*71\.7778%/);
  assert.match(css, /@keyframes prison-pv-title-rule-settle[^}]*from[^}]*opacity:\s*1[^}]*}[^}]*to[^}]*opacity:\s*0/);
  assert.match(css, /\.council-console/);
  assert.match(css, /\.opinion-track/);
  assert.match(css, /\.character-browser/);
  assert.match(css, /\.character-roster[^}]*grid-template-columns:\s*1fr/);
  assert.match(css, /grid-template-columns:\s*88px 1fr/);
  assert.match(css, /auto clamp\(205%,calc\(var\(--portrait-zoom\) \* \.78\),285%\)/);
  assert.match(css, /grid-template-columns:\s*240px 1fr/);
  assert.match(css, /auto clamp\(175%,calc\(var\(--portrait-zoom\) \* \.62\),225%\)/);
  assert.match(css, /aspect-ratio:\s*1/);
  assert.match(css, /\.relationship-node > b[^}]*font-size:\s*18px/);
  assert.match(css, /\.relationship-records li p[^}]*font-size:\s*16px/);
});

test("ships the exact-title social card", async () => {
  const [layout, workflow] = await Promise.all([
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /학교라는 이름의 감옥 \| 완전판/);
  assert.match(layout, /https:\/\/crackhamzzi\.github\.io\/SchoolPrision\//);
  assert.match(layout, /socialImageUrl/);
  assert.match(workflow, /dist\/client\/SchoolPrision\/_next/);
  assert.doesNotMatch(workflow, /dist\/client\/SchoolPrison\/_next/);
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../dist/client/og.png", import.meta.url));
});
