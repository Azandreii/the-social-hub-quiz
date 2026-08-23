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
    }

];