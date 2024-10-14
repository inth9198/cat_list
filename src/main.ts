import { addTagToCat, closeModal, openModal, removeTagFromCat } from "./modal";
import {
  getCats,
  addCat,
  generateRandomLike,
  generateRandomTags,
  generateRandomLikeNumber,
} from "./storage";
import { Cat } from "./types";
import { debounce } from "./debounce";

const galleryContainer = document.querySelector("#gallery");
const prevButton = document.querySelector("#prevPage") as HTMLButtonElement;
const nextButton = document.querySelector("#nextPage") as HTMLButtonElement;
const pageIndicator = document.querySelector(
  "#pageIndicator",
) as HTMLSpanElement;
const modal = document.querySelector("#modal") as HTMLElement;
const closeButton = document.querySelector(".close-button") as HTMLElement;
const loadingElement = document.querySelector("#loading") as HTMLElement;
const searchInput = document.querySelector("#searchInput") as HTMLInputElement;

const itemsPerPage = 9;
const numRequests = 10;
export let currentPage = 1;

let catImages: Cat[] = getCats() || [];
let filteredCats: Cat[] = [];
let isSearching = false;
const tagFilter = document.querySelector("#tagFilter") as HTMLSelectElement;

function filterImagesByTag(tag: string) {
  let filteredCats;

  if (tag === "all") {
    filteredCats = catImages;
  } else {
    filteredCats = catImages.filter((cat) => cat.tags.includes(tag));
  }
  displayImages(filteredCats, 1);
  updatePageIndicator(1, Math.ceil(filteredCats.length / itemsPerPage));
}
function searchByTag(tag: string) {
  loadingElement.style.display = "block";

  catImages = getCats();
  filteredCats = catImages.filter((cat) =>
    cat.tags.some((t) => t.includes(tag)),
  );
  isSearching = true;
  displayImages(filteredCats, 1);
  updatePageIndicator(1, Math.ceil(filteredCats.length / itemsPerPage));
  loadingElement.style.display = "none";
}

const debouncedSearch = debounce(() => {
  const tag = searchInput.value.trim();
  searchByTag(tag);
}, 300);

searchInput.addEventListener("input", () => {
  if (searchInput.value.trim()) {
    loadingElement.style.display = "block";
    debouncedSearch();
  } else {
    isSearching = false;
    filteredCats = [];
    displayImages(catImages, 1);
    updatePageIndicator(1, Math.ceil(catImages.length / itemsPerPage));
  }
});
tagFilter.addEventListener("change", () => {
  const selectedTag = tagFilter.value;
  filterImagesByTag(selectedTag);
});
async function fetchCatImages() {
  try {
    loadingElement.style.display = "block";
    const existingCats = getCats();

    if (existingCats.length >= 100) {
      console.warn("데이터가 존재합니다 fetch 생략하겠습니다.");
      catImages = existingCats;
      displayImages(catImages, currentPage);
      goToPage(1);
      return;
    }
    const fetchPromises = Array.from({ length: numRequests }, () =>
      fetch("https://api.thecatapi.com/v1/images/search?limit=10"),
    );
    const responses = await Promise.all(fetchPromises);
    const dataPromises = responses.map((res) => res.json());

    const data = await Promise.all(dataPromises);

    const cats = data.flat().map((img: any) => {
      const tags = generateRandomTags();
      return {
        id: img.id,
        url: img.url,
        width: img.width.toString(),
        height: img.height.toString(),
        title: tags[0],
        like: generateRandomLike(),
        likeCount: generateRandomLikeNumber(),
        tags: tags,
      };
    });
    console.log("cats", cats);

    cats.forEach((cat) => addCat(cat));
    catImages = cats;
    displayImages(cats, currentPage);
    goToPage(1);

    console.log(
      getCats(),
      cats.forEach((cat) => console.log(321, cat)),
    );
  } catch (error) {
    console.error("Error fetching cat images:", error);
  } finally {
    loadingElement.style.display = "none";
  }
}

export function displayImages(images: Cat[], page: number) {
  if (!galleryContainer) {
    console.error("Gallery container not found");
    return;
  }
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const imagesToDisplay = images.slice(startIndex, endIndex);
  const latestCats = getCats();

  galleryContainer.innerHTML = imagesToDisplay
    .map((img) => {
      const cat = latestCats.find((cat) => cat.id === img.id);
      const tags = cat?.tags.map((tag) => `#${tag}`).join(" ") || "";
      return `
        <div class="thumbnail" data-id="${img.id}">
          <img src="${img.url}" alt="Cat Image" class="cat-thumbnail">
          <p class="tags">${tags}</p>
        </div>`;
    })
    .join("");

  document.querySelectorAll(".thumbnail").forEach((image) => {
    image.addEventListener("click", (event) => {
      const target = event.currentTarget as HTMLElement;
      const catId = target.getAttribute("data-id");
      const cat = latestCats.find((img) => img.id === catId);
      if (cat) openModal(cat);
    });
  });

  document.querySelectorAll(".add-tag-button").forEach((button) => {
    button.addEventListener("click", (event) => {
      const thumbnail = (event.target as HTMLElement).closest(".thumbnail");
      const catId = thumbnail?.getAttribute("data-id") || "";
      const newTagInput = thumbnail?.querySelector(
        ".add-tag-input",
      ) as HTMLInputElement;
      if (newTagInput.value.trim()) {
        addTagToCat(catId, newTagInput.value.trim());
        newTagInput.value = "";
        displayImages(getCats(), currentPage);
      }
    });
  });

  document.querySelectorAll(".remove-tag").forEach((button) => {
    button.addEventListener("click", (event) => {
      const tagSpan = (event.target as HTMLElement).closest(".tag");
      const thumbnail = (event.target as HTMLElement).closest(".thumbnail");
      const catId = thumbnail?.getAttribute("data-id") || "";
      const tagToRemove = tagSpan?.textContent?.trim().replace(" x", "") || "";
      removeTagFromCat(catId, tagToRemove);
      displayImages(getCats(), currentPage);
    });
  });
}

function goToPage(page: number) {
  const data = isSearching ? filteredCats : catImages;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    displayImages(data, currentPage);
    updatePageIndicator(currentPage, totalPages);
  }

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}
function updatePageIndicator(currentPage: number, totalPages: number) {
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
}

closeButton.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
fetchCatImages();
prevButton.addEventListener("click", () => goToPage(currentPage - 1));
nextButton.addEventListener("click", () => goToPage(currentPage + 1));
