import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const updatedAt = "2026-10-08";

const regions = [
  { slug: "seoul", name: "서울특별시", shortName: "서울", areas: [
    ["jongno-gu", "종로구"], ["jung-gu", "중구"], ["yongsan-gu", "용산구"], ["seongdong-gu", "성동구"], ["gwangjin-gu", "광진구"],
    ["dongdaemun-gu", "동대문구"], ["jungnang-gu", "중랑구"], ["seongbuk-gu", "성북구"], ["gangbuk-gu", "강북구"], ["dobong-gu", "도봉구"],
    ["nowon-gu", "노원구"], ["eunpyeong-gu", "은평구"], ["seodaemun-gu", "서대문구"], ["mapo-gu", "마포구"], ["yangcheon-gu", "양천구"],
    ["gangseo-gu", "강서구"], ["guro-gu", "구로구"], ["geumcheon-gu", "금천구"], ["yeongdeungpo-gu", "영등포구"], ["dongjak-gu", "동작구"],
    ["gwanak-gu", "관악구"], ["seocho-gu", "서초구"], ["gangnam-gu", "강남구"], ["songpa-gu", "송파구"], ["gangdong-gu", "강동구"],
  ]},
  { slug: "busan", name: "부산광역시", shortName: "부산", areas: [
    ["jung-gu", "중구"], ["seo-gu", "서구"], ["dong-gu", "동구"], ["yeongdo-gu", "영도구"], ["busanjin-gu", "부산진구"], ["dongnae-gu", "동래구"],
    ["nam-gu", "남구"], ["buk-gu", "북구"], ["haeundae-gu", "해운대구"], ["saha-gu", "사하구"], ["geumjeong-gu", "금정구"], ["gangseo-gu", "강서구"],
    ["yeonje-gu", "연제구"], ["suyeong-gu", "수영구"], ["sasang-gu", "사상구"], ["gijang-gun", "기장군"],
  ]},
  { slug: "daegu", name: "대구광역시", shortName: "대구", areas: [
    ["jung-gu", "중구"], ["dong-gu", "동구"], ["seo-gu", "서구"], ["nam-gu", "남구"], ["buk-gu", "북구"], ["suseong-gu", "수성구"],
    ["dalseo-gu", "달서구"], ["dalseong-gun", "달성군"], ["gunwi-gun", "군위군"],
  ]},
  { slug: "incheon", name: "인천광역시", shortName: "인천", areas: [
    ["jemulpo-gu", "제물포구"], ["yeongjong-gu", "영종구"], ["michuhol-gu", "미추홀구"], ["yeonsu-gu", "연수구"], ["namdong-gu", "남동구"],
    ["bupyeong-gu", "부평구"], ["gyeyang-gu", "계양구"], ["seo-gu", "서구"], ["geomdan-gu", "검단구"], ["ganghwa-gun", "강화군"], ["ongjin-gun", "옹진군"],
  ]},
  { slug: "gwangju-jeonnam", name: "전남광주통합특별시", shortName: "광주·전남", areas: [
    ["dong-gu", "동구"], ["seo-gu", "서구"], ["nam-gu", "남구"], ["buk-gu", "북구"], ["gwangsan-gu", "광산구"],
    ["mokpo-si", "목포시"], ["yeosu-si", "여수시"], ["suncheon-si", "순천시"], ["naju-si", "나주시"], ["gwangyang-si", "광양시"],
    ["damyang-gun", "담양군"], ["gokseong-gun", "곡성군"], ["gurye-gun", "구례군"], ["goheung-gun", "고흥군"], ["boseong-gun", "보성군"],
    ["hwasun-gun", "화순군"], ["jangheung-gun", "장흥군"], ["gangjin-gun", "강진군"], ["haenam-gun", "해남군"], ["yeongam-gun", "영암군"],
    ["muan-gun", "무안군"], ["hampyeong-gun", "함평군"], ["yeonggwang-gun", "영광군"], ["jangseong-gun", "장성군"], ["wando-gun", "완도군"],
    ["jindo-gun", "진도군"], ["sinan-gun", "신안군"],
  ]},
  { slug: "daejeon", name: "대전광역시", shortName: "대전", areas: [
    ["dong-gu", "동구"], ["jung-gu", "중구"], ["seo-gu", "서구"], ["yuseong-gu", "유성구"], ["daedeok-gu", "대덕구"],
  ]},
  { slug: "ulsan", name: "울산광역시", shortName: "울산", areas: [
    ["jung-gu", "중구"], ["nam-gu", "남구"], ["dong-gu", "동구"], ["buk-gu", "북구"], ["ulju-gun", "울주군"],
  ]},
  { slug: "sejong", name: "세종특별자치시", shortName: "세종", areas: [["", "세종시"]] },
  { slug: "gyeonggi", name: "경기도", shortName: "경기", areas: [
    ["suwon-si", "수원시"], ["yongin-si", "용인시"], ["goyang-si", "고양시"], ["hwaseong-si", "화성시"], ["seongnam-si", "성남시"],
    ["bucheon-si", "부천시"], ["namyangju-si", "남양주시"], ["ansan-si", "안산시"], ["pyeongtaek-si", "평택시"], ["anyang-si", "안양시"],
    ["siheung-si", "시흥시"], ["paju-si", "파주시"], ["gimpo-si", "김포시"], ["uijeongbu-si", "의정부시"], ["gwangju-si", "광주시"],
    ["hanam-si", "하남시"], ["gwangmyeong-si", "광명시"], ["gunpo-si", "군포시"], ["yangju-si", "양주시"], ["osan-si", "오산시"],
    ["icheon-si", "이천시"], ["anseong-si", "안성시"], ["guri-si", "구리시"], ["uiwang-si", "의왕시"], ["pocheon-si", "포천시"],
    ["yangpyeong-gun", "양평군"], ["yeoju-si", "여주시"], ["dongducheon-si", "동두천시"], ["gwacheon-si", "과천시"], ["gapyeong-gun", "가평군"], ["yeoncheon-gun", "연천군"],
  ]},
  { slug: "gangwon", name: "강원특별자치도", shortName: "강원", areas: [
    ["chuncheon-si", "춘천시"], ["wonju-si", "원주시"], ["gangneung-si", "강릉시"], ["donghae-si", "동해시"], ["taebaek-si", "태백시"], ["sokcho-si", "속초시"],
    ["samcheok-si", "삼척시"], ["hongcheon-gun", "홍천군"], ["hoengseong-gun", "횡성군"], ["yeongwol-gun", "영월군"], ["pyeongchang-gun", "평창군"],
    ["jeongseon-gun", "정선군"], ["cheorwon-gun", "철원군"], ["hwacheon-gun", "화천군"], ["yanggu-gun", "양구군"], ["inje-gun", "인제군"],
    ["goseong-gun", "고성군"], ["yangyang-gun", "양양군"],
  ]},
  { slug: "chungbuk", name: "충청북도", shortName: "충북", areas: [
    ["cheongju-si", "청주시"], ["chungju-si", "충주시"], ["jecheon-si", "제천시"], ["boeun-gun", "보은군"], ["okcheon-gun", "옥천군"], ["yeongdong-gun", "영동군"],
    ["jeungpyeong-gun", "증평군"], ["jincheon-gun", "진천군"], ["goesan-gun", "괴산군"], ["eumseong-gun", "음성군"], ["danyang-gun", "단양군"],
  ]},
  { slug: "chungnam", name: "충청남도", shortName: "충남", areas: [
    ["cheonan-si", "천안시"], ["gongju-si", "공주시"], ["boryeong-si", "보령시"], ["asan-si", "아산시"], ["seosan-si", "서산시"], ["nonsan-si", "논산시"],
    ["gyeryong-si", "계룡시"], ["dangjin-si", "당진시"], ["geumsan-gun", "금산군"], ["buyeo-gun", "부여군"], ["seocheon-gun", "서천군"],
    ["cheongyang-gun", "청양군"], ["hongseong-gun", "홍성군"], ["yesan-gun", "예산군"], ["taean-gun", "태안군"],
  ]},
  { slug: "jeonbuk", name: "전북특별자치도", shortName: "전북", areas: [
    ["jeonju-si", "전주시"], ["gunsan-si", "군산시"], ["iksan-si", "익산시"], ["jeongeup-si", "정읍시"], ["namwon-si", "남원시"], ["gimje-si", "김제시"],
    ["wanju-gun", "완주군"], ["jinan-gun", "진안군"], ["muju-gun", "무주군"], ["jangsu-gun", "장수군"], ["imsil-gun", "임실군"], ["sunchang-gun", "순창군"],
    ["gochang-gun", "고창군"], ["buan-gun", "부안군"],
  ]},
  { slug: "gyeongbuk", name: "경상북도", shortName: "경북", areas: [
    ["pohang-si", "포항시"], ["gyeongju-si", "경주시"], ["gimcheon-si", "김천시"], ["andong-si", "안동시"], ["gumi-si", "구미시"], ["yeongju-si", "영주시"],
    ["yeongcheon-si", "영천시"], ["sangju-si", "상주시"], ["mungyeong-si", "문경시"], ["gyeongsan-si", "경산시"], ["uiseong-gun", "의성군"],
    ["cheongsong-gun", "청송군"], ["yeongyang-gun", "영양군"], ["yeongdeok-gun", "영덕군"], ["cheongdo-gun", "청도군"], ["goryeong-gun", "고령군"],
    ["seongju-gun", "성주군"], ["chilgok-gun", "칠곡군"], ["yecheon-gun", "예천군"], ["bonghwa-gun", "봉화군"], ["uljin-gun", "울진군"], ["ulleung-gun", "울릉군"],
  ]},
  { slug: "gyeongnam", name: "경상남도", shortName: "경남", areas: [
    ["changwon-si", "창원시"], ["jinju-si", "진주시"], ["tongyeong-si", "통영시"], ["sacheon-si", "사천시"], ["gimhae-si", "김해시"], ["miryang-si", "밀양시"],
    ["geoje-si", "거제시"], ["yangsan-si", "양산시"], ["uiryeong-gun", "의령군"], ["haman-gun", "함안군"], ["changnyeong-gun", "창녕군"],
    ["goseong-gun", "고성군"], ["namhae-gun", "남해군"], ["hadong-gun", "하동군"], ["sancheong-gun", "산청군"], ["hamyang-gun", "함양군"],
    ["geochang-gun", "거창군"], ["hapcheon-gun", "합천군"],
  ]},
  { slug: "jeju", name: "제주특별자치도", shortName: "제주", areas: [["jeju-si", "제주시"], ["seogwipo-si", "서귀포시"]] },
];

