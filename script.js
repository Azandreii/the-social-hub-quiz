const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get("embed") === "1") {
    document.body.classList.add("embed-mode");
}

let currentQuestion = 0;


function loadQuestion() {

    const questionData = questions[currentQuestion];

    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const feedbackElement = document.getElementById("feedback");


    questionElement.textContent = questionData.question;

    answersElement.innerHTML = "";
    answersElement.style.display = "";

    feedbackElement.innerHTML = "";


    questionData.answers.forEach(function(answer, index) {

        const button = document.createElement("button");

        button.textContent = answer;

        button.onclick = function() {
            checkAnswer(index);
        };

        answersElement.appendChild(button);

    });

}


function checkAnswer(selectedAnswer) {

    const questionData = questions[currentQuestion];

    const feedback = document.getElementById("feedback");
    const answersElement = document.getElementById("answers");
    const answerButtons = document.querySelectorAll("#answers button");


    answerButtons.forEach(function(button) {
        button.disabled = true;
    });


    if (document.body.classList.contains("embed-mode")) {
        answersElement.style.display = "none";
    }


    if (selectedAnswer === questionData.correctAnswer) {

        feedback.innerHTML = `
            <div class="feedback correct">

                <h2>Correct!</h2>

                <p>
                    ${questionData.explanation}
                </p>

                <button onclick="continueQuiz()">
                    Continue
                </button>

            </div>
        `;

    } else {

        feedback.innerHTML = `
            <div class="feedback incorrect">

                <h2>Not quite</h2>

                <p>
                    That's not the correct answer. Try again!
                </p>

                <button onclick="tryAgain()">
                    Try Again
                </button>

            </div>
        `;

    }

}


function tryAgain() {

    const feedback = document.getElementById("feedback");
    const answersElement = document.getElementById("answers");
    const answerButtons = document.querySelectorAll("#answers button");


    feedback.innerHTML = "";


    answersElement.style.display = "";


    answerButtons.forEach(function(button) {
        button.disabled = false;
    });

}


function continueQuiz() {

    currentQuestion++;

    if (currentQuestion < questions.length) {

        loadQuestion();

    } else {

        showCompletion();

    }

}

function showCompletion() {

    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const feedbackElement = document.getElementById("feedback");

    questionElement.textContent = "Quick Challenge complete!";

    answersElement.innerHTML = "";
    answersElement.style.display = "none";

    feedbackElement.innerHTML = `
        <div class="feedback correct">

            <h2>Well done!</h2>

            <p>
                You completed the Quick Challenge.
                Close this card to continue exploring the tour.
            </p>

            <button onclick="restartQuiz()">
                Restart Quiz
            </button>

        </div>
    `;

}

function restartQuiz() {

    currentQuestion = 0;

    loadQuestion();

}



loadQuestion();