import * as mongoose from "mongoose"

export async function Initialize(
  uristring : string = process.env.MONGODB_URI || 'mongodb://localhost/dailygoal',
  params: {withDropAll?: boolean} = {withDropAll: false}
)
{
  var mngse : any = mongoose;
  mngse.Promise = global.Promise;

  await mongoose.connect(uristring);

  if(params.withDropAll) {
    await mongoose.connection.db.dropDatabase();
  }
}

export async function Finalize()
{
  await ResetModels();
  await mongoose.connection.close();
}

export async function ResetModels()
{
  var connection: any = mongoose.connection;
  for(var modelName of connection.modelNames())
  {
    delete connection.models[modelName];
  }
}