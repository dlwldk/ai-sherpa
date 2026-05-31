import React, { useMemo } from 'react';
import { C, s, num } from '../styles';
import { BUILDING_GRADES, COVERAGE_PERIOD_FACTORS, calculateBuildingInsurance, calculateObjectInsurance, formatAmount } from '../data/insuranceData';
import ObjectCard from './ObjectCard';

export default function Step2({ data, setData }) {
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
          <div style={{ background: '#f7f5f1', borderRadius: 10, padding: '14px 16px', border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: C.textSub }}>보험가입금액</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>{formatAmount(buildingCalc.amount)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: C.textSub }}>월 보장보험료</span>
              <span style={{ fontSize: 15, fontWeight: 700 }}>{formatAmount(buildingCalc.premium)}</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 11, color: C.textSub, lineHeight: 1.5 }}>
              산식: {formatAmount(BUILDING_GRADES[grade]?.pricePerPyeong || 0)} × {area}평 = {formatAmount(buildingCalc.amount)}
            </div>
          </div>
        ) : (
          <div style={{ fontSize: 14, color: C.textSub, textAlign: 'center', padding: 20 }}>기본정보를 먼저 입력해주세요</div>
        )}
      </div>

      <div className="two-col-grid">
        <ObjectCard icon="🪑" title="시설 · 집기 (인테리어)"
          hint="인테리어, 가구, 집기 등의 가액 (원)" premium={facilityP}
          value={data.facilityAmount} onChange={e => setData(d => ({ ...d, facilityAmount: e.target.value }))} />
        <ObjectCard icon="⚙️" title="기계 · 설비"
          hint="기계, 냉동기, 대형설비 등의 가액 (원)" premium={machineP}
          value={data.machineAmount} onChange={e => setData(d => ({ ...d, machineAmount: e.target.value }))} />
      </div>
      <ObjectCard icon="📦" title="재고 · 상품"
        hint="재고자산, 원자재, 상품 등의 가액 (원)" premium={stockP}
        value={data.stockAmount} onChange={e => setData(d => ({ ...d, stockAmount: e.target.value }))} />

      <div style={{ ...s.card, background: 'linear-gradient(135deg, #2d2d2d 0%, #444 100%)', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 15, fontWeight: 500 }}>보장보험료 합계 (월)</span>
          <span style={{ fontSize: 22, fontWeight: 900, color: C.primary }}>
            {formatAmount((buildingCalc?.premium || 0) + facilityP + machineP + stockP)}
          </span>
        </div>
      </div>
    </div>
  );
}
