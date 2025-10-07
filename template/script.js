// ===========================
// Global State & DOM Elements
// ===========================

let currentTab = 'stopwatch';

// Stopwatch State
let stopwatchRunning = false;
let stopwatchStartTime = 0;
let stopwatchElapsed = 0;
let stopwatchInterval = null;
let lapsCount = 0;

// Countdown State
let countdownRunning = false;
let countdownTime = 0;
let countdownInitialTime = 0;
let countdownInterval = null;

// DOM Elements - Tabs
const tabButtons = document.querySelectorAll('.tab-btn');
const stopwatchSection = document.getElementById('stopwatch-section');
const countdownSection = document.getElementById('countdown-section');

// DOM Elements - Stopwatch
const stopwatchDisplay = document.getElementById('stopwatch-display');
const stopwatchStartBtn = document.getElementById('stopwatch-start');
const stopwatchLapBtn = document.getElementById('stopwatch-lap');
const stopwatchResetBtn = document.getElementById('stopwatch-reset');
const lapsList = document.getElementById('laps-list');

// DOM Elements - Countdown
const countdownDisplay = document.getElementById('countdown-display');
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');
const countdownStartBtn = document.getElementById('countdown-start');
const countdownResetBtn = document.getElementById('countdown-reset');
const presetButtons = document.querySelectorAll('.preset-btn');
const timesUpMessage = document.getElementById('timesup-message');

// ===========================
// Tab System
// ===========================

function switchTab(tabName) {
    currentTab = tabName;
    
    // Update active tab button
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Show/hide sections
    if (tabName === 'stopwatch') {
        stopwatchSection.classList.add('active');
        countdownSection.classList.remove('active');
    } else {
        stopwatchSection.classList.remove('active');
        countdownSection.classList.add('active');
    }
    
    // Save to localStorage
    localStorage.setItem('activeTab', tabName);
}

// Tab button event listeners
tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTab(btn.dataset.tab);
    });
});

// ===========================
// Stopwatch Functions
// ===========================

function formatStopwatchTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
}

function updateStopwatchDisplay() {
    const currentTime = Date.now() - stopwatchStartTime + stopwatchElapsed;
    stopwatchDisplay.textContent = formatStopwatchTime(currentTime);
}

function startStopwatch() {
    stopwatchRunning = true;
    stopwatchStartTime = Date.now();
    
    stopwatchInterval = setInterval(updateStopwatchDisplay, 10);
    
    // Update UI
    stopwatchStartBtn.innerHTML = `
        <svg class="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Pause
    `;
    stopwatchStartBtn.classList.add('pause');
    stopwatchLapBtn.disabled = false;
    
    // Save state
    saveStopwatchState();
}

function pauseStopwatch() {
    stopwatchRunning = false;
    clearInterval(stopwatchInterval);
    stopwatchElapsed += Date.now() - stopwatchStartTime;
    
    // Update UI
    stopwatchStartBtn.innerHTML = `
        <svg class="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start
    `;
    stopwatchStartBtn.classList.remove('pause');
    
    // Save state
    saveStopwatchState();
}

function resetStopwatch() {
    stopwatchRunning = false;
    stopwatchElapsed = 0;
    clearInterval(stopwatchInterval);
    
    stopwatchDisplay.textContent = '00:00:00.00';
    
    // Update UI
    stopwatchStartBtn.innerHTML = `
        <svg class="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start
    `;
    stopwatchStartBtn.classList.remove('pause');
    stopwatchLapBtn.disabled = true;
    
    // Clear laps
    lapsCount = 0;
    lapsList.innerHTML = '';
    
    // Clear state
    localStorage.removeItem('stopwatchState');
}

function recordLap() {
    lapsCount++;
    const currentTime = Date.now() - stopwatchStartTime + stopwatchElapsed;
    
    const lapItem = document.createElement('div');
    lapItem.className = 'lap-item';
    lapItem.innerHTML = `
        <span class="lap-number">Lap ${lapsCount}</span>
        <span class="lap-time">${formatStopwatchTime(currentTime)}</span>
    `;
    
    // Insert at the beginning
    lapsList.insertBefore(lapItem, lapsList.firstChild);
    
    // Keep only last 10 laps
    while (lapsList.children.length > 10) {
        lapsList.removeChild(lapsList.lastChild);
    }
    
    // Save laps
    saveLaps();
}

