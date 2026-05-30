import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  INDUSTRY_CATEGORIES,
  BUILDING_GRADES,
  COVERAGE_PERIOD_FACTORS,
  SPECIAL_COVERAGES,
  MULTI_USE_INDUSTRIES,
  ACCIDENT_CASES,
  ACCUMULATION_RATE,
  calculateBuildingInsurance,
  calculateObjectInsurance,
  calculateSpecialCoverage,
  calculateMaturityRefund,
  calculateTaxBenefit,
  matchIndustry,
  recommendCoverages,
  formatNumber,
  formatAmount,
} from './data/insuranceData';

const globalCSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Noto Sans KR', -apple-system, sans-serif;
    background: #f5f3ef; color: #1a1a1a;
    -webkit-font-smoothing: antialiased;
  }
  input, select, textarea, button { font-family: inherit; font-size: inherit; }
  input:focus, select:focus, textarea:focus { outline: 2px solid #e8930c; outline-offset: -1px; }
  ::selection { background: #e8930c33; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes scanning { 0% { top: 0; } 50% { top: calc(100% - 4px); } 100% { top: 0; } }
  .fade-in { animation: fadeIn 0.4s ease-out both; }
  .slide-in { animation: slideIn 0.35s ease-out both; }
  .app-container { max-width: 100%; margin: 0 auto; min-height: 100vh; background: #f5f3ef; }
  @media (min-width: 768px) { .app-container { max-width: 800px; } }
  @media (min-width: 1200px) { .app-container { max-width: 960px; } }
  .body-area { padding: 20px 16px 110px; }
  @media (min-width: 768px) { .body-area { padding: 28px 32px 110px; } }
  .footer-bar {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 100%; padding: 12px 16px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
    background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
    border-top: 1px solid #e5e0d8; display: flex; gap: 10px; z-index: 100;
  }
  @media (min-width: 768px) { .footer-bar { max-width: 800px; padding: 14px 32px; } }
  @media (min-width: 1200px) { .footer-bar { max-width: 960px; } }
  .two-col-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  @media (min-width: 768px) { .two-col-grid { grid-template-columns: 1fr 1fr; } }
  .case-images { display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px; }
  .case-images img { width: 160px; height: 100px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
  @media (min-width: 768px) { .case-images img { width: 200px; height: 130px; } }
`;

const C = {
  primary: '#e8930c', primaryDark: '#c57a0a', primaryLight: '#fdf3e1',
  accent: '#2d2d2d', bg: '#f5f3ef', card: '#ffffff', border: '#e5e0d8',
  text: '#1a1a1a', textSub: '#6b6560', danger: '#d94040', success: '#1a8c4e', info: '#2b7cd4',
};

const s = {
  header: { background: 'linear-gradient(135deg, #2d2d2d 0%, #444 100%)', padding: '28px 24px 22px', color: '#fff' },
  headerIcon: {
    width: 56, height: 56, borderRadius: 16,
    background: 'linear-gradient(135deg, #3a8c5c 0%, #2d6b45 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 28, marginBottom: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  headerTitle: { fontSize: 22, fontWeight: 700, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: '#bbb', marginTop: 4, fontWeight: 300 },
  stepper: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px 24px 16px', background: C.card, borderBottom: `1px solid ${C.border}`,
  },
  card: {
    background: C.card, borderRadius: 16, padding: '24px 20px', marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)', border: `1px solid ${C.border}`,
  },
  cardTitle: { fontSize: 16, fontWeight: 600, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 6, display: 'block' },
  required: { color: C.danger, marginLeft: 2 },
  input: {
    width: '100%', padding: '12px 14px', border: `1px solid ${C.border}`,
    borderRadius: 10, fontSize: 15, background: '#fafaf8', color: C.text,
  },
  select: {
    width: '100%', padding: '12px 14px', border: `1px solid ${C.border}`,
    borderRadius: 10, fontSize: 15, background: '#fafaf8', appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%236b6560' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', cursor: 'pointer', color: C.text,
  },
  textarea: {
    width: '100%', padding: '12px 14px', border: `1px solid ${C.border}`,
    borderRadius: 10, fontSize: 14, background: '#fafaf8', minHeight: 80,
    resize: 'vertical', lineHeight: 1.6, color: C.text,
  },
  row: { display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' },
  col: { flex: 1, minWidth: 0 },
  btnPrimary: {
    width: '100%', padding: '14px 20px', background: C.primary, color: '#fff',
    border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(232,147,12,0.3)',
  },
  btnSecondary: {
    padding: '14px 20px', background: '#f0ece6', color: C.text,
    border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 500, cursor: 'pointer',
  },
  btnOutline: {
    padding: '10px 16px', background: 'transparent', color: C.primary,
    border: `2px solid ${C.primary}`, borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
  },
  tag: { display: 'inline-block', padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 600 },
  hint: { fontSize: 12, color: C.textSub, marginTop: 4 },
};

// ★ 숫자 파싱 헬퍼 (문자열 → 숫자, 빈값 → 0)
function num(v) { return Number(v) || 0; }

/* ─── Stepper ─── */
function Stepper({ current, steps }) {
  return (
    <div style={s.stepper}>
      {steps.map((step, i) => {
        const isActive = i === current, isDone = i < current;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: isActive ? C.primary : isDone ? C.success : '#e5e0d8',
                color: isActive || isDone ? '#fff' : C.textSub,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 700,
                boxShadow: isActive ? '0 2px 8px rgba(232,147,12,0.4)' : 'none',
              }}>{isDone ? '✓' : i + 1}</div>
              <span style={{
                fontSize: 11, marginTop: 5,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? C.primary : C.textSub,
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, maxWidth: 40, margin: '0 4px', marginBottom: 18,
                background: isDone ? C.success : '#e5e0d8', borderRadius: 1,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ─── 건물 사진 AI 판정 ─── */
function BuildingPhotoAI({ onGradeDetected }) {
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
        const r = d[i], g = d[i+1], b = d[i+2]; total++;
        const mx = Math.max(r,g,b), mn = Math.min(r,g,b);
        const sat = mx === 0 ? 0 : (mx-mn)/mx;
        if (sat < 0.15 && r > 100) gray++;
        if (r > g && g > b && sat > 0.1 && sat < 0.6) brown++;
      }
      const gR = gray/total, bR = brown/total;
      setTimeout(() => {
        let grade, confidence, reason;
        if (gR > 0.4) { grade=1; confidence=87; reason='콘크리트/회색 톤의 외벽이 감지되었습니다. 철근콘크리트 구조로 판정합니다.'; }
        else if (gR > 0.25) { grade=2; confidence=78; reason='금속/철골 재질의 외벽 패턴이 감지되었습니다. 철골 구조로 판정합니다.'; }
        else if (bR > 0.3) { grade=4; confidence=82; reason='목재/갈색 톤의 외벽이 감지되었습니다. 목조 구조로 판정합니다.'; }
        else { grade=3; confidence=72; reason='불연 재질의 외벽이 감지되었습니다. 불연목조 구조로 판정합니다.'; }
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
          border: `2px dashed #d0cbc3`, background: '#f5f3ef',
        }} onClick={() => fileRef.current?.click()}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🏢</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>건물 외관 사진 촬영 또는 업로드</div>
          <div style={{ fontSize: 12, color: C.textSub, marginTop: 4 }}>탭하여 카메라 촬영 또는 갤러리에서 선택</div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment"
            style={{ display: 'none' }}
            onChange={e => { const f = e.target.files?.[0]; if(f){ setPhoto(f); analyzeBuilding(f); } }}
          />
        </div>
      ) : (
        <div>
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 14 }}>
            <img src={photoUrl} alt="건물" style={{ width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' }} />
            {analyzing && (
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                <div style={{ position:'absolute', left:0, right:0, height:3, background:C.primary, boxShadow:`0 0 20px ${C.primary}`, animation:'scanning 1.5s ease-in-out infinite' }} />
                <div style={{ color:'#fff', fontSize:15, fontWeight:700, zIndex:1 }}>🤖 AI 분석 중...</div>
                <div style={{ color:'#ccc', fontSize:12, marginTop:6, zIndex:1 }}>건물 외벽 재질 · 구조 · 형태 분석</div>
              </div>
            )}
          </div>
          {result && (
            <div className="slide-in" style={{ background:'#eefbf3', borderRadius:12, padding:16, border:'1px solid #b8e8cc', marginBottom:12 }}>
              <div style={{ fontWeight:700, fontSize:15, color:C.success, marginBottom:8 }}>✅ AI 판정 완료 (신뢰도 {result.confidence}%)</div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                <div style={{ width:52, height:52, borderRadius:12, background:C.primary, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900 }}>{result.grade}급</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:16 }}>{BUILDING_GRADES[result.grade].label}</div>
                  <div style={{ fontSize:12, color:C.textSub }}>평당 기준가: {formatAmount(BUILDING_GRADES[result.grade].pricePerPyeong)}</div>
                </div>
              </div>
              <div style={{ fontSize:13, color:C.textSub, lineHeight:1.6, marginBottom:12 }}>{result.reason}</div>
              <div style={{ display:'flex', gap:8 }}>
                <button style={{ ...s.btnPrimary, fontSize:14, padding:'10px 16px' }} onClick={() => onGradeDetected(result.grade)}>이 등급 적용하기</button>
                <button style={{ ...s.btnSecondary, fontSize:13, padding:'10px 16px' }} onClick={() => { setPhoto(null); setResult(null); setPhotoUrl(''); }}>다시 촬영</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Step 1 ─── */
function Step1({ data, setData }) {
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState(null);

  const handleAiMatch = () => {
    if (!aiInput.trim()) return;
    const matched = matchIndustry(aiInput);
    if (matched) {
      setAiResult({ success: true, industry: matched });
      setData(d => ({ ...d, industry: matched.value, industryRate: matched.rate, industryLabel: matched.label }));
    } else { setAiResult({ success: false }); }
  };

  return (
    <div className="fade-in">
      <div style={s.card}>
        <div style={s.cardTitle}>📋 기본 정보 입력</div>

        <div style={s.row}>
          <div style={s.col}>
            <label style={s.label}>고객명</label>
            <input style={s.input} placeholder="홍길동 사장님"
              value={data.customerName} onChange={e => setData(d => ({ ...d, customerName: e.target.value }))} />
            <div style={s.hint}>선택사항</div>
          </div>
          <div style={s.col}>
            <label style={s.label}>업종 선택<span style={s.required}>*</span></label>
            <select style={s.select} value={data.industry} onChange={e => {
              const v = e.target.value;
              const f = INDUSTRY_CATEGORIES.find(c => c.value === v);
              setData(d => ({ ...d, industry: v, industryRate: f?.rate || 1.0, industryLabel: f?.label || '' }));
            }}>
              <option value="">선택하세요</option>
              {INDUSTRY_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={s.label}>업종 직접 입력 (위에 없는 경우)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ ...s.input, flex: 1 }} placeholder="업종명을 직접 입력하세요"
              value={aiInput} onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAiMatch()} />
            <button style={{
              background: C.primary, color: '#fff', border: 'none', borderRadius: 10,
              padding: '10px 14px', whiteSpace: 'nowrap', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }} onClick={handleAiMatch}>🤖 AI 등급 판정</button>
          </div>
          <div style={s.hint}>예: 숯불구이 고기집, PC방, 코인세탁소 등 자연어로 입력 가능</div>
        </div>

        {aiResult && (
          <div className="slide-in" style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 14,
            background: aiResult.success ? '#eefbf3' : '#fef2f2',
            border: `1px solid ${aiResult.success ? '#b8e8cc' : '#fecaca'}`,
          }}>
            {aiResult.success ? (
              <div style={{ fontSize: 14 }}>
                <span style={{ fontWeight: 700, color: C.success }}>✅ 매칭 완료</span>
                <span style={{ marginLeft: 8 }}>업종: <strong>{aiResult.industry.label}</strong> (요율: {aiResult.industry.rate})</span>
              </div>
            ) : <div style={{ fontSize: 14, color: C.danger }}>❌ 매칭되는 업종이 없습니다. 드롭다운에서 직접 선택해주세요.</div>}
          </div>
        )}

        {/* ★ 건물 등급 + 면적 */}
        <div style={s.row}>
          <div style={s.col}>
            <label style={s.label}>건물 등급<span style={s.required}>*</span></label>
            <select style={s.select} value={data.buildingGrade}
              onChange={e => setData(d => ({ ...d, buildingGrade: e.target.value }))}>
              <option value="">선택하세요</option>
              {Object.entries(BUILDING_GRADES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <div style={s.hint}>1급=철근콘크리트, 2급=철골, 3급=불연목조, 4급=목조</div>
          </div>
          <div style={{ ...s.col, maxWidth: 110 }}>
            <label style={s.label}>전용면적(평)<span style={s.required}>*</span></label>
            <input style={s.input} type="number" placeholder="50" min="1"
              value={data.area} onChange={e => setData(d => ({ ...d, area: e.target.value }))} />
          </div>
        </div>

        <div>
          <label style={s.label}>보장기간<span style={s.required}>*</span></label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(COVERAGE_PERIOD_FACTORS).map(([k, v]) => (
              <button key={k} style={{
                flex: 1, minWidth: 56, padding: '12px 8px',
                border: data.coveragePeriod === Number(k) ? `2px solid ${C.primary}` : `1px solid ${C.border}`,
                borderRadius: 10,
                background: data.coveragePeriod === Number(k) ? C.primaryLight : '#fafaf8',
                color: data.coveragePeriod === Number(k) ? C.primaryDark : C.textSub,
                fontWeight: data.coveragePeriod === Number(k) ? 700 : 400, fontSize: 15, cursor: 'pointer',
              }} onClick={() => setData(d => ({ ...d, coveragePeriod: Number(k) }))}>{v.label}</button>
            ))}
          </div>
        </div>
      </div>

      <BuildingPhotoAI onGradeDetected={g => setData(d => ({ ...d, buildingGrade: String(g) }))} />

      {data.industry && MULTI_USE_INDUSTRIES.includes(data.industry) && (
        <div className="slide-in" style={{ ...s.card, background: '#fff8ed', border: '1px solid #fcd49a' }}>
          <div style={{ fontSize: 14, lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: C.primary }}>⚠️ 다중이용업소 해당</span>
            <p style={{ marginTop: 6, color: C.textSub }}>
              해당 업종은 <strong>다중이용업소</strong>에 해당할 수 있습니다.
              화재대물배상책임_무과실책임특약 의무가입 대상이며,
              미가입 시 <strong style={{ color: C.danger }}>과태료 부과</strong> 대상입니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ★ ObjectCard: Step2 바깥에 정의 (포커스 유지) ─── */
function ObjectCard({ icon, title, field, hint, premium, value, onChange }) {
  return (
    <div style={s.card}>
      <div style={s.cardTitle}>{icon} {title}</div>
      <div style={{ marginBottom: 10 }}>
        <label style={s.label}>보험가입금액 (원)</label>
        <input style={s.input} type="number" placeholder="예: 200000000 (2억원)"
          value={value} onChange={onChange} />
        <div style={s.hint}>{hint}</div>
      </div>
      {num(value) > 0 && (
        <div style={{ background:'#f7f5f1', borderRadius:10, padding:'12px 16px', border:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <span style={{ fontSize:13, color:C.textSub }}>월 보장보험료</span>
            <span style={{ fontSize:15, fontWeight:700 }}>{formatAmount(premium)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Step 2: 보험목적물 ─── */
function Step2({ data, setData }) {
  const grade = num(data.buildingGrade);
  const area = num(data.area);
  const pf = COVERAGE_PERIOD_FACTORS[data.coveragePeriod]?.factor || 1;

  const buildingCalc = useMemo(() => {
    if (!grade || !area || !data.coveragePeriod) return null;
    return calculateBuildingInsurance(grade, area, data.industryRate, pf);
  }, [grade, area, data.industryRate, pf]);

  const facilityP = useMemo(() => num(data.facilityAmount) > 0 && grade ? calculateObjectInsurance(num(data.facilityAmount), grade, data.industryRate, pf) : 0,
    [data.facilityAmount, grade, data.industryRate, pf]);
  const machineP = useMemo(() => num(data.machineAmount) > 0 && grade ? calculateObjectInsurance(num(data.machineAmount), grade, data.industryRate, pf) : 0,
    [data.machineAmount, grade, data.industryRate, pf]);
  const stockP = useMemo(() => num(data.stockAmount) > 0 && grade ? calculateObjectInsurance(num(data.stockAmount), grade, data.industryRate, pf) : 0,
    [data.stockAmount, grade, data.industryRate, pf]);

  return (
    <div className="fade-in">
      <div style={s.card}>
        <div style={s.cardTitle}>🏢 건물</div>
        {buildingCalc ? (
          <div style={{ background:'#f7f5f1', borderRadius:10, padding:'14px 16px', border:`1px solid ${C.border}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
              <span style={{ fontSize:13, color:C.textSub }}>보험가입금액</span>
              <span style={{ fontSize:15, fontWeight:700, color:C.primary }}>{formatAmount(buildingCalc.amount)}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:13, color:C.textSub }}>월 보장보험료</span>
              <span style={{ fontSize:15, fontWeight:700 }}>{formatAmount(buildingCalc.premium)}</span>
            </div>
            <div style={{ marginTop:8, fontSize:11, color:C.textSub, lineHeight:1.5 }}>
              산식: {formatAmount(BUILDING_GRADES[grade]?.pricePerPyeong || 0)} × {area}평 = {formatAmount(buildingCalc.amount)}
            </div>
          </div>
        ) : (
          <div style={{ fontSize:14, color:C.textSub, textAlign:'center', padding:20 }}>기본정보를 먼저 입력해주세요</div>
        )}
      </div>

      <div className="two-col-grid">
        <ObjectCard icon="🪑" title="시설 · 집기 (인테리어)" field="facilityAmount"
          hint="인테리어, 가구, 집기 등의 가액 (원)" premium={facilityP}
          value={data.facilityAmount} onChange={e => setData(d => ({ ...d, facilityAmount: e.target.value }))} />
        <ObjectCard icon="⚙️" title="기계 · 설비" field="machineAmount"
          hint="기계, 냉동기, 대형설비 등의 가액 (원)" premium={machineP}
          value={data.machineAmount} onChange={e => setData(d => ({ ...d, machineAmount: e.target.value }))} />
      </div>
      <ObjectCard icon="📦" title="재고 · 상품" field="stockAmount"
        hint="재고자산, 원자재, 상품 등의 가액 (원)" premium={stockP}
        value={data.stockAmount} onChange={e => setData(d => ({ ...d, stockAmount: e.target.value }))} />

      <div style={{ ...s.card, background:'linear-gradient(135deg, #2d2d2d 0%, #444 100%)', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:15, fontWeight:500 }}>보장보험료 합계 (월)</span>
          <span style={{ fontSize:22, fontWeight:900, color:C.primary }}>
            {formatAmount((buildingCalc?.premium || 0) + facilityP + machineP + stockP)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: 특약선택 ─── */
function Step3({ data, setData }) {
  const [worryInput, setWorryInput] = useState('');
  const [recommended, setRecommended] = useState([]);
  const isMultiUse = MULTI_USE_INDUSTRIES.includes(data.industry);
  const totalArea = num(data.area) * num(data.floors);

  useEffect(() => {
    if (isMultiUse && !data.selectedCoverages.find(c => c.id === 'fire_liability_no_fault')) {
      const cov = SPECIAL_COVERAGES.find(c => c.id === 'fire_liability_no_fault');
      if (cov) {
        const premium = calculateSpecialCoverage(cov, totalArea, cov.defaultLimit);
        setData(d => ({ ...d, selectedCoverages: [...d.selectedCoverages, { ...cov, limit: cov.defaultLimit, premium, mandatory: true }] }));
      }
    }
  }, [isMultiUse]);

  const addCoverage = (cov) => {
    if (data.selectedCoverages.find(c => c.id === cov.id)) return;
    const premium = calculateSpecialCoverage(cov, totalArea, cov.defaultLimit);
    setData(d => ({ ...d, selectedCoverages: [...d.selectedCoverages, { ...cov, limit: cov.defaultLimit, premium }] }));
  };
  const removeCoverage = (id) => {
    if (data.selectedCoverages.find(c => c.id === id)?.mandatory) return;
    setData(d => ({ ...d, selectedCoverages: d.selectedCoverages.filter(c => c.id !== id) }));
  };
  const updateLimit = (id, newLimit) => {
    setData(d => ({
      ...d, selectedCoverages: d.selectedCoverages.map(c => {
        if (c.id !== id) return c;
        return { ...c, limit: newLimit, premium: calculateSpecialCoverage(c, totalArea, newLimit) };
      }),
    }));
  };
  const totalCovP = data.selectedCoverages.reduce((s, c) => s + c.premium, 0);

  return (
    <div className="fade-in">
      <div style={s.card}>
        <div style={s.cardTitle}>💬 사장님의 걱정거리</div>
        <textarea style={s.textarea}
          placeholder={'예: "손님이 음식을 먹고 탈이 나면 보상이 되나요?"\n"종업원이 뜨거운 음식물을 손님에게 쏟는 경우가 있어요"'}
          value={worryInput} onChange={e => setWorryInput(e.target.value)} />
        <button style={{ ...s.btnPrimary, marginTop: 12, fontSize: 14 }}
          onClick={() => { if(worryInput.trim()) setRecommended(recommendCoverages(worryInput)); }}>
          🤖 AI 특약 추천
        </button>
      </div>

      {recommended.length > 0 && (
        <div className="slide-in" style={s.card}>
          <div style={s.cardTitle}>🎯 AI 추천 특약</div>
          {recommended.map(cov => {
            const added = data.selectedCoverages.find(c => c.id === cov.id);
            return (
              <div key={cov.id} style={{
                padding:'14px 16px', borderRadius:10, marginBottom:10,
                border:`1px solid ${added ? '#b8e8cc' : C.border}`,
                background: added ? '#eefbf3' : '#fafaf8',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:14, marginBottom:4 }}>{cov.name}</div>
                    <div style={{ fontSize:12, color:C.textSub, lineHeight:1.5 }}>{cov.description}</div>
                  </div>
                  {!added ?
                    <button style={{ ...s.tag, background:C.primary, color:'#fff', cursor:'pointer', border:'none', whiteSpace:'nowrap', marginLeft:10 }}
                      onClick={() => addCoverage(cov)}>+ 추가</button> :
                    <span style={{ ...s.tag, background:'#d4edda', color:C.success, whiteSpace:'nowrap', marginLeft:10 }}>추가됨 ✓</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={s.card}>
        <div style={s.cardTitle}>📋 특약 목록</div>
        {SPECIAL_COVERAGES.map(cov => {
          const sel = data.selectedCoverages.find(c => c.id === cov.id);
          return (
            <div key={cov.id} style={{
              padding:'12px 14px', borderRadius:10, marginBottom:8,
              border:`1px solid ${sel ? C.primary : C.border}`,
              background: sel ? C.primaryLight : '#fafaf8',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
                    {cov.name}
                    {cov.mandatory && isMultiUse && <span style={{ ...s.tag, background:C.danger, color:'#fff', fontSize:10 }}>의무</span>}
                  </div>
                  <div style={{ fontSize:11, color:C.textSub, marginTop:2 }}>{cov.description}</div>
                </div>
                {sel ? (
                  <button style={{
                    border:'none', background: sel.mandatory ? '#ccc' : C.danger, color:'#fff',
                    borderRadius:6, padding:'6px 10px', fontSize:12, fontWeight:600,
                    whiteSpace:'nowrap', marginLeft:8, cursor: sel.mandatory ? 'not-allowed' : 'pointer',
                  }} onClick={() => removeCoverage(cov.id)} disabled={sel.mandatory}>
                    {sel.mandatory ? '필수' : '제거'}
                  </button>
                ) : (
                  <button style={{
                    border:'none', background:'#e8e4de', color:C.text, borderRadius:6,
                    padding:'6px 10px', fontSize:12, fontWeight:600, cursor:'pointer',
                    whiteSpace:'nowrap', marginLeft:8,
                  }} onClick={() => addCoverage(cov)}>추가</button>
                )}
              </div>
              {sel && (
                <div className="slide-in" style={{ marginTop:10, display:'flex', gap:10, alignItems:'center' }}>
                  {cov.calcType === 'limit' && (
                    <div style={{ flex:1 }}>
                      <label style={{ fontSize:11, color:C.textSub }}>보상한도 (원)</label>
                      <input style={{ ...s.input, padding:'8px 10px', fontSize:13 }}
                        type="number" value={sel.limit}
                        onChange={e => updateLimit(cov.id, num(e.target.value))} />
                    </div>
                  )}
                  <div style={{ textAlign:'right', minWidth:100 }}>
                    <div style={{ fontSize:11, color:C.textSub }}>월 보험료</div>
                    <div style={{ fontSize:15, fontWeight:700, color:C.primary }}>{formatAmount(sel.premium)}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ ...s.card, background:'linear-gradient(135deg, #2d2d2d 0%, #444 100%)', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:15, fontWeight:500 }}>
            특약보험료 합계 (월) <span style={{ fontSize:12, color:'#aaa', marginLeft:6 }}>{data.selectedCoverages.length}건</span>
          </span>
          <span style={{ fontSize:22, fontWeight:900, color:C.primary }}>{formatAmount(totalCovP)}</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: 결과 확인 ─── */
function Step4({ data }) {
  const [monthlyTotal, setMonthlyTotal] = useState('');
  const [taxableIncome, setTaxableIncome] = useState('');
  const [showScript, setShowScript] = useState(false);

  const grade = num(data.buildingGrade), area = num(data.area);
  const pf = COVERAGE_PERIOD_FACTORS[data.coveragePeriod]?.factor || 1;
  const bc = calculateBuildingInsurance(grade, area, data.industryRate, pf);
  const fP = num(data.facilityAmount) > 0 ? calculateObjectInsurance(num(data.facilityAmount), grade, data.industryRate, pf) : 0;
  const mP = num(data.machineAmount) > 0 ? calculateObjectInsurance(num(data.machineAmount), grade, data.industryRate, pf) : 0;
  const sP = num(data.stockAmount) > 0 ? calculateObjectInsurance(num(data.stockAmount), grade, data.industryRate, pf) : 0;
  const covP = data.selectedCoverages.reduce((a, c) => a + c.premium, 0);
  const totalProt = bc.premium + fP + mP + sP + covP;

  const mt = num(monthlyTotal);
  const accum = Math.max(0, mt - totalProt);
  const refund = accum > 0 ? calculateMaturityRefund(accum, data.coveragePeriod, ACCUMULATION_RATE) : 0;
  const totalPaid = mt * data.coveragePeriod * 12;
  const refundRate = totalPaid > 0 ? ((refund / totalPaid) * 100).toFixed(1) : 0;

  const ti = num(taxableIncome);
  const taxB = ti > 0 && mt > 0 ? calculateTaxBenefit(mt * 12, ti, data.coveragePeriod) : null;
  const effRefund = taxB ? refund + taxB.totalBenefit : refund;
  const effRate = totalPaid > 0 ? ((effRefund / totalPaid) * 100).toFixed(1) : 0;

  const cases = ACCIDENT_CASES[data.industry] || ACCIDENT_CASES.default;

  return (
    <div className="fade-in">
      <div style={s.card}>
        <div style={s.cardTitle}>📊 보장보험료 요약</div>
        {[
          { label:'건물', value:bc.premium }, { label:'시설·집기', value:fP },
          { label:'기계·설비', value:mP }, { label:'재고·상품', value:sP },
          { label:'특약보험료', value:covP },
        ].filter(r => r.value > 0).map((r, i) => (
          <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid #f0ece6', fontSize:14 }}>
            <span style={{ color:C.textSub }}>{r.label}</span>
            <span style={{ fontWeight:600 }}>{formatAmount(r.value)}</span>
          </div>
        ))}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'14px 0 0', fontSize:16, fontWeight:700, borderTop:`2px solid ${C.accent}`, marginTop:8 }}>
          <span>월 보장보험료 합계</span>
          <span style={{ color:C.primary, fontSize:20 }}>{formatAmount(totalProt)}</span>
        </div>
      </div>

      <div className="two-col-grid">
        <div style={s.card}>
          <div style={s.cardTitle}>💰 만기환급금 시뮬레이션</div>
          <div style={{ marginBottom:14 }}>
            <label style={s.label}>희망 월납입보험료 (원)</label>
            <input style={s.input} type="number" placeholder="예: 500000"
              value={monthlyTotal} onChange={e => setMonthlyTotal(e.target.value)} />
            <div style={s.hint}>보장보험료({formatAmount(totalProt)})보다 큰 금액 입력</div>
          </div>
          {mt > totalProt && (
            <div className="slide-in" style={{
              background:'linear-gradient(135deg, #fdf3e1 0%, #ffedc8 100%)',
              borderRadius:12, padding:'18px 16px', border:'1px solid #fcd49a',
            }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>월 적립보험료</div><div style={{ fontSize:16, fontWeight:700 }}>{formatAmount(accum)}</div></div>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>총 납입보험료</div><div style={{ fontSize:16, fontWeight:700 }}>{formatAmount(totalPaid)}</div></div>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>만기환급금</div><div style={{ fontSize:18, fontWeight:900, color:C.primary }}>{formatAmount(refund)}</div></div>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>만기환급률</div><div style={{ fontSize:18, fontWeight:900, color:C.primary }}>{refundRate}%</div></div>
              </div>
              <div style={{ marginTop:10, fontSize:11, color:C.textSub }}>* 부리이율 연 {(ACCUMULATION_RATE * 100).toFixed(1)}% 복리 적용</div>
            </div>
          )}
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>🧾 사업자 경비처리 절세효과</div>
          <div style={{ marginBottom:14 }}>
            <label style={s.label}>종합소득세 과세표준 (원)</label>
            <input style={s.input} type="number" placeholder="예: 50000000"
              value={taxableIncome} onChange={e => setTaxableIncome(e.target.value)} />
            <div style={s.hint}>국세청 손택스 앱에서 확인 가능</div>
          </div>
          {taxB && (
            <div className="slide-in" style={{ background:'#eefbf3', borderRadius:12, padding:'18px 16px', border:'1px solid #b8e8cc' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>적용 세율</div><div style={{ fontSize:16, fontWeight:700 }}>{(taxB.taxRate * 100).toFixed(0)}%</div></div>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>연간 절세액</div><div style={{ fontSize:16, fontWeight:700, color:C.success }}>{formatAmount(taxB.annualBenefit)}</div></div>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>{data.coveragePeriod}년간 절세 합계</div><div style={{ fontSize:18, fontWeight:900, color:C.success }}>{formatAmount(taxB.totalBenefit)}</div></div>
                <div><div style={{ fontSize:11, color:C.textSub, marginBottom:4 }}>실질 환급률</div><div style={{ fontSize:18, fontWeight:900, color:C.success }}>{effRate}%</div></div>
              </div>
              <div style={{ marginTop:12, fontSize:13, color:'#2d6b45', lineHeight:1.6, fontWeight:500 }}>
                💡 경비처리를 고려하면 실질 환급금은 <strong>{formatAmount(effRefund)}</strong>이며, 실질 환급률은 <strong>{effRate}%</strong>입니다!
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>🎯 세일즈 스크립트</div>
        <button style={{ ...s.btnOutline, width:'100%', marginBottom:14 }} onClick={() => setShowScript(!showScript)}>
          {showScript ? '접기 ▲' : '스토리텔링형 세일즈 스크립트 보기 ▼'}
        </button>
        {showScript && (
          <div className="slide-in">
            {cases.map((c, i) => (
              <div key={i} style={{ background:'#fef9f0', borderRadius:10, padding:16, marginBottom:10, borderLeft:`4px solid ${C.primary}` }}>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:6, color:C.primaryDark }}>📰 {c.title}</div>
                <div style={{ fontSize:13, color:C.textSub, lineHeight:1.7, marginBottom:8 }}>{c.summary}</div>
                {c.images?.length > 0 && (
                  <div className="case-images">
                    {c.images.map((url, idx) => <img key={idx} src={url} alt={`${c.title} ${idx+1}`} loading="lazy" onError={e => { e.target.style.display='none'; }} />)}
                  </div>
                )}
                <div style={{ fontSize:13, color:C.text, lineHeight:1.6, marginTop:10, padding:'10px 12px', background:'#fff', borderRadius:8, border:`1px solid ${C.border}` }}>
                  💡 <strong>설계사 멘트:</strong> "{c.lesson}"
                </div>
              </div>
            ))}
            <div style={{ background:'#f0f4ff', borderRadius:10, padding:16, borderLeft:`4px solid ${C.info}` }}>
              <div style={{ fontWeight:700, fontSize:14, marginBottom:8, color:C.info }}>📝 종합 상담 스크립트</div>
              <div style={{ fontSize:13, color:C.text, lineHeight:1.8 }}>
                "{data.customerName || '사장'}님, {data.industryLabel || '이 업종'}은 화재뿐 아니라 다양한 위험에 노출되어 있습니다.
                {mt > 0 && <> 월 {formatAmount(mt)}만 납입하시면 {data.coveragePeriod}년 후 약 {formatAmount(refund)}을 돌려받으실 수 있고, 경비처리로 매년 약 {taxB ? formatAmount(taxB.annualBenefit) : '상당한 금액'}의 세금도 절약하실 수 있습니다.</>}
                {' '}사업장을 든든하게 지키면서 적립과 절세까지, 한화손보 재물보험으로 한 번에 해결하세요!"
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── 메인 App ─── */
export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    customerName: '', industry: '', industryRate: 1.0, industryLabel: '',
    buildingGrade: '', area: '', floors: '', coveragePeriod: 5,
    facilityAmount: '', machineAmount: '', stockAmount: '',
    selectedCoverages: [],
  });

  const steps = ['기본정보', '보험목적물', '특약선택', '결과확인'];
  const canProceed = useMemo(() => {
    if (step === 0) return data.industry && data.buildingGrade && num(data.area) > 0 && data.coveragePeriod;
    return true;
  }, [step, data]);

  const go = (dir) => { setStep(s => s + dir); window.scrollTo({ top:0, behavior:'smooth' }); };
  const reset = () => {
    if (window.confirm('모든 입력을 초기화하시겠습니까?')) {
      setData({
        customerName:'', industry:'', industryRate:1.0, industryLabel:'',
        buildingGrade:'', area:'', floors:'', coveragePeriod:5,
        facilityAmount:'', machineAmount:'', stockAmount:'', selectedCoverages:[],
      });
      setStep(0);
    }
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="app-container">
        <div style={s.header}>
          <div style={s.headerIcon}>⛰️</div>
          <div style={s.headerTitle}>재물보험 AI 세르파</div>
          <div style={s.headerSub}>GA·교차설계사 전용 · 재물보험 설계 자동화 시스템</div>
        </div>
        <Stepper current={step} steps={steps} />
        <div className="body-area">
          {step === 0 && <Step1 data={data} setData={setData} />}
          {step === 1 && <Step2 data={data} setData={setData} />}
          {step === 2 && <Step3 data={data} setData={setData} />}
          {step === 3 && <Step4 data={data} />}
        </div>
        <div className="footer-bar">
          {step > 0 ?
            <button style={{ ...s.btnSecondary, flex:0.4 }} onClick={() => go(-1)}>← 이전</button> :
            <button style={{ ...s.btnSecondary, flex:0.4, color:C.danger }} onClick={reset}>초기화</button>
          }
          {step < 3 ?
            <button style={{ ...s.btnPrimary, flex:0.6, opacity: canProceed ? 1 : 0.4, cursor: canProceed ? 'pointer' : 'not-allowed' }}
              onClick={canProceed ? () => go(1) : undefined}>다음 단계 →</button> :
            <button style={{ ...s.btnPrimary, flex:0.6 }} onClick={reset}>🔄 새로 설계하기</button>
          }
        </div>
      </div>
    </>
  );
}
