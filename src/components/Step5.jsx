import React from 'react';
import { C, s, num } from '../styles';
import {
  BUILDING_GRADES, COVERAGE_PERIOD_FACTORS,
  calculateBuildingInsurance, calculateObjectInsurance, formatAmount,
} from '../data/insuranceData';

export default function Step5({ data }) {
  const grade = num(data.buildingGrade), area = num(data.area);
  const pf = COVERAGE_PERIOD_FACTORS[data.coveragePeriod]?.factor || 1;
  const bc = calculateBuildingInsurance(grade, area, data.industryRate, pf);
  const fP = num(data.facilityAmount) > 0 ? calculateObjectInsurance(num(data.facilityAmount), grade, data.industryRate, pf) : 0;
  const mP = num(data.machineAmount) > 0 ? calculateObjectInsurance(num(data.machineAmount), grade, data.industryRate, pf) : 0;
  const sP = num(data.stockAmount) > 0 ? calculateObjectInsurance(num(data.stockAmount), grade, data.industryRate, pf) : 0;
  const covP = data.selectedCoverages.reduce((a, c) => a + c.premium, 0);
  const totalProt = bc.premium + fP + mP + sP + covP;
  const totalInsured = bc.amount + num(data.facilityAmount) + num(data.machineAmount) + num(data.stockAmount);

  return (
    <div className="fade-in">
      {/* ★ 요약 헤더: 다크 네이비 (헤더 오렌지와 구분) */}
      <div style={{
        ...s.card, textAlign: 'center', padding: '28px 20px',
        background: 'linear-gradient(135deg, #1a2a4a 0%, #2a3a5a 100%)',
        color: '#fff', border: 'none',
      }}>
        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 4 }}>재물보험 AI 세르파</div>
        <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>📋 보험설계 요약서</div>
        <div style={{ fontSize: 13, opacity: 0.75 }}>
          {data.customerName ? `${data.customerName} 고객님` : '고객님'} | {data.industryLabel || '-'}
        </div>
      </div>

      {/* 기본정보 */}
      <div style={s.card}>
        <div style={s.cardTitle}>📋 기본정보</div>
        {[
          { label: '고객명', value: data.customerName || '-' },
          { label: '업종', value: data.industryLabel || '-' },
          { label: '건물등급', value: data.buildingGrade ? BUILDING_GRADES[grade]?.label : '-' },
          { label: '전용면적', value: data.area ? `${data.area}평` : '-' },
          { label: '보장기간', value: `${data.coveragePeriod}년` },
        ].map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 0',
            borderBottom: i < 4 ? '1px solid #f0ece6' : 'none', fontSize: 14,
          }}>
            <span style={{ color: C.textSub }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{r.value}</span>
          </div>
        ))}
      </div>

      {/* 보험가입금액 */}
      <div style={s.card}>
        <div style={s.cardTitle}>🏢 보험가입금액</div>
        {[
          { label: '건물', value: bc.amount },
          { label: '시설·집기', value: num(data.facilityAmount) },
          { label: '기계·설비', value: num(data.machineAmount) },
          { label: '재고·상품', value: num(data.stockAmount) },
        ].filter(r => r.value > 0).map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 0',
            borderBottom: '1px solid #f0ece6', fontSize: 14,
          }}>
            <span style={{ color: C.textSub }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{formatAmount(r.value)}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', padding: '12px 0 0',
          fontSize: 15, fontWeight: 700, borderTop: '2px solid #2d2d2d', marginTop: 4,
        }}>
          <span>총 보험가입금액</span>
          <span style={{ color: C.primary }}>{formatAmount(totalInsured)}</span>
        </div>
      </div>

      {/* 월 보장보험료 */}
      <div style={s.card}>
        <div style={s.cardTitle}>💰 월 보장보험료</div>
        {[
          { label: '건물', value: bc.premium },
          { label: '시설·집기', value: fP },
          { label: '기계·설비', value: mP },
          { label: '재고·상품', value: sP },
          { label: '특약보험료', value: covP },
        ].filter(r => r.value > 0).map((r, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', padding: '8px 0',
            borderBottom: '1px solid #f0ece6', fontSize: 14,
          }}>
            <span style={{ color: C.textSub }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{formatAmount(r.value)}</span>
          </div>
        ))}
        <div style={{
          display: 'flex', justifyContent: 'space-between', padding: '14px 0 0',
          fontSize: 16, fontWeight: 700, borderTop: '2px solid #2d2d2d', marginTop: 4,
        }}>
          <span>월 합계</span>
          <span style={{ color: C.primary, fontSize: 20 }}>{formatAmount(totalProt)}</span>
        </div>
      </div>

      {/* 선택 특약 */}
      {data.selectedCoverages.length > 0 && (
        <div style={s.card}>
          <div style={s.cardTitle}>📑 선택 특약 ({data.selectedCoverages.length}건)</div>
          {data.selectedCoverages.map((c, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '10px 0', borderBottom: i < data.selectedCoverages.length - 1 ? '1px solid #f0ece6' : 'none',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.name}</div>
                {c.calcType === 'limit' && (
                  <div style={{ fontSize: 11, color: C.textSub, marginTop: 2 }}>
                    보상한도: {formatAmount(c.limit)}
                  </div>
                )}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.primary, whiteSpace: 'nowrap' }}>
                {formatAmount(c.premium)}/월
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 연간 보험료 */}
      <div style={{
        ...s.card, border: 'none',
        background: 'linear-gradient(135deg, #2d2d2d 0%, #444 100%)', color: '#fff',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: '#ccc' }}>월 보장보험료</span>
          <span style={{ fontSize: 16, fontWeight: 600 }}>{formatAmount(totalProt)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, color: '#ccc' }}>연간 보장보험료</span>
          <span style={{ fontSize: 20, fontWeight: 900, color: '#F37321' }}>{formatAmount(totalProt * 12)}</span>
        </div>
      </div>
    </div>
  );
}
