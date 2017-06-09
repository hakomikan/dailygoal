import * as React from "react";
import * as ReactDOM from "react-dom";
import * as axios from "axios";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as mui from "material-ui";
import * as icons from "material-ui/svg-icons";
import { Router, Route, Link, browserHistory, hashHistory } from "react-router";
var Calendar : any = require("material-ui/DatePicker/Calendar");
var injectTapEventPlugin : any = require('react-tap-event-plugin');
injectTapEventPlugin();

interface Goal {
  _id?: string;
  subject: string;
}

interface Report {
  _id?: string,
  goal_id: string,
  date: Date
}


interface IAppProps {
}

interface IAppState {
  goals: Goal[];
}

class GoalItem extends React.Component<{goal: Goal, model: any}, {isEditing: boolean}> {
  constructor(props) {
    super(props);

    this.state = {isEditing: false};
  }

  delete() {
    this.props.model.delete(this.props.goal._id);
  }

  render() {
    if(this.state.isEditing) {
      return (
        <GoalEditor goal={this.props.goal} model={this.props.model} cancel={()=>{this.setState({isEditing: false})}}/>
      );
    }
    else {
      return (
        <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #A7FFEB"}}>
          <mui.CardHeader
            title={this.props.goal.subject}
            subtitle={this.props.goal._id}>
            <div style={{float: "right"}}>
              <mui.FlatButton label="Edit" labelStyle={{color: "#90CAF9"}} icon={<icons.ContentCreate color="#90CAF9"/>} onClick={()=>this.setState({isEditing: true})}/>
              <mui.FlatButton label="Delete" labelStyle={{color: "#EF9A9A"}} icon={<icons.ActionDelete color="#EF9A9A"/>} onClick={()=>this.delete()}/>
            </div>
          </mui.CardHeader>
        </mui.Card>
      );
    }
  }
}

class GoalEditor extends React.Component<{goal?: Goal, model: any, cancel?: ()=>void}, {isUpdating: boolean, goal: Goal}> {
  constructor(props) {
    super(props);

    this.state = {
      isUpdating: this.props.goal ? true : false, 
      goal: this.props.goal ? this.props.goal : { subject: "" },
    }
  }

