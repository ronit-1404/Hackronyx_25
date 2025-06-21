export const fakeParentData = {
    parents: [
        {
            id: 1,
            name: "Aniket Sharma",
            linkedStudents: [
                {
                    id: 101,
                    name: "Ruby Sharma",
                    engagementScore: 85,
                    lastSessionTags: ["Math", "Science"],
                },
                {
                    id: 102,
                    name: "Ronit Sharma",
                    engagementScore: 78,
                    lastSessionTags: ["Literature", "History"],
                },
            ],
        },
        {
            id: 2,
            name: "Ayan Singh",
            linkedStudents: [
                {
                    id: 103,
                    name: "Arman Singh",
                    engagementScore: 90,
                    lastSessionTags: ["Art", "Music"],
                },
            ],
        },
    ],
    suggestions: [
        {
            id: 1,
            message: "Encourage your child to take breaks during study sessions.",
        },
        {
            id: 2,
            message: "Review the last session's topics to reinforce learning.",
        },
    ],
};