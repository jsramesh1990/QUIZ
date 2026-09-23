```javascript
// ============================================================
// C PROGRAMMING QUIZ
// ============================================================

// ------------------------------------------------------------
// C-QUIZ-DATA repository
// ------------------------------------------------------------

const DATA_BASE_URL =
    "https://raw.githubusercontent.com/jsramesh1990/C-QUIZ-DATA/main";

// ------------------------------------------------------------
// Topic list
// ------------------------------------------------------------

const topicFiles = [
    "c-basics",
    "tokens",
    "data-types",
    "variables-constants",
    "input-output",
    "operators",
    "control-statements",
    "loops",
    "functions",
    "arrays-strings"
];

// ------------------------------------------------------------
// Quiz state
// ------------------------------------------------------------

let topics = [];
let currentTopicIndex = 0;

let currentQuestions = [];
let currentQuestionIndex = 0;

let currentQuestion = null;

let score = 0;
let totalQuestions = 0;

let selectedAnswer = null;

// ------------------------------------------------------------
// HTML elements
// ------------------------------------------------------------

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const restartButton = document.getElementById("restart-btn");

const topicTitle = document.getElementById("topic-title");

const questionNumber = document.getElementById("question-number");
const scoreDisplay = document.getElementById("score-display");

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const finalScore = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");

const message = document.getElementById("message");

// ------------------------------------------------------------
// Shuffle function
// Fisher-Yates shuffle
// ------------------------------------------------------------

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


// ------------------------------------------------------------
// Load JSON file
// ------------------------------------------------------------

async function loadJSON(url) {

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Failed to load JSON: ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
}


// ------------------------------------------------------------
// Load all topics
// ------------------------------------------------------------

async function loadTopics() {

    topics = [];

    for (const topicFile of topicFiles) {

        const url =
            `${DATA_BASE_URL}/topics/${topicFile}.json`;

        const topic = await loadJSON(url);

        topics.push(topic);
    }

    // Randomize topic order
    shuffle(topics);
}


// ------------------------------------------------------------
// Load questions for current topic
// ------------------------------------------------------------

async function loadTopicQuestions(topicId) {

    const questionURL =
        `${DATA_BASE_URL}/questions/${topicId}.json`;

    const answerURL =
        `${DATA_BASE_URL}/answers/${topicId}.json`;

    const questionData = await loadJSON(questionURL);
    const answerData = await loadJSON(answerURL);

    const answers = answerData.answers;

    currentQuestions = questionData.questions.map(question => {

        return {
            ...question,
            correctAnswer: answers[String(question.id)]
        };

    });

    // Randomize question order
    shuffle(currentQuestions);
}


// ------------------------------------------------------------
// Start quiz
// ------------------------------------------------------------

async function startQuiz() {

    try {

        showMessage("Loading quiz...");

        score = 0;
        currentTopicIndex = 0;
        currentQuestionIndex = 0;
        totalQuestions = 0;

        await loadTopics();

        // Calculate total questions
        // Each topic normally has 10 questions
        totalQuestions = topics.length * 10;

        startScreen.classList.add("hidden");
        resultScreen.classList.add("hidden");
        quizScreen.classList.remove("hidden");

        hideMessage();

        scoreDisplay.textContent = `Score: ${score}`;

        await loadCurrentTopic();

    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to load the quiz. Please check the C-QUIZ-DATA repository."
        );
    }
}


// ------------------------------------------------------------
// Load current topic
// ------------------------------------------------------------

async function loadCurrentTopic() {

    if (currentTopicIndex >= topics.length) {

        showResult();

        return;
    }

    const topic = topics[currentTopicIndex];

    topicTitle.textContent = topic.title;

    currentQuestionIndex = 0;

    await loadTopicQuestions(topic.id);

    showQuestion();

}


// ------------------------------------------------------------
// Display current question
// ------------------------------------------------------------

function showQuestion() {

    selectedAnswer = null;

    nextButton.disabled = true;

    const question = currentQuestions[currentQuestionIndex];

    currentQuestion = question;

    questionText.textContent = question.question;

    questionNumber.textContent =
        `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;

    scoreDisplay.textContent =
        `Score: ${score}`;

    optionsContainer.innerHTML = "";

    // --------------------------------------------------------
    // Convert current options into objects
    // --------------------------------------------------------
    //
    // Original JSON:
    //
    // A. int
    // B. float
    // C. char
    // D. double
    //
    // We extract the original letter and text.
    //
    // --------------------------------------------------------

    let options = question.options.map(option => {

        const letter = option.charAt(0);

        const text = option.substring(2);

        return {
            originalLetter: letter,
            text: text
        };

    });

    // Randomize options
    shuffle(options);

    // --------------------------------------------------------
    // Create option buttons
    // --------------------------------------------------------

    options.forEach((option, index) => {

        const displayLetter =
            String.fromCharCode(65 + index);

        const button =
            document.createElement("button");

        button.classList.add("option");

        button.textContent =
            `${displayLetter}. ${option.text}`;

        // Store original answer letter
        button.dataset.answer =
            option.originalLetter;

        button.addEventListener(
            "click",
            () => selectAnswer(button)
        );

        optionsContainer.appendChild(button);

    });
}


