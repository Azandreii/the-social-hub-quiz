const hubUrlParams =
    new URLSearchParams(
        window.location.search
    );


const isEmbedMode =
    hubUrlParams.get("embed") === "1";


const isDevMode =
    hubUrlParams.get("dev") === "1";


if (isEmbedMode) {

    document.body.classList.add(
        "embed-mode"
    );

}


if (isDevMode) {

    const devTools =
        document.getElementById(
            "dev-tools"
        );

    const devResetButton =
        document.getElementById(
            "dev-reset-button"
        );


    if (devTools) {
        devTools.hidden = false;
    }


    if (devResetButton) {

        devResetButton.addEventListener(
            "click",
            function () {

                const shouldReset =
                    window.confirm(
                        "Reset all test progress?"
                    );


                if (!shouldReset) {
                    return;
                }


                localStorage.removeItem(
                    PROGRESS_STORAGE_KEY
                );


                window.location.reload();

            }
        );

    }

}



function buildHubPageUrl(pageName) {

    const targetUrl =
        new URL(
            pageName,
            window.location.href
        );


    const currentParams =
        new URLSearchParams(
            window.location.search
        );


    if (currentParams.get("embed") === "1") {

        targetUrl.searchParams.set(
            "embed",
            "1"
        );

    }


    if (currentParams.get("dev") === "1") {

        targetUrl.searchParams.set(
            "dev",
            "1"
        );

    }


    return (
        targetUrl.pathname.split("/").pop() +
        targetUrl.search
    );

}


function openChallenge(challengeUrl) {

    window.location.href =
        buildHubPageUrl(
            challengeUrl
        );

}


function renderMySocialHub() {

    const summary =
        getTourProgressSummary();


    renderHubPoints(summary);

    renderJourneyProgress(summary);

    renderChallenges(summary);

    renderBadges(summary);

}


function renderHubPoints(summary) {

    const pointsElement =
        document.getElementById(
            "hub-total-points"
        );

    const dashboardPointsElement =
        document.getElementById(
            "hub-dashboard-points-value"
        );


    if (pointsElement) {

        pointsElement.textContent =
            summary.hubPoints;

    }


    if (dashboardPointsElement) {

        dashboardPointsElement.textContent =
            summary.hubPoints;

    }

}


function renderJourneyProgress(summary) {

    const totalChallenges =
        challenges.length;


    const perfectEligibleChallenges =
        challenges.filter(
            function (challenge) {
                return (
                    challenge.supportsPerfect === true
                );
            }
        );


    const totalPerfectEligible =
        perfectEligibleChallenges.length;


    const perfectedChallenges =
        perfectEligibleChallenges.filter(
            function (challenge) {

                const progress =
                    summary.challengeProgress[
                        challenge.id
                    ];


                return (
                    progress &&
                    progress.completed &&
                    progress.bestScore >=
                        challenge.perfectScore
                );

            }
        ).length;

    const findChallenges =
    challenges.filter(
        function (challenge) {

            return (
                challenge.type === "find-it"
            );

        }
    );


const completedFindChallenges =
    findChallenges.filter(
        function (challenge) {

            const progress =
                summary.challengeProgress[
                    challenge.id
                ];

            return (
                progress &&
                progress.completed === true
            );

        }
    ).length;


const findElement =
    document.getElementById(
        "hub-find-count"
    );


if (findElement) {

    findElement.textContent =
        `${completedFindChallenges} / ${findChallenges.length}`;

}


    const discoveredElement =
        document.getElementById(
            "hub-discovered-count"
        );


    const completedElement =
        document.getElementById(
            "hub-completed-count"
        );


    const perfectedElement =
        document.getElementById(
            "hub-perfected-count"
        );


    discoveredElement.textContent =
        `${summary.discoveredChallenges} / ${totalChallenges}`;


    completedElement.textContent =
        `${summary.completedChallenges} / ${totalChallenges}`;


    perfectedElement.textContent =
        `${perfectedChallenges} / ${totalPerfectEligible}`;

}


