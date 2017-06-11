import * as mongoose from "mongoose";

export var DailyGoalSchema = new mongoose.Schema({
  subject: String,
  owner_id: String,
}, { toJSON: { virtuals: true } });

DailyGoalSchema.virtual("records", {
  ref: 'DoneRecord',
  localField: '_id',
  foreignField: 'goal'
});

class DailyGoalClass
{
  static FindDateRecord(date: Date) : any
  {
    var model : mongoose.Model<mongoose.Document> = this as any;
    return model.find().populate({
      path: "records", 
      match:{ date: date }
    });
  }
}

(DailyGoalSchema as any).loadClass(DailyGoalClass);

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