// Event Listeners - Stopwatch
stopwatchStartBtn.addEventListener('click', () => {
    if (stopwatchRunning) {
        pauseStopwatch();
    } else {
        startStopwatch();
    }
});

stopwatchResetBtn.addEventListener('click', resetStopwatch);
stopwatchLapBtn.addEventListener('click', recordLap);

// ===========================
// Countdown Functions
// ===========================

function formatCountdownTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateCountdownDisplay() {
    countdownDisplay.textContent = formatCountdownTime(countdownTime);
    
    if (countdownTime <= 0) {
        finishCountdown();
    } else {
        countdownTime--;
    }
}

function getInputTime() {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    return hours * 3600 + minutes * 60 + seconds;
}

function setInputTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    hoursInput.value = hours;
    minutesInput.value = minutes;
    secondsInput.value = seconds;
}

function startCountdown() {
    if (!countdownRunning) {
        // Get time from inputs
        const inputTime = getInputTime();
        
        if (inputTime === 0) {
            alert('Please set a time for the countdown!');
            return;
        }
        
        countdownTime = inputTime;
        countdownInitialTime = inputTime;
    }
    
    countdownRunning = true;
    countdownInterval = setInterval(updateCountdownDisplay, 1000);
    
    // Update UI
    countdownStartBtn.innerHTML = `
        <svg class="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Pause
    `;
    countdownStartBtn.classList.add('pause');
    
    // Disable inputs
    hoursInput.disabled = true;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    
    // Hide times up message
    timesUpMessage.classList.remove('show');
    countdownSection.querySelector('.timer-card').classList.remove('countdown-finished');
    
    // Save state
    saveCountdownState();
}

function pauseCountdown() {
    countdownRunning = false;
    clearInterval(countdownInterval);
    
    // Update UI
    countdownStartBtn.innerHTML = `
        <svg class="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start
    `;
    countdownStartBtn.classList.remove('pause');
    
    // Save state
    saveCountdownState();
}

function resetCountdown() {
    countdownRunning = false;
    clearInterval(countdownInterval);
    countdownTime = countdownInitialTime;
    
    // Update display
    countdownDisplay.textContent = formatCountdownTime(countdownTime);
    
    // Update UI
    countdownStartBtn.innerHTML = `
        <svg class="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start
    `;
    countdownStartBtn.classList.remove('pause');
    
    // Enable inputs
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    
    // Hide times up message
    timesUpMessage.classList.remove('show');
    countdownSection.querySelector('.timer-card').classList.remove('countdown-finished');
    
    // Reset to initial values
    setInputTime(countdownInitialTime);
    
    // Clear state
    localStorage.removeItem('countdownState');
}

function finishCountdown() {
    countdownRunning = false;
    clearInterval(countdownInterval);
    countdownTime = 0;
    
    // Update display
    countdownDisplay.textContent = '00:00:00';
    
    // Show times up message
    timesUpMessage.classList.add('show');
    countdownSection.querySelector('.timer-card').classList.add('countdown-finished');
    
    // Play sound (if available)
    playAlertSound();
    
    // Update UI
    countdownStartBtn.innerHTML = `
        <svg class="btn-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
        </svg>
        Start
    `;
    countdownStartBtn.classList.remove('pause');
    
    // Enable inputs
    hoursInput.disabled = false;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
}

function playAlertSound() {
    // Create audio context for beep sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio not supported');
    }
}

// Event Listeners - Countdown
countdownStartBtn.addEventListener('click', () => {
    if (countdownRunning) {
        pauseCountdown();
    } else {
        startCountdown();
    }
});

countdownResetBtn.addEventListener('click', resetCountdown);

// Preset buttons
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const seconds = parseInt(btn.dataset.seconds);
        setInputTime(seconds);
        countdownInitialTime = seconds;
        countdownTime = seconds;
        countdownDisplay.textContent = formatCountdownTime(seconds);
    });
});

