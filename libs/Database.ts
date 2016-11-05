import * as mongoose from "mongoose"

export function Initialize()
{
  var uristring = process.env.MONGODB_URI || 'mongodb://localhost/dailygoal'
  mongoose.connect(uristring,
    function (err, res) {
      if (err) {
        console.log ('ERROR connecting to: ' + uristring + '. ' + err);
      } else {
        console.log ('Succeeded connected to: ' + uristring);
      }
    }
  );
}