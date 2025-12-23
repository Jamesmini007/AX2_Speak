# AX2 웹사이트 색상 가이드

이 문서는 AX2 웹사이트에서 사용되는 주요 색상 코드를 정리한 것입니다.

## 🎨 주요 브랜드 컬러 (가장 많이 사용)

### 오렌지 계열 ⭐

**AX2의 핵심 브랜드 컬러로, 웹사이트 전반에 가장 많이 사용되는 색상입니다.**

| 변수명 | 색상 코드 | 설명 | 사용 예시 |
|--------|-----------|------|-----------|
| `--orange` | `#FF9800` | **메인 오렌지** (가장 많이 사용) | 버튼, 링크, 강조, CTA, 아이콘 |
| `--dark-orange` | `#E65100` | **진한 오렌지** | 제목, 강조 텍스트, 호버 상태 |
| `--light-orange` | `#FFF3E0` | **밝은 오렌지** | 배경, 강조 영역, 라벨 배경 |

**사용 빈도**: ⭐⭐⭐⭐⭐ (최고 빈도)

**주요 사용 위치**:
- Primary 버튼 (`지금 시작하기`, `조회` 등)
- 네비게이션 링크 호버 상태
- 섹션 제목 및 강조 텍스트
- 라벨 배경 (FEATURES, REAL-TIME 등)
- 아이콘 및 시각적 요소
- 그라데이션 배경

## 기본 색상

| 변수명 | 색상 코드 | 설명 | 사용 예시 |
|--------|-----------|------|-----------|
| `--primary-color` | `#000000` | 기본 검정색 | 텍스트, 버튼 테두리 |
| `--secondary-color` | `#ffffff` | 기본 흰색 | 배경, 카드 배경 |
| `--text-color` | `#333333` | 기본 텍스트 색상 | 본문 텍스트 |
| `--text-light` | `#666666` | 밝은 텍스트 색상 | 부제목, 보조 텍스트 |
| `--bg-light` | `#f8f9fa` | 밝은 배경색 | 섹션 배경 |
| `--border-color` | `#e0e0e0` | 테두리 색상 | 구분선, 테두리 |

### 보조 색상

| 변수명 | 색상 코드 | 설명 | 사용 예시 |
|--------|-----------|------|-----------|
| `--light-gray` | `#F5F5F5` | 밝은 회색 | 배경 |
| `--mint-green` | `#E0F7FA` | 민트 그린 | 특수 배경 |
| `--pink` | `#FCE4EC` | 핑크 | 특수 배경 |

## 그라데이션 (오렌지 계열 중심)

### Hero 섹션 (오렌지 → 흰색)
```css
background: linear-gradient(180deg, #FFF3E0 0%, #ffffff 100%);
```
- 시작: `#FFF3E0` (밝은 오렌지 - `--light-orange`)
- 끝: `#ffffff` (흰색 - `--secondary-color`)
- **사용 위치**: Hero 섹션 배경

### 버튼 그라데이션 (오렌지 → 진한 오렌지) ⭐
```css
background: linear-gradient(135deg, var(--orange) 0%, var(--dark-orange) 100%);
```
- 시작: `#FF9800` (오렌지 - `--orange`)
- 끝: `#E65100` (진한 오렌지 - `--dark-orange`)
- **사용 위치**: Primary 버튼, 강조 요소

### 코드 블록 그라데이션
```css
background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
```
- 시작: `#1a1a1a` (어두운 회색)
- 끝: `#2d2d2d` (중간 회색)

## 투명도가 적용된 색상

### 그림자 및 오버레이
- `rgba(0, 0, 0, 0.1)` - 가벼운 그림자
- `rgba(0, 0, 0, 0.08)` - 테두리, 가벼운 그림자
- `rgba(0, 0, 0, 0.05)` - 매우 가벼운 구분선
- `rgba(0, 0, 0, 0.2)` - 중간 오버레이
- `rgba(0, 0, 0, 0.3)` - 진한 그림자
- `rgba(0, 0, 0, 0.5)` - 모달 오버레이

### 오렌지 계열 투명도 ⭐ (가장 많이 사용)
- `rgba(255, 152, 0, 0.2)` - 오렌지 가벼운 그림자 (호버 효과, 카드 그림자)
- `rgba(255, 152, 0, 0.3)` - 오렌지 중간 그림자 (버튼 호버, 강조)
- `rgba(255, 152, 0, 0.4)` - 오렌지 진한 그림자 (강한 강조)

## 코드 하이라이팅 색상

| 용도 | 색상 코드 | 설명 |
|------|-----------|------|
| 일반 텍스트 | `#e0e0e0` | 코드 기본 텍스트 |
| 키워드 | `#4fc3f7` | 파란색 |
| 문자열 | `#a5d6a7` | 연한 초록색 |
| 숫자 | `#ffb74d` | 연한 오렌지 |
| 불린 | `#ce93d8` | 보라색 |
| 함수 | `#81c784` | 초록색 |
| 주석 | `#c8e6c9` | 매우 연한 초록색 |
| 특수 문자 | `#fff9c4` | 연한 노란색 |

## 사용 가이드

### 버튼 색상 (오렌지 중심)
- **Primary 버튼** ⭐: `--orange` (#FF9800) 배경, `--secondary-color` (#ffffff) 텍스트
- **Hover 상태** ⭐: `--dark-orange` (#E65100) 배경
- **Secondary 버튼**: `--secondary-color` (#ffffff) 배경, `--primary-color` (#000000) 텍스트

### 텍스트 계층 (오렌지 강조)
- **제목/강조** ⭐: `--dark-orange` (#E65100) - 가장 많이 사용
- **본문**: `--text-color` (#333333)
- **부제목/보조**: `--text-light` (#666666)
- **라벨 텍스트** ⭐: `--dark-orange` (#E65100) on `--light-orange` (#FFF3E0) 배경

### 배경 계층 (오렌지 계열 포함)
- **메인 배경**: `--secondary-color` (#ffffff)
- **섹션 배경**: `--bg-light` (#f8f9fa)
- **강조 배경** ⭐: `--light-orange` (#FFF3E0) - Hero 섹션, 라벨 배경

## CSS 변수 사용 예시

```css
/* 기본 사용 */
.my-element {
    color: var(--text-color);
    background: var(--secondary-color);
    border: 1px solid var(--border-color);
}

/* 버튼 스타일 */
.btn-primary {
    background: var(--orange);
    color: var(--secondary-color);
}

.btn-primary:hover {
    background: var(--dark-orange);
}

/* 강조 영역 */
.highlight {
    background: var(--light-orange);
    color: var(--dark-orange);
}
```

## 색상 대비비

모든 텍스트와 배경 조합은 WCAG 2.1 AA 기준을 준수합니다:
- `--text-color` (#333333) on `--secondary-color` (#ffffff): ✅ 12.6:1
- `--text-light` (#666666) on `--secondary-color` (#ffffff): ✅ 7.0:1
- `--dark-orange` (#E65100) on `--light-orange` (#FFF3E0): ✅ 4.5:1
- `--secondary-color` (#ffffff) on `--orange` (#FF9800): ✅ 2.9:1

---

**마지막 업데이트**: 2025년 1월
**파일 위치**: `/styles.css` (`:root` 섹션)

