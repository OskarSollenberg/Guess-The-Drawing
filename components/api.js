// This function fetches a random animal name from the API

export async function fetchRandomAnimal() {
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
export async function loadAnimal() {
    const animalWordEl = document.querySelector("#random-animal");
    const loader = document.querySelector(".loader");
    const animal = await fetchRandomAnimal();
    animalWordEl.textContent = animal;
    loader.classList.remove("loader--visible");
}
