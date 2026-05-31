// 업종 분류 및 요율 데이터
export const INDUSTRY_CATEGORIES = [
  { value: 'restaurant', label: '음식점', rate: 1.2, group: '서비스업' },
  { value: 'office', label: '사무실', rate: 1.1, group: '서비스업' },
  { value: 'screen_golf', label: '스크린골프장', rate: 1.3, group: '체육시설' },
  { value: 'sports_facility', label: '체육시설', rate: 1.2, group: '체육시설' },
  { value: 'billiards', label: '당구장', rate: 1.1, group: '체육시설' },
  { value: 'cafe', label: '카페/커피숍', rate: 1.15, group: '서비스업' },
  { value: 'pc_bang', label: 'PC방', rate: 1.25, group: '서비스업' },
  { value: 'coin_laundry', label: '코인세탁소', rate: 1.15, group: '서비스업' },
  { value: 'hair_salon', label: '미용실/헤어숍', rate: 1.1, group: '서비스업' },
  { value: 'mart', label: '마트/슈퍼', rate: 1.15, group: '판매업' },
  { value: 'academy', label: '학원', rate: 1.1, group: '서비스업' },
  { value: 'hospital', label: '병원/의원', rate: 1.15, group: '서비스업' },
  { value: 'pharmacy', label: '약국', rate: 1.1, group: '판매업' },
  { value: 'factory', label: '공장', rate: 1.4, group: '제조업' },
  { value: 'warehouse', label: '창고', rate: 1.25, group: '물류업' },
  { value: 'accommodation', label: '숙박업', rate: 1.2, group: '서비스업' },
  { value: 'retail', label: '소매점', rate: 1.1, group: '판매업' },
  { value: 'bakery', label: '제과점/베이커리', rate: 1.2, group: '서비스업' },
  { value: 'karaoke', label: '노래연습장', rate: 1.2, group: '서비스업' },
  { value: 'other', label: '기타', rate: 1.15, group: '기타' },
];

export const INDUSTRY_KEYWORDS = {
  restaurant: ['고기집', '고깃집', '숯불구이', '삼겹살', '한식', '중식', '일식', '양식', '분식', '치킨', '피자', '족발', '보쌈', '국밥', '찌개', '식당', '음식점', '밥집', '횟집', '초밥', '라멘', '떡볶이', '김밥', '냉면', '갈비', '삼계탕', '해장국', '곱창', '막창'],
  cafe: ['카페', '커피', '디저트', '베이커리카페', '브런치', '차', '티', '스무디'],
  pc_bang: ['pc방', 'PC방', '피씨방', '게임방', '피시방'],
  coin_laundry: ['코인세탁', '빨래방', '셀프빨래'],
  screen_golf: ['스크린골프', '골프연습장', '골프존', '실내골프'],
  billiards: ['당구장', '포켓볼', '빌리어드'],
  hair_salon: ['미용실', '헤어숍', '헤어샵', '이발소', '네일', '뷰티샵'],
  mart: ['마트', '슈퍼', '슈퍼마켓', '편의점', '가게'],
  academy: ['학원', '교습소', '어학원', '수학학원', '영어학원', '태권도', '피아노'],
  hospital: ['병원', '의원', '클리닉', '치과', '한의원', '피부과', '안과', '정형외과'],
  pharmacy: ['약국', '약방'],
  factory: ['공장', '제조', '생산', '가공'],
  warehouse: ['창고', '물류', '보관'],
  accommodation: ['모텔', '호텔', '펜션', '민박', '게스트하우스', '숙박'],
  office: ['사무실', '오피스', '사무소', '법무사', '회계사', '세무사'],
  sports_facility: ['헬스장', '피트니스', '요가', '필라테스', '수영장', '체육관'],
  bakery: ['빵집', '제과', '베이커리', '케이크'],
  karaoke: ['노래방', '노래연습장', '코인노래방'],
  retail: ['옷가게', '의류', '잡화', '문구', '꽃집', '화원', '서점'],
};

// 건물 등급별 데이터 (평당 가액: 원 단위)
export const BUILDING_GRADES = {
  1: { label: '1급 (철근콘크리트)', pricePerPyeong: 4000000, baseRate: 0.0001 },
  2: { label: '2급 (철골)', pricePerPyeong: 3500000, baseRate: 0.0002 },
  3: { label: '3급 (불연목조)', pricePerPyeong: 3000000, baseRate: 0.0003 },
  4: { label: '4급 (목조)', pricePerPyeong: 2500000, baseRate: 0.0004 },
};

export const COVERAGE_PERIOD_FACTORS = {
  3: { factor: 0.85, label: '3년' },
  5: { factor: 1.0, label: '5년' },
  7: { factor: 1.12, label: '7년' },
  10: { factor: 1.25, label: '10년' },
  15: { factor: 1.4, label: '15년' },
};

