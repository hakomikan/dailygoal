import * as React from "react";
import * as ReactDOM from "react-dom";
import * as axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as mui from "material-ui";
import * as icons from "material-ui/svg-icons";

interface Goal {
  _id?: string;
  subject: string;
}

interface IAppProps {
}

interface IAppState {
  goals: Goal[];
}

class GoalItem extends React.Component<{goal: Goal, model: any}, {}> {
  constructor(props) {
    super(props);
  }

  delete() {
    this.props.model.delete(this.props.goal._id);
  }

  render() {
    return (
      <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #A7FFEB"}}>
        <mui.CardHeader
          title={this.props.goal.subject}
          subtitle={this.props.goal._id}>
          <div style={{float: "right"}}>
            <mui.FlatButton label="Edit" labelStyle={{color: "#90CAF9"}} icon={<icons.ContentCreate color="#90CAF9"/>} onClick={()=>console.log("edit")}/>
            <mui.FlatButton label="Delete" labelStyle={{color: "#EF9A9A"}} icon={<icons.ActionDelete color="#EF9A9A"/>} onClick={()=>this.delete()}/>
          </div>
        </mui.CardHeader>
      </mui.Card>
    );
  }
}

class GoalEditor extends React.Component<{model: any}, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #64FFDA"}}>
        <mui.CardActions>
          <mui.TextField
            floatingLabelText="Subject"
            ref="subject"
          />
          <mui.FlatButton
            label="Create"
            style={{float: "right"}}
            labelStyle={{color: "#90CAF9"}}
            icon={<icons.ContentAdd color="#90CAF9"/>}
            onClick={()=>{
              this.props.model.create({subject: (this.refs["subject"] as any).getValue().trim()});
              (this.refs["subject"] as any).input.value = "";
            }}/>
        </mui.CardActions>
      </mui.Card>
    );
  }  
}

function GoalList(props) {
  return (
    <div>
      <GoalEditor model={props.model}/>
      {props.goals.map(
        v => <GoalItem key={v._id} goal={v} model={props.model}/>
      )}
    </div>);
}

class DailyGoalApp extends React.Component<IAppProps, IAppState> {
  constructor(props) {
    super(props);
    this.state = {goals: []};
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    (async ()=>{
      let goals = (await axios.get<Goal[]>("/api/goals")).data;
      this.setState(prevState => ({goals: goals}));
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });
  }

  create(goal: Goal)
  {
    (async ()=>{
      await axios.post("/api/goals", goal);
      this.refresh();
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });
  }

  delete(id: number) {
    (async ()=>{
      await axios.delete(`/api/goals/${id}`);
      this.refresh();
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });
  }

  model(): any {
    return {
      create: this.create.bind(this),
      delete: this.delete.bind(this),
      refresh: this.refresh.bind(this)
    }
  }

  render() {
    return <div><h1>DailyGoal</h1><GoalList goals={this.state.goals} model={this.model()}/></div>;
  }
}

ReactDOM.render(
  <MuiThemeProvider>
    <DailyGoalApp/>
  </MuiThemeProvider>,
  document.getElementById("main")
);