const pathFor = (region, areaSlug) => areaSlug ? `/${region.slug}/${areaSlug}/` : `/${region.slug}/`;

function directory(region) {
  return region.areas.map(([slug, name]) => `          <a href="${pathFor(region, slug)}">${name}</a>`).join("\n");
}

function page(region, areaSlug, areaName) {
  const path = pathFor(region, areaSlug);
  const fullName = areaSlug ? `${region.name} ${areaName}` : region.name;
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${fullName} 공무원 시험 과외 소개. 9급·7급 국가직 및 지방직, 국어·영어·한국사를 실시간 비대면 1:1 수업으로 준비하세요.">
  <title>${areaName} 공무원 시험 과외 소개</title>
  <link rel="canonical" href="https://passtutor.kr${path}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:title" content="${areaName} 공무원 시험 과외 소개">
  <meta property="og:description" content="${areaName} 수험생을 위한 실시간 비대면 공무원 1:1 과외 안내입니다.">
  <meta property="og:url" content="https://passtutor.kr${path}">
  <link rel="icon" href="/assets/logo.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Gowun+Batang:wght@700&family=Pretendard:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="/location.css?v=20261008-1">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "${areaName} 공무원 시험 1:1 과외",
    "provider": { "@type": "Organization", "name": "에듀패스", "url": "https://passtutor.kr/" },
    "areaServed": { "@type": "AdministrativeArea", "name": "${fullName}" },
    "serviceType": "실시간 비대면 공무원 시험 1:1 과외",
    "url": "https://passtutor.kr${path}"
  }
  </script>
