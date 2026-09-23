let currentQuestion = 1;
let selectedAnswer = null;


// Get the HTML elements
const questionNumber =
    document.getElementById("question-number");

const questionDisplay =
    document.getElementById("question");

const optionsDisplay =
    document.getElementById("options");

const nextButton =
    document.getElementById("next-button");


// Load a question
async function loadQuestion(questionNumberValue) {

    // Create file name
    const fileName =
        `questions/q${String(questionNumberValue).padStart(2, "0")}.json`;


    // Fetch JSON file
    const response = await fetch(fileName);

    // Convert JSON into JavaScript object
    const question = await response.json();


    // Reset selected answer
    selectedAnswer = null;


    // Display question number
    questionNumber.textContent =
        `Question ${question.id} of 10`;


    // Display question
    questionDisplay.textContent =
        question.question;


    // Remove previous options
    optionsDisplay.innerHTML = "";


    // Create new options
    question.options.forEach((option, index) => {

        const button =
            document.createElement("button");

        button.textContent = option;

        button.classList.add("option");


        // When option is clicked
        button.addEventListener("click", () => {

            selectedAnswer = index;


            // Remove selection from all options
            document
                .querySelectorAll(".option")
                .forEach(optionButton => {

                    optionButton.classList.remove("selected");

                });


            // Select this option
            button.classList.add("selected");

        });


        // Add option to the same box
        optionsDisplay.appendChild(button);

    });
}


// Next button
nextButton.addEventListener("click", () => {

    // Make sure user selected something
    if (selectedAnswer === null) {

        alert("Please select an answer.");

        return;
    }


    // Move to next question
    currentQuestion++;


    // Load next question
    loadQuestion(currentQuestion);

});


// Start with Question 1
loadQuestion(currentQuestion);
