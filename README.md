<div align="center">

# 크루위키 (Crew-Wiki)

<img src="https://private-user-images.githubusercontent.com/97431021/551164006-8a2b35fc-1436-4fb0-8f62-6511114c905d.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzEzNTg3MjAsIm5iZiI6MTc3MTM1ODQyMCwicGF0aCI6Ii85NzQzMTAyMS81NTExNjQwMDYtOGEyYjM1ZmMtMTQzNi00ZmIwLThmNjItNjUxMTExNGM5MDVkLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAyMTclMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMjE3VDIwMDAyMFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWJlODUyYmMwMTU2ZjNjNDJjY2E1M2Y2MGE3ZTQzYTg5MDM3YjQ2M2EyMzY3OTRjZTJlNzU0ZGI0ODdhZGFkNDEmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.OKx4lMBejMqN8SeFIqkQP3CXHNmQDiMwdyWxzjaJkSE" width="500" alt="crew-wiki-logo">

### 우아한테크코스 크루들을 위한 위키 서비스
크루들의 정보(논란)를 기록하고 공유하는 공간입니다.

### [🔗 크루위키](https://www.crew-wiki.site/)

</div>

## 기술 스택

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat-square)
![Toast UI Editor](https://img.shields.io/badge/Toast_UI_Editor-515CE6?style=flat-square)
![Storybook](https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white)

## 주요 기능

### 문서 조회

문서를 조회할 수 있습니다.  
H1, H2, H3 태그를 인식해서 목차가 자동으로 생성되며, 목차를 누르면 해당 제목으로 이동합니다.

![문서 조회](docs/screenshots/document-view.png)

- **새로고침** - 새로고침 버튼을 누르면 최신 문서 상태를 불러옵니다.
- **편집하기** - 편집 버튼을 눌러 문서를 수정할 수 있습니다.
- **편집기록** - 이전 버전의 문서 내용을 확인할 수 있습니다.
- **작성하기** - 새 문서를 등록할 수 있습니다.

### 문서 편집

문서를 편집할 수 있습니다.  
제목은 편집할 수 없으며, 편집자와 내용을 입력하면 작성완료 버튼이 활성화됩니다.
편집 중 실수로 이탈했을 때를 대비해 문서가 5초마다 세션 스토리지에 자동 저장됩니다.

![문서 편집](docs/screenshots/document-edit.png)

### 문서 작성

새로운 문서를 작성할 수 있습니다.  
이미 존재하는 제목의 문서는 등록할 수 없으며, 제목 입력 후 포커스를 해제하면 중복 여부를 자동으로 검사합니다.
문서 제목과 편집자, 내용을 입력하면 작성완료 버튼이 활성화됩니다. 
작성 중에도 5초마다 세션 스토리지에 자동 저장됩니다.

![문서 작성](docs/screenshots/document-write.png)

### 편집기록

문서의 편집기록을 확인할 수 있습니다.  
버전, 생성일시, 문서 크기, 편집자를 확인할 수 있습니다.
누구나 수정 가능하기 때문에 편집자를 양심있게 적어주셔야 합니다.

![편집기록](docs/screenshots/edit-log.png)

### 문서 검색

검색창에서 문서 제목을 입력하면 **자동완성 기능**을 통해 빠르게 문서를 찾을 수 있습니다.

![문서 검색](docs/screenshots/search-document.png)

### 최근 편집

최근에 편집된 문서 20개를 확인할 수 있습니다. 데스크톱 화면에서 사이드바로 표시됩니다.

![최근 편집](docs/screenshots/recent-edit.png)

### 랜덤 문서 조회

헤더의 랜덤 버튼을 누르면 등록된 문서 중 하나를 랜덤으로 보여줍니다.

![랜덤 문서](docs/screenshots/random-document.png)

### 그룹/조직 문서

조직별로 문서를 분류하고 관리할 수 있습니다. 각 그룹의 전용 페이지에서 관련 문서를 모아볼 수 있습니다.

<!-- 스크린샷 추가 필요 -->

### 타임라인

조직의 주요 이벤트를 타임라인 형태로 시각화하여 볼 수 있습니다.

<!-- 스크린샷 추가 필요 -->

## Team

### Frontend

<table>
  <tr>
    <td align="center"><img src="https://github.com/jinhokim98.png" width="120" alt="쿠키"><br><a href="https://github.com/jinhokim98">쿠키</a><br>6기</td>
    <td align="center"><img src="https://github.com/Todari.png" width="120" alt="토다리"><br><a href="https://github.com/Todari">토다리</a><br>6기</td>
    <td align="center"><img src="https://github.com/chosim-dvlpr.png" width="120" alt="프룬"><br><a href="https://github.com/chosim-dvlpr">프룬</a><br>6기</td>
    <td align="center"><img src="https://github.com/ShinjungOh.png" width="120" alt="루나"><br><a href="https://github.com/ShinjungOh">루나</a><br>7기</td>
  </tr>
</table>

### Backend

<table>
  <tr>
    <td align="center"><img src="https://github.com/Minjoo522.png" width="120" alt="리브"><br><a href="https://github.com/Minjoo522">리브</a><br>6기</td>
    <td align="center"><img src="https://github.com/masonkimseoul.png" width="120" alt="메이슨"><br><a href="https://github.com/masonkimseoul">메이슨</a><br>6기</td>
    <td align="center"><img src="https://github.com/jinchiim.png" width="120" alt="폴라"><br><a href="https://github.com/jinchiim">폴라</a><br>6기</td>
    <td align="center"><img src="https://github.com/Starlight258.png" width="120" alt="밍트"><br><a href="https://github.com/Starlight258">밍트</a><br>7기</td>
    <td align="center"><img src="https://github.com/2Jin1031.png" width="120" alt="칼리"><br><a href="https://github.com/2Jin1031">칼리</a><br>7기</td>
    <td align="center"><img src="https://github.com/CheChe903.png" width="120" alt="체체"><br><a href="https://github.com/CheChe903">체체</a><br>7기</td>
  </tr>
</table>
