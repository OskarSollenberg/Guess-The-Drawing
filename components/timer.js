export function initTimer(callback) {
    const counter = document.querySelector("#counter");
    let secondsLeftToDraw = 2;
    counter.textContent = secondsLeftToDraw;

    function startTimer() {
        counter.textContent = secondsLeftToDraw;

        if (secondsLeftToDraw === 0) {
            counter.textContent = "Time's up!";
            callback();
        } else {
            secondsLeftToDraw -= 1;
            setTimeout(startTimer, 1000);
        }
    }
    startTimer();
}
