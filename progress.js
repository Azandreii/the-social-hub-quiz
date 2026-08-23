// GLOBAL TOUR PROGRESSION

let tourProgress = {
    hubPoints: 0,
    completedChallenges: [],
    unlockedBadges: []
};


const PROGRESS_STORAGE_KEY = "tshTourProgress";


// SAVE PROGRESS

function saveTourProgress() {

    localStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(tourProgress)
    );

}


// LOAD PROGRESS

function loadTourProgress() {

    const savedProgress =
        localStorage.getItem(PROGRESS_STORAGE_KEY);


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


// BADGE LOOKUP

function getBadgeById(badgeId) {

    return badges.find(function(badge) {
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


    badges.forEach(function(badge) {

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


    const isAlreadyCompleted =
        tourProgress.completedChallenges.includes(
            challengeId
        );


    /*
        Challenge points are added to the
        persistent total only once.

        Replaying remains possible without
        allowing Hub Point farming.
    */

    if (!isAlreadyCompleted) {

        tourProgress.completedChallenges.push(
            challengeId
        );

        tourProgress.hubPoints +=
            challengePoints;

    }


    const badgeContext = {

        challengeId:
            challengeId,

        challengePoints:
            challengePoints,

        firstTryBonuses:
            firstTryBonuses,

        totalQuestions:
            totalQuestions,

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