  render() {
    return (
      <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #64FFDA"}}>
        <mui.CardActions>
          <mui.TextField
            floatingLabelText="Subject"
            defaultValue={this.state.goal.subject}
            ref="subject"
          />
          {(() => {
            if(this.state.isUpdating) {
              return (
                <div style={{float: "right"}}>
                  <mui.FlatButton
                    label="Update"
                    labelStyle={{color: "#90CAF9"}}
                    icon={<icons.ContentCreate color="#90CAF9"/>}
                    onClick={()=>{
                      console.log(`update: ${this.props.goal._id}`);
                      this.props.model.update(this.props.goal._id, {subject: (this.refs["subject"] as any).getValue().trim()});
                      this.props.cancel();
                    }}/>
                  <mui.FlatButton
                    label="Cancel"
                    labelStyle={{color: "#90CAF9"}}
                    icon={<icons.ContentUndo color="#90CAF9"/>}
                    onClick={this.props.cancel}
                    />
                </div>);
            }
            else {
              return (<mui.FlatButton
                label="Create"
                style={{float: "right"}}
                labelStyle={{color: "#90CAF9"}}
                icon={<icons.ContentAdd color="#90CAF9"/>}
                onClick={()=>{
                  this.props.model.create({subject: (this.refs["subject"] as any).getValue().trim()});
                  (this.refs["subject"] as any).input.value = "";
                }}/>);
            }
          })()}
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

class ReportItem extends React.Component<{report: Report, model: any}, {}> {
  constructor(props) {
    super(props);
  }

  delete() {
    this.props.model.delete(this.props.report._id);
  }

  render() {
    return (
      <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #A7FFEB"}}>
        <mui.CardHeader
          title={this.props.report.goal_id}
          subtitle={this.props.report.date}>
          <div style={{float: "right"}}>
            <mui.FlatButton label="Delete" labelStyle={{color: "#EF9A9A"}} icon={<icons.ActionDelete color="#EF9A9A"/>} onClick={()=>this.delete()}/>
          </div>
        </mui.CardHeader>
      </mui.Card>
    );
  }
}

function ReportList(props) {
  return (
    <div>
      {props.reports.map(
        v => <ReportItem key={v._id} report={v} model={props.model}/>
      )}
    </div>);
}

function DailyGoalMenu(props){
  return (
    <mui.Drawer
      docked={true}
      width={200}
      open={true}
    >
      <mui.AppBar title="daily goal"/>
      <mui.List defaultValue={1}>
        <Link to="/goals"><mui.ListItem primaryText="goals"/></Link>
        <Link to="/reports"><mui.ListItem primaryText="reports"/></Link>
        <Link to="/calender"><mui.ListItem primaryText="calender"/></Link>
      </mui.List>
    </mui.Drawer>
  );
}

function DailyGoalFrame(props) {
  return (
    <MuiThemeProvider>
      <div>
        <mui.AppBar title="daily goal"/>
        <DailyGoalMenu/>
        <div style={{paddingLeft: "220px", marginTop: "20px", width: "100%"}} className="container">
          {props.Content}
        </div>
      </div>
    </MuiThemeProvider>
  );
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

  update(id: string, goal: Goal)
  {
    (async ()=>{
      await axios.put(`/api/goals/${id}`, goal);
      this.refresh();
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });    
  }

  delete(id: string) {
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
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      refresh: this.refresh.bind(this)
    }
  }

  render() {    
    return (
      <DailyGoalFrame Content={<GoalList goals={this.state.goals} model={this.model()}/>}/>
    );
  }
}

class ReportApp extends React.Component<IAppProps, {reports: Report[]}> {
  constructor(props) {
    super(props);
    this.state = {reports: []};
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    (async ()=>{
      let reports = (await axios.get<Report[]>("/api/reports")).data;
      this.setState(prevState => ({reports: reports}));
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });
  }

  create(report: Report)
  {
    (async ()=>{
      await axios.post("/api/reports", report);
      this.refresh();
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });
  }

  update(id: string, report: Report)
  {
    (async ()=>{
      await axios.put(`/api/reports/${id}`, report);
      this.refresh();
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });    
  }

  delete(id: string) {
    (async ()=>{
      await axios.delete(`/api/reports/${id}`);
      this.refresh();
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });
  }

  model(): any {
    return {
      create: this.create.bind(this),
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      refresh: this.refresh.bind(this)
    }
  }

  render() {
    return (
      <DailyGoalFrame Content={<ReportList reports={this.state.reports} model={this.model()}/>}/>
    );
  }
}

class DateRecordItem extends React.Component<{goal: Goal, model: any}, {}> {
  constructor(props) {
    super(props);
  }

  delete() {
    this.props.model.delete(this.props.goal._id);
  }

  render() {
    var self = this;
    return (
      <mui.Card style={{marginBottom: "1em", borderLeft: "8px solid #A7FFEB"}}>
        <mui.CardHeader
          title={
            <mui.Checkbox
              label={self.props.goal.subject}
            />}
          subtitle={this.props.goal._id}>
        </mui.CardHeader>
      </mui.Card>
    );
  }
}


function DateRecordList(props) {
  return (
    <div>
      {props.reports.map(
        v => <DateRecordItem key={v._id} goal={v} model={props.model}/>
      )}
    </div>);
}

class CalenderApp extends React.Component<IAppProps, IAppState> {
  constructor(props) {
    super(props);
    this.state = {goals: []};
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    (async ()=>{
      let goals = (await axios.get<Goal[]>("/api/date/2017-06-09")).data;      // HERE
      console.log(goals);
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

  update(id: string, goal: Goal)
  {
    (async ()=>{
      await axios.put(`/api/goals/${id}`, goal);
      this.refresh();
    })().catch(reason=>{
      console.error(`ERROR: ${reason}`);
    });    
  }

  delete(id: string) {
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
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      refresh: this.refresh.bind(this)
    }
  }

  mystringify(obj) : string {
    var cache = [];
    return JSON.stringify(obj, (key, value) => {
      if (typeof value == 'object' && value == null)
        if(-1 < cache.indexOf(value))
        {
          return cache.indexOf(value);
        }
        cache.push(value);
      return value
    });
  } 

  render() {
    return (
      <DailyGoalFrame Content={
        <div className="row">
          <div className="col-md-4" style={{width: "320px"}}>
            <mui.Paper style={{width: "310px"}}>
              <Calendar.default
                  autoOk={false}
                  disableYearSelection={false}
                  firstDayOfWeek={0}
                  locale={"en-US"}
                  onTouchTapDay={(e,d)=>{e=this.mystringify(d);console.log(`touch ${d}`);}}
                  mode={"portrait"}
                  open={false}
                  ref="calendar"
                  onTouchTapCancel={(e)=>{e=this.mystringify(e);console.log(`cancel ${e}`)}}
                  onTouchTapOk={(e,d)=>{e=JSON.stringify(e);console.log(`ok ${e}`)}}
                  shouldDisableDate={(d)=>{return false;}}
              />
            </mui.Paper>
          </div>
          <div className="col-md-8">
            <DateRecordList reports={this.state.goals} model={this.model()}/>
          </div>
        </div>
      }/>
    );
  }
}

ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={DailyGoalApp}/>
    <Route path="/reports" component={ReportApp}/>
    <Route path="/goals" component={DailyGoalApp}/>
    <Route path="/calender" component={CalenderApp}/>
    <Route path="/calender/:date" component={CalenderApp}/>    
  </Router>,
  document.getElementById("main")
);