// Input validation
[hoursInput, minutesInput, secondsInput].forEach(input => {
    input.addEventListener('input', () => {
        const max = parseInt(input.max);
        const min = parseInt(input.min);
        let value = parseInt(input.value);
        
        if (value > max) input.value = max;
        if (value < min) input.value = min;
    });
    
    input.addEventListener('change', () => {
        const totalSeconds = getInputTime();
        countdownTime = totalSeconds;
        countdownInitialTime = totalSeconds;
        countdownDisplay.textContent = formatCountdownTime(totalSeconds);
    });
});

// ===========================
// Keyboard Shortcuts
// ===========================

document.addEventListener('keydown', (e) => {
    // Ignore if typing in input
    if (e.target.tagName === 'INPUT') return;
    
    switch (e.key.toLowerCase()) {
        case ' ':
            e.preventDefault();
            if (currentTab === 'stopwatch') {
                stopwatchStartBtn.click();
            } else {
                countdownStartBtn.click();
            }
            break;
            
        case 'r':
            e.preventDefault();
            if (currentTab === 'stopwatch') {
                stopwatchResetBtn.click();
            } else {
                countdownResetBtn.click();
            }
            break;
            
        case 'l':
            e.preventDefault();
            if (currentTab === 'stopwatch' && !stopwatchLapBtn.disabled) {
                stopwatchLapBtn.click();
            }
            break;
    }
});

// ===========================
// LocalStorage Persistence
// ===========================

function saveStopwatchState() {
    const state = {
        running: stopwatchRunning,
        elapsed: stopwatchElapsed,
        startTime: stopwatchStartTime
    };
    localStorage.setItem('stopwatchState', JSON.stringify(state));
}

function loadStopwatchState() {
    const saved = localStorage.getItem('stopwatchState');
    if (saved) {
        const state = JSON.parse(saved);
        stopwatchElapsed = state.elapsed || 0;
        
        if (state.running) {
            // Calculate adjusted elapsed time
            const now = Date.now();
            const timeSinceStart = now - state.startTime;
            stopwatchElapsed = state.elapsed + timeSinceStart;
            stopwatchDisplay.textContent = formatStopwatchTime(stopwatchElapsed);
        } else {
            stopwatchDisplay.textContent = formatStopwatchTime(stopwatchElapsed);
        }
    }
}

function saveLaps() {
    const laps = [];
    lapsList.querySelectorAll('.lap-item').forEach(item => {
        laps.push({
            number: item.querySelector('.lap-number').textContent,
            time: item.querySelector('.lap-time').textContent
        });
    });
    localStorage.setItem('stopwatchLaps', JSON.stringify(laps));
}

function loadLaps() {
    const saved = localStorage.getItem('stopwatchLaps');
    if (saved) {
        const laps = JSON.parse(saved);
        laps.forEach(lap => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">${lap.number}</span>
                <span class="lap-time">${lap.time}</span>
            `;
            lapsList.appendChild(lapItem);
        });
        
        // Update laps count
        if (laps.length > 0) {
            const lastLapNumber = laps[0].number.match(/\d+/);
            if (lastLapNumber) {
                lapsCount = parseInt(lastLapNumber[0]);
            }
        }
    }
}

function saveCountdownState() {
    const state = {
        running: countdownRunning,
        time: countdownTime,
        initialTime: countdownInitialTime
    };
    localStorage.setItem('countdownState', JSON.stringify(state));
}

function loadCountdownState() {
    const saved = localStorage.getItem('countdownState');
    if (saved) {
        const state = JSON.parse(saved);
        countdownInitialTime = state.initialTime || 0;
        countdownTime = state.time || 0;
        
        setInputTime(countdownInitialTime);
        countdownDisplay.textContent = formatCountdownTime(countdownTime);
    }
}

// ===========================
// Initialization
// ===========================

function init() {
    // Load saved tab
    const savedTab = localStorage.getItem('activeTab') || 'stopwatch';
    switchTab(savedTab);
    
    // Load states
    loadStopwatchState();
    loadLaps();
    loadCountdownState();
    
    console.log('Timer Application initialized successfully! 🎉');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