function renderChallenges(summary) {

    const container =
        document.getElementById(
            "hub-challenges"
        );


    container.innerHTML = "";


    challenges.forEach(
        function (challenge) {

            const progress =
                summary.challengeProgress[
                challenge.id
                ];


            let stateClass =
                "is-locked";

            let perfectClass =
                "";

            let stateIcon =
                "🔒";

            let stateText =
                "Not discovered";

            let detailText =
                "Keep exploring the tour";

            let actionHTML =
                "";


            /*
                DISCOVERED

                The challenge has been opened,
                but has not yet been completed.
            */

            if (
                progress &&
                progress.discovered
            ) {

                stateClass =
                    "is-discovered";

                stateIcon =
                    "○";

                stateText =
                    "Discovered";

                detailText =
                    "Not completed";


                actionHTML = `
                    <button
                        type="button"
                        class="hub-challenge-action"
                        onclick="openChallenge('${challenge.url}')"
                    >
                        Start challenge
                    </button>
                `;

            }


            /*
                COMPLETED

                Completed challenges overwrite
                the discovered state.

                Performance-based challenges
                may additionally reach Perfect.
            */

            if (
                progress &&
                progress.completed
            ) {

                stateClass =
                    "is-completed";

                stateIcon =
                    "✓";

                stateText =
                    "Completed";


                const isPerfect =
                    challenge.supportsPerfect === true &&
                    progress.bestScore >=
                    challenge.perfectScore;


                /*
                    PERFORMANCE-BASED CHALLENGES
                */

                if (
                    challenge.supportsPerfect === true
                ) {

                    if (isPerfect) {

                        perfectClass =
                            "is-perfect";

                        detailText =
                            "Perfect";

                    } else {

                        detailText =
                            `Best ${progress.bestScore}`;

                    }

                }


                /*
                    FIND-IT CHALLENGES

                    These are binary:
                    either the location was found
                    or it was not.

                    There is no Perfect state.
                */

                else if (
                    challenge.type ===
                    "find-it"
                ) {

                    perfectClass =
                        "is-found";

                    detailText =
                        "Found";

                }


                /*
                    FALLBACK FOR ANY FUTURE
                    NON-PERFORMANCE CHALLENGE
                */

                else {

                    detailText =
                        "Completed";

                }


                actionHTML = `
                    <button
                        type="button"
                        class="hub-challenge-action"
                        onclick="openChallenge('${challenge.url}')"
                    >
                        Replay challenge
                    </button>
                `;

            }


            const challengeElement =
                document.createElement(
                    "article"
                );


            challengeElement.className =
                `hub-challenge ${stateClass} ${perfectClass}`;


            challengeElement.innerHTML = `

                <div class="hub-challenge-icon">
                    ${stateIcon}
                </div>

                <div class="hub-challenge-content">

                    <div class="hub-challenge-name">

                        ${progress &&
                    progress.discovered
                    ? challenge.name
                    : "Undiscovered Challenge"
                }

                    </div>

                    <div class="hub-challenge-state">
                        ${stateText}
                        ·
                        ${detailText}
                    </div>

                </div>

                ${actionHTML}

            `;


            container.appendChild(
                challengeElement
            );

        }
    );

}


function renderBadges(summary) {

    const container =
        document.getElementById(
            "hub-badges"
        );


    container.innerHTML = "";


    badges.forEach(function (badge) {

        const isUnlocked =
            summary.unlockedBadges.includes(
                badge.id
            );


        const badgeElement =
            document.createElement(
                "div"
            );


        badgeElement.className =
            isUnlocked
                ? "hub-badge is-unlocked"
                : "hub-badge is-locked";


        badgeElement.innerHTML = `

    <div class="hub-badge-icon">
        ${isUnlocked
                ? badge.icon
                : "?"
            }
    </div>

    <div class="hub-badge-name">
        ${isUnlocked
                ? badge.name
                : "Locked badge"
            }
    </div>

    ${isUnlocked
                ? `
                <div class="hub-badge-reward">
                    +${badge.reward}
                </div>
            `
                : ""
            }

`;


        container.appendChild(
            badgeElement
        );

    });

}


loadTourProgress();

renderMySocialHub();