// ============================================================
// C PROGRAMMING QUIZ
// ============================================================

// ------------------------------------------------------------
// C-QUIZ-DATA repository
// ------------------------------------------------------------

const DATA_BASE_URL =
    "https://raw.githubusercontent.com/jsramesh1990/C-QUIZ-DATA/main/C-QUIZ-DATA";

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
    "arrays-strings",
    "pointers",
    "strings",
    "structures",
    "unions-enums",
    "storage-classes",
    "preprocessor",
    "dynamic-memory",
    "file-handling",
    "bitwise-operations",
    "command-line-arguments"
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

const startScreen =
    document.getElementById("start-screen");

const quizScreen =
    document.getElementById("quiz-screen");

const resultScreen =
    document.getElementById("result-screen");

const startButton =
    document.getElementById("start-btn");

const nextButton =
    document.getElementById("next-btn");

const restartButton =
    document.getElementById("restart-btn");

const topicTitle =
    document.getElementById("topic-title");

// NEW: Topic learning description
const topicDescription =
    document.getElementById("topic-description");

const questionNumber =
    document.getElementById("question-number");

const scoreDisplay =
    document.getElementById("score-display");

const questionText =
    document.getElementById("question-text");

const optionsContainer =
    document.getElementById("options-container");

const finalScore =
    document.getElementById("final-score");

const resultMessage =
    document.getElementById("result-message");

const message =
    document.getElementById("message");

// ------------------------------------------------------------
// Check HTML elements
// ------------------------------------------------------------

if (
    !startScreen ||
    !quizScreen ||
    !resultScreen ||
    !startButton ||
    !nextButton ||
    !restartButton ||
    !topicTitle ||
    !topicDescription ||
    !questionNumber ||
    !scoreDisplay ||
    !questionText ||
    !optionsContainer ||
    !finalScore ||
    !resultMessage ||
    !message
) {
    console.error(
        "Quiz HTML elements are missing."
    );
}

// ------------------------------------------------------------
// Shuffle function
// Fisher-Yates shuffle
// ------------------------------------------------------------

function shuffle(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array;
}

// ------------------------------------------------------------
// Load JSON file
// ------------------------------------------------------------

async function loadJSON(url) {

    console.log(
        "Loading:",
        url
    );

    const response =
        await fetch(url);

    if (!response.ok) {

        throw new Error(
            `Failed to load JSON: ${response.status} ${response.statusText} - ${url}`
        );
    }

    return await response.json();
}

// ------------------------------------------------------------
// Load all topics
// ------------------------------------------------------------

async function loadTopics() {

    topics = [];

    for (
        const topicFile of topicFiles
    ) {

        const url =
            `${DATA_BASE_URL}/topics/${topicFile}.json`;

        const topic =
            await loadJSON(url);

        topics.push(topic);
    }

    // Randomize topic order
    shuffle(topics);

    console.log(
        "Topics loaded:",
        topics
    );
}

// ------------------------------------------------------------
// Load questions for current topic
// ------------------------------------------------------------

async function loadTopicQuestions(topicId) {

    const questionURL =
        `${DATA_BASE_URL}/questions/${topicId}.json`;

    const answerURL =
        `${DATA_BASE_URL}/answers/${topicId}.json`;

    const questionData =
        await loadJSON(questionURL);

    const answerData =
        await loadJSON(answerURL);

    const answers =
        answerData.answers;

    if (
        !questionData.questions ||
        !Array.isArray(
            questionData.questions
        )
    ) {

        throw new Error(
            `Invalid questions file for topic: ${topicId}`
        );
    }

    if (!answers) {

        throw new Error(
            `Invalid answers file for topic: ${topicId}`
        );
    }

    currentQuestions =
        questionData.questions.map(
            question => {

                return {
                    ...question,

                    correctAnswer:
                        answers[
                            String(question.id)
                        ]
                };

            }
        );

    // Randomize question order
    shuffle(currentQuestions);

    console.log(
        `Questions loaded for ${topicId}:`,
        currentQuestions
    );
}

// ------------------------------------------------------------
// Start quiz
// ------------------------------------------------------------

async function startQuiz() {

    try {

        console.log(
            "Start Quiz clicked."
        );

        showMessage(
            "Loading quiz..."
        );

        // ----------------------------------------------------
        // Reset quiz state
        // ----------------------------------------------------

        score = 0;

        currentTopicIndex = 0;

        currentQuestionIndex = 0;

        totalQuestions = 0;

        currentQuestions = [];

        currentQuestion = null;

        selectedAnswer = null;

        // ----------------------------------------------------
        // Load all 20 topics
        // ----------------------------------------------------

        await loadTopics();

        // ----------------------------------------------------
        // Calculate total questions
        // ----------------------------------------------------

        totalQuestions =
            topics.reduce(
                (
                    total,
                    topic
                ) => {

                    return total + 10;

                },
                0
            );

        console.log(
            "Total questions:",
            totalQuestions
        );

        // ----------------------------------------------------
        // Hide start/result screens
        // ----------------------------------------------------

        startScreen.classList.add(
            "hidden"
        );

        resultScreen.classList.add(
            "hidden"
        );

        // ----------------------------------------------------
        // Show quiz screen
        // ----------------------------------------------------

        quizScreen.classList.remove(
            "hidden"
        );

        // ----------------------------------------------------
        // Hide loading message
        // ----------------------------------------------------

        hideMessage();

        // ----------------------------------------------------
        // Reset score
        // ----------------------------------------------------

        scoreDisplay.textContent =
            `Score: ${score}`;

        // ----------------------------------------------------
        // Load first topic
        // ----------------------------------------------------

        await loadCurrentTopic();

    } catch (error) {

        console.error(
            "Quiz loading error:",
            error
        );

        // Make sure quiz screen doesn't remain
        // in a broken state.

        quizScreen.classList.add(
            "hidden"
        );

        startScreen.classList.remove(
            "hidden"
        );

        showMessage(
            "Unable to load the quiz. Please check the C-QUIZ-DATA repository and JSON files."
        );
    }
}

// ------------------------------------------------------------
// Load current topic
// ------------------------------------------------------------

async function loadCurrentTopic() {

    if (
        currentTopicIndex >=
        topics.length
    ) {

        showResult();

        return;
    }

    const topic =
        topics[currentTopicIndex];

    console.log(
        "Current topic:",
        topic
    );

    // --------------------------------------------------------
    // Display topic title
    // --------------------------------------------------------

    topicTitle.textContent =
        `Topic: ${topic.title}`;

    // --------------------------------------------------------
    // Display topic learning information
    // --------------------------------------------------------

    if (
        topicDescription
    ) {

        topicDescription.textContent =
            topic.description || "";
    }

    // --------------------------------------------------------
    // Reset question index
    // --------------------------------------------------------

    currentQuestionIndex = 0;

    // --------------------------------------------------------
    // Load topic questions
    // --------------------------------------------------------

    await loadTopicQuestions(
        topic.id
    );

    // --------------------------------------------------------
    // Make sure questions exist
    // --------------------------------------------------------

    if (
        currentQuestions.length === 0
    ) {

        throw new Error(
            `No questions found for topic: ${topic.id}`
        );
    }

    // --------------------------------------------------------
    // Display first question
    // --------------------------------------------------------

    showQuestion();
}

// ------------------------------------------------------------
// Display current question
// ------------------------------------------------------------

function showQuestion() {

    selectedAnswer = null;

    nextButton.disabled = true;

    const question =
        currentQuestions[
            currentQuestionIndex
        ];

    currentQuestion =
        question;

    // --------------------------------------------------------
    // Question text
    // --------------------------------------------------------

    questionText.textContent =
        question.question;

    // --------------------------------------------------------
    // Question number
    // --------------------------------------------------------

    questionNumber.textContent =
        `Question ${currentQuestionIndex + 1} of ${currentQuestions.length}`;

    // --------------------------------------------------------
    // Score
    // --------------------------------------------------------

    scoreDisplay.textContent =
        `Score: ${score}`;

    // --------------------------------------------------------
    // Clear previous options
    // --------------------------------------------------------

    optionsContainer.innerHTML = "";

    // --------------------------------------------------------
    // Convert options into objects
    // --------------------------------------------------------

    let options =
        question.options.map(
            option => {

                const originalLetter =
                    option.charAt(0);

                const optionText =
                    option.substring(2);

                return {

                    originalLetter:
                        originalLetter,

                    text:
                        optionText
                };
            }
        );

    // --------------------------------------------------------
    // Randomize options
    // --------------------------------------------------------

    shuffle(options);

    // --------------------------------------------------------
    // Create option buttons
    // --------------------------------------------------------

    options.forEach(
        (
            option,
            index
        ) => {

            const displayLetter =
                String.fromCharCode(
                    65 + index
                );

            const button =
                document.createElement(
                    "button"
                );

            button.classList.add(
                "option"
            );

            button.textContent =
                `${displayLetter}. ${option.text}`;

            // Store original answer letter
            button.dataset.answer =
                option.originalLetter;

            // Add click event
            button.addEventListener(
                "click",
                () => selectAnswer(button)
            );

            optionsContainer.appendChild(
                button
            );
        }
    );
}

