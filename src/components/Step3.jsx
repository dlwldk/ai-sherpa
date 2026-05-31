import React, { useState, useEffect } from 'react';
import { C, s, num } from '../styles';
import { SPECIAL_COVERAGES, MULTI_USE_INDUSTRIES, calculateSpecialCoverage, recommendCoverages, formatAmount } from '../data/insuranceData';

export default function Step3({ data, setData }) {
  const [worryInput, setWorryInput] = useState('');
  const [recommended, setRecommended] = useState([]);
  const isMultiUse = MULTI_USE_INDUSTRIES.includes(data.industry);
  const totalArea = num(data.area);

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
  const totalCovP = data.selectedCoverages.reduce((acc, c) => acc + c.premium, 0);

  return (
    <div className="fade-in">
      <div style={s.card}>
        <div style={s.cardTitle}>💬 사장님의 걱정거리</div>
        <textarea style={s.textarea}
          placeholder={'예: "손님이 음식을 먹고 탈이 나면 보상이 되나요?"\n"종업원이 뜨거운 음식물을 손님에게 쏟는 경우가 있어요"'}
          value={worryInput} onChange={e => setWorryInput(e.target.value)} />
        <button style={{ ...s.btnPrimary, marginTop: 12, fontSize: 14 }}
          onClick={() => {
            if (!worryInput.trim()) return;
            const recs = recommendCoverages(worryInput);
            if (recs.length > 0) {
              setRecommended(recs);
            } else {
              alert('입력하신 내용과 매칭되는 특약을 찾지 못했습니다.\n아래 특약 목록에서 직접 선택해주세요.');
              setRecommended([]);
            }
          }}>
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
                padding: '14px 16px', borderRadius: 10, marginBottom: 10,
                border: `1px solid ${added ? '#b8e8cc' : C.border}`,
                background: added ? '#eefbf3' : '#fafaf8',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{cov.name}</div>
                    <div style={{ fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>{cov.description}</div>
                  </div>
                  {!added ?
                    <button style={{ ...s.tag, background: C.primary, color: '#fff', cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', marginLeft: 10 }}
                      onClick={() => addCoverage(cov)}>+ 추가</button> :
                    <span style={{ ...s.tag, background: '#d4edda', color: C.success, whiteSpace: 'nowrap', marginLeft: 10 }}>추가됨 ✓</span>
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
              padding: '12px 14px', borderRadius: 10, marginBottom: 8,
              border: `1px solid ${sel ? C.primary : C.border}`,
              background: sel ? C.primaryLight : '#fafaf8',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {cov.name}
                    {cov.mandatory && isMultiUse && <span style={{ ...s.tag, background: C.danger, color: '#fff', fontSize: 10 }}>의무</span>}
                  </div>
                  <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>{cov.description}</div>
                </div>
                {sel ? (
                  <button style={{
                    border: 'none', background: sel.mandatory ? '#ccc' : C.danger, color: '#fff',
                    borderRadius: 6, padding: '6px 10px', fontSize: 12, fontWeight: 600,
                    whiteSpace: 'nowrap', marginLeft: 8, cursor: sel.mandatory ? 'not-allowed' : 'pointer',
                  }} onClick={() => removeCoverage(cov.id)} disabled={sel.mandatory}>
                    {sel.mandatory ? '필수' : '제거'}
                  </button>
                ) : (
                  <button style={{
                    border: 'none', background: '#e8e4de', color: C.text, borderRadius: 6,
                    padding: '6px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    whiteSpace: 'nowrap', marginLeft: 8,
                  }} onClick={() => addCoverage(cov)}>추가</button>
                )}
              </div>
              {sel && (
                <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                  {cov.calcType === 'limit' && (
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: 11, color: C.textSub }}>보상한도 (원)</label>
                      <input style={{ ...s.input, padding: '8px 10px', fontSize: 13 }}
                        type="number" value={sel.limit}
                        onChange={e => updateLimit(cov.id, num(e.target.value))} />
                    </div>
                  )}
                  <div style={{ textAlign: 'left', minWidth: 100 }}>
                    <div style={{ fontSize: 11, color: C.textSub }}>월 보험료</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{formatAmount(sel.premium)}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ ...s.card, background: 'linear-gradient(135deg, #2d2d2d 0%, #444 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>
            특약보험료 합계 (월) <span style={{ fontSize: 12, color: '#aaa', marginLeft: 6 }}>{data.selectedCoverages.length}건</span>
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>{formatAmount(totalCovP)}</span>
        </div>
      </div>
    </div>
  );
}
