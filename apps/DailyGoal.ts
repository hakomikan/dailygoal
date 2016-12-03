import * as mongoose from "mongoose";

export var DailyGoalSchema : any = {
  subject: String,
  owner_id: String,
};

export var DailyGoalApplication : any = {
  name: "DailyGoal",
  url: "/dailygoal",
  schema: DailyGoalSchema,
  properties: [
    {
      name: "subject",
      description: "DailyGoal"
    }
  ],
  summary: {
    columns: ["subject"]
  }
};
