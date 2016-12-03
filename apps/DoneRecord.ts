import * as mongoose from "mongoose";

export var DoneRecordSchema : any = {
  goal: { type: mongoose.Schema.Types.ObjectId, ref: 'DailyGoal' },
  date: Date
};

export type DoneRecordEntry = {goal: mongoose.Schema.Types.ObjectId, date: Date};

export var DoneRecordApplication : any = {
  name: "DoneRecord",
  url: "/DoneRecord",
  schema: DoneRecordSchema,
  properties: [
    {
      name: "goal",
      description: "goal id"
    },
    {
      name: "date",
      description: "Done date",
    }
  ],
  summary: {
    columns: ["goal.subject"]
  }
};
