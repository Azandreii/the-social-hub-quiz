const urlParams = new URLSearchParams(window.location.search);

if (urlParams.get("embed") === "1") {
    document.body.classList.add("embed-mode");
}

let currentQuestion = 0;

//gamification vars
const BASE_POINTS = 100;
const FIRST_TRY_BONUS = 50;
let totalPoints = 0;
let firstTryBonuses = 0;
let attemptedCurrentQuestion = false;

//global point system
let tourProgress = {
    hubPoints: 0,
    completedChallenges: [],
    unlockedBadges: []
};

const CHALLENGE_ID = "groningen-quick-challenge";

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
    const unlockedBadges =
        completeChallenge();

    let badgeUnlockHTML = "";


    if (unlockedBadges.length > 0) {

        badgeUnlockHTML =
            unlockedBadges
                .map(function (badge) {

                    return `
                    <div class="badge-unlock">

                        <div class="badge-icon">
                            ${badge.icon}
                        </div>

                        <div class="badge-content">

                            <div class="badge-kicker">
                                Badge unlocked
                            </div>

                            <div class="badge-name">
                                ${badge.name}
                            </div>

                            <div class="badge-description">
                                ${badge.description}
                            </div>

                            <div class="badge-reward">
                                +${badge.reward} Hub Points
                            </div>

                        </div>

                    </div>
                `;

                })
                .join("");

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
                Points
            </div>

        </div>

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

//badges functions

function saveTourProgress() {

    localStorage.setItem(
        "tshTourProgress",
        JSON.stringify(tourProgress)
    );

}


function loadTourProgress() {

    const savedProgress =
        localStorage.getItem("tshTourProgress");


    if (!savedProgress) {
        return;
    }


    try {

        const parsedProgress =
            JSON.parse(savedProgress);


        if (parsedProgress) {

            tourProgress = {
                hubPoints:
                    parsedProgress.hubPoints || 0,

                completedChallenges:
                    parsedProgress.completedChallenges || [],

                unlockedBadges:
                    parsedProgress.unlockedBadges || []
            };

        }

    } catch (error) {

        console.error(
            "Could not load saved tour progress:",
            error
        );

    }

}

function getBadgeById(badgeId) {

    return badges.find(function (badge) {
        return badge.id === badgeId;
    });

}

function unlockBadge(badgeId) {

    if (tourProgress.unlockedBadges.includes(badgeId)) {
        return null;
    }


    const badge = getBadgeById(badgeId);


    if (!badge) {
        return null;
    }


    tourProgress.unlockedBadges.push(badgeId);

    tourProgress.hubPoints += badge.reward;


    saveTourProgress();


    return badge;

}

function evaluateBadges(context) {

    const newlyUnlockedBadges = [];


    badges.forEach(function (badge) {

        if (
            tourProgress.unlockedBadges.includes(
                badge.id
            )
        ) {
            return;
        }


        if (
            typeof badge.condition !== "function"
        ) {
            return;
        }


        const conditionMet =
            badge.condition(
                tourProgress,
                context
            );


        if (!conditionMet) {
            return;
        }


        const unlockedBadge =
            unlockBadge(badge.id);


        if (unlockedBadge) {

            newlyUnlockedBadges.push(
                unlockedBadge
            );

        }

    });


    return newlyUnlockedBadges;

}

function completeChallenge() {

    const isAlreadyCompleted =
        tourProgress.completedChallenges.includes(
            CHALLENGE_ID
        );


    if (!isAlreadyCompleted) {

        tourProgress.completedChallenges.push(
            CHALLENGE_ID
        );

        tourProgress.hubPoints += totalPoints;

    }


    const badgeContext = {

        challengeId:
            CHALLENGE_ID,

        challengePoints:
            totalPoints,

        firstTryBonuses:
            firstTryBonuses,

        totalQuestions:
            questions.length,

        isFirstCompletion:
            !isAlreadyCompleted

    };


    const unlockedBadges =
        evaluateBadges(
            badgeContext
        );


    saveTourProgress();


    return unlockedBadges;

}

loadTourProgress();
loadQuestion();