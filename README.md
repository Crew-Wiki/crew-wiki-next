# 크루위키 (Crew-Wiki)

우아한테크코스 크루들의 정보(논란)을 적기 위한 위키, 크루위키

## Team

### Frontend
+ [쿠키](https://github.com/jinhokim98)
+ [토다리](https://github.com/Todari)
+ [프룬](https://github.com/chosim-dvlpr)
+ [루나](https://github.com/ShinjungOh) 

### Backend
+ [폴라](https://github.com/jinchiim)
+ [메이슨](https://github.com/masonkimseoul)
+ [리브](https://github.com/Minjoo522)
+ [밍트](https://github.com/Starlight258)
+ [칼리](https://github.com/2Jin1031)
+ [체체](https://github.com/CheChe903)


## 기능

### 문서 조회
문서를 조회할 수 있습니다.
H1, H2, H3 태그를 인식해서 목차가 보여집니다.
목차를 누르면 해당 제목으로 이동합니다.
![image](https://github.com/Crew-Wiki/frontend/assets/81083461/7354eb1c-c7cc-4ed7-891f-d6b2cbbf3313)

+ 새로고침
  - 새로고침 버튼을 누르면 최신의 문서 상태를 불러올 수 있습니다.
  - f5를 통한 새로고침으로는 최신의 상태를 불러오지 않습니다.
    
+ 편집하기
  - 편집하기 버튼을 누르면 문서를 편집할 수 있습니다. V1은 누구나 수정할 수 있습니다.

+ 편집로그
  - 문서의 편집로그를 볼 수 있습니다. 전에 어떤 문서가 적혀있었는지 확인할 수 있습니다.
 
+ 작성하기
  - 새 문서를 등록할 수 있습니다.
 

### 최근 편집
최근에 편집된 문서 20개를 볼 수 있습니다. 데스크톱 화면에서만 보이며 모바일에서는 보이지 않습니다.
![image](https://github.com/Crew-Wiki/frontend/assets/81083461/cc4c1309-0058-48d1-84f8-f782468dbed7)


### 문서 편집
문서를 편집할 수 있습니다. V1은 누구나 수정 가능합니다.
제목은 편집할 수 없습니다. 편집자와 내용이 입력되면 작성완료 버튼이 활성화됩니다.
편집 중에 실수로 이탈했을 때를 대비해서 글을 입력하는 중간중간 5초마다 문서가 세션 스토리지에 자동 저장됩니다.
![image](https://github.com/Crew-Wiki/frontend/assets/81083461/9efa0291-4e3d-4bba-818e-5bcd5aa3ae19)


### 편집로그
문서의 편집로그를 확인할 수 있습니다.
버전, 생성일시, 문서 크기, 편집자를 확인할 수 있습니다.
V1은 누구나 수정 가능하기 때문에 편집자를 양심있게 적어주셔야합니다. (벌써 누군지 밝히지 않는 사용자도 있군요)
![image](https://github.com/Crew-Wiki/frontend/assets/81083461/ca1f5acf-bfba-4689-8d6a-0ce5df72780e)


### 문서 작성
새로운 문서를 작성할 수 있습니다. V1은 누구나 작성 가능합니다.
이미 있는 문서는 등록할 수 없습니다. 문서의 제목을 입력하고 포커싱을 해제할 때 글 중복을 체크하게 됩니다.
문서의 제목과 편집자, 본문을 입력하면 작성완료가 활성화됩니다.
작성 중에 실수로 이탈했을 때를 대비해서 문서를 입력하는 중간중간 5초마다 문서가 세션 스토리지에 자동 저장됩니다.
![image](https://github.com/Crew-Wiki/frontend/assets/81083461/4fde6c14-a845-4a5f-83b9-533f133ba0c8)


### 랜덤 문서 조회
헤더의 랜덤버튼을 누르게 되면, 랜덤으로 등록되어있는 문서 중 한 개를 보여주게 됩니다.
![image](https://github.com/Crew-Wiki/frontend/assets/81083461/c2ec4ea6-bdd0-432a-9c02-17ac5b529603)


### 문서 검색
검색 창에서 검색하고 싶은 문서 제목을 입력한 후에 엔터나 아이콘을 누르게 되면 검색이됩니다.
문서의 정확한 이름을 검색해야합니다. 유사 이름으로는 문서가 나오지 않습니다.


