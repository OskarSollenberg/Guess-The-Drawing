"use strict";

// Global Result / Animal Name

// Cards / Forms
const cards = document.querySelectorAll(".card");
const form = document.querySelector("#form");
// Buttons
const buttons = document.querySelectorAll(".button");
const submitGuessBtn = document.querySelector("#submitGuessBtn");
// Canvas
const canvasEl = document.querySelector("#canvas");
const context = canvasEl.getContext("2d");
const rect = canvasEl.getBoundingClientRect();
// User-input
const userInput = document.querySelector("#userInput");

let result;
let secondsToDraw = 3;
let currentPageNumber = 0;
let nextPageNumber = currentPageNumber + 1;
let canvasImgUrlList = []; // Array to store the URLs of canvas images

async function fetchRandomAnimal() {
    const url = "https://animal-name-api.onrender.com/random-animal";
    try {
        const response = await fetch(url);
        const result = await response.json();
        return result.animal;
    } catch (error) {
        console.error("Error fetching animal:", error);
        return "Error fetching word";
    }
}
// Function to display the fetched animal name
async function displayAnimalName() {
    let animalName = await fetchRandomAnimal();
    result = animalName;
    let keyWordElement = document.querySelector("#key-word");
    keyWordElement.textContent = animalName; // Replace "Random word" with the fetched animal name
}

// Function to handle the visibility of different cards/cards
function toggleVisability() {
    let previousPageNumber = currentPageNumber;
    cards[currentPageNumber].classList.remove("card--visable");
    cards[nextPageNumber].classList.add("card--visable");
    currentPageNumber++;
    nextPageNumber++;

    if (currentPageNumber === 2) {
        // Display the animal name when the third page (page number 2) is shown
        displayAnimalName();
    } else if (currentPageNumber === 3 && previousPageNumber === 2) {
        // Start the canvas drawing timer only when moving from the third page (page number 2) to the fourth page (page number 3)
        startTimer();
    }
}

// Adding click event listeners to buttons to handle page visibility changes
function startTimer() {
    if (secondsToDraw > 0) {
        const counter = document.querySelector("#counter");
        secondsToDraw -= 1;
        counter.textContent = secondsToDraw;
        setTimeout(startTimer, 1000); // Call countdown again after 1 second
    } else {
        canDraw = false;
        saveCanvasImage();
        displayGalleryImages();
        form.classList.add("form--visable");
        cards[currentPageNumber].classList.add("card--content-positioning");
    }
}

// Function to convert canvas content to an image URL and store it in the array
function saveCanvasImage() {
    if (canvasEl.getContext) {
        var canvasImageURL = canvasEl.toDataURL("image/png");
        canvasImgUrlList.push(canvasImageURL); // Add the image URL to the array
        localStorage.setItem(
            "canvasImgUrlList",
            JSON.stringify(canvasImgUrlList)
        ); // Save to localStorage
    }
}
// Function to display images in the gallery
function displayGalleryImages() {
    const galleryGrid = document.querySelector(".gallery-grid"); // Assuming you have a div with id 'gallery' for the gallery

    galleryGrid.innerHTML = ""; // Clear previous images
    // Loop through the array and create image elements to add to the gallery
    for (var i = 0; i < canvasImgUrlList.length; i++) {
        var img = document.createElement("img");
        img.src = canvasImgUrlList[i];
        galleryGrid.appendChild(img);
    }
}
function updatePreviousImagesToGallery() {
    if (localStorage.getItem("canvasImgUrlList")) {
        canvasImgUrlList = JSON.parse(localStorage.getItem("canvasImgUrlList"));
        displayGalleryImages(); // Display images if any are saved in localStorage
    }
}

// winning condition
function compareInputToApi() {
    if (userInput.value.toLowerCase() === result.toLowerCase()) {
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
    loosingConditionMessage.innerText = `Wrong! The correct answer is ${result}!`;
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
    compareInputToApi();
    form.reset();
});

for (let button of buttons) {
    button.addEventListener("click", toggleVisability);
}

updatePreviousImagesToGallery();