// ------------------------------------------------------------
// Select answer
// ------------------------------------------------------------

function selectAnswer(button) {

    // Prevent selecting another answer
    if (selectedAnswer !== null) {
        return;
    }

    selectedAnswer =
        button.dataset.answer;

    const allOptions =
        document.querySelectorAll(".option");

    // Disable all buttons
    allOptions.forEach(option => {

        option.disabled = true;

    });

    // Correct answer from answer JSON
    const correctAnswer =
        currentQuestion.correctAnswer;

    // Check answer
    if (selectedAnswer === correctAnswer) {

        button.classList.add("correct");

        score++;

    } else {

        button.classList.add("wrong");

        // Find the correct option
        allOptions.forEach(option => {

            if (
                option.dataset.answer === correctAnswer
            ) {

                option.classList.add("correct");

            }

        });

    }

    scoreDisplay.textContent =
        `Score: ${score}`;

    nextButton.disabled = false;
}


// ------------------------------------------------------------
// Next button
// ------------------------------------------------------------

async function nextQuestion() {

    currentQuestionIndex++;

    // More questions in current topic
    if (
        currentQuestionIndex <
        currentQuestions.length
    ) {

        showQuestion();

        return;
    }

    // Current topic finished
    currentTopicIndex++;

    // More topics available
    if (
        currentTopicIndex <
        topics.length
    ) {

        try {

            await loadCurrentTopic();

        } catch (error) {

            console.error(error);

            showMessage(
                "Unable to load the next topic."
            );
        }

        return;
    }

    // All topics finished
    showResult();
}


// ------------------------------------------------------------
// Show final result
// ------------------------------------------------------------

function showResult() {

    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    topicTitle.textContent =
        "Quiz Finished";

    finalScore.textContent =
        `${score} / ${totalQuestions}`;

    const percentage =
        Math.round((score / totalQuestions) * 100);

    if (percentage >= 80) {

        resultMessage.textContent =
            `Excellent! You scored ${percentage}%.`;

    } else if (percentage >= 60) {

        resultMessage.textContent =
            `Good job! You scored ${percentage}%.`;

    } else if (percentage >= 40) {

        resultMessage.textContent =
            `Keep practicing! You scored ${percentage}%.`;

    } else {

        resultMessage.textContent =
            `Keep learning and try again! You scored ${percentage}%.`;

    }
}


// ------------------------------------------------------------
// Restart quiz
// ------------------------------------------------------------

async function restartQuiz() {

    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    await startQuiz();

}


// ------------------------------------------------------------
// Show message
// ------------------------------------------------------------

function showMessage(text) {

    message.textContent = text;

    message.classList.remove("hidden");
}


// ------------------------------------------------------------
// Hide message
// ------------------------------------------------------------

function hideMessage() {

    message.classList.add("hidden");
}


// ------------------------------------------------------------
// Event listeners
// ------------------------------------------------------------

startButton.addEventListener(
    "click",
    startQuiz
);

nextButton.addEventListener(
    "click",
    nextQuestion
);

restartButton.addEventListener(
    "click",
    restartQuiz
);
```

