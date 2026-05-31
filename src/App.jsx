import React, { useState, useMemo } from 'react';
import { C, s, num } from './styles';
import Stepper from './components/Stepper';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';

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

const INITIAL_DATA = {
  customerName: '', industry: '', industryRate: 1.0, industryLabel: '',
  buildingGrade: '', area: '', coveragePeriod: 5,
  facilityAmount: '', machineAmount: '', stockAmount: '',
  selectedCoverages: [],
};

const STEPS = ['기본정보', '보험목적물', '특약선택', '결과확인', '요약보기'];

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);

  const canProceed = useMemo(() => {
    if (step === 0) return data.industry && data.buildingGrade && num(data.area) > 0 && data.coveragePeriod;
    return true;
  }, [step, data]);

  const go = (dir) => {
    setStep(s => s + dir);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => {
    setData(INITIAL_DATA);
    setStep(0);
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div className="app-container">
        {/* 헤더 */}
        <div style={s.header}>
          <img
            src={import.meta.env.BASE_URL + 'logo.png'}
            alt="한화손해보험"
            style={{ height: 40, marginBottom: 10 }}
          />
          <div style={s.headerTitle}>재물보험 AI 세르파</div>
          <div style={s.headerSub}>GA·교차설계사 전용 · 재물보험 설계 자동화 시스템</div>
        </div>

        {/* 스텝퍼 */}
        <Stepper current={step} steps={STEPS} />

        {/* 본문 */}
        <div className="body-area">
          {step === 0 && <Step1 data={data} setData={setData} />}
          {step === 1 && <Step2 data={data} setData={setData} />}
          {step === 2 && <Step3 data={data} setData={setData} />}
          {step === 3 && <Step4 data={data} />}
          {step === 4 && <Step5 data={data} />}
        </div>

        {/* 하단 네비게이션 */}
        <div className="footer-bar">
          {step > 0 ? (
            <button style={{ ...s.btnSecondary, flex: 0.4 }} onClick={() => go(-1)}>
              ← 이전
            </button>
          ) : (
            <button style={{ ...s.btnSecondary, flex: 0.4, color: C.danger }} onClick={reset}>
              초기화
            </button>
          )}
          {step < 4 ? (
            <button
              style={{
                ...s.btnPrimary, flex: 0.6,
                opacity: canProceed ? 1 : 0.4,
                cursor: canProceed ? 'pointer' : 'not-allowed',
              }}
              onClick={canProceed ? () => go(1) : undefined}
            >
              {step === 3 ? '✅ 확인' : '다음 단계 →'}
            </button>
          ) : (
            <button style={{ ...s.btnPrimary, flex: 0.6, background: C.danger }} onClick={reset}>
              🔄 새로 설계하기
            </button>
          )}
        </div>
      </div>
    </>
  );
}
