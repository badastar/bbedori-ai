# AI 블로그 콘텐츠 발굴 10분 실전 교육 (bbedori-ai)

소상공인·자영업자·사업자를 대상으로 **ChatGPT와 NotebookLM을 활용해 블로그 글감을 찾고, 분석하고, 축적하는 10분 실전형 반응형 교육 웹사이트**입니다.

> 이 프로젝트는 기존 전시회 저장소(`BBeDori`)와 코드·Git 히스토리·배포가 **완전히 분리된 독립 저장소**용 정적 웹사이트입니다.

---

## 페이지 구성

- **`index.html` (수강생용 메인 학습·실습 페이지)**
  - 10분 교육 시간표, 1~3단계 핵심 학습, 얼큰이 칼국수 사례, 6단계 반복 업무 프로세스
  - **7~9분 실습 패널**: 업종/업체명 실시간 치환(브라우저 내 처리, 서버 전송·저장 없음) 및 원클릭 복사
  - **NotebookLM 질문 프롬프트 3종** 원클릭 복사, 자료 관리 예시 6종, 실무 주의사항, 4단계 후속 로드맵
- **`slides.html` (강사 발표용 슬라이드 뷰어)**
  - 총 8장 슬라이드 전환(버튼 · 목차 필 · 키보드 `←`/`→`), 슬라이드별 발표 대본 접기/펼치기 지원
- **`script.html` (강사 대본 및 진행 가이드)**
  - 슬라이드 1~8 구어체 강사 대본, 시간표, 시각 자료 제안, 실습 진행 팁, 인쇄 지원, PPT 제작용 최종 프롬프트 복사

---

## 폴더 구조

```text
bbedori-ai/
├── index.html                  # 수강생용 학습·실습 메인 페이지
├── slides.html                 # 강사 발표용 8장 슬라이드 뷰어
├── script.html                 # 강사 대본 및 진행 가이드
├── assets/
│   ├── css/
│   │   └── style.css           # 공통 디자인 시스템 및 반응형·인쇄 스타일
│   ├── js/
│   │   └── main.js             # 모바일 메뉴, 공통 복사, 입력 치환, 슬라이드 제어
│   └── images/
│       └── favicon.svg         # 사이트 파비콘
├── .nojekyll                   # GitHub Pages 정적 자산 서빙 보장
├── .gitignore
├── README.md
├── AI 블로그 교육안.md          # 원본 교육안 문서
└── 교육용웹사이트구축.md        # 웹사이트 구축 명세서
```

---

## 로컬에서 미리보기

빌드 도구나 별도 서버 패키지 없이 정적 HTML/CSS/JS로 동작합니다.

```powershell
# Python 내장 HTTP 서버로 확인 (예시)
python -m http.server 8080
```

브라우저에서 `http://localhost:8080` 으로 접속해 `index.html`, `slides.html`, `script.html`을 확인할 수 있습니다.

---

## GitHub 저장소 연결 및 배포 방법 (신규 독립 저장소)

### 1. GitHub에서 새 저장소 만들기
1. GitHub(`https://github.com/new`)에 접속합니다.
2. Repository name에 `bbedori-ai`를 입력합니다. (README/.gitignore 추가 체크 없이 빈 저장소로 생성)
3. **Create repository**를 클릭합니다.

### 2. 로컬 폴더를 새 저장소에 푸시하기
```powershell
cd d:\python\MY\bbedori-ai
git init -b main
git add .
git commit -m "Initial commit: AI 블로그 교육 반응형 웹페이지 구축"
git remote add origin https://github.com/badastar/bbedori-ai.git
git push -u origin main
```

### 3. 웹에서 바로 볼 수 있게 배포하기 (택 1)

- **방법 1: GitHub Pages 사용**
  1. GitHub `bbedori-ai` 저장소의 **Settings → Pages**로 이동합니다.
  2. **Build and deployment > Source**를 `Deploy from a branch`로 선택합니다.
  3. **Branch**를 `main` / `/ (root)`로 지정하고 **Save**를 누릅니다.
  4. 1~2분 후 해당 저장소의 Pages 설정 화면 상단에 표시되는 주소(`https://<계정명>.github.io/bbedori-ai/`)로 접속합니다.
  - 모든 링크와 CSS/JS 경로가 상대 경로로 작성되어 `/bbedori-ai/` 하위 경로에서도 정상 동작합니다.

- **방법 2: Vercel 사용 (기존 전시회와 동일 플랫폼)**
  1. Vercel 대시보드에서 **Add New... → Project**를 선택합니다.
  2. 새로 만든 `bbedori-ai` GitHub 저장소를 **Import**합니다.
  3. Framework Preset: `Other` (빌드 설정 없음) 그대로 **Deploy**를 클릭하면 독립된 URL이 생성됩니다.
