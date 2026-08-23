const hubUrlParams =
    new URLSearchParams(
        window.location.search
    );


if (
    hubUrlParams.get("embed") === "1"
) {

    document.body.classList.add(
        "embed-mode"
    );

}

function buildHubPageUrl(pageName) {

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


function openChallenge() {

    window.location.href =
        buildHubPageUrl(
            "index.html"
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


    pointsElement.textContent =
        summary.hubPoints;

}


function renderJourneyProgress(summary) {

    const totalChallenges =
        challenges.length;


    const discoveredElement =
        document.getElementById(
            "hub-discovered-count"
        );


    const completedElement =
        document.getElementById(
            "hub-completed-count"
        );


    discoveredElement.textContent =
        `${summary.discoveredChallenges} / ${totalChallenges}`;


    completedElement.textContent =
        `${summary.completedChallenges} / ${totalChallenges}`;

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

            let stateIcon =
                "🔒";

            let stateText =
                "Not discovered";

            let detailText =
                "Keep exploring the tour";

            let actionHTML = "";


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
                    onclick="openChallenge()">

                    Start challenge

                </button>
`;

            }


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

                detailText =
                    `Best ${progress.bestScore}`;

            }


            const challengeElement =
                document.createElement(
                    "article"
                );


            challengeElement.className =
                `hub-challenge ${stateClass}`;


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

        `;


        container.appendChild(
            badgeElement
        );

    });

}


loadTourProgress();

renderMySocialHub();