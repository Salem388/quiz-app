

// DOM Elements
const questionCount = document.querySelector(".question-count span");
const bulletsContainer = document.querySelector(".bottom .spans");
const questionArea = document.querySelector(".question-area");
const answersArea = document.querySelector(".answers-area");
const submitButton = document.querySelector(".submit");
const resultContainer = document.querySelector(".result");
const timeContainer = document.querySelector(".bottom .count-down");

// Variables
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let countdownInterval;

// Initialize Quiz Game
function initializeQuizGame() {
    fetchQuestions()
        .then((questions) => {
            const totalQuestions = questions.length;
            createBullets(totalQuestions);
            loadQuestion(questions[currentQuestionIndex], totalQuestions);
            startCountdown(45, totalQuestions);

            submitButton.onclick = function() {
                clearInterval(countdownInterval);
                startCountdown(45, totalQuestions);

                const correctAnswer = questions[currentQuestionIndex]["right_answer"];
                checkAnswer(correctAnswer);
                currentQuestionIndex++;
                updateGame(questions, totalQuestions);
            };
        });
}

// Fetch Questions from JSON
async function fetchQuestions() {
    try {
        const response = await fetch("./test.json");
        return await response.json();
    } catch (error) {
        return console.error("Error fetching questions:", error);
    }
}

// Update Game State
function updateGame(questions, totalQuestions) {
    clearQuestionArea();
    if (currentQuestionIndex < totalQuestions) {
        loadQuestion(questions[currentQuestionIndex], totalQuestions);
        updateBullets();
    } else {
        showResult(totalQuestions);
    }
}

// Create Bullets for Questions
function createBullets(total) {
    for (let i = 0; i < total; i++) {
        const bullet = document.createElement("span");
        bulletsContainer.append(bullet);
        if (i === 0) bullet.classList.add("on");
    }
}

// Load Question and Answers
function loadQuestion(question, total) {
    questionCount.textContent = total - currentQuestionIndex;
    createQuestionElement(question["title"]);
    createAnswersElements(question);
}

// Create Question Element
function createQuestionElement(questionTitle) {
    const heading = document.createElement("h2");
    heading.textContent = questionTitle;
    questionArea.append(heading);
}

// Create Answer Elements
function createAnswersElements(question) {
    for (let i = 1; i <= 4; i++) {
        const answerDiv = document.createElement("div");
        answerDiv.classList.add("answer");

        const input = createAnswerInput(i, question[`answer_${i}`]);
        const label = createAnswerLabel(i, question[`answer_${i}`]);

        answerDiv.append(input, label);
        answersArea.append(answerDiv);
    }
}

// Create Input Element for Answers
function createAnswerInput(index, answerText) {
    const input = document.createElement("input");
    input.type = "radio";
    input.id = `answer_${index}`;
    input.name = "answers";
    input.dataset.answer = answerText;
    return input;
}

// Create Label Element for Answers
function createAnswerLabel(index, answerText) {
    const label = document.createElement("label");
    label.htmlFor = `answer_${index}`;
    label.textContent = answerText;
    return label;
}

// Check the User's Answer
function checkAnswer(correctAnswer) {
    const selectedAnswer = getSelectedAnswer();
    if (selectedAnswer === correctAnswer) {
        correctAnswersCount++;
    }
}

// Get Selected Answer
function getSelectedAnswer() {
    const answers = document.getElementsByName("answers");
    let selected;
    answers.forEach((answer) => {
        if (answer.checked) {
            selected = answer.dataset.answer;
        }
    });
    return selected;
}

// Update Bullets to Indicate Progress
function updateBullets() {
    const bullets = document.querySelectorAll(".bottom .spans span");
    bullets.forEach((bullet, index) => {
        bullet.classList.toggle("on", index === currentQuestionIndex);
    });
}

// Show Result After Quiz Completion
function showResult(totalQuestions) {
    submitButton.disabled = true;
    bulletsContainer.style.display = "none";
    timeContainer.style.display = "none";
    resultContainer.innerHTML = getResultMessage(totalQuestions);
    
}

// Get Result Message Based on Performance
function getResultMessage(totalQuestions) {
    if (correctAnswersCount === totalQuestions) {
        return `Perfect: You answered all ${totalQuestions} questions correctly!`;
    } else if (correctAnswersCount >= totalQuestions / 2) {
        return `Good: You answered ${correctAnswersCount} out of ${totalQuestions} correctly.`;
    } else {
        return `Bad: You only answered ${correctAnswersCount} out of ${totalQuestions} correctly.`;
    }
}

// Clear the Question and Answer Areas
function clearQuestionArea() {
    questionArea.innerHTML = "";
    answersArea.innerHTML = "";
}

// Countdown Timer
function startCountdown(duration, totalQuestions) {
    countdownInterval = setInterval(() => {
        const [minutes, seconds] = formatTime(duration);
        timeContainer.textContent = `${minutes}:${seconds}`;
        duration--;

        if (duration < 0) {
            clearInterval(countdownInterval);
            submitButton.click();
        }
    }, 1000);
}

// Format Time into Minutes and Seconds
function formatTime(duration) {
    const minutes = Math.floor(duration / 60).toString().padStart(2, "0");
    const seconds = (duration % 60).toString().padStart(2, "0");
    return [minutes, seconds];
}

// Start the Quiz Game
initializeQuizGame();
