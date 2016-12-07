import * as React from "react";
import * as ReactDOM from "react-dom";
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
import * as axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as mui from "material-ui";

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
    <p key={props.goal._id}>
      <mui.Paper>{props.goal.subject}</mui.Paper>
    </p>
  );
}

function GoalList(props) {
  return (
    <div>
      {props.goals.map(
        v => (
          <div style={{paddingBottom: "1 em"}} key={v._id}>
            <mui.Paper>{v.subject}</mui.Paper>
          </div>
        )
      )}
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
    return <GoalList goals={this.state.goals}/>;
  }
}

ReactDOM.render(
  <MuiThemeProvider>
    <DailyGoalApp/>
  </MuiThemeProvider>,
  document.getElementById("main")
);