</head>
<body class="location-page">
  <header class="site-header location-header">
    <a class="brand" href="/" aria-label="에듀패스 홈">
      <img class="brand-mark" src="/assets/logo.svg" alt="">
      <span><strong>에듀패스</strong><small>공무원 1:1 과외</small></span>
    </a>
    <nav aria-label="지역 페이지 메뉴">
      <a href="#subjects">수업 과목</a>
      <a href="#process">진행 방식</a>
      <a href="#nearby-areas">${region.shortName} 지역</a>
    </nav>
    <a class="header-cta" href="tel:01029283614">전화 상담</a>
  </header>

  <main>
    <section class="location-hero">
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85" alt="공무원 시험 학습 계획을 함께 점검하는 수험생들">
      <div class="location-hero-shade"></div>
      <div class="location-hero-content">
        <p class="location-breadcrumb"><a href="/">홈</a><span>/</span>${region.name}<span>/</span>${areaName}</p>
        <p class="eyebrow">${region.shortName.toUpperCase()} · LIVE ONLINE LESSON</p>
        <h1>${areaName} 공무원 시험<br>과외 소개</h1>
        <p>${areaName} 어디서나 이동 없이 강사와 마주 보고 배우는<br>실시간 비대면 공무원 1:1 과외입니다.</p>
        <a class="primary-button" href="tel:01029283614">수업 상담하기 <span aria-hidden="true">→</span></a>
      </div>
    </section>

    <section class="location-intro">
      <div class="section-heading">
        <p class="eyebrow dark">PERSONAL STUDY PLAN</p>
        <h2>${areaName} 수험생에게 맞춘<br>일대일 학습 설계</h2>
      </div>
      <p class="section-lead">현재 점수와 목표 직렬, 시험까지 남은 기간을 확인해 수업 범위와 복습 계획을 정합니다. 정해진 영상을 혼자 듣는 방식이 아니라 질문과 피드백이 오가는 실시간 수업으로 진행합니다.</p>
      <div class="location-feature-grid">
        <article><span>01</span><h3>현재 실력 진단</h3><p>기초부터 다시 시작해야 하는 과목과 점수를 끌어올릴 영역을 구분합니다.</p></article>
        <article><span>02</span><h3>직렬별 수업 계획</h3><p>9급·7급 국가직과 지방직, 경찰·소방·군무원 등 목표 시험에 맞춰 설계합니다.</p></article>
        <article><span>03</span><h3>매주 학습 관리</h3><p>수업 진도뿐 아니라 과제, 복습, 기출 풀이 결과까지 확인하고 다음 계획에 반영합니다.</p></article>
      </div>
    </section>

    <section class="location-subjects" id="subjects">
      <div>
        <p class="eyebrow">SUBJECTS</p>
        <h2>필요한 과목을<br>필요한 만큼 집중해서</h2>
        <p>공무원 과목뿐 아니라 기업 인적성, 공기업 수리, 경제·회계 자격시험과 취업 영어까지 목표에 맞는 전문 강사를 연결합니다.</p>
      </div>
      <ul>
        <li><strong>국어</strong><span>문법 · 독해 · 어휘 · 기출 분석</span></li>
        <li><strong>영어</strong><span>구문 · 독해 · 어휘 · 생활영어</span></li>
        <li><strong>한국사</strong><span>시대사 · 사료 · 기출 문제</span></li>
        <li><strong>기업 인적성</strong><span>삼성 GSAT · SKCT · NCS</span></li>
        <li><strong>대기업 인적성</strong><span>LG 인적성 · 포스코 등 기업 인적성</span></li>
        <li><strong>공기업 수리</strong><span>공기업 전공수학 · 경제수학</span></li>
        <li><strong>경제·회계 시험</strong><span>매경TEST · 한경 TESAT · 재경관리사 · 신용분석사</span></li>
        <li><strong>회계 과목</strong><span>재무회계 · 원가회계</span></li>
        <li><strong>취업 영어</strong><span>TOEIC · TOEIC Speaking · OPIc · 취업 영어면접</span></li>
      </ul>
    </section>

    <section class="location-process" id="process">
      <div class="section-heading">
        <p class="eyebrow dark">HOW IT WORKS</p>
        <h2>${areaName} 공무원 과외<br>진행 방식</h2>
      </div>
      <ol>
        <li><span>01</span><div><h3>전화 상담</h3><p>목표 시험과 준비 기간, 고민 과목을 확인합니다.</p></div></li>
        <li><span>02</span><div><h3>강사 매칭</h3><p>과목과 수준, 가능한 수업 시간에 맞춰 강사를 연결합니다.</p></div></li>
        <li><span>03</span><div><h3>실시간 수업</h3><p>${areaName}의 집이나 익숙한 공간에서 화상으로 1:1 수업을 시작합니다.</p></div></li>
      </ol>
    </section>

    <section class="district-directory" id="nearby-areas">
      <div class="section-heading">
        <p class="eyebrow dark">${region.shortName.toUpperCase()} AREAS</p>
        <h2>${region.name} 지역별<br>공무원 시험 과외</h2>
      </div>
      <div class="district-links">
