# 에듀패스

`passtutor.kr` 공무원 1:1 과외 웹사이트입니다.

`main` 브랜치에 변경 사항을 푸시하면 GitHub Actions가 GitHub Pages에 자동 배포합니다.

## 지역 페이지 생성

전국 지역 페이지, 일반구 세부 페이지, 메인 페이지의 지역 목록, 사이트맵은 하나의 지역 데이터에서 생성합니다.

```sh
node scripts/generate-locations.mjs
```

지역명이나 행정구역이 바뀌면 `scripts/generate-locations.mjs`의 `regions` 또는 `subAreas`를 수정한 뒤 위 명령을 실행합니다.