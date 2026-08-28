// GLOBAL TOUR PROGRESSION

let tourProgress = {
    hubPoints: 0,

    challengeProgress: {},

    unlockedBadges: []
};


const PROGRESS_STORAGE_KEY = "tshTourProgress";


// SAVE PROGRESS

function saveTourProgress() {

    localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(tourProgress)
    );

    sendProgressToWrapper();
}

function sendProgressToWrapper() {

    if (window.top === window) {
        return;
    }

    const progressForWrapper = {
        hubPoints:
            tourProgress.hubPoints,

        challengeProgress:
            tourProgress.challengeProgress,

        unlockedBadges:
            tourProgress.unlockedBadges
    };

    const progressJson =
        JSON.stringify(progressForWrapper);

    if (
        progressJson ===
        lastSentProgressJson
    ) {
        return;
    }

    lastSentProgressJson =
        progressJson;

    window.top.postMessage(
        {
            type:
                "tsh-progress-update",

            progress:
                progressForWrapper
        },
        "https://azandreii.github.io"
    );
}



// LOAD PROGRESS

function loadTourProgress() {

    const savedProgress =
        localStorage.getItem(PROGRESS_STORAGE_KEY);

    let lastSentProgressJson = null;


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

                challengeProgress:
                    parsedProgress.challengeProgress || {},

                unlockedBadges:
                    parsedProgress.unlockedBadges || []

            };

        }

        if (
            !tourProgress.challengeProgress ||
            typeof tourProgress.challengeProgress !== "object"
        ) {

            tourProgress.challengeProgress = {};

        }

    } catch (error) {

        console.error(
            "Could not load saved tour progress:",
            error
        );

    }

}

function getTourProgressSummary() {

    const challengeEntries =
        Object.entries(
            tourProgress.challengeProgress
        );


    const discoveredChallenges =
        challengeEntries.filter(function(entry) {

            const challenge = entry[1];

            return challenge.discovered === true;

        }).length;


    const completedChallenges =
        challengeEntries.filter(function(entry) {

            const challenge = entry[1];

            return challenge.completed === true;

        }).length;


    return {

        hubPoints:
            tourProgress.hubPoints,

        discoveredChallenges:
            discoveredChallenges,

        completedChallenges:
            completedChallenges,

        challengeProgress:
            tourProgress.challengeProgress,

        unlockedBadges:
            tourProgress.unlockedBadges

    };

}

// BADGE LOOKUP

function getBadgeById(badgeId) {

    return badges.find(function (badge) {
        return badge.id === badgeId;
    });

}


// UNLOCK BADGE

function unlockBadge(badgeId) {

    if (
        tourProgress.unlockedBadges.includes(
            badgeId
        )
    ) {
        return null;
    }


    const badge =
        getBadgeById(badgeId);


    if (!badge) {
        return null;
    }


    tourProgress.unlockedBadges.push(
        badgeId
    );

    tourProgress.hubPoints +=
        badge.reward;


    saveTourProgress();


    return badge;

}


// CHECK ALL BADGES

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
            unlockBadge(
                badge.id
            );


        if (unlockedBadge) {

            newlyUnlockedBadges.push(
                unlockedBadge
            );

        }

    });


    return newlyUnlockedBadges;

}


// marked discovered

function markChallengeDiscovered(challengeId) {

    if (!tourProgress.challengeProgress) {

        tourProgress.challengeProgress = {};

    }

    const existingProgress =
        tourProgress.challengeProgress[
        challengeId

        ];


    if (existingProgress) {

        existingProgress.discovered = true;

    } else {

        tourProgress.challengeProgress[
            challengeId
        ] = {

            discovered: true,
            completed: false,
            bestScore: 0

        };

    }


    saveTourProgress();

}

// RECORD A CHALLENGE COMPLETION

function completeChallengeProgress(
    challengeData
) {

    const challengeId =
        challengeData.challengeId;

    const challengePoints =
        challengeData.challengePoints;

    const firstTryBonuses =
        challengeData.firstTryBonuses;

    const totalQuestions =
        challengeData.totalQuestions;


    const previousChallengeProgress =
        tourProgress.challengeProgress[
        challengeId
        ];


    const previousBestScore =
        previousChallengeProgress
            ? previousChallengeProgress.bestScore
            : 0;


    const isFirstCompletion =
        !previousChallengeProgress ||
        !previousChallengeProgress.completed;


    /*
        PERSONAL BEST SYSTEM

        Hub Points only increase when the
        current score is higher than the
        previous best score.

        This rewards genuine improvement
        while preventing repeated farming.
    */

    let scoreImprovement = 0;


    if (
        challengePoints >
        previousBestScore
    ) {

        scoreImprovement =
            challengePoints -
            previousBestScore;


        tourProgress.hubPoints +=
            scoreImprovement;


        tourProgress.challengeProgress[
            challengeId
        ] = {

            discovered: true,

            completed: true,

            bestScore:
                challengePoints

        };

    }


    /*
        If this is the first completion and
        the score happened to be zero,
        still record that the challenge
        has been completed.
    */

    if (isFirstCompletion) {

        tourProgress.challengeProgress[
            challengeId
        ] = {

            discovered: true,

            completed: true,

            bestScore:
                challengePoints

        };

    }


    const badgeContext = {

        challengeId:
            challengeId,

        challengePoints:
            challengePoints,

        previousBestScore:
            previousBestScore,

        scoreImprovement:
            scoreImprovement,

        firstTryBonuses:
            firstTryBonuses,

        totalQuestions:
            totalQuestions,

        isFirstCompletion:
            isFirstCompletion

    };


    const unlockedBadges =
        evaluateBadges(
            badgeContext
        );


    saveTourProgress();


    return {
        unlockedBadges: unlockedBadges,
        previousBestScore: previousBestScore,
        scoreImprovement: scoreImprovement,
        isNewBest:
            challengePoints > previousBestScore
    };

}