// ------------------------------------------------------------
// Select answer
// ------------------------------------------------------------

function selectAnswer(button) {

    // Prevent selecting another answer
    if (
        selectedAnswer !== null
    ) {

        return;
    }

    selectedAnswer =
        button.dataset.answer;

    const allOptions =
        document.querySelectorAll(
            ".option"
        );

    // --------------------------------------------------------
    // Disable all options
    // --------------------------------------------------------

    allOptions.forEach(
        option => {

            option.disabled = true;

        }
    );

    // --------------------------------------------------------
    // Get correct answer
    // --------------------------------------------------------

    const correctAnswer =
        currentQuestion.correctAnswer;

    // --------------------------------------------------------
    // Check selected answer
    // --------------------------------------------------------

    if (
        selectedAnswer ===
        correctAnswer
    ) {

        button.classList.add(
            "correct"
        );

        score++;

    } else {

        button.classList.add(
            "wrong"
        );

        // Highlight correct answer
        allOptions.forEach(
            option => {

                if (
                    option.dataset.answer ===
                    correctAnswer
                ) {

                    option.classList.add(
                        "correct"
                    );
                }

            }
        );
    }

    // --------------------------------------------------------
    // Update score
    // --------------------------------------------------------

    scoreDisplay.textContent =
        `Score: ${score}`;

    // --------------------------------------------------------
    // Enable Next button
    // --------------------------------------------------------

    nextButton.disabled = false;
}

// ------------------------------------------------------------
// Next question
// ------------------------------------------------------------

async function nextQuestion() {

    currentQuestionIndex++;

    // --------------------------------------------------------
    // More questions in current topic
    // --------------------------------------------------------

    if (
        currentQuestionIndex <
        currentQuestions.length
    ) {

        showQuestion();

        return;
    }

    // --------------------------------------------------------
    // Current topic finished
    // --------------------------------------------------------

    currentTopicIndex++;

    // --------------------------------------------------------
    // More topics available
    // --------------------------------------------------------

    if (
        currentTopicIndex <
        topics.length
    ) {

        try {

            showMessage(
                "Loading next topic..."
            );

            await loadCurrentTopic();

            hideMessage();

        } catch (error) {

            console.error(
                "Next topic loading error:",
                error
            );

            showMessage(
                "Unable to load the next topic."
            );
        }

        return;
    }

    // --------------------------------------------------------
    // All topics finished
    // --------------------------------------------------------

    showResult();
}

// ------------------------------------------------------------
// Show final result
// ------------------------------------------------------------

function showResult() {

    quizScreen.classList.add(
        "hidden"
    );

    resultScreen.classList.remove(
        "hidden"
    );

    topicTitle.textContent =
        "Quiz Finished";

    if (topicDescription) {

        topicDescription.textContent =
            "";
    }

    finalScore.textContent =
        `${score} / ${totalQuestions}`;

    let percentage = 0;

    if (
        totalQuestions > 0
    ) {

        percentage =
            Math.round(
                (
                    score /
                    totalQuestions
                ) * 100
            );
    }

    if (
        percentage >= 80
    ) {

        resultMessage.textContent =
            `Excellent! You scored ${percentage}%.`;

    } else if (
        percentage >= 60
    ) {

        resultMessage.textContent =
            `Good job! You scored ${percentage}%.`;

    } else if (
        percentage >= 40
    ) {

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

    resultScreen.classList.add(
        "hidden"
    );

    startScreen.classList.remove(
        "hidden"
    );

    await startQuiz();
}

// ------------------------------------------------------------
// Show message
// ------------------------------------------------------------

function showMessage(text) {

    message.textContent =
        text;

    message.classList.remove(
        "hidden"
    );
}

// ------------------------------------------------------------
// Hide message
// ------------------------------------------------------------

function hideMessage() {

    message.classList.add(
        "hidden"
    );
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

// ------------------------------------------------------------
// Script loaded successfully
// ------------------------------------------------------------

console.log(
    "C Programming Quiz JavaScript loaded successfully."
);
