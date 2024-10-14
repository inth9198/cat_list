import { Cat } from "./types";

const STORAGE_KEY = "catImages";

export function generateRandomTitle() {
  const titles = [
    "장화신은 고양이",
    "아기 고양이",
    "검은 고양이",
    "치즈 고양이",
    "귀여운 고양이",
    "화난 고양이",
    "행복한 고양이",
    "사나운 고양이",
    "놀란 고양이",
    "졸린 고양이",
    "고양이와 동물",
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

export function generateRandomLike() {
  return Math.random() > 0.5;
}

export function generateRandomLikeNumber() {
  return Math.floor(Math.random() * 100);
}

export function generateRandomTags() {
  const tags = [
    "장화신은 고양이",
    "아기 고양이",
    "검은 고양이",
    "치즈 고양이",
    "귀여운 고양이",
    "화난 고양이",
    "행복한 고양이",
    "사나운 고양이",
    "놀란 고양이",
    "졸린 고양이",
    "고양이와 동물",
  ];
  const numTags = Math.floor(Math.random() * 3) + 1;
  return Array.from(
    { length: numTags },
    () => tags[Math.floor(Math.random() * tags.length)],
  );
}

export function getCats(): Cat[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function updateCat(updatedCat: Cat): void {
  const cats = getCats();
  const index = cats.findIndex((cat) => cat.id === updatedCat.id);
  if (index !== -1) {
    cats[index] = {
      ...updatedCat,
      likeCount: updatedCat.likeCount || 0,
      like: updatedCat.like || false,
      tags: updatedCat.tags || [],
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
  }
}

export function deleteCat(catId: string): void {
  const cats = getCats().filter((cat) => cat.id !== catId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cats));
}
export function addCat(cat: Cat): void {
  const cats = getCats();

  const newCat: Cat = {
    id: cat.id,
    url: cat.url,
    width: cat.width,
    height: cat.height,
    title: cat.title || "Untitled",
    likeCount: cat.likeCount !== undefined ? cat.likeCount : 0,
    like: cat.like !== undefined ? cat.like : false,
    tags: cat.tags || [],
  };

  console.log("Adding new cat to LocalStorage:", newCat);

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...cats, newCat]));
}
