const findUrlParams =
    new URLSearchParams(
        window.location.search
    );


const FIND_ID =
    findUrlParams.get(
        "challenge"
    );


const isEmbedMode =
    findUrlParams.get(
        "embed"
    ) === "1";


const isDevMode =
    findUrlParams.get(
        "dev"
    ) === "1";


const isFound =
    findUrlParams.get(
        "found"
    ) === "1";


if (isEmbedMode) {

    document.body.classList.add(
        "embed-mode"
    );

}


const currentChallenge =
    challenges.find(function(challenge) {

        return challenge.id ===
            FIND_ID;

    });


const findData =
    findChallenges[
        FIND_ID
    ];


if (!currentChallenge) {

    throw new Error(
        `Challenge not found: ${FIND_ID}`
    );

}


if (!findData) {

    throw new Error(
        `Find-it data not found: ${FIND_ID}`
    );

}


function showFindIntro() {

    markChallengeDiscovered(
        FIND_ID
    );


    const questionElement =
        document.getElementById(
            "question"
        );

    const instructionElement =
        document.getElementById(
            "answer-instruction"
        );

    const feedbackElement =
        document.getElementById(
            "feedback"
        );


    questionElement.textContent =
        currentChallenge.name;


    instructionElement.textContent =
        currentChallenge.estimatedTime;


    feedbackElement.innerHTML = `

        <div class="challenge-intro">

            <p class="challenge-intro-text">
                ${currentChallenge.description}
            </p>

            <div class="challenge-intro-note">

                <strong>
                    Find it in the tour.
                </strong>

                <span>
                    Close this window using the Kuula X,
                    explore the space,
                    and click the correct target hotspot
                    when you find the reception area.
                </span>

            </div>

            <button
                type="button"
                class="secondary-button"
                onclick="openFindHub()">

                My Social Hub

            </button>

        </div>
    `;

}


function showFindSuccess() {

    markChallengeDiscovered(
        FIND_ID
    );


    const result =
        completeChallengeProgress({

            challengeId:
                FIND_ID,

            challengePoints:
                findData.points,

            firstTryBonuses:
                0,

            totalQuestions:
                1

        });


    const questionElement =
        document.getElementById(
            "question"
        );

    const instructionElement =
        document.getElementById(
            "answer-instruction"
        );

    const feedbackElement =
        document.getElementById(
            "feedback"
        );


    questionElement.textContent =
        findData.successMessage;


    instructionElement.textContent =
        "";


    feedbackElement.innerHTML = `

        <div class="feedback feedback-success">

            <div class="feedback-status">

                <span class="feedback-icon">
                    ✓
                </span>

                <span class="feedback-label">
                    Found
                </span>

            </div>

            <h2>
                Nice work!
            </h2>

            <p>
                ${findData.successDescription}
            </p>

            <div class="points-reward">

                <div class="points-earned">
                    +${findData.points}
                    <span>
                        points
                    </span>
                </div>

            </div>

            <button
                type="button"
                class="secondary-button"
                onclick="openFindHub()">

                My Social Hub

            </button>

        </div>
    `;

}


function openFindHub() {

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


if (isFound) {

    showFindSuccess();

} else {

    showFindIntro();

}