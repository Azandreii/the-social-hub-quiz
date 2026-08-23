const badges = [

    {
        id: "first-steps",

        name: "First Steps",

        description:
            "Complete your first Quick Challenge.",

        reward: 100,

        icon: "★",

        condition: function (progress, context) {

            return (
                Object.keys(
                    progress.challengeProgress
                ).length >= 1
            );

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