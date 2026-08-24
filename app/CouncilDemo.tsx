"use client";

import { useState } from "react";

const moves = [
  { label: "기록의 모순 지적", delta: 9, note: "출석 기록과 교사의 진술이 충돌한다. 교실 뒤편의 웅성거림이 커졌다." },
  { label: "목격자 보호 요구", delta: 6, note: "증언보다 먼저 보호를 요구했다. 방관하던 학생 몇 명이 고개를 들었다." },
  { label: "공포 통치 폭로", delta: 12, note: "침묵이 동의가 아니라 두려움이었다는 사실이 공개적으로 언급됐다." },
  { label: "근거 없이 단정", delta: -8, note: "상대가 빈틈을 놓치지 않았다. 주장보다 감정이 앞섰다는 반론이 먹혀들었다." },
] as const;

export default function CouncilDemo() {
  const [support, setSupport] = useState(42);
  const [log, setLog] = useState("공격권이 당신에게 넘어왔다. 어떤 방식으로 청중을 설득할 것인가?");

  const play = (delta: number, note: string) => {
    setSupport((current) => Math.max(5, Math.min(95, current + delta)));
    setLog(note);
  };

  const reset = () => {
    setSupport(42);
    setLog("공격권이 당신에게 넘어왔다. 어떤 방식으로 청중을 설득할 것인가?");
  };

  return (
    <div className="council-console">
      <div className="console-head"><span>📜 학급의회</span><i>논제: 침묵은 동의인가</i></div>
      <div className="debate-sides">
        <div><span>당신 · 이소현</span><strong>{support}%</strong></div>
        <div className="opponent"><span>진희주 무리</span><strong>{100 - support}%</strong></div>
      </div>
      <div className="opinion-track" aria-label={`당신 측 현장 여론 ${support}%`}><i style={{ width: `${support}%` }} /></div>
      <p className="debate-log" aria-live="polite">{log}</p>
      <div className="move-grid">
        {moves.map((move) => <button type="button" key={move.label} onClick={() => play(move.delta, move.note)}>{move.label}<span>{move.delta > 0 ? `+${move.delta}` : move.delta}</span></button>)}
      </div>
      <button className="reset-button" type="button" onClick={reset}>공방 초기화</button>
    </div>
  );
}
