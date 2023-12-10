let galleryItemList = [];
let objectInfo = {
    url: "",
    animal: "",
};

export function saveCanvasToLocalStorage() {
    let canvasEl = document.querySelector("#canvas");
    let animal = document.querySelector("#random-animal").textContent;
    let currentCanvasUrl = canvasEl.toDataURL("image/png");

    objectInfo.url = currentCanvasUrl;
    objectInfo.animal = animal;
    galleryItemList.push(objectInfo);

    localStorage.setItem("galleryItemList", JSON.stringify(galleryItemList));
}

export function initImgGallery() {
    function checkForPrevSavedCanvasImages() {
        if (localStorage.getItem("galleryItemList")) {
            galleryItemList = JSON.parse(
                localStorage.getItem("galleryItemList")
            );
        }
    }
    function renderImgGallery() {
        const galleryWrapper = document.querySelector(".gallery-grid-wrapper");
        galleryWrapper.innerHTML = "";

        for (let galleryItem of galleryItemList) {
            let galleryImg = document.createElement("img");
            let galleryText = document.createElement("p");
            let galleryContentWrapper = document.createElement("div");
            galleryContentWrapper.classList.add("gallery-grid-items");
            galleryImg.src = galleryItem.url;
            galleryText.textContent = galleryItem.animal;
            galleryWrapper.appendChild(galleryContentWrapper);
            galleryContentWrapper.appendChild(galleryImg);
            galleryContentWrapper.appendChild(galleryText);
        }
    }
    checkForPrevSavedCanvasImages();
    renderImgGallery();
}

export function displayCanvasImg() {
    let userGuesscanvas = document.querySelector("#userGuesscanvas");
    galleryItemList = JSON.parse(localStorage.getItem("galleryItemList"));
    let currentCanvasUrl = galleryItemList[galleryItemList.length - 1].url;
    userGuesscanvas.src = currentCanvasUrl;
}
