const urlParams =
    new URLSearchParams(
        window.location.search
    );


const isEmbedMode =
    urlParams.get("embed") === "1";


const isDevMode =
    urlParams.get("dev") === "1";


if (isEmbedMode) {

    document.body.classList.add(
        "embed-mode"
    );

}

// for testing purposes inside kuula as localstorage can't be removed through the console
if (urlParams.get("dev") === "1") {
    createDevTools();
}

let currentQuestion = 0;

//gamification vars
const BASE_POINTS = 100;
const FIRST_TRY_BONUS = 50;
let totalPoints = 0;
let firstTryBonuses = 0;
let attemptedCurrentQuestion = false;

//check for quiz id
const challengeIdFromUrl =
    urlParams.get("challenge");

const CHALLENGE_ID =
    challengeIdFromUrl ||
    "groningen-quick-challenge";

const currentChallenge =
    challenges.find(function (challenge) {

        return challenge.id === CHALLENGE_ID;

    });

if (!currentChallenge) {

    throw new Error(
        `Challenge not found: ${CHALLENGE_ID}`
    );

}

const questions =
    quizQuestions[
    CHALLENGE_ID
    ];

if (!questions) {

    throw new Error(
        `Question set not found for challenge: ${CHALLENGE_ID}`
    );

}

// const CHALLENGE_ID = "groningen-quick-challenge";  - HARD CODED VERSION FOR TESTING PURPOSES

/* WRAPPER */
function sendWrapperTestMessage() {

    window.top.postMessage(
        {
            type: "tsh-wrapper-test",
            challengeId:
                "groningen-quick-challenge"
        },
        "*"
    );

}


function changeQuizState(updateFunction) {

    const quizStage = document.getElementById("quiz-stage");

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    if (prefersReducedMotion) {

        updateFunction();

        return;

    }


    quizStage.classList.remove("is-entering");

    quizStage.classList.add("is-leaving");


    quizStage.addEventListener("transitionend", function handleTransition() {

        updateFunction();

        quizStage.classList.remove("is-leaving");


        void quizStage.offsetWidth;


        quizStage.classList.add("is-entering");


        quizStage.addEventListener("animationend", function () {

            quizStage.classList.remove("is-entering");

        }, { once: true });


    }, { once: true });

}

function showChallengeIntro() {

    const questionElement =
        document.getElementById("question");

    const answersElement =
        document.getElementById("answers");

    const feedbackElement =
        document.getElementById("feedback");

    const questionCounter =
        document.getElementById("question-counter");

    const progressElement =
        document.getElementById("progress");

    const answerInstruction =
        document.getElementById(
            "answer-instruction"
        );


    /*
        Opening this screen is the first
        measurable evidence that the user
        intentionally discovered this challenge.
    */

    markChallengeDiscovered(
        CHALLENGE_ID
    );


    questionCounter.textContent = "";

    progressElement.style.display =
        "none";


    questionElement.textContent =
        currentChallenge.name;


    answerInstruction.textContent =
        `${questions.length} questions · ${currentChallenge.estimatedTime}`;

    answerInstruction.style.display =
        "";


    answersElement.innerHTML = "";


    feedbackElement.innerHTML = `

        <div class="challenge-intro">

            <p class="challenge-intro-text">
                ${currentChallenge.description}
            </p>

            <div class="challenge-intro-note">

                <strong>
                    Earn Hub Points as you play.
                </strong>

                <span>
                    Correct answers earn points,
                    with an extra bonus when you
                    get them right on your first try.
                </span>

            </div>

            <button
                type="button"
                class="feedback-button"
                onclick="startChallenge()">

                Start challenge

                <span aria-hidden="true">
                    →
                </span>

            </button>

            <button
                type="button"
                class="secondary-button"
                onclick="openMySocialHub()">

                My Social Hub

            </button>

        </div>
    `;


    const startButton =
        feedbackElement.querySelector(
            ".feedback-button"
        );


    if (startButton) {

        startButton.focus({
            preventScroll: true
        });

    }

}
function startChallenge() {

    sendWrapperTestMessage();

    changeQuizState(function () {

        currentQuestion = 0;

        totalPoints = 0;
        firstTryBonuses = 0;
        attemptedCurrentQuestion = false;


        const progressElement =
            document.getElementById(
                "progress"
            );

        const answerInstruction =
            document.getElementById(
                "answer-instruction"
            );


        progressElement.style.display = "";

        answerInstruction.textContent =
            "Pick an answer";


        loadQuestion();

    });

}

