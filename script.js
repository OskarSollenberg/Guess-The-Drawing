import { fetchRandomAnimal } from "./api.js";
import * as canvas from "./canvas.js";

// Cards / Forms / Inputs
const clickSound = document.getElementById("clickSound");
const cards = document.querySelectorAll(".card"); // All cards/pages saved in an array
const inputContentWrapper = document.querySelector(".input__content-wrapper"); // The form that displays where the user can input guess
// const formGridRow = document.querySelector(".card__grid-wrapper");
const userInput = document.querySelector(".input"); // To store the user guess/input into a variable
const cardInformationCanvas = document.querySelector(
  "#card-infromation-canvas"
);

// Buttons
const nextPageButtons = document.querySelectorAll(".btn__next-page"); // All buttons that take you to the next card/page
const submitGuessBtn = document.querySelector(".btn__submit-guess"); // The button to submit guess
const playAgainBtn = document.querySelector(".btn__play-again");

// Winning / Loosing conditions
const conditionsWrapperEl = document.querySelector(".condition__wrapper");
const conditionStatusEl = document.querySelector(".condition__status");
const conditionMessageEl = document.querySelector(".condition__message");

// lettter in the Alphabet
const lettersInAlphabet = /^[a-z]+$/;

let randomAnimal; // Varible to store the API's random animal
let secondsLeftToDraw = 30; // How many seconds the player should have to draw on the canvas
let currentPageNumber = 0; // What card/page the user is currently on
let nextPageNumber = currentPageNumber + 1; // The page number to be displayed next

let galleryItemList = []; // Array containing all the image-URL's saved to local storage

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
  cardInformationCanvas.textContent = "Nice drawing!!";
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
  clickSound.play();
  cards[currentPageNumber].classList.remove("card--visible");
  cards[nextPageNumber].classList.add("card--visible");
  currentPageNumber++;
  nextPageNumber++;
  updateContentBasedOnPageNumber();
}

//This function saves the canvas-URL to an array called "galleryItemList" in the local storage
function saveCanvasToLocalStorage() {
  let objectInfo = {
    url: "",
    animal: "",
  };
  let currentCanvasUrl = canvas.getImageUrl();

  objectInfo.url = currentCanvasUrl;
  objectInfo.animal = randomAnimal;
  galleryItemList.push(objectInfo);

  // galleryItemList.push(currentCanvasUrl);

  localStorage.setItem("galleryItemList", JSON.stringify(galleryItemList));
}

// This function removes all the images in the image-gallery and then creates new image-elements for every image-Url we have stored in local storage.
function displayGalleryImages() {
  const galleryWrapper = document.querySelector(".gallery-wrapper");

  galleryWrapper.innerHTML = "";

  for (let galleryItem of galleryItemList) {
    let galleryImg = document.createElement("img");
    let galleryText = document.createElement("p");
    let galleryContentWrapper = document.createElement("div");
    galleryContentWrapper.classList.add("gallery-content-wrapper");

    galleryImg.src = galleryItem.url;
    galleryText.textContent = galleryItem.animal;
    galleryWrapper.appendChild(galleryContentWrapper);

    galleryContentWrapper.appendChild(galleryImg);
    galleryContentWrapper.appendChild(galleryText);
  }
}

// This function checkes if there are any previously drawn images that should be displayed in the image-gallery
function checkForPrevSavedCanvasImages() {
  if (localStorage.getItem("galleryItemList")) {
    galleryItemList = JSON.parse(localStorage.getItem("galleryItemList"));
  }
}
// This is the winning condition
function showWinningCondition() {
  conditionStatusEl.innerText = "Correct!";
  conditionMessageEl.innerText = "You are the best!";
  displayGalleryImages();
}
// This is the loosing condition
function showLosingCondition() {
  conditionStatusEl.innerText = "Wrong!";
  conditionMessageEl.innerText = `The correct answer is ${randomAnimal}!`;
  displayGalleryImages();
}
// This function checkes if the user have guessed the correct animal and calls for function to display winning or loosing condition
function compareGuessToAnswer() {
  if (userInput.value.toLowerCase() === randomAnimal.toLowerCase()) {
    showWinningCondition();
  } else {
    showLosingCondition();
  }
}

// Play again button that reloads the page
playAgainBtn.addEventListener("click", function () {
  clickSound.play();
  location.reload();
});

// Submit button for user to submit their guess
submitGuessBtn.addEventListener("click", function () {
  clickSound.play();
  let userGuess = userInput.value.toLowerCase();
  if (lettersInAlphabet.test(userGuess)) {
    inputContentWrapper.classList.remove("input__content-wrapper--visible");
    conditionsWrapperEl.classList.add("condition--visible");
    compareGuessToAnswer();
  } else {
    userInput.value = "";
  }
});

for (let nextPageButton of nextPageButtons) {
  nextPageButton.addEventListener("click", changePage);
}

// Initial redering
checkForPrevSavedCanvasImages();
displayGalleryImages();

// Call touchhandler function when initializing your game
canvas.initTouchHandlers();
