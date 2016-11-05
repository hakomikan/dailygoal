import * as mongoose from "mongoose";

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

// TODO: あとで削除する
var DailyGoalSchema = new mongoose.Schema({
  subject: String,
});
mongoose.model('DailyGoal', DailyGoalSchema);

export var DailyGoal = mongoose.model('DailyGoal');
