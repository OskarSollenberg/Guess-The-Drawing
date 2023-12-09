import * as api from "./components/api.js";
import * as canvas from "./components/canvas.js";
import * as timer from "./components/timer.js";
import * as imgGallery from "./components/imgGallery.js";
import * as answer from "./components/conditions.js";

// Router function
function setPage(pageId) {
    let pages = document.querySelectorAll(".page");
    for (let page of pages) {
        page.classList.remove("page--visible");
    }
    if (pageId === "welcomePage") {
        renderWelcomePage();
    } else if (pageId === "instructionsPage") {
        renderInstructionsPage();
    } else if (pageId === "animalPage") {
        renderRandAnimalPage();
    } else if (pageId === "gamePage") {
        renderGamePage();
    } else if (pageId === "inputPage") {
        renderInputPage();
    }
}
// Render component function
function renderWelcomePage() {
    let welcomePage = document.querySelector("#welcomePage");
    displayPage(welcomePage);

    let nextBtnEl = welcomePage.querySelector(".btn__next-page");
    nextBtnEl.addEventListener("click", function () {
        setPage("instructionsPage");
    });
}
function renderImgGallery() {
    imgGallery.initImgGallery();
}
function renderInstructionsPage() {
    let instructionsPage = document.querySelector("#instructionsPage");
    displayPage(instructionsPage);

    let nextBtnEl = instructionsPage.querySelector(".btn__next-page");
    nextBtnEl.addEventListener("click", function () {
        setPage("animalPage");
    });
}
function renderRandAnimalPage() {
    let animalPage = document.querySelector("#animalPage");
    displayPage(animalPage);
    api.loadAnimal();

    let nextBtnEl = animalPage.querySelector(".btn__next-page");
    nextBtnEl.addEventListener("click", function () {
        setPage("gamePage");
    });
}
function renderGamePage() {
    let gamePage = document.querySelector("#gamePage");
    displayPage(gamePage);

    canvas.initCanvas();

    timer.initTimer(handleTimerEnd);
    function handleTimerEnd() {
        canvas.disableDrawing();
        imgGallery.saveCanvasToLocalStorage();
        setPage("inputPage");
    }
}
function renderInputPage() {
    const inputContentWrapper = document.querySelector(
        ".input__content-wrapper"
    );
    inputContentWrapper.classList.toggle("input__content-wrapper--visible");

    imgGallery.displayCurrentCanvas();
    gamePage.classList.add("page--content-positioning");

    const submitGuessBtn = document.querySelector(".btn__submit-guess");
    submitGuessBtn.addEventListener("click", function () {
        const userInput = document.querySelector(".input");
        const userGuess = userInput.value.toLowerCase();
        const lettersInAlphabet = /^[a-z]+$/;

        if (lettersInAlphabet.test(userGuess)) {
            const conditionsWrapperEl = document.querySelector(
                ".condition__wrapper"
            );
            conditionsWrapperEl.classList.add("condition--visible");
            inputContentWrapper.classList.toggle(
                "input__content-wrapper--visible"
            );

            answer.initAnswer();
            imgGallery.initImgGallery();
        } else {
            userInput.value = "";
        }
    });
}

function displayPage(pageId) {
    pageId.classList.add("page--visible");
}

const playAgainBtn = document.querySelector(".btn__play-again");
playAgainBtn.addEventListener("click", function () {
    location.reload();
});

renderWelcomePage();
renderImgGallery();
