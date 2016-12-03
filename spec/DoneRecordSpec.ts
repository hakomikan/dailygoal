/// <reference path="../typings/index.d.ts" />
import {WrapAsync} from "./helper/helper";
import {CrudApplication} from '../libs/CrudApplication';
import {DailyGoalApplication} from '../apps/DailyGoal';
import {DoneRecordApplication, DoneRecordEntry} from '../apps/DoneRecord';
import * as Database from "../libs/Database";

describe("DoneRecord", () => {
  beforeAll(WrapAsync(async () => {
    await Database.Initialize('mongodb://localhost/dailygoal-test', {withDropAll: true})
  }));

  afterAll(WrapAsync(async () => {
    await Database.Finalize();
  }));

  it("should access the goal's subject.", WrapAsync( async () => {
    var dailyGoalModel = CrudApplication.RegisterModel(DailyGoalApplication);
    var doneRecordModel = CrudApplication.RegisterModel(DoneRecordApplication);

    let sampleGoal = await new dailyGoalModel({subject: "test subject"}).save();
    expect(await dailyGoalModel.count({})).toBe(1);

    let sampleRecord = await new doneRecordModel({goal: sampleGoal._id, date: new Date("2016-12-03")} as DoneRecordEntry).save();
    expect(await doneRecordModel.count({})).toBe(1);

    let populated: any = await doneRecordModel.find().populate("goal").findOne();
    expect(populated.goal.subject).toEqual("test subject");

    let populated2: any = await dailyGoalModel.find().populate("records").findOne();
    expect(populated2.records[0].date).toEqual(new Date("2016-12-03"));
  }));
});
