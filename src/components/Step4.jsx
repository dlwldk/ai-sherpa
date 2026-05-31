import React, { useState } from 'react';
import { C, s, num } from '../styles';
import {
  COVERAGE_PERIOD_FACTORS, ACCIDENT_CASES, ACCUMULATION_RATE,
  calculateBuildingInsurance, calculateObjectInsurance,
  calculateMaturityRefund, calculateTaxBenefit, formatAmount,
} from '../data/insuranceData';

export default function Step4({ data }) {
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
          { label: '건물', value: bc.premium }, { label: '시설·집기', value: fP },
          { label: '기계·설비', value: mP }, { label: '재고·상품', value: sP },
          { label: '특약보험료', value: covP },
        ].filter(r => r.value > 0).map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0ece6', fontSize: 14 }}>
            <span style={{ color: C.textSub }}>{r.label}</span>
            <span style={{ fontWeight: 600 }}>{formatAmount(r.value)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 0', fontSize: 16, fontWeight: 700, borderTop: `2px solid ${C.accent}`, marginTop: 8 }}>
          <span>월 보장보험료 합계</span>
          <span style={{ color: C.primary, fontSize: 20 }}>{formatAmount(totalProt)}</span>
        </div>
      </div>

      <div className="two-col-grid">
        <div style={s.card}>
          <div style={s.cardTitle}>💰 만기환급금 시뮬레이션</div>
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>희망 월납입보험료 (원)</label>
            <input style={s.input} type="number" placeholder="예: 500000"
              value={monthlyTotal} onChange={e => setMonthlyTotal(e.target.value)} />
            <div style={s.hint}>보장보험료({formatAmount(totalProt)})보다 큰 금액 입력</div>
          </div>
          {mt > totalProt && (
            <div style={{
              background: 'linear-gradient(135deg, #fdf3e1 0%, #ffedc8 100%)',
              borderRadius: 12, padding: '18px 16px', border: '1px solid #fcd49a',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>월 적립보험료</div><div style={{ fontSize: 16, fontWeight: 700 }}>{formatAmount(accum)}</div></div>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>총 납입보험료</div><div style={{ fontSize: 16, fontWeight: 700 }}>{formatAmount(totalPaid)}</div></div>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>만기환급금</div><div style={{ fontSize: 18, fontWeight: 900, color: C.primary }}>{formatAmount(refund)}</div></div>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>만기환급률</div><div style={{ fontSize: 18, fontWeight: 900, color: C.primary }}>{refundRate}%</div></div>
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: C.textSub }}>* 부리이율 연 {(ACCUMULATION_RATE * 100).toFixed(1)}% 복리 적용</div>
            </div>
          )}
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>🧾 사업자 경비처리 절세효과</div>
          <div style={{ marginBottom: 14 }}>
            <label style={s.label}>종합소득세 과세표준 (원)</label>
            <input style={s.input} type="number" placeholder="예: 50000000"
              value={taxableIncome} onChange={e => setTaxableIncome(e.target.value)} />
            <div style={s.hint}>국세청 손택스 앱에서 확인 가능</div>
          </div>
          {taxB && (
            <div style={{ background: '#eefbf3', borderRadius: 12, padding: '18px 16px', border: '1px solid #b8e8cc' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>적용 세율</div><div style={{ fontSize: 16, fontWeight: 700 }}>{(taxB.taxRate * 100).toFixed(0)}%</div></div>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>연간 절세액</div><div style={{ fontSize: 16, fontWeight: 700, color: C.success }}>{formatAmount(taxB.annualBenefit)}</div></div>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>{data.coveragePeriod}년간 절세 합계</div><div style={{ fontSize: 18, fontWeight: 900, color: C.success }}>{formatAmount(taxB.totalBenefit)}</div></div>
                <div><div style={{ fontSize: 11, color: C.textSub, marginBottom: 4 }}>실질 환급률</div><div style={{ fontSize: 18, fontWeight: 900, color: C.success }}>{effRate}%</div></div>
              </div>
              <div style={{ marginTop: 12, fontSize: 13, color: '#2d6b45', lineHeight: 1.6, fontWeight: 500 }}>
                💡 경비처리를 고려하면 실질 환급금은 <strong>{formatAmount(effRefund)}</strong>이며, 실질 환급률은 <strong>{effRate}%</strong>입니다!
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={s.card}>
        <div style={s.cardTitle}>🎯 세일즈 스크립트</div>
        <button style={{ ...s.btnOutline, width: '100%', marginBottom: 14 }} onClick={() => setShowScript(!showScript)}>
          {showScript ? '접기 ▲' : '스토리텔링형 세일즈 스크립트 보기 ▼'}
        </button>
        {showScript && (
          <div className="slide-in">
            {cases.map((c, i) => (
              <div key={i} style={{ background: '#fef9f0', borderRadius: 10, padding: 16, marginBottom: 10, borderLeft: `4px solid ${C.primary}` }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: C.primaryDark }}>📰 {c.title}</div>
                <div style={{ fontSize: 13, color: C.textSub, lineHeight: 1.7, marginBottom: 8 }}>{c.summary}</div>
                {c.images?.length > 0 && (
                  <div className="case-images">
                    {c.images.map((url, idx) => <img key={idx} src={url} alt={`${c.title} ${idx + 1}`} loading="lazy" onError={e => { e.target.style.display = 'none'; }} />)}
                  </div>
                )}
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6, marginTop: 10, padding: '10px 12px', background: '#fff', borderRadius: 8, border: `1px solid ${C.border}` }}>
                  💡 <strong>설계사 멘트:</strong> "{c.lesson}"
                </div>
              </div>
            ))}
            <div style={{ background: '#f0f4ff', borderRadius: 10, padding: 16, borderLeft: `4px solid ${C.info}` }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8, color: C.info }}>📝 종합 상담 스크립트</div>
              <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
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
