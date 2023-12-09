export function initAnswer() {
    const conditionStatusEl = document.querySelector(".condition__status");
    const conditionMessageEl = document.querySelector(".condition__message");
    const userInput = document.querySelector(".input"); // To store the user guess/input into a variable
    const randomAnimal = document.querySelector("#random-animal").innerText;

    if (userInput.value.toLowerCase() === randomAnimal.toLowerCase()) {
        conditionStatusEl.innerText = "Correct!";
        conditionMessageEl.innerText = "You are the best!";
    } else {
        conditionStatusEl.innerText = "Wrong!";
        conditionMessageEl.innerText = `The correct answer is ${randomAnimal}!`;
    }
}
