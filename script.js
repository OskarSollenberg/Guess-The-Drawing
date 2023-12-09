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
    welcomePage.classList.add("page--visible");

    let nextBtnEl = welcomePage.querySelector(".btn__next-page");
    nextBtnEl.addEventListener("click", function () {
        setPage("instructionsPage");
    });
}
function renderInstructionsPage() {
    let instructionsPage = document.querySelector("#instructionsPage");
    instructionsPage.classList.add("page--visible");

    let nextBtnEl = instructionsPage.querySelector(".btn__next-page");
    nextBtnEl.addEventListener("click", function () {
        setPage("animalPage");
    });
}
function renderRandAnimalPage() {
    let animalPage = document.querySelector("#animalPage");
    animalPage.classList.add("page--visible");
    api.loadAnimal();

    let nextBtnEl = animalPage.querySelector(".btn__next-page");
    nextBtnEl.addEventListener("click", function () {
        setPage("gamePage");
    });
}
function renderGamePage() {
    let gamePage = document.querySelector("#gamePage");
    gamePage.classList.add("page--visible");

    canvas.initCanvas();

    timer.initTimer(handleTimerEnd);
    function handleTimerEnd() {
        imgGallery.saveCanvasToLocalStorage();
        setPage("inputPage");
    }
}
function renderInputPage() {
    let inputPage = document.querySelector("#inputPage");
    inputPage.classList.add("page--visible");

    imgGallery.displayCanvasImg();
    inputPage.classList.add("page--content-positioning");

    const submitGuessBtn = document.querySelector(".btn__submit-guess");
    submitGuessBtn.addEventListener("click", function () {
        const userInput = document.querySelector(".input");
        const userGuess = userInput.value.toLowerCase();
        const lettersInAlphabet = /^[a-z]+$/;

        if (lettersInAlphabet.test(userGuess)) {
            const inputContent = document.querySelector(".input__content");
            const conditionsEl = document.querySelector(".conditions");

            inputContent.classList.add("input__content--hidden");
            conditionsEl.classList.add("condition--visible");

            answer.initAnswer();
            imgGallery.initImgGallery();
        } else {
            userInput.value = "";
        }
    });
}

const playAgainBtn = document.querySelector(".btn__play-again");
playAgainBtn.addEventListener("click", function () {
    location.reload();
});

renderWelcomePage();
imgGallery.initImgGallery();
