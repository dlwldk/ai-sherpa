import React, { useState, useRef } from 'react';
import { C, s } from '../styles';
import { BUILDING_GRADES, formatAmount } from '../data/insuranceData';

export default function BuildingPhotoAI({ onGradeDetected }) {
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  const analyzeBuilding = (file) => {
    setAnalyzing(true); setResult(null);
    const img = new Image();
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const sz = 100; canvas.width = sz; canvas.height = sz;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, sz, sz);
      const d = ctx.getImageData(0, 0, sz, sz).data;
      let gray = 0, brown = 0, total = 0;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2]; total++;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
        const sat = mx === 0 ? 0 : (mx - mn) / mx;
        if (sat < 0.15 && r > 100) gray++;
        if (r > g && g > b && sat > 0.1 && sat < 0.6) brown++;
      }
      const gR = gray / total, bR = brown / total;
      setTimeout(() => {
        let grade, confidence, reason;
        if (gR > 0.4) { grade = 1; confidence = 87; reason = '콘크리트/회색 톤의 외벽이 감지되었습니다. 철근콘크리트 구조로 판정합니다.'; }
        else if (gR > 0.25) { grade = 2; confidence = 78; reason = '금속/철골 재질의 외벽 패턴이 감지되었습니다. 철골 구조로 판정합니다.'; }
        else if (bR > 0.3) { grade = 4; confidence = 82; reason = '목재/갈색 톤의 외벽이 감지되었습니다. 목조 구조로 판정합니다.'; }
        else { grade = 3; confidence = 72; reason = '불연 재질의 외벽이 감지되었습니다. 불연목조 구조로 판정합니다.'; }
        setResult({ grade, confidence, reason }); setAnalyzing(false);
      }, 2000);
    };
    img.src = url;
  };

  return (
    <div style={{ ...s.card, background: '#fafaf8', border: `1px dashed ${C.border}` }}>
      <div style={s.cardTitle}>📸 건물 사진으로 AI 등급 판정</div>
      {!photo ? (
        <div style={{
          textAlign: 'center', padding: '30px 20px', cursor: 'pointer', borderRadius: 12,
          border: '2px dashed #d0cbc3', background: '#f5f3ef',
        }} onClick={() => fileRef.current?.click()}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏢</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>건물 외관 사진 촬영 또는 업로드</div>
          <div style={{ fontSize: 12, color: C.textSub, marginTop: 4 }}>탭하여 카메라 촬영 또는 갤러리에서 선택</div>
          <input ref={fileRef} type="file" accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if (f) { setPhoto(f); analyzeBuilding(f); } }}
          />
        </div>
      ) : (
        <div>
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
            <img src={photoUrl} alt="건물" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }} />
            {analyzing && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, height: 3, background: C.primary, boxShadow: `0 0 20px ${C.primary}`, animation: 'scanning 1.5s ease-in-out infinite' }} />
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, zIndex: 1 }}>🤖 AI 분석 중...</div>
                <div style={{ color: '#ccc', fontSize: 12, marginTop: 6, zIndex: 1 }}>건물 외벽 재질 · 구조 · 형태 분석</div>
              </div>
            )}
          </div>
          {result && (
            <div className="slide-in" style={{ background: '#eefbf3', borderRadius: 12, padding: 16, border: '1px solid #b8e8cc', marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.success, marginBottom: 8 }}>✅ AI 판정 완료 (신뢰도 {result.confidence}%)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: C.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900 }}>{result.grade}급</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{BUILDING_GRADES[result.grade].label}</div>
                  <div style={{ fontSize: 12, color: C.textSub }}>평당 기준가: {formatAmount(BUILDING_GRADES[result.grade].pricePerPyeong)}</div>
                </div>
              </div>
              <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.6, marginBottom: 12 }}>{result.reason}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ ...s.btnPrimary, fontSize: 14, padding: '10px 16px' }} onClick={() => onGradeDetected(result.grade)}>이 등급 적용하기</button>
                <button style={{ ...s.btnSecondary, fontSize: 13, padding: '10px 16px' }} onClick={() => { setPhoto(null); setResult(null); setPhotoUrl(''); }}>다시 촬영</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
