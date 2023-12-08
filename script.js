import { fetchRandomAnimal } from "./api.js";
import * as canvas from "./canvas.js";

// Cards / Forms / Inputs
const cards = document.querySelectorAll(".card"); // All cards/pages saved in an array
const inputContentWrapper = document.querySelector(".input__content-wrapper"); // The form that displays where the user can input guess
// const formGridRow = document.querySelector(".card__grid-wrapper");
const userInput = document.querySelector(".input"); // To store the user guess/input into a variable

// Buttons
const nextPageButtons = document.querySelectorAll(".btn__next-page"); // All buttons that take you to the next card/page
const submitGuessBtn = document.querySelector(".btn__submit-guess"); // The button to submit guess
const playAgainBtn = document.querySelector(".btn__play-again");

// Winning / Loosing conditions
const conditionsWrapperEl = document.querySelector(".condition__wrapper");
const conditionStatusEl = document.querySelector(".condition__status");
const conditionMessageEl = document.querySelector(".condition__message");

let randomAnimal; // Varible to store the API's random animal
let secondsLeftToDraw = 3; // How many seconds the player should have to draw on the canvas
let currentPageNumber = 0; // What card/page the user is currently on
let nextPageNumber = currentPageNumber + 1; // The page number to be displayed next

let imgUrls = []; // Array containing all the image-URL's saved to local storage

function assignAnimal(animal) {
    randomAnimal = animal;
}
// This function waits for the API to fetch a random animal and then when function is called, displays the animal in text in the HTML.
async function loadAnimal() {
    const animalWordEl = document.querySelector("#random-animal");
    const loader = document.querySelector(".loader");
    const animal = await fetchRandomAnimal();
    assignAnimal(animal);
    animalWordEl.textContent = randomAnimal;
    loader.classList.remove("loader--visible");
}

function handleTimeUp() {
    canvas.disableDrawing();
    saveCanvasToLocalStorage();
    inputContentWrapper.classList.add("input__content-wrapper--visible"); // Show form where user can input guess
    cards[currentPageNumber].classList.add("card--content-positioning"); // Push canvas to the side to make place for form (grid on class in css)
}
// This function checks if the user have any time left to draw and eccecutes accordingly
function checkTimeLeftToDraw() {
    if (secondsLeftToDraw === 0) {
        handleTimeUp();
    } else {
        setTimeout(countDownSeconds, 1000); // Keep counting down by calling the function again after 1 second
    }
}

function displaySecondsLeftToDraw() {
    const counter = document.querySelector("#counter");
    counter.textContent = secondsLeftToDraw;
}
// This function counts down the time the user have to draw the animal on the canvas and updates a counter displayed in HTML
function countDownSeconds() {
    secondsLeftToDraw -= 1;
    checkTimeLeftToDraw();
    displaySecondsLeftToDraw();
}

// This function check for the current card/page-number and calls for functions if anything should be displayed on a specific card/page
function updateContentBasedOnPageNumber() {
    if (currentPageNumber === 2) {
        loadAnimal();
    } else if (currentPageNumber === 3) {
        canvas.initCanvas();
        countDownSeconds();
    }
}

// This function displays the next card/page and increments the current page number
function changePage() {
    cards[currentPageNumber].classList.remove("card--visible");
    cards[nextPageNumber].classList.add("card--visible");
    currentPageNumber++;
    nextPageNumber++;
    updateContentBasedOnPageNumber();
}

//This function saves the canvas-URL to an array called "imgUrls" in the local storage
function saveCanvasToLocalStorage() {
    let object = {
        url: "",
        animal: "",
    };
    let currentCanvasUrl = canvas.getImageUrl();

    object.url = currentCanvasUrl;
    object.animal = randomAnimal;
    imgUrls.push(object);

    // imgUrls.push(currentCanvasUrl);

    localStorage.setItem("imgUrls", JSON.stringify(imgUrls));
}

// This function removes all the images in the image-gallery and then creates new image-elements for every image-Url we have stored in local storage.
function displayGalleryImages() {
    const galleryWrapper = document.querySelector(".gallery-wrapper");

    galleryWrapper.innerHTML = "";

    for (let imgUrl of imgUrls) {
        let img = document.createElement("img");
        let text = document.createElement("p");
        let galleryContentWrapper = document.createElement("div");
        galleryContentWrapper.classList.add("gallery-content-wrapper");

        img.src = imgUrl.url;
        text.textContent = imgUrl.animal;
        galleryWrapper.appendChild(galleryContentWrapper);

        galleryContentWrapper.appendChild(img);
        galleryContentWrapper.appendChild(text);
    }
}

// This function checkes if there are any previously drawn images that should be displayed in the image-gallery
function checkForPrevSavedCanvasImages() {
    if (localStorage.getItem("imgUrls")) {
        imgUrls = JSON.parse(localStorage.getItem("imgUrls"));
    }
}
// This is the winning condition
function showWinningCondition() {
    conditionStatusEl.innerText = "Correct!";
    conditionMessageEl.innerText = "You are the best!";
}
// This is the loosing condition
function showLoosingCondition() {
    conditionStatusEl.innerText = "Wrong!";
    conditionMessageEl.innerText = `The correct answer is ${randomAnimal}!`;
}
// This function checkes if the user have guessed the correct animal and calls for function to display winning or loosing condition
function checkIfCorrectGuess() {
    if (userInput.value.toLowerCase() === randomAnimal.toLowerCase()) {
        showWinningCondition();
    } else {
        showLoosingCondition();
    }
    displayGalleryImages();
}

// Play again button that reloads the page
playAgainBtn.addEventListener("click", function () {
    location.reload();
});

// Submit button for user to submit their guess
submitGuessBtn.addEventListener("click", function () {
    inputContentWrapper.classList.remove("input__content-wrapper--visible");
    conditionsWrapperEl.classList.add("condition--visible");
    checkIfCorrectGuess();
    inputContentWrapper.reset(); // Do we need this??
});

for (let nextPageButton of nextPageButtons) {
    nextPageButton.addEventListener("click", changePage);
}

checkForPrevSavedCanvasImages();
displayGalleryImages();
