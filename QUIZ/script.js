const questions = [

    {
        question: "What is the entry point of a C program?",
        options: [
            "printf()",
            "main()",
            "start()",
            "begin()"
        ],
        answer: 1
    },

    {
        question: "Which header file is commonly used for printf()?",
        options: [
            "stdlib.h",
            "string.h",
            "stdio.h",
            "math.h"
        ],
        answer: 2
    },

    {
        question: "Which symbol is used to end a C statement?",
        options: [
            ":",
            ".",
            ",",
            ";"
        ],
        answer: 3
    },

    {
        question: "Which data type is used to store an integer?",
        options: [
            "float",
            "char",
            "int",
            "double"
        ],
        answer: 2
    },

    {
        question: "Which operator is used to assign a value to a variable?",
        options: [
            "==",
            "=",
            "!=",
            "<="
        ],
        answer: 1
    },

    {
        question: "Which format specifier is commonly used to print an int using printf()?",
        options: [
            "%c",
            "%f",
            "%d",
            "%s"
        ],
        answer: 2
    },

    {
        question: "Which keyword is used to declare a constant variable in C?",
        options: [
            "constant",
            "const",
            "fixed",
            "static"
        ],
        answer: 1
    },

    {
        question: "Which operator is used to get the address of a variable?",
        options: [
            "*",
            "&",
            "%",
            "#"
        ],
        answer: 1
    },

    {
        question: "Which loop is guaranteed to execute its body at least once?",
        options: [
            "for",
            "while",
            "do-while",
            "if"
        ],
        answer: 2
    },

    {
        question: "Which keyword is used to return a value from a function?",
        options: [
            "break",
            "return",
            "continue",
            "exit"
        ],
        answer: 1
    }

];


let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;


const questionElement =
    document.getElementById("question");

const optionsElement =
    document.getElementById("options");

const questionNumberElement =
    document.getElementById("question-number");

const scoreElement =
    document.getElementById("score");

const quizBox =
    document.getElementById("quiz-box");

const resultBox =
    document.getElementById("result-box");

const finalScoreElement =
    document.getElementById("final-score");


function loadQuestion() {

    selectedAnswer = null;

    const question = questions[currentQuestion];

    questionElement.textContent =
        question.question;

    questionNumberElement.textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    scoreElement.textContent =
        `Score: ${score}`;

    optionsElement.innerHTML = "";


    question.options.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.textContent = option;

        button.classList.add("option");

        button.onclick = function () {

            selectAnswer(index, button);

        };

        optionsElement.appendChild(button);

    });

}


function selectAnswer(index, button) {

    selectedAnswer = index;

    const buttons =
        document.querySelectorAll(".option");

    buttons.forEach(function (btn) {

        btn.classList.remove("selected");

    });

    button.classList.add("selected");

}


function nextQuestion() {

    if (selectedAnswer === null) {

        alert("Please select an answer.");

        return;

    }


    const correctAnswer =
        questions[currentQuestion].answer;


    if (selectedAnswer === correctAnswer) {

        score++;

    }


    currentQuestion++;


    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        showResult();

    }

}


function showResult() {

    quizBox.classList.add("hidden");

    resultBox.classList.remove("hidden");

    finalScoreElement.textContent =
        `Your Score: ${score} / ${questions.length}`;

}


function restartQuiz() {

    currentQuestion = 0;

    score = 0;

    selectedAnswer = null;


    resultBox.classList.add("hidden");

    quizBox.classList.remove("hidden");


    loadQuestion();

}


loadQuestion();
