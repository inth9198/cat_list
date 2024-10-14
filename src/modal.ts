import { currentPage, displayImages } from "./main";
import { getCats, updateCat } from "./storage";
import { Cat } from "./types";
const modalImage = document.querySelector("#modalImage") as HTMLImageElement;
const modal = document.querySelector("#modal") as HTMLElement;

export function addTagToCat(catId: string, newTag: string) {
  const cat = getCats().find((cat) => cat.id === catId);
  if (cat && !cat.tags.includes(newTag)) {
    cat.tags.push(newTag);
    updateCat(cat);
    displayImages(getCats(), currentPage);
  }
}

export function removeTagFromCat(catId: string, tagToRemove: string) {
  const cat = getCats().find((cat) => cat.id === catId);
  if (cat) {
    cat.tags = cat.tags.filter((tag) => tag !== tagToRemove);
    updateCat(cat);
    displayImages(getCats(), currentPage);
  }
}

export function openModal(cat: Cat) {
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-button">&times;</span>
      <h1>${cat.title}</h1>
      <img src="${cat.url}" alt="Cat Image" class="modal-image" />
      <div class="flex">
        <input type="text" id="catName" value="${cat.title}" placeholder="Enter name">
        <button id="saveNameButton">Save Name</button>
      </div>
      <div class="like-container">
        <button id="likeButton" class="like-button">
          ${cat.like ? "❤️" : "🤍"}
        </button>
        <span id="likeCount">${cat.likeCount}</span>
      </div>
      <div class="tags">
        ${cat.tags
          .map(
            (tag) =>
              `<span class="tag">#${tag} <button class="remove-tag">x</button></span>`,
          )
          .join("")}
      </div>
      <div class="flex">
        <input type="text" id="newTagInput" placeholder="태그 입력">
        <button id="addTagButton">Add Tag</button>
      </div>
    </div>
  `;
  modal.style.display = "flex";

  document
    .querySelector(".close-button")
    ?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.getElementById("saveNameButton")?.addEventListener("click", () => {
    const nameInput = document.getElementById("catName") as HTMLInputElement;
    cat.title = nameInput.value;
    updateCat(cat);
    displayImages(getCats(), currentPage);
  });

  document.getElementById("likeButton")?.addEventListener("click", () => {
    cat.like = !cat.like;
    cat.likeCount += cat.like ? 1 : -1;
    updateCat(cat);
    openModal(cat);
    displayImages(getCats(), currentPage);
  });

  document.getElementById("addTagButton")?.addEventListener("click", () => {
    const newTagInput = document.getElementById(
      "newTagInput",
    ) as HTMLInputElement;
    const newTag = newTagInput.value.trim();
    if (newTag && !cat.tags.includes(newTag)) {
      cat.tags.push(newTag);
      updateCat(cat);
      openModal(cat);
      displayImages(getCats(), currentPage);
    }
  });

  document.querySelectorAll(".remove-tag").forEach((button) => {
    button.addEventListener("click", (event) => {
      const tagButton = event.target as HTMLElement;
      const tagText =
        tagButton.parentElement?.textContent
          ?.replace(" x", "")
          ?.replace("#", "") || "";
      cat.tags = cat.tags.filter((tag) => tag !== tagText);
      updateCat(cat);
      openModal(cat);
      displayImages(getCats(), currentPage);
    });
  });
}
export function closeModal() {
  modal.style.display = "none";
  modalImage.src = "";
}
