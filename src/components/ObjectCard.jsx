import React from 'react';
import { C, s, num } from '../styles';
import { formatAmount } from '../data/insuranceData';

export default function ObjectCard({ icon, title, hint, premium, value, onChange }) {
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
        <div style={{ background: '#f7f5f1', borderRadius: 10, padding: '12px 16px', border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, color: C.textSub }}>월 보장보험료</span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{formatAmount(premium)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
