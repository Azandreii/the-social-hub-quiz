const observationUrlParams =
    new URLSearchParams(
        window.location.search
    );


const OBSERVATION_ID =
    observationUrlParams.get(
        "challenge"
    );


const isEmbedMode =
    observationUrlParams.get(
        "embed"
    ) === "1";


const isDevMode =
    observationUrlParams.get(
        "dev"
    ) === "1";


if (isEmbedMode) {

    document.body.classList.add(
        "embed-mode"
    );

}


const currentChallenge =
    challenges.find(function (challenge) {

        return challenge.id ===
            OBSERVATION_ID;

    });


const observationData =
    observationChallenges[
    OBSERVATION_ID
    ];


if (!currentChallenge) {

    throw new Error(
        `Challenge not found: ${OBSERVATION_ID}`
    );

}


if (!observationData) {

    throw new Error(
        `Observation data not found: ${OBSERVATION_ID}`
    );

}


let attemptedObservation = false;


function showObservationIntro() {

    markChallengeDiscovered(
        OBSERVATION_ID
    );


    const questionElement =
        document.getElementById(
            "question"
        );

    const instructionElement =
        document.getElementById(
            "answer-instruction"
        );

    const answersElement =
        document.getElementById(
            "answers"
        );

    const feedbackElement =
        document.getElementById(
            "feedback"
        );

    const progressElement =
        document.getElementById(
            "progress"
        );


    progressElement.style.display =
        "none";


    questionElement.textContent =
        currentChallenge.name;


    instructionElement.textContent =
        currentChallenge.estimatedTime;


    answersElement.innerHTML = "";


    feedbackElement.innerHTML = `

        <div class="challenge-intro">

            <p class="challenge-intro-text">
                ${currentChallenge.description}
            </p>

            <div class="challenge-intro-note">

                <strong>
                    Look around first.
                </strong>

                <span>
                    Close this window using the Kuula X,
                    explore the room carefully,
                    then reopen this challenge when
                    you're ready to answer.
                </span>

            </div>

            <button
                type="button"
                class="feedback-button"
                onclick="showObservationQuestion()">

                I'm ready to answer

                <span aria-hidden="true">
                    →
                </span>

            </button>

            <button
                type="button"
                class="secondary-button"
                onclick="openObservationHub()">

                 My Social Hub

            </button>

        </div>
    `;

}


function showObservationQuestion() {

    const questionElement =
        document.getElementById(
            "question"
        );

    const instructionElement =
        document.getElementById(
            "answer-instruction"
        );

    const answersElement =
        document.getElementById(
            "answers"
        );

    const feedbackElement =
        document.getElementById(
            "feedback"
        );


    feedbackElement.innerHTML = "";

    answersElement.innerHTML = "";

    answersElement.style.display =
    "";


    questionElement.textContent =
        observationData.question;


    instructionElement.textContent =
        "Pick an answer";


    const answerLetters =
        ["A", "B", "C", "D"];


    observationData.answers.forEach(
        function (answer, index) {

            const button =
                document.createElement(
                    "button"
                );

            button.type =
                "button";

            button.classList.add(
                "answer-button"
            );


            button.innerHTML = `

                <span class="answer-letter">
                    ${answerLetters[index]}
                </span>

                <span class="answer-text">
                    ${answer}
                </span>

            `;


            button.onclick =
                function () {

                    checkObservationAnswer(
                        index
                    );

                };


            answersElement.appendChild(
                button
            );

        }
    );

}


function checkObservationAnswer(
    selectedAnswer
) {

    const feedbackElement =
        document.getElementById(
            "feedback"
        );

    const answersElement =
        document.getElementById(
            "answers"
        );

    const isCorrect =
        selectedAnswer ===
        observationData.correctAnswer;


    if (!isCorrect) {

        attemptedObservation =
            true;
        answersElement.style.display =
            "none";


        feedbackElement.innerHTML = `

            <div class="feedback feedback-error">

                <div class="feedback-status">

                    <span class="feedback-icon">
                        ×
                    </span>

                    <span class="feedback-label">
                        Not quite
                    </span>

                </div>

                <h2>
                    Take another look.
                </h2>

                <p>
                    That wasn't the right answer.
                    You can explore the room again
                    and retry.
                </p>

                <button
                    type="button"
                    class="feedback-button"
                    onclick="showObservationQuestion()">

                    Try again

                </button>

            </div>
        `;

        return;

    }


    const earnedPoints =
        observationData.points +
        (
            attemptedObservation
                ? 0
                : observationData.firstTryBonus
        );


    const firstTryBonuses =
        attemptedObservation
            ? 0
            : 1;


    const result =
        completeChallengeProgress({

            challengeId:
                OBSERVATION_ID,

            challengePoints:
                earnedPoints,

            firstTryBonuses:
                firstTryBonuses,

            totalQuestions:
                1

        });


    answersElement.innerHTML = "";


    feedbackElement.innerHTML = `

        <div class="feedback feedback-success">

            <div class="feedback-status">

                <span class="feedback-icon">
                    ✓
                </span>

                <span class="feedback-label">
                    Nice observation
                </span>

            </div>

            <h2>
                Correct!
            </h2>

            <p>
                ${observationData.explanation}
            </p>

            <div class="points-reward">

                <div class="points-earned">
                    +${earnedPoints}
                    <span>
                        points
                    </span>
                </div>

                ${firstTryBonuses === 1
            ? `
                            <div class="first-try-bonus">
                                First-try bonus
                                +${observationData.firstTryBonus}
                            </div>
                        `
            : ""
        }

            </div>

            <button
                type="button"
                class="secondary-button"
                onclick="openObservationHub()">

                My Social Hub

            </button>

        </div>
    `;

}

function retryObservation() {

    const answersElement =
        document.getElementById(
            "answers"
        );


    answersElement.style.display =
        "";


    showObservationQuestion();

}


function openObservationHub() {

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

showObservationIntro();