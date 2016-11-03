export var DailyGoalModel : any = {
  subject: String,
};

export var DailyGoalApplication : any = {
  name: "DailyGoal",
  url: "/dailygoal",
  model: DailyGoalModel,
  properties: [
    {
      name: "subject",
      description: "DailyGoal"
    }
  ]
};
