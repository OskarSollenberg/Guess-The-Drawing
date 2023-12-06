"use strict";

let result;
// const wordDisplay = document.querySelector("#word-display"); //define where the word will be displayed,add some div to the html
// const startButton = document.querySelector(".start-game"); //define the start button

document.addEventListener("DOMContentLoaded", (event) => {
    if (localStorage.getItem("canvasImages")) {
        canvasImages = JSON.parse(localStorage.getItem("canvasImages"));
        displayGalleryImages(); // Display images if any are saved in localStorage
    }
});

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

const cards = document.querySelectorAll(".card");
const cardButtons = document.querySelectorAll(".button");
let currentPageNumber = 0;
let nextPageNumber = currentPageNumber + 1;
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
for (let button of cardButtons) {
    button.addEventListener("click", toggleVisability);
}

const canvasEl = document.querySelector("#canvas");
const context = canvasEl.getContext("2d");
let isDrawing = false;
let canDraw = true;
let lastX = 0;
let lastY = 0;
let seconds = 3;
let rect = canvasEl.getBoundingClientRect();

// canvasEl.width = rect.width * devicePixelRatio;
// canvasEl.height = rect.height * devicePixelRatio;
context.scale(devicePixelRatio, devicePixelRatio);
context.lineWidth = 2; // Set the line width to make it thicker
context.strokeStyle = "#000"; // Set the line color to black
context.lineJoin = "round"; // Round the corners when two lines meet
context.lineCap = "round"; // Round the ends of the lines
let heightRatio = 0.7;
canvasEl.height = canvasEl.width * heightRatio;

/* timer
    setInterval method calls a function at specified intervals.
    It takes as parameters:
    1) a function to be executed every delay milliseconds and
    2) milliseconds
    it returns an interval ID which identifies the interval
    and can be later removed by calling clearInterval() that takes
    as a parameter a function that serves as first parameter in
    setInterval() method.
*/

function startTimer() {
    if (seconds > 0) {
        seconds -= 1;
        document.querySelector("#counter").textContent = seconds;
        setTimeout(startTimer, 1000); // Call countdown again after 1 second
    } else {
        canDraw = false;
        saveCanvasImage();
        displayGalleryImages();
        form.classList.add("form--visable");
        cards[currentPageNumber].classList.add("card--content-positioning");
    }
}

canvasEl.addEventListener("pointerdown", function (e) {
    isDrawing = true;
    lastX = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
    lastY = ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
    context.beginPath();

    context.moveTo(lastX, lastY);
});
canvasEl.addEventListener("pointermove", function (e) {
    if (canDraw && isDrawing) {
        const x = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
        const y = ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
        context.quadraticCurveTo(
            lastX,
            lastY,
            (lastX + x) / 2,
            (lastY + y) / 2
        );
        lastX = x;
        lastY = y;
        context.stroke();
    }
});
canvasEl.addEventListener("pointerup", function () {
    if (isDrawing) {
        context.lineTo(lastX, lastY);
        context.stroke();
        context.closePath();
        isDrawing = false;
    }
});

// Comparing user input/guess and word from API

// let userInput = document.querySelector("#userInput");
// let submitGuessBtn = document.querySelector("#submitGuessBtn");
// let form = document.querySelector("#form");

// submitGuessBtn.addEventListener("click", function () {
//     let userInputValue = userInput.value;
//     console.log(userInputValue);

//     form.reset();
// });

// function compareInputwithApi {
//     if (userInputValue = animalName) {
//         let win = document.querySelector
//     }
// }

let canvasImages = []; // Array to store the URLs of canvas images
// Function to convert canvas content to an image URL and store it in the array
function saveCanvasImage() {
    var canvas = document.getElementById("canvas");
    if (canvas.getContext) {
        var canvasImageURL = canvas.toDataURL("image/png");
        canvasImages.push(canvasImageURL); // Add the image URL to the array
        localStorage.setItem("canvasImages", JSON.stringify(canvasImages)); // Save to localStorage
    }
}
// Function to display images in the gallery
function displayGalleryImages() {
    var gallery = document.getElementById("gallery"); // Assuming you have a div with id 'gallery' for the gallery
    var galleryGrid = document.querySelector(".gallery-grid"); // Assuming you have a div with id 'gallery' for the gallery

    galleryGrid.innerHTML = ""; // Clear previous images
    // Loop through the array and create image elements to add to the gallery
    for (var i = 0; i < canvasImages.length; i++) {
        var img = document.createElement("img");
        img.src = canvasImages[i];
        galleryGrid.appendChild(img);
    }
}

let userInput = document.querySelector("#userInput");
let submitGuessBtn = document.querySelector("#submitGuessBtn");
let form = document.querySelector("#form");

submitGuessBtn.addEventListener("click", function () {
    let userInputValue = userInput.value;
    console.log(userInputValue);
    compareInputToApi();
    form.reset();
});

// winning condition
function compareInputToApi() {
    if (userInput.value.toLowerCase() === result.toLowerCase()) {
        displayCorrect();
        playAgainButton();
    } else {
        displayWrong();
        playAgainButton();
    }
}
function displayCorrect() {
    form.style.display = "none";
    let col = document.querySelector(".col");
    let win = document.createElement("div");
    col.appendChild(win);
    win.className = "win-condition";
    win.innerText = "Correct!";
}
function displayWrong() {
    form.style.display = "none";
    let col = document.querySelector(".col");
    let wrong = document.createElement("div");
    col.appendChild(wrong);
    wrong.className = "win-condition";
    wrong.innerText = `Wrong! The correct answer is ${result}!`;
}
function playAgainButton() {
    let playAgainBtn = document.createElement("button");
    let col = document.querySelector(".col");
    col.appendChild(playAgainBtn);
    playAgainBtn.className = "button";
    playAgainBtn.innerText = "Play Again!";
    playAgainBtn.addEventListener("click", function () {
        location.reload();
    });
}
