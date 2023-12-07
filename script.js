import { fetchRandomAnimal } from "./api.js";
import * as canvas from "./canvas.js";

// Cards / Forms / Inputs
const cards = document.querySelectorAll(".card"); // All cards/pages saved in an array
const form = document.querySelector("#form"); // The form that displays where the user can input guess
const formGridRow = document.querySelector(".form__grid__row");
const userInput = document.querySelector("#userInput"); // To store the user guess/input into a variable

// Buttons
const nextPageButtons = document.querySelectorAll(".button"); // All buttons that take you to the next card/page
const submitGuessBtn = document.querySelector("#submitGuessBtn"); // The button to submit guess
const playAgainBtn = document.querySelector(".play-again__btn");

// Winning / Loosing conditions
const conditionsWrapperEl = document.querySelector(".conditions__wrapper");
const conditionTitleEl = document.querySelector(".condition__title");
const conditionMessageEl = document.querySelector(".condition__message");

let randomAnimal; // Varible to store the API's random animal
let secondsLeftToDraw = 3; // How many seconds the player should have to draw on the canvas
let currentPageNumber = 0; // What card/page the user is currently on
let nextPageNumber = currentPageNumber + 1; // The page number to be displayed next
let imgUrls = []; // Array containing all the image-URL's saved to local storage
let winningCondition;
let loosingCondition;

// This function waits for the API to fetch a random animal and then when function is called, displays the animal in text in the HTML.
async function displayAnimalName() {
    let animalWordEl = document.querySelector("#key-word");
    randomAnimal = await fetchRandomAnimal();
    animalWordEl.textContent = randomAnimal;
}

// This function checks if the user have any time left to draw and eccecutes accordingly
function checkTimeLeftToDraw() {
    if (secondsLeftToDraw === 0) {
        canvas.disableDrawing();
        saveCanvasToLocalStorage();
        displayGalleryImages();
        form.classList.add("form--visable"); // Show form where user can input guess
        cards[currentPageNumber].classList.add("card--content-positioning"); // Push canvas to the side to make place for form (grid on class in css)
    } else {
        setTimeout(countDownSeconds, 1000); // Keep counting down by calling the function again after 1 second
    }
}

// This function counts down the time the user have to draw the animal on the canvas and updates a counter displayed in HTML
function countDownSeconds() {
    const counter = document.querySelector("#counter");
    secondsLeftToDraw -= 1;
    counter.textContent = secondsLeftToDraw;
    checkTimeLeftToDraw();
}

// This function check for the current card/page-number and calls for functions if anything should be displayed on a specific card/page
function updateContentBasedOnPageNumber() {
    if (currentPageNumber === 2) {
        displayAnimalName();
    } else if (currentPageNumber === 3) {
        canvas.initCanvas();
        countDownSeconds();
    }
}

// This function displays the next card/page and increments the current page number
function changePage() {
    cards[currentPageNumber].classList.remove("card--visable");
    cards[nextPageNumber].classList.add("card--visable");
    currentPageNumber++;
    nextPageNumber++;
    updateContentBasedOnPageNumber();
}

//This function saves the canvas-URL to an array called "imgUrls" in the local storage
function saveCanvasToLocalStorage() {
    let currentCanvasUrl = canvas.getImageUrl();
    imgUrls.push(currentCanvasUrl);
    localStorage.setItem("imgUrls", JSON.stringify(imgUrls));
}

// This function removes all the images in the image-gallery and then creates new image-elements for every image-Url we have stored in local storage.
function displayGalleryImages() {
    const galleryWrapper = document.querySelector(".gallery-wrapper");
    galleryWrapper.innerHTML = "";

    for (let imgUrl of imgUrls) {
        let img = document.createElement("img");

        img.src = imgUrl;
        galleryWrapper.appendChild(img);
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
    conditionTitleEl.innerText = "Correct!";
    conditionMessageEl.innerText = "You are the best!";
}
// This is the loosing condition
function showLoosingCondition() {
    conditionTitleEl.innerText = "Wrong!";
    conditionMessageEl.innerText = `The correct answer is ${randomAnimal}!`;
}
// This function checkes if the user have guessed the correct animal and calls for function to display winning or loosing condition
let cardInfo
function checkIfCorrectGuess() {
    if (userInput.value === "") {
        cardInfo = document.querySelector("#_input");
        cardInfo.innerText = "Please fill in the field"
    }
    else {
        form.classList.remove("form--visable");
        conditionsWrapperEl.classList.add("condition--visable");
        if (userInput.value.toLowerCase() === randomAnimal.toLowerCase()) {
            showWinningCondition();
        }
        else {
            showLoosingCondition();
        }
        form.reset();
    }
}

// Play again button that reloads the page
playAgainBtn.addEventListener("click", function () {
    location.reload();
});

// Submit button for user to submit their guess
submitGuessBtn.addEventListener("click", function () {
    checkIfCorrectGuess();

});

for (let nextPageButton of nextPageButtons) {
    nextPageButton.addEventListener("click", changePage);
}

checkForPrevSavedCanvasImages();
displayGalleryImages();
