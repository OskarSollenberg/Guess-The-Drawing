"use strict";

const cards = document.querySelectorAll(".card"); // All cards/pages saved in an array
const form = document.querySelector("#form"); // The form that displays where the user can input guess
const nextPageButtons = document.querySelectorAll(".button"); // All buttons that take you to the next card/page
const submitGuessBtn = document.querySelector("#submitGuessBtn"); // The button to submit guess
const canvasEl = document.querySelector("#canvas"); // Canvas element
const context = canvasEl.getContext("2d"); // The content within the canvas
const rect = canvasEl.getBoundingClientRect(); // Size of the Canvas
const userInput = document.querySelector("#userInput"); // To store the user guess/input into a variable

let randomAnimal; // Varible to store the API's random animal
let secondsLeftToDraw = 3; // How many seconds the player should have to draw on the canvas
let currentPageNumber = 0; // What card/page the user is currently on
let nextPageNumber = currentPageNumber + 1; // The page number to be displayed next
let imgUrls = []; // Array containing all the image-URL's saved to local storage

// This function fetches a random animal name from the API
async function fetchRandomAnimal() {
    const url = "https://animal-name-api.onrender.com/random-animal";
    try {
        const response = await fetch(url);
        const result = await response.json();
        randomAnimal = result.animal;
        return randomAnimal;
    } catch (error) {
        console.error("Error fetching animal:", error);
        return "Error fetching word";
    }
}

// This function waits for the API to fetch a random animal and then when function is called, displays the animal in text in the HTML.
async function displayAnimalName() {
    let animalWordEl = document.querySelector("#key-word");
    let animalName = await fetchRandomAnimal();
    animalWordEl.textContent = animalName;
}

// This function checks if the user have any time left to draw and eccecutes accordingly
function checkTimeLeftToDraw() {
    if (secondsLeftToDraw === 0) {
        canDraw = false; // User can not draw anymore
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
        countDownSeconds();
    }
}

// This function displays the next card/page and increments the current page number
function displayNextPage() {
    cards[currentPageNumber].classList.remove("card--visable");
    cards[nextPageNumber].classList.add("card--visable");
    currentPageNumber++;
    nextPageNumber++;
    updateContentBasedOnPageNumber();
}

//This function saves the canvas-URL to an array called "imgUrls" in the local storage
function saveCanvasToLocalStorage() {
    let currentDrawingUrl = canvasEl.toDataURL("image/png");
    imgUrls.push(currentDrawingUrl);
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
// This function checkes if the user have guessed the correct animal and calls for function to display winning or loosing condition
function checkIfCorrectGuess() {
    if (userInput.value.toLowerCase() === randomAnimal.toLowerCase()) {
        displayWinningCondition();
        playAgainButton();
    } else {
        displayLoosingCondition();
        playAgainButton();
    }
}
// Oskar thinks this should be done in HTML see quick examlpe in HTML file
let gridRow = document.querySelector(".grid__row");
let winningConditionMessage = document.createElement("div");
let loosingConditionMessage = document.createElement("div");

function displayWinningCondition() {
    form.style.display = "none";
    gridRow.appendChild(winningConditionMessage);
    winningConditionMessage.className = "win-condition";
    winningConditionMessage.innerText = "Correct!";
}
function displayLoosingCondition() {
    form.style.display = "none";
    gridRow.appendChild(loosingConditionMessage);
    loosingConditionMessage.className = "win-condition";
    loosingConditionMessage.innerText = `Wrong! The correct answer is ${randomAnimal}!`;
}
function playAgainButton() {
    let playAgainBtn = document.createElement("button");
    gridRow.appendChild(playAgainBtn);
    playAgainBtn.className = "button";
    playAgainBtn.innerText = "Play Again!";
    playAgainBtn.addEventListener("click", function () {
        location.reload();
    });
}

submitGuessBtn.addEventListener("click", function () {
    checkIfCorrectGuess();
    form.reset();
});

for (let nextPageButton of nextPageButtons) {
    nextPageButton.addEventListener("click", displayNextPage);
}

checkForPrevSavedCanvasImages();
displayGalleryImages();
