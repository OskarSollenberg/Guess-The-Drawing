let isDrawing = false;
let canDraw = true;
let lastXPos = 0;
let lastYPos = 0;

function fixCanvasScaling() {
    context.scale(devicePixelRatio, devicePixelRatio);
    context.lineWidth = 2; // Set the line width to make it thicker
    context.strokeStyle = "#000"; // Set the line color to black
    context.lineJoin = "round"; // Round the corners when two lines meet
    context.lineCap = "round"; // Round the ends of the lines
    let heightRatio = 0.7;
    canvasEl.height = canvasEl.width * heightRatio;
}

canvasEl.addEventListener("pointerdown", function (e) {
    isDrawing = true;
    lastXPos = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
    lastYPos = ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
    context.beginPath();

    context.moveTo(lastXPos, lastYPos);
});
canvasEl.addEventListener("pointermove", function (e) {
    if (canDraw && isDrawing) {
        const x = ((e.offsetX * canvasEl.width) / canvasEl.clientWidth) | 0;
        const y = ((e.offsetY * canvasEl.height) / canvasEl.clientHeight) | 0;
        context.quadraticCurveTo(
            lastXPos,
            lastYPos,
            (lastXPos + x) / 2,
            (lastYPos + y) / 2
        );
        lastXPos = x;
        lastYPos = y;
        context.stroke();
    }
});
canvasEl.addEventListener("pointerup", function () {
    if (isDrawing) {
        context.lineTo(lastXPos, lastYPos);
        context.stroke();
        context.closePath();
        isDrawing = false;
    }
});

fixCanvasScaling();
