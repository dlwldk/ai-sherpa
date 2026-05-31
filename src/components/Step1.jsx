import React, { useState } from 'react';
import { C, s } from '../styles';
import { INDUSTRY_CATEGORIES, BUILDING_GRADES, COVERAGE_PERIOD_FACTORS, MULTI_USE_INDUSTRIES, matchIndustry } from '../data/insuranceData';
import BuildingPhotoAI from './BuildingPhotoAI';

export default function Step1({ data, setData }) {
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