// 특약 데이터 (보상한도: 원 단위)
export const SPECIAL_COVERAGES = [
  {
    id: 'fire_liability',
    name: '화재대물배상책임특약',
    description: '화재로 인한 제3자의 재물손해를 보상합니다.',
    calcType: 'area',
    ratePerPyeong: 500,
    minLimit: 10000000,
    maxLimit: 100000000,
    defaultLimit: 30000000,
    mandatory: false,
    keywords: ['화재', '불', '대물', '배상'],
  },
  {
    id: 'fire_liability_no_fault',
    name: '화재대물배상책임_무과실책임특약',
    description: '과실 여부와 관계없이 화재로 인한 제3자 재물손해를 보상합니다. 다중이용업소 의무가입 대상.',
    calcType: 'area',
    ratePerPyeong: 700,
    minLimit: 10000000,
    maxLimit: 200000000,
    defaultLimit: 50000000,
    mandatory: true,
    keywords: ['무과실', '의무', '다중이용'],
  },
  {
    id: 'food_liability',
    name: '음식물배상책임특약',
    description: '음식물 섭취로 인한 고객의 신체손해를 보상합니다.',
    calcType: 'limit',
    ratePerLimit: 0.008,
    minLimit: 10000000,
    maxLimit: 100000000,
    defaultLimit: 30000000,
    mandatory: false,
    keywords: ['음식', '식중독', '탈', '먹고', '배탈', '식사', '음식물'],
  },
  {
    id: 'facility_liability',
    name: '시설소유관리자배상책임특약',
    description: '시설의 소유, 사용, 관리 중 발생한 사고로 인한 제3자의 손해를 보상합니다.',
    calcType: 'area',
    ratePerPyeong: 700,
    minLimit: 10000000,
    maxLimit: 200000000,
    defaultLimit: 50000000,
    mandatory: false,
    keywords: ['시설', '관리', '넘어', '미끄러', '낙상', '사고', '다치', '손님', '고객'],
  },
  {
    id: 'employer_liability',
    name: '고용자배상책임특약',
    description: '종업원의 업무 중 재해로 인한 사용자의 배상책임을 보상합니다.',
    calcType: 'limit',
    ratePerLimit: 0.01,
    minLimit: 10000000,
    maxLimit: 100000000,
    defaultLimit: 30000000,
    mandatory: false,
    keywords: ['종업원', '직원', '근로자', '업무', '쏟', '화상', '뜨거운'],
  },
  {
    id: 'theft',
    name: '도난손해특약',
    description: '도난으로 인한 보험목적물의 손해를 보상합니다.',
    calcType: 'limit',
    ratePerLimit: 0.005,
    minLimit: 5000000,
    maxLimit: 50000000,
    defaultLimit: 10000000,
    mandatory: false,
    keywords: ['도난', '도둑', '절도', '훔치'],
  },
  {
    id: 'water_damage',
    name: '수재손해특약',
    description: '풍수재(태풍, 홍수, 폭우 등)로 인한 손해를 보상합니다.',
    calcType: 'limit',
    ratePerLimit: 0.006,
    minLimit: 10000000,
    maxLimit: 100000000,
    defaultLimit: 30000000,
    mandatory: false,
    keywords: ['물', '침수', '홍수', '태풍', '폭우', '비', '누수'],
  },
  {
    id: 'electric',
    name: '전기적사고특약',
    description: '전기적 원인에 의한 화재, 폭발 등의 손해를 보상합니다.',
    calcType: 'limit',
    ratePerLimit: 0.004,
    minLimit: 5000000,
    maxLimit: 50000000,
    defaultLimit: 20000000,
    mandatory: false,
    keywords: ['전기', '합선', '누전', '과전류', '감전', '전기사고'],
  },
];

export const MULTI_USE_INDUSTRIES = [
  'restaurant', 'cafe', 'karaoke', 'pc_bang', 'screen_golf', 'accommodation'
];

// 종합소득세 과세표준 (원 단위)
export const TAX_BRACKETS = [
  { min: 0, max: 14000000, rate: 0.06, deduction: 0 },
  { min: 14000000, max: 50000000, rate: 0.15, deduction: 1260000 },
  { min: 50000000, max: 88000000, rate: 0.24, deduction: 5760000 },
  { min: 88000000, max: 150000000, rate: 0.35, deduction: 15440000 },
  { min: 150000000, max: 300000000, rate: 0.38, deduction: 19940000 },
  { min: 300000000, max: 500000000, rate: 0.40, deduction: 25940000 },
  { min: 500000000, max: 1000000000, rate: 0.42, deduction: 35940000 },
  { min: 1000000000, max: Infinity, rate: 0.45, deduction: 65940000 },
];

