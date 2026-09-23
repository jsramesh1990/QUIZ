let questions = [];
let answers = {};

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;


// Get HTML elements
const questionNumber = document.getElementById("question-number");
const scoreDisplay = document.getElementById("score");
const questionDisplay = document.getElementById("question");
const optionsDisplay = document.getElementById("options");

const nextButton = document.getElementById("next-button");

const resultBox = document.getElementById("result");
const finalScore = document.getElementById("final-score");

const restartButton = document.getElementById("restart-button");


// Load all questions
async function loadQuestions() {

    for (let i = 1; i <= 10; i++) {

        const response = await fetch(
            `questions/q${String(i).padStart(2, "0")}.json`
        );

        const question = await response.json();

        questions.push(question);
    }

    // Load answers
    const answerResponse = await fetch("answers/answers.json");

    answers = await answerResponse.json();

    loadQuestion();
}


// Display current question
function loadQuestion() {

    selectedAnswer = null;

    const question = questions[currentQuestion];

    questionNumber.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    scoreDisplay.textContent =
        `Score: ${score}`;

    questionDisplay.textContent =
        question.question;

    optionsDisplay.innerHTML = "";


    question.options.forEach((option, index) => {

        const button = document.createElement("button");

        button.textContent = option;

        button.classList.add("option");

        button.addEventListener("click", () => {

            selectAnswer(index, button);

        });

        optionsDisplay.appendChild(button);

    });
}


// Select an answer
function selectAnswer(index, button) {

    selectedAnswer = index;

    const allOptions =
        document.querySelectorAll(".option");

    allOptions.forEach(option => {

        option.classList.remove("selected");

    });

    button.classList.add("selected");
}


// Move to next question
nextButton.addEventListener("click", () => {

    if (selectedAnswer === null) {

        alert("Please select an answer.");

        return;
    }


    const questionId =
        questions[currentQuestion].id;


    if (selectedAnswer === answers[questionId]) {

        score++;

    }


    currentQuestion++;


    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        showResult();

    }

});


// Show final result
function showResult() {

    questionDisplay.style.display = "none";

    optionsDisplay.style.display = "none";

    nextButton.style.display = "none";

    questionNumber.style.display = "none";


    resultBox.classList.remove("hidden");

    finalScore.textContent =
        `Your score is ${score} / ${questions.length}`;

}


// Restart quiz
restartButton.addEventListener("click", () => {

    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;

    questionDisplay.style.display = "block";

    optionsDisplay.style.display = "block";

    nextButton.style.display = "block";

    questionNumber.style.display = "inline";


    resultBox.classList.add("hidden");

    loadQuestion();

});


// Start quiz
loadQuestions();
