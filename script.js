import { fetchRandomAnimal, loadAnimal } from "./api.js";
import * as canvas from "./canvas.js";

// Cards / Forms / Inputs
// // const formGridRow = document.querySelector(".card__grid-wrapper");
// const userInput = document.querySelector(".input"); // To store the user guess/input into a variable

// // Buttons
// const nextPageButtons = document.querySelectorAll(".btn__next-page"); // All buttons that take you to the next card/page
// const submitGuessBtn = document.querySelector(".btn__submit-guess"); // The button to submit guess
// const playAgainBtn = document.querySelector(".btn__play-again");

// // Winning / Loosing conditions
// const conditionsWrapperEl = document.querySelector(".condition__wrapper");
// const conditionStatusEl = document.querySelector(".condition__status");
// const conditionMessageEl = document.querySelector(".condition__message");

// // lettter in the Alphabet
// const lettersInAlphabet = /^[a-z]+$/;

// let secondsLeftToDraw = 3; // How many seconds the player should have to draw on the canvas
// let currentPageNumber = 0; // What card/page the user is currently on
// let nextPageNumber = currentPageNumber + 1; // The page number to be displayed next

// let galleryItemList = []; // Array containing all the image-URL's saved to local storage

// // This function check for the current card/page-number and calls for functions if anything should be displayed on a specific card/page
// function updateContentBasedOnPageNumber() {
//     if (currentPageNumber === 2) {
//         loadAnimal();
//     } else if (currentPageNumber === 3) {
//         canvas.initCanvas();
//         countDownSeconds();
//     }
// }

// // This function displays the next card/page and increments the current page number
// function changePage() {
//     cards[currentPageNumber].classList.remove("card--visible");
//     cards[nextPageNumber].classList.add("card--visible");
//     currentPageNumber++;
//     nextPageNumber++;
//     updateContentBasedOnPageNumber();
// }

// //This function saves the canvas-URL to an array called "galleryItemList" in the local storage
// function saveCanvasToLocalStorage() {
//     let objectInfo = {
//         url: "",
//         animal: "",
//     };
//     let currentCanvasUrl = canvas.getImageUrl();

//     objectInfo.url = currentCanvasUrl;
//     objectInfo.animal = randomAnimal;
//     galleryItemList.push(objectInfo);

//     // galleryItemList.push(currentCanvasUrl);

//     localStorage.setItem("galleryItemList", JSON.stringify(galleryItemList));
// }

// // This function removes all the images in the image-gallery and then creates new image-elements for every image-Url we have stored in local storage.
// function displayGalleryImages() {
//     const galleryWrapper = document.querySelector(".gallery-wrapper");

//     galleryWrapper.innerHTML = "";

//     for (let galleryItem of galleryItemList) {
//         let galleryImg = document.createElement("img");
//         let galleryText = document.createElement("p");
//         let galleryContentWrapper = document.createElement("div");
//         galleryContentWrapper.classList.add("gallery-content-wrapper");

//         galleryImg.src = galleryItem.url;
//         galleryText.textContent = galleryItem.animal;
//         galleryWrapper.appendChild(galleryContentWrapper);

//         galleryContentWrapper.appendChild(galleryImg);
//         galleryContentWrapper.appendChild(galleryText);
//     }
// }

// // This function checkes if there are any previously drawn images that should be displayed in the image-gallery
// function checkForPrevSavedCanvasImages() {
//     if (localStorage.getItem("galleryItemList")) {
//         galleryItemList = JSON.parse(localStorage.getItem("galleryItemList"));
//     }
// }
// // This is the winning condition
// function showWinningCondition() {
//     conditionStatusEl.innerText = "Correct!";
//     conditionMessageEl.innerText = "You are the best!";
//     displayGalleryImages();
// }
// // This is the loosing condition
// function showLosingCondition() {
//     conditionStatusEl.innerText = "Wrong!";
//     conditionMessageEl.innerText = `The correct answer is ${randomAnimal}!`;
//     displayGalleryImages();
// }
// // This function checkes if the user have guessed the correct animal and calls for function to display winning or loosing condition
// function compareGuessToAnswer() {
//     if (userInput.value.toLowerCase() === randomAnimal.toLowerCase()) {
//         showWinningCondition();
//     } else {
//         showLosingCondition();
//     }
// }

// // Play again button that reloads the page
// playAgainBtn.addEventListener("click", function () {
//     location.reload();
// });

// // Submit button for user to submit their guess
// submitGuessBtn.addEventListener("click", function () {
//     let userGuess = userInput.value.toLowerCase();
//     if (lettersInAlphabet.test(userGuess)) {
//         inputContentWrapper.classList.remove("input__content-wrapper--visible");
//         conditionsWrapperEl.classList.add("condition--visible");
//         compareGuessToAnswer();
//     } else {
//         userInput.value = "";
//     }
// });

// for (let nextPageButton of nextPageButtons) {
//     nextPageButton.addEventListener("click", changePage);
// }

// This function waits for the API to fetch a random animal and then when function is called, displays the animal in text in the HTML.

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
    loadAnimal();

    let nextBtnEl = animalPage.querySelector(".btn__next-page");
    nextBtnEl.addEventListener("click", function () {
        setPage("gamePage");
    });
}

function renderGamePage() {
    const cards = document.querySelectorAll(".card");
    const inputContentWrapper = document.querySelector(
        ".input__content-wrapper"
    );

    let gamePage = document.querySelector("#gamePage");
    let randomAnimal;
    let currentPageNumber = 0;
    let secondsLeftToDraw = 4;

    gamePage.classList.add("page--visible");

    canvas.initCanvas();
    startTimer();

    function handleTimeUp() {
        canvas.disableDrawing();
        // saveCanvasToLocalStorage();
        inputContentWrapper.classList.add("input__content-wrapper--visible");
        cards[currentPageNumber].classList.add("card--content-positioning");
    }

    function startTimer() {
        const counter = document.querySelector("#counter");
        counter.textContent = secondsLeftToDraw;

        if (secondsLeftToDraw === 0) {
            handleTimeUp();
        } else {
            secondsLeftToDraw -= 1;
            setTimeout(startTimer, 1000);
        }
    }

    // let nextBtnEl = gamePage.querySelector(".btn__next-page");
    // nextBtnEl.addEventListener("click", function () {
    //     setPage("welcomePage");
    // });
}

renderWelcomePage();
