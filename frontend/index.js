import { backend } from "declarations/backend";

let isPouring = false;
let gameActive = false;

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

async function pourWater() {
    if (!gameActive || isPouring) return;
    
    isPouring = true;
    waterStream.style.height = '150px';
    
    try {
        const result = await backend.pourWater(0.1);
        currentWeightDisplay.textContent = `Current Weight: ${result.weight.toFixed(2)}`;
        water.style.height = `${(result.weight / result.targetWeight) * 100}%`;
        
        if (result.isWin) {
            gameActive = false;
            message.className = 'message success';
            message.textContent = 'Congratulations! You hit the target weight!';
        } else if (result.weight > result.targetWeight + 0.1) {
            gameActive = false;
            message.className = 'message error';
            message.textContent = 'Too much water! Game Over!';
        }
    } catch (error) {
        message.className = 'message error';
        message.textContent = 'Error updating game';
    } finally {
        setTimeout(() => {
            waterStream.style.height = '0';
            isPouring = false;
        }, 300);
    }
}

startButton.addEventListener('click', startNewGame);
pitcher.addEventListener('click', pourWater);
