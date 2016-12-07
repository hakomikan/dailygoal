import * as React from "react";
import * as ReactDOM from "react-dom";
import * as axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as mui from "material-ui";
import * as icons from "material-ui/svg-icons";

interface Goal {
  _id: string;
  subject: string;
}

interface IAppProps {
}

interface IAppState {
  goals: Goal[];
}

function GoalItem(props: {goal: Goal}) {
  return (
    <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #64FFDA"}}>
      <mui.CardHeader
        title={props.goal.subject}
        subtitle={props.goal._id}>
        <div style={{float: "right"}}>
          <mui.FlatButton label="Edit" labelStyle={{color: "#90CAF9"}} icon={<icons.ContentCreate color="#90CAF9"/>} onClick={()=>console.log("edit")}/>
          <mui.FlatButton label="Delete" labelStyle={{color: "#EF9A9A"}} icon={<icons.ActionDelete color="#EF9A9A"/>} onClick={()=>console.log("Delete")}/>
        </div>
      </mui.CardHeader>
    </mui.Card>
  );
}


function GoalList(props) {
  return (
    <div>
      {props.goals.map(
        v => <GoalItem key={v._id} goal={v}/>
      )}
      <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #64FFDA"}}>
        <mui.CardActions>
          <mui.TextField
            floatingLabelText="Subject"
          />
          <mui.FlatButton label="Create" style={{float: "right"}} primary={true} labelStyle={{color: "#90CAF9"}} icon={<icons.ContentAdd color="#90CAF9"/>} onClick={()=>console.log("edit")}/>
        </mui.CardActions>
      </mui.Card>
    </div>);
}

class DailyGoalApp extends React.Component<IAppProps, IAppState> {
  constructor(props) {
    super(props);
    this.state = {goals: []};
  }

  componentDidMount() {
    (async ()=>{
      let goals = (await axios.get<Goal[]>("/api/goals")).data;
      this.setState(prevState => ({goals: goals}));
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });
  }

  render() {
    return <div><h1>DailyGoal</h1><GoalList goals={this.state.goals}/></div>;
  }
}

ReactDOM.render(
  <MuiThemeProvider>
    <DailyGoalApp/>
  </MuiThemeProvider>,
  document.getElementById("main")
);
