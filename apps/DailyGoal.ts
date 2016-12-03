import * as mongoose from "mongoose";

export var DailyGoalSchema = new mongoose.Schema({
  subject: String,
  owner_id: String,
});

DailyGoalSchema.virtual("records", {
  ref: 'DoneRecord',
  localField: '_id',
  foreignField: 'goal'
});

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
