# 에듀패스

`passtutor.kr` 공무원 공기업 자격증 1:1과외 웹사이트입니다.

`main` 브랜치에 변경 사항을 푸시하면 GitHub Actions가 GitHub Pages에 자동 배포합니다.

## 지역 페이지 생성

전국 지역 페이지, 일반구 세부 페이지, 과목별 랜딩 페이지(`/subjects/`), 메인 페이지의 지역 목록, 사이트맵, RSS(`rss.xml`)는 하나의 생성 스크립트에서 만듭니다.

```sh
node scripts/generate-locations.mjs
```

지역명이나 행정구역이 바뀌면 `scripts/generate-locations.mjs`의 `regions` 또는 `subAreas`를 수정한 뒤 위 명령을 실행합니다.

과목 페이지 내용(제목·설명·FAQ)은 같은 파일의 `subjects` 배열에서 수정합니다.
