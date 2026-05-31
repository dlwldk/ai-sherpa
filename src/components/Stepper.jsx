import React from 'react';
import { C, s } from '../styles';

export default function Stepper({ current, steps }) {
  return (
    <div style={s.stepper}>
      {steps.map((step, i) => {
        const isActive = i === current, isDone = i < current;
        return (
          <React.Fragment key={i}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 48 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: isActive ? C.primary : isDone ? C.success : '#e5e0d8',
                color: isActive || isDone ? '#fff' : C.textSub,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                boxShadow: isActive ? '0 2px 8px rgba(232,147,12,0.4)' : 'none',
              }}>{isDone ? '✓' : i + 1}</div>
              <span style={{
                fontSize: 10, marginTop: 4,
                fontWeight: isActive ? 700 : 400,
                color: isActive ? C.primary : C.textSub,
              }}>{step}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 2, maxWidth: 20, margin: '0 2px', marginBottom: 16,
                background: isDone ? C.success : '#e5e0d8', borderRadius: 1,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