${directory(region)}
      </div>
      <a class="all-area-link" href="/#areas">전국 지역 목록 보기 <span aria-hidden="true">→</span></a>
    </section>

    <section class="final-cta location-cta">
      <div><p class="eyebrow">START YOUR PLAN</p><h2>${areaName}에서 시작하는<br>합격 학습 계획</h2></div>
      <a class="primary-button light" href="tel:01029283614">전화 상담하기 <span aria-hidden="true">→</span></a>
    </section>
  </main>

  <footer class="site-footer location-footer">
    <div class="footer-brand"><img src="/assets/logo.svg" alt=""><div><strong>에듀패스</strong><span>공무원 1:1 과외</span></div></div>
    <div><p>전화 상담 <a class="footer-phone" href="tel:01029283614">010-2928-3614</a> · 평일 10:00–20:00 · 토요일 10:00–16:00</p><p>모든 수업은 실시간 비대면 방식으로 진행됩니다.</p></div>
    <p>© 2026 passtutor.kr. All rights reserved.</p>
  </footer>
</body>
</html>
`;
}

function homeDirectory() {
  return `    <!-- LOCATION_DIRECTORY_START -->
    <section class="areas" id="areas">
      <div class="section-heading row-heading">
        <div><p class="eyebrow dark">NATIONWIDE AREAS</p><h2>전국 지역별 공무원<br>시험 과외 소개</h2></div>
        <p>전국 230개 시·군·구 및 행정시에서<br>이동 없이 실시간 비대면으로 만나세요.</p>
      </div>
      <div class="region-directory">
${regions.map((region, index) => `        <details${index === 0 ? " open" : ""}>
          <summary><span>${region.name}</span><small>${region.areas.length}개 지역</small></summary>
          <div class="area-links" aria-label="${region.name} 지역별 공무원 시험 과외">
${region.areas.map(([slug, name]) => `            <a href="${pathFor(region, slug)}"><span>${name}</span><small>공무원 시험 과외</small></a>`).join("\n")}
          </div>
        </details>`).join("\n")}
      </div>
    </section>
    <!-- LOCATION_DIRECTORY_END -->`;
}

async function generate() {
  const expectedRoots = new Set(regions.map(({ slug }) => slug));
  const existingRoots = ["seoul", "busan", "daegu", "incheon", "gwangju", "jeonnam", "gwangju-jeonnam", "daejeon", "ulsan", "sejong", "gyeonggi", "gangwon", "chungbuk", "chungnam", "jeonbuk", "gyeongbuk", "gyeongnam", "jeju"];
  for (const folder of existingRoots) {
    if (expectedRoots.has(folder) || folder === "gwangju" || folder === "jeonnam") {
      await rm(join(root, folder), { recursive: true, force: true });
    }
  }

  for (const region of regions) {
    for (const [areaSlug, areaName] of region.areas) {
      const output = areaSlug
        ? join(root, region.slug, areaSlug, "index.html")
        : join(root, region.slug, "index.html");
      await mkdir(dirname(output), { recursive: true });
      await writeFile(output, page(region, areaSlug, areaName), "utf8");
    }
  }

  const indexPath = join(root, "index.html");
  const index = await readFile(indexPath, "utf8");
  const replacement = homeDirectory();
  const sectionPattern = /    <!-- LOCATION_DIRECTORY_START -->[\s\S]*?    <!-- LOCATION_DIRECTORY_END -->|    <section class="areas" id="areas">[\s\S]*?    <\/section>/;
  if (!sectionPattern.test(index)) throw new Error("Homepage area section not found");
  await writeFile(indexPath, index.replace(sectionPattern, replacement), "utf8");

  const urls = regions.flatMap((region) => region.areas.map(([slug]) => pathFor(region, slug)));
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://passtutor.kr/</loc>
    <lastmod>${updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${urls.map((url) => `  <url><loc>https://passtutor.kr${url}</loc><lastmod>${updatedAt}</lastmod><priority>0.8</priority></url>`).join("\n")}
</urlset>
`;
  await writeFile(join(root, "sitemap.xml"), sitemap, "utf8");

  console.log(`Generated ${urls.length} location pages across ${regions.length} top-level regions.`);
}

await generate();
