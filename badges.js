const badges = [

    {
        id: "first-steps",

        name: "First Steps",

        description:
            "Complete your first Quick Challenge.",

        reward: 100,

        icon: "★",

        condition: function (progress) {

            return Object.values(
                progress.challengeProgress
            ).some(function (challenge) {

                return challenge.completed === true;

            });

        }
    },


    {
        id: "perfect-run",

        name: "Perfect Run",

        description:
            "Complete a Quick Challenge with every first-try bonus.",

        reward: 150,

        icon: "✓",

        condition: function (progress, context) {

            return (
                context &&
                context.firstTryBonuses === context.totalQuestions
            );

        }
    },

    {
        id: "perfect-journey",

        name: "Perfect Journey",

        description:
            "Complete every challenge and master every performance challenge.",

        reward: 250,

        icon: "★",

        condition: function (progress) {

            const allChallengesCompleted =
                challenges.every(
                    function (challenge) {

                        const challengeProgress =
                            progress.challengeProgress[
                            challenge.id
                            ];

                        return (
                            challengeProgress &&
                            challengeProgress.completed
                        );

                    }
                );


            const allPerfectChallengesPerfected =
                challenges
                    .filter(
                        function (challenge) {

                            return (
                                challenge.supportsPerfect ===
                                true
                            );

                        }
                    )
                    .every(
                        function (challenge) {

                            const challengeProgress =
                                progress.challengeProgress[
                                challenge.id
                                ];

                            return (
                                challengeProgress &&
                                challengeProgress.bestScore >=
                                challenge.perfectScore
                            );

                        }
                    );


            return (
                allChallengesCompleted &&
                allPerfectChallengesPerfected
            );

        }
    }

];