function loadQuestion() {

    attemptedCurrentQuestion = false;

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

    questions.forEach(function (question, index) {

        const progressItem = document.createElement("div");
        progressItem.classList.add("progress-item");


        const progressNode = document.createElement("span");
        progressNode.classList.add("progress-node");

        if (index <= currentQuestion) {
            progressNode.classList.add("active");

            if (index === currentQuestion) {
                progressNode.classList.add("current");
            }
        }

        progressItem.appendChild(progressNode);


        if (index < questions.length - 1) {

            const progressLine = document.createElement("span");
            progressLine.classList.add("progress-line");

            if (index < currentQuestion) {
                progressLine.classList.add("active");
            }

            progressItem.appendChild(progressLine);

        }


        progressElement.appendChild(progressItem);

    });


    answersElement.innerHTML = "";
    answersElement.style.display = "";

    feedbackElement.innerHTML = "";
    answerInstruction.style.display = "";


    const answerLetters = ["A", "B", "C", "D"];


    questionData.answers.forEach(function (answer, index) {

        const button = document.createElement("button");
        button.type = "button";

        button.classList.add("answer-button");

        button.innerHTML = `
            <span class="answer-letter">
                ${answerLetters[index]}
            </span>

            <span class="answer-text">
                ${answer}
            </span>
        `;

        button.onclick = function () {
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


    answerButtons.forEach(function (button) {
        button.disabled = true;
    });


    changeQuizState(function () {

        answersElement.style.display = "none";
        answerInstruction.style.display = "none";


        if (selectedAnswer === questionData.correctAnswer) {

            let earnedPoints = BASE_POINTS;
            let earnedFirstTryBonus = false;

            if (!attemptedCurrentQuestion) {

                earnedPoints += FIRST_TRY_BONUS;
                firstTryBonuses++;

                earnedFirstTryBonus = true;

            }

            totalPoints += earnedPoints;


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

            <div class="points-reward">

                <div class="points-earned">
                    +${earnedPoints}
                    <span>points</span>
                </div>

                ${earnedFirstTryBonus
                    ? `
                        <div class="first-try-bonus">
                            First-try bonus +${FIRST_TRY_BONUS}
                        </div>
                    `
                    : ""
                }

            </div>

            <button
                type="button"
                class="feedback-button"
                onclick="continueQuiz()">

                Next one

                <span aria-hidden="true">→</span>

            </button>

        </div>
    `;

        } else {

            attemptedCurrentQuestion = true;

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

                    <button
                        type="button"
                        class="feedback-button"
                        onclick="tryAgain()">
                        Try Again
                    </button>

                </div>
            `;

        }


        const feedbackButton = feedback.querySelector(".feedback-button");

        if (feedbackButton) {
            feedbackButton.focus({
                preventScroll: true
            });
        }


    });

}


function tryAgain() {

    const feedback = document.getElementById("feedback");
    const answersElement = document.getElementById("answers");
    const answerInstruction = document.getElementById("answer-instruction");
    const answerButtons = document.querySelectorAll("#answers button");


    changeQuizState(function () {

        feedback.innerHTML = "";

        answersElement.style.display = "";

        answerInstruction.style.display = "";


        answerButtons.forEach(function (button) {
            button.disabled = false;
        });

    });

}

function continueQuiz() {

    changeQuizState(function () {

        if (currentQuestion < questions.length - 1) {

            currentQuestion++;

            loadQuestion();

        } else {

            showCompletion();

        }

    });

}

function getCompletionMessage() {

    if (firstTryBonuses === questions.length) {
        return "Nailed it!";
    }

    if (firstTryBonuses >= Math.ceil(questions.length / 2)) {
        return "Nice work!";
    }

    return "You made it!";

}

function getBonusMessage() {

    if (firstTryBonuses === questions.length) {

        return `
            <div class="bonus-summary bonus-summary-perfect">
                <strong>Perfect run!</strong>
                You got every question right on your first try
                and earned every available first-try bonus.
            </div>
        `;

    }

    return `
        <div class="bonus-summary">
            <strong>Want to beat your score?</strong>
            Get a question right on your first try to earn
            an extra +50 points.
        </div>
    `;

}

function showCompletion() {

    const questionElement = document.getElementById("question");
    const answersElement = document.getElementById("answers");
    const feedbackElement = document.getElementById("feedback");
    const answerInstruction = document.getElementById("answer-instruction");

    const completionMessage = getCompletionMessage();
    const bonusMessage = getBonusMessage();

    //badge
    const completionResult =
        completeChallenge();

    const unlockedBadges =
        completionResult.unlockedBadges;

    let personalBestHTML = "";

    if (
        completionResult.isNewBest &&
        completionResult.previousBestScore > 0
    ) {

        personalBestHTML = `
        <div class="personal-best">

            <div class="personal-best-title">
                ↑ New personal best +${completionResult.scoreImprovement}
            </div>

            <div class="personal-best-detail">
                +${completionResult.scoreImprovement} Hub Points from improvement
            </div>

        </div>
    `;

    }


    let badgeUnlockHTML = "";


    if (unlockedBadges.length > 0) {

        const rewardItems =
            unlockedBadges
                .map(function (badge) {

                    return `
                    <div class="reward-item">

                        <div class="reward-info">

                            <span class="reward-icon">
                                ${badge.icon}
                            </span>

                            <span class="reward-name">
                                ${badge.name}
                            </span>

                        </div>

                        <span class="reward-points">
                            +${badge.reward}
                        </span>

                    </div>
                `;

                })
                .join("");


        badgeUnlockHTML = `
        <div class="rewards-summary">

            <div class="rewards-heading">
                Rewards unlocked
            </div>

            ${rewardItems}

        </div>
    `;

    }

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

        <h2>${completionMessage}</h2>

        <div class="completion-score">

            <div class="completion-points">
                ${totalPoints}
            </div>

            <div class="completion-points-label">
                Challenge score
            </div>

        </div>

        
        
        ${personalBestHTML}

        <div class="completion-bonuses">
            ${firstTryBonuses}
            ${firstTryBonuses === 1
            ? "first-try bonus"
            : "first-try bonuses"
        }
        </div>

        ${bonusMessage}

        ${badgeUnlockHTML}

        <div class="hub-points-total">

            <span class="hub-points-label">
                Hub Points
            </span>

            <span class="hub-points-value">
                ${tourProgress.hubPoints}
            </span>

        </div>

        <p>
            You completed all ${questions.length} questions.
            Keep exploring The Social Hub.
        </p>

        <button
            type="button"
            class="feedback-button"
            onclick="restartQuiz()">

            Restart challenge

            <span
                class="restart-icon"
                aria-hidden="true">
                ↻
            </span>

        </button>

        <button
            type="button"
            class="secondary-button"
            onclick="openMySocialHub()">

            My Social Hub

        </button>

    </div>
`;


    const restartButton =
        feedbackElement.querySelector(".feedback-button");


    if (restartButton) {

        restartButton.focus({
            preventScroll: true
        });

    }

}

function restartQuiz() {

    changeQuizState(function () {

        currentQuestion = 0;

        totalPoints = 0;
        firstTryBonuses = 0;
        attemptedCurrentQuestion = false;

        loadQuestion();

    });

}

loadTourProgress();
loadQuestion();

//badges functions moved to progress.js


function completeChallenge() {

    return completeChallengeProgress({

        challengeId:
            CHALLENGE_ID,

        challengePoints:
            totalPoints,

        firstTryBonuses:
            firstTryBonuses,

        totalQuestions:
            questions.length

    });

}

function createDevTools() {

    const devTools =
        document.createElement("div");

    devTools.classList.add("dev-tools");


    const resetButton =
        document.createElement("button");

    resetButton.type = "button";
    resetButton.classList.add("dev-reset-button");

    resetButton.textContent =
        "Reset test progress";


    resetButton.onclick = function () {

        localStorage.removeItem(
            "tshTourProgress"
        );

        window.location.reload();

    };


    devTools.appendChild(
        resetButton
    );

    document.body.appendChild(
        devTools
    );

}

function buildInternalPageUrl(pageName) {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const queryString =
        params.toString();


    return queryString
        ? `${pageName}?${queryString}`
        : pageName;

}


function openMySocialHub() {

    const params =
        new URLSearchParams();


    if (isEmbedMode) {

        params.set(
            "embed",
            "1"
        );

    }


    if (isDevMode) {

        params.set(
            "dev",
            "1"
        );

    }


    const queryString =
        params.toString();


    window.location.href =
        queryString
            ? `hub.html?${queryString}`
            : "hub.html";

}


loadTourProgress();
showChallengeIntro();