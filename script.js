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
