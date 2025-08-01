// Show game instructions on page load
window.addEventListener("load", () => {
    alert("🧠 Welcome to the Simon Game!\n\n🔹 Watch the sequence of flashing colors.\n🔹 Repeat the same sequence by clicking the buttons.\n🔹 Each level adds one more color to remember.\n\n💥 Make a mistake, and the game is over!\n\n🎮 Press 'Start' to begin.");
});


// Initialize game sequence and user sequence arrays
let gameSeq = [];
let userSeq = [];

// Define the color buttons used in the game
let btns = ["yellow", "purple", "green", "red"];

// Game state variables
let started = false;          // To check if the game has started
let level = 0;                // Track current level
let acceptingInput = false;  // To prevent input during sequence playback
let soundEnabled = true;     // Enable/disable sound

// Get high score from local storage (or 0 if none)
let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("high-score").innerText = highScore;

// Select the h2 element for showing the level or game over message
let h2 = document.querySelector("h2");

// Load sound effects for each color and wrong answer
let sounds = {
    yellow: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
    red: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
    green: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
    purple: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
    wrong: new Audio("https://www.soundjay.com/button/sounds/button-10.mp3")
};

// Handle Sound Toggle Button
document.getElementById("sound-toggle").addEventListener("click", () => {
    soundEnabled = !soundEnabled;  // Toggle state

    // Update button label
    const soundBtn = document.getElementById("sound-toggle");
    soundBtn.innerText = soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
});

// Start the game with keypress or start button
function startGame() {
    if (!started) {
        started = true;
         // Hide the button again during the game
        const startBtn = document.getElementById("start-btn");
        startBtn.style.display = "none";
        startBtn.innerText = "▶️ Start"; // Reset label for next time
        levelUp();
    }
}

document.addEventListener("keypress", startGame);
document.getElementById("start-btn").addEventListener("click", startGame);


// Function to flash the button (visual feedback)
function btnFlash(btn) {
    btn.classList.add("flash");
    btn.classList.add("pressed");

    // Remove flash effect after a short delay
    setTimeout(() => {
        btn.classList.remove("flash");
        btn.classList.remove("pressed");
    }, 200);
}

// Function to play the full game sequence (flashes each button in order)
function playSequence() {
    acceptingInput = false; // Disable input while showing sequence
    let i = 0;

    let interval = setInterval(() => {
        let color = gameSeq[i]; // Get the current color from the sequence
        let btn = document.querySelector(`.${color}`); // Select the button

        btnFlash(btn);               // Flash the button
        if (soundEnabled) sounds[color].play(); // Play sound if enabled

        i++;
        if (i >= gameSeq.length) {
            clearInterval(interval);   // End sequence playback
            acceptingInput = true;     // Allow user input again
        }
    }, 550); // Time between flashes
}

// Function to go to the next level
function levelUp() {
    userSeq = [];        // Reset user sequence for this level
    level++;             // Increase level
    h2.innerText = `Level ${level}`; // Update heading

    // Add glowing animation to the level heading
    h2.classList.add("level-up-effect");
    setTimeout(() => h2.classList.remove("level-up-effect"), 1000);

    // Pick a random color and add to the game sequence
    let randomIdx = Math.floor(Math.random() * 4);
    let randomColor = btns[randomIdx];
    gameSeq.push(randomColor);

    // Play the updated sequence after a short delay
    setTimeout(playSequence, 300);
}

// Function to check if the user pressed the right button
function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        // If current input is correct, check if sequence is complete
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp,100); // Move to next level
        }
    } else {
        // Wrong input — game over
        if (soundEnabled) sounds.wrong.play(); // Play game over sound

        // Show Game Over message
        h2.innerHTML = `❌ Game Over! Your score was <b>${level}</b><br>Press any key to restart.`;

        // Add red flash to background
        document.body.classList.add("game-over");
        setTimeout(() => {
            document.body.classList.remove("game-over");
        }, 400);

        // Vibrate device with a double buzz (if supported)
        if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200]);
        }

        // Update high score if current level is higher
        if (level > highScore) {
            highScore = level;
            localStorage.setItem("highScore", highScore);
            document.getElementById("high-score").innerText = highScore;
        }

        // Reset game state
        reset();
    }
}

// Function to handle button clicks by the user
function btnPress() {
    if (!acceptingInput) return; // Ignore clicks during sequence playback

    let btn = this;
    let userColor = btn.getAttribute("id"); // Get color of clicked button
    userSeq.push(userColor);                // Add to user's input sequence
    btnFlash(btn);                          // Flash the button

    if (soundEnabled) sounds[userColor].play(); // Play sound

    checkAns(userSeq.length - 1); // Check answer so far

    // Short vibration for feedback (if supported)
    if ("vibrate" in navigator) {
        navigator.vibrate(50);
    }
}

// Add click event to all buttons
let allBtns = document.querySelectorAll(".btn");
for (let btn of allBtns) {
    btn.addEventListener("click", btnPress);
}

// Function to reset the game to its initial state
function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    acceptingInput = false;

    // Show the Start button again and change its label to "Restart"
    const startBtn = document.getElementById("start-btn");
    startBtn.innerText = "🔁 Restart";
    startBtn.style.display = "inline-block";
}


let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    let now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault(); // Block double-tap zoom
    }
    lastTouchEnd = now;
}, false);


