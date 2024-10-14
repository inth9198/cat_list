## 실행법
npm install
npm run dev

## 소스 코드 설명

### main.ts
검색을 수행하는 searchByTag 함수
고양이 정보를 받아오는 fetchCatImages 함수
리스트를 디스플래이하는 displayImages 함수
페이지 네이션을 관리하는 goToPage, updatePageIndicator 함수
로 구성이 되어있습니다
### modal.ts
태그를 더하고 제가하는 addTagToCat removeTagFromCat 함수
모달을 오픈하하고 닫는 openModal closeModal 함수
로 구성이 되어있습니다

### storage.ts
초기 고양이 태그와 좋아요 수 등을 랜덤하게 설정해주는 generateRandomLike, generateRandomLikeNumber, generateRandomTags 함수
로컬스토리지 고양이 리스트를 관리하는 getCats, updateCat, deleteCat, addCat 함수
로 구성이 되어있습니다

### types.ts
고양이 객체의 타입을 관리하는 Cat 변수로 구성이 되어있습니다

### debounce.ts
debounce 처리 함수로 구성이 되어있습니다