export const ACCIDENT_CASES = {
  restaurant: [
    {
      title: '음식점 화재사고',
      summary: '서울 OO구 숯불구이 음식점에서 환풍기 덕트 내 유분(기름때)에 불이 옮겨 붙어 점포 전소. 영업 중단 3개월, 피해액 약 2억 8천만원.',
      lesson: '환풍기 관리 소홀로 인한 화재는 음식점에서 가장 빈번한 사고입니다. 건물+시설 보장이 필수입니다.',
      images: [],
    },
    {
      title: '식중독 집단 발생',
      summary: 'OO시 한식뷔페에서 노로바이러스 감염으로 고객 12명 집단 식중독 발생. 치료비 및 위자료 배상 약 4,500만원.',
      lesson: '음식물배상책임특약 없이는 식중독 사고 시 사업주가 전액 부담해야 합니다.',
      images: [],
    },
  ],
  cafe: [
    {
      title: '카페 화상 사고',
      summary: 'OO카페에서 종업원이 뜨거운 커피를 손님에게 쏟아 2도 화상. 치료비+위자료 약 1,800만원 배상.',
      lesson: '시설소유관리자배상책임특약과 고용자배상책임특약으로 대비해야 합니다.',
      images: [],
    },
  ],
  pc_bang: [
    {
      title: 'PC방 화재',
      summary: 'OO시 PC방에서 멀티탭 과부하로 인한 전기화재 발생. 고가 PC장비 전소, 피해액 약 1억 5천만원.',
      lesson: '전기적사고특약과 시설(집기) 보장으로 고가 장비를 보호해야 합니다.',
      images: [],
    },
  ],
  screen_golf: [
    {
      title: '스크린골프장 시설 사고',
      summary: '스크린골프 이용 중 스크린 프레임 떨어져 고객 부상. 치료비+위자료 약 2,300만원 배상.',
      lesson: '시설소유관리자배상책임특약 필수 가입이 권장됩니다.',
      images: [],
    },
  ],
  factory: [
    {
      title: '공장 화재 전소',
      summary: 'OO시 가구 제조공장에서 원인불명 화재로 공장 및 원자재 전소. 피해액 약 8억원, 영업손실 별도.',
      lesson: '공장은 화재 위험이 높아 건물+기계+재고 모두 충분한 보험가입금액 설정이 핵심입니다.',
      images: [],
    },
  ],
  default: [
    {
      title: '일반 화재 사고',
      summary: '전기 합선으로 인한 화재로 점포 내부 전소. 인테리어 복구비용 약 1억 2천만원 소요.',
      lesson: '어떤 업종이든 화재 위험은 존재합니다. 건물등급에 맞는 적정 보험가입금액 설정이 중요합니다.',
      images: [],
    },
  ],
};

export const ACCUMULATION_RATE = 0.027;

// ★ 건물 보험: 층수 미반영 (평당가 × 면적만)
export function calculateBuildingInsurance(grade, areaPyeong, industryRate, periodFactor) {
  const gradeData = BUILDING_GRADES[grade];
  if (!gradeData) return { amount: 0, premium: 0 };
  const insuredAmount = gradeData.pricePerPyeong * areaPyeong;
  const monthlyRate = gradeData.baseRate * periodFactor;
  const premium = Math.round(insuredAmount * monthlyRate * industryRate);
  return { amount: insuredAmount, premium };
}

// 목적물: 원 단위 직접 입력
export function calculateObjectInsurance(insuredAmount, grade, industryRate, periodFactor) {
  const gradeData = BUILDING_GRADES[grade];
  if (!gradeData) return 0;
  const monthlyRate = gradeData.baseRate * periodFactor;
  return Math.round(insuredAmount * monthlyRate * industryRate);
}

// 특약: 보상한도 원 단위
export function calculateSpecialCoverage(coverage, areaPyeong, limit) {
  if (coverage.calcType === 'area') {
    return Math.round(areaPyeong * coverage.ratePerPyeong);
  } else {
    return Math.round(limit * coverage.ratePerLimit);
  }
}

export function calculateMaturityRefund(monthlyAccumulation, years, annualRate) {
  const monthlyRate = annualRate / 12;
  const months = years * 12;
  if (monthlyRate === 0) return monthlyAccumulation * months;
  const fv = monthlyAccumulation * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  return Math.round(fv);
}

// 세금: 원 단위
export function calculateTaxBenefit(annualPremium, taxableIncome, years) {
  const bracket = TAX_BRACKETS.find(b => taxableIncome >= b.min && taxableIncome < b.max);
  if (!bracket) return 0;
  const annualBenefit = Math.round(annualPremium * bracket.rate);
  const totalBenefit = annualBenefit * years;
  return { annualBenefit, totalBenefit, taxRate: bracket.rate };
}

export function matchIndustry(input) {
  const normalized = input.toLowerCase().trim();
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalized.includes(keyword.toLowerCase())) {
        return INDUSTRY_CATEGORIES.find(c => c.value === industry);
      }
    }
  }
  return null;
}

export function recommendCoverages(input) {
  const normalized = input.toLowerCase().trim();
  const recommended = [];
  for (const coverage of SPECIAL_COVERAGES) {
    for (const keyword of coverage.keywords) {
      if (normalized.includes(keyword)) {
        if (!recommended.find(r => r.id === coverage.id)) {
          recommended.push(coverage);
        }
        break;
      }
    }
  }
  return recommended;
}

export function formatNumber(num) {
  return new Intl.NumberFormat('ko-KR').format(num);
}

export function formatAmount(won) {
  return formatNumber(won) + '원';
}
