import { backend } from "declarations/backend";

let isPouring = false;
let gameActive = false;
let pourInterval = null;
let startPourTime = null;
let animationFrameId = null;

const pitcher = document.getElementById('pitcher');
const waterStream = document.getElementById('water-stream');
const water = document.getElementById('water');
const startButton = document.getElementById('start-game');
const message = document.getElementById('message');
const loading = document.getElementById('loading');
const targetWeightDisplay = document.getElementById('target-weight');
const currentWeightDisplay = document.getElementById('current-weight');

async function startNewGame() {
    loading.classList.remove('hidden');
    message.className = 'message';
    message.textContent = '';
    
    try {
        const targetWeight = await backend.startNewGame();
        targetWeightDisplay.textContent = `Target Weight: ${targetWeight.toFixed(2)}`;
        currentWeightDisplay.textContent = 'Current Weight: 0.00';
        water.style.height = '0%';
        gameActive = true;
    } catch (error) {
        message.className = 'message error';
        message.textContent = 'Error starting game';
    } finally {
        loading.classList.add('hidden');
    }
}

function calculatePourRate(elapsedTime) {
    // Start with base rate and increase exponentially
    const baseRate = 0.05;
    const maxRate = 0.5;
    const accelerationFactor = 1.005;
    return Math.min(baseRate * Math.pow(accelerationFactor, elapsedTime), maxRate);
}

async function updateWater() {
    if (!gameActive || !isPouring) return;

    const elapsedTime = Date.now() - startPourTime;
    const pourAmount = calculatePourRate(elapsedTime);

    try {
        const result = await backend.pourWater(pourAmount);
        currentWeightDisplay.textContent = `Current Weight: ${result.weight.toFixed(2)}`;
        water.style.height = `${(result.weight / result.targetWeight) * 100}%`;
        
        if (result.isWin) {
            stopPouring();
            message.className = 'message success';
            message.textContent = 'Congratulations! You hit the target weight!';
            gameActive = false;
        } else if (!result.gameActive) {
            stopPouring();
            message.className = 'message error';
            message.textContent = 'Too much water! Game Over!';
            gameActive = false;
        } else {
            animationFrameId = requestAnimationFrame(updateWater);
        }
    } catch (error) {
        stopPouring();
        message.className = 'message error';
        message.textContent = 'Error updating game';
    }
}

function startPouring() {
    if (!gameActive || isPouring) return;
    isPouring = true;
    startPourTime = Date.now();
    waterStream.style.height = '150px';
    waterStream.style.opacity = '1';
    updateWater();
}

function stopPouring() {
    isPouring = false;
    waterStream.style.height = '0';
    waterStream.style.opacity = '0';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

startButton.addEventListener('click', startNewGame);
pitcher.addEventListener('mousedown', startPouring);
pitcher.addEventListener('mouseup', stopPouring);
pitcher.addEventListener('mouseleave', stopPouring);
pitcher.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startPouring();
});
pitcher.addEventListener('touchend', (e) => {
    e.preventDefault();
    stopPouring();
});
