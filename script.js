"use strict";

// const wordDisplay = document.querySelector("#word-display"); //define where the word will be displayed,add some div to the html
// const startButton = document.querySelector(".start-game"); //define the start button

async function fetchRandomAnimal() {
    const url = "https://animal-name-api.onrender.com/random-animal";
    const options = {
        method: "GET",
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result?.animal;
    } catch (error) {
        console.error(error);
    }
}
// Function to start the drawing phase
async function startDrawing() {
    let currentWord = await fetchRandomAnimal();
    //   wordDisplay.textContent = "Draw: " + currentWord;
    //   wordDisplay.style.display = "block"; // Show the word
    //   startButton.style.display = "none"; // Hide the start button

    //   setTimeout(() => {
    //     // Hide the word after 2 seconds
    //     wordDisplay.style.display = "none";
    //     canDraw = true;
    //     startTimer(); // Start the countdown timer
    //   }, 2000);
}

const pages = document.querySelectorAll(".card");
const pageButtons = document.querySelectorAll(".button");
let currentPageNumber = 0;

for (let button of pageButtons) {
    button.addEventListener("click", toggleVisability);
}
function toggleVisability() {
    pages[currentPageNumber].classList.remove("card--visable");
    pages[currentPageNumber + 1].classList.add("card--visable");
    currentPageNumber++;
}

const canvasEl = document.querySelector("#canvas");
const context = canvasEl.getContext("2d");
let isDrawing = false;
let canDraw = true;
let lastX = 0;
let lastY = 0;
let seconds = 21;
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
setInterval(function () {
    if (seconds <= 0) {
        canDraw = false;
    } else {
        seconds -= 1;
        document.querySelector("#counter").textContent = seconds;
    }
}, 1000);
canvasEl.addEventListener("pointerdown", function (e) {
    isDrawing = true;
    // const x = e.clientX - canvasEl.offsetLeft;
    // const y = e.clientY - canvasEl.offsetTop;
    //   const x = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
    //   const y = ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
    lastX = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
    lastY = ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
    context.beginPath();
    //   context.moveTo(x, y);
    context.moveTo(lastX, lastY);
});
canvasEl.addEventListener("pointermove", function (e) {
    if (canDraw && isDrawing) {
        // const x = e.clientX - canvasEl.offsetLeft;
        // const y = e.clientY - canvasEl.offsetTop;
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
        // context.lineTo(x, y);
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
