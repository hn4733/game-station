const canvas = document.getElementById("penpenCanvas");
const ctx = canvas.getContext("2d");

// Active set to TRUE to begin the GAME but will be set to FALSE when it's GAME OVER
let active = true;
// Counting the SCORE
let count = 0;

// Declaring assets for GAME
const penguin = new Image();
const iceberg = new Image();
const iceTop = new Image();
const iceBottom = new Image();
penguin.src = "./img/penguin.png";
iceberg.src = "./img/iceberg.jpg";
iceTop.src = "./img/ice-top.png";
iceBottom.src = "./img/ice-bottom.png";

// Initial position of penguin
let penguinFloat = 250;
// Coordinates of ICE
let coordinates = [
	{
		x: canvas.width,
		y: 320
	}
];
// Coordinates of Background
let coordinatesBackground = [
	{
		x: 0,
		y: 0
	}
];
// Event Listener of hitting the SPACE bar
document.addEventListener("keydown", e => {
	if (e.code === "Space") {
		penguinFloat -= 15;
	}
});

// Function to draw on the CANVAS
const draw = () => {
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, 600, 400);
	ctx.drawImage(penguin, 50, penguinFloat);

	const gap = 230;
	let constant = iceBottom.height + gap;
	penguinFloat += 1;
	// Calculate the floor touch
	const touchFloor = canvas.height - penguin.height;
	// Y coordinates of Penguin
	const touchTopSide = penguinFloat;
	// Width of penguin - the 60 is manually adjusted to make it look right
	const topSideTouch = 50 + penguin.width;

	// GAME OVER screen content
	const gameOverScreen = () => {
		active = false;
		const overlay = document.getElementById("overlay-wrapper");
		const content = `
				<div id="game-over-wrapper">
					<div id="content-wrapper">
						<h4>Ahhhh nooo. Pengiun didn't make it :(</h4>
						<Button id="button">Play again!</Button>
					</div>
				</div>
			`;

		overlay.insertAdjacentHTML("beforeend", content);
	};

	coordinates.forEach((coordinate, i) => {
		ctx.drawImage(iceTop, coordinate.x, coordinate.y - constant);
		ctx.drawImage(iceBottom, coordinate.x, coordinate.y);

		coordinate.x--;

		if (coordinate.x - iceTop.width === canvas.width / 2 - iceTop.width / 2) {
			coordinates.push({
				x: canvas.width,
				y: 320 + Math.floor(Math.random() * iceBottom.height)
			});
		}

		if (
			// between the first coordinate x, which is the start of the ice TO the end of the ice
			(touchTopSide <= iceTop.height + coordinate.y - constant &&
				(topSideTouch >= coordinate.x &&
					topSideTouch <= coordinate.x + iceTop.width)) ||
			(touchTopSide + penguin.height >= coordinate.y &&
				(topSideTouch >= coordinate.x &&
					topSideTouch <= coordinate.x + iceBottom.width))
		) {
			gameOverScreen();
		}

		if (
			penguinFloat + penguin.height <= coordinate.y &&
			penguinFloat >= coordinate.y - constant + iceTop.height &&
			topSideTouch === coordinate.x
		) {
			count++;
			console.log(count);
			const score = document.getElementById("score");
			const scoreContent = `
				<h3>Score: ${count}</h3>
			`;

			score.innerHTML = scoreContent;
		}
	});

	// Penguin touching either the TOP or the Bottom leads to GAME OVER
	if (touchTopSide <= iceberg.height + 0 || touchFloor === penguinFloat) {
		gameOverScreen();
	}

	// Moving background
	coordinatesBackground.forEach((bgV, bgI) => {
		ctx.drawImage(iceberg, bgV.x, bgV.y);

		if (bgV.x === 0 || bgV.x === 0.5999999999886835) {
			coordinatesBackground.push({
				x: canvas.width,
				y: 0
			});
		}

		bgV.x -= 0.6;
	});

	if (active) {
		requestAnimationFrame(draw);
	}
};

// Start button event listener
const overlayWrapper = document.getElementById("overlay-wrapper");
const startButton = document.getElementById("button");
if (startButton) {
	startButton.addEventListener("click", () => {
		// Remove the button from within the overlay wrapper DIV
		overlayWrapper.innerHTML = "";
		// Draw the GAME
		draw();
	});
}

// Looking out for changes in the DOM.
const replaceConfig = { attributes: true, childList: true, subtree: true };
let replaceCallback = (mutationsList, observer) => {
	for (var mutation of mutationsList) {
		if (mutation.type == "childList") {
			const startButton = document.getElementById("button");
			if (startButton) {
				startButton.addEventListener("click", () => {
					startButton.remove();
					location.reload();
				});
			}
		}
	}
};
let replaceObserver = new MutationObserver(replaceCallback);
if (overlayWrapper) replaceObserver.observe(overlayWrapper, replaceConfig);
