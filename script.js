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
    const questionCounter = document.getElementById("question-counter");
    const progressElement = document.getElementById("progress");
    const answerInstruction = document.getElementById("answer-instruction");


    questionElement.textContent = questionData.question;

    questionCounter.textContent =
        `${currentQuestion + 1} / ${questions.length}`;


    progressElement.innerHTML = "";

    questions.forEach(function(question, index) {

        const progressNode = document.createElement("span");

        progressNode.classList.add("progress-node");

        if (index <= currentQuestion) {
            progressNode.classList.add("active");
        }

        progressElement.appendChild(progressNode);

    });


    answersElement.innerHTML = "";
    answersElement.style.display = "";

    feedbackElement.innerHTML = "";
    answerInstruction.style.display = "";


    const answerLetters = ["A", "B", "C", "D"];


    questionData.answers.forEach(function(answer, index) {

        const button = document.createElement("button");

        button.classList.add("answer-button");

        button.innerHTML = `
            <span class="answer-letter">
                ${answerLetters[index]}
            </span>

            <span class="answer-text">
                ${answer}
            </span>
        `;

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
    const answerInstruction = document.getElementById("answer-instruction");
    const answerButtons = document.querySelectorAll("#answers button");


    answerButtons.forEach(function(button) {
        button.disabled = true;
    });


    // if (document.body.classList.contains("embed-mode")) {

        answersElement.style.display = "none";
        answerInstruction.style.display = "none";

    // }
    // DECIDED TO KEEP THE SAME UI UX FOR NON-EMBEDD AS IT SIMPLIFIES IT AND GOES WITH THE BRAND IDENTITY 

    if (selectedAnswer === questionData.correctAnswer) {

        feedback.innerHTML = `
            <div class="feedback feedback-success">

                <div class="feedback-status">

                    <span class="feedback-icon">
                        ✓
                    </span>

                    <span class="feedback-label">
                        Nice one
                    </span>

                </div>

                <h2>Correct!</h2>

                <p>
                    ${questionData.explanation}
                </p>

                <button class="feedback-button" onclick="continueQuiz()">
                    Next one
                    <span aria-hidden="true">→</span>
                </button>

            </div>
        `;

    } else {

        feedback.innerHTML = `
            <div class="feedback feedback-error">

                <div class="feedback-status">

                    <span class="feedback-icon">
                        ×
                    </span>

                    <span class="feedback-label">
                        Not quite
                    </span>

                </div>

                <h2>Give it another shot.</h2>

                <p>
                    That wasn't the right answer.
                </p>

                <button class="feedback-button" onclick="tryAgain()">
                    Try Again
                </button>

            </div>
        `;

    }

}


function tryAgain() {

    const feedback = document.getElementById("feedback");
    const answersElement = document.getElementById("answers");
    const answerInstruction = document.getElementById("answer-instruction");
    const answerButtons = document.querySelectorAll("#answers button");


    feedback.innerHTML = "";

    answersElement.style.display = "";

    answerInstruction.style.display = "";


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
    const answerInstruction = document.getElementById("answer-instruction");

    questionElement.textContent = "Quick Challenge complete!";

    answersElement.innerHTML = "";
    answersElement.style.display = "none";

    answerInstruction.style.display = "none";

    feedbackElement.innerHTML = `
        <div class="feedback feedback-complete">

            <div class="feedback-status">

                <span class="feedback-icon">
                    ✓
                </span>

                <span class="feedback-label">
                    Nice work
                </span>

            </div>

            <h2>You made it!</h2>

            <p>
                That's the Quick Challenge done.
                Keep exploring The Social Hub.
            </p>

            <button class="feedback-button" onclick="restartQuiz()">
                Restart challenge
                <span aria-hidden="true">↻</span>
            </button>

        </div>
    `;

}

function restartQuiz() {

    currentQuestion = 0;

    loadQuestion();

}



loadQuestion();