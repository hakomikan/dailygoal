import * as React from "react";
import * as ReactDOM from "react-dom";

interface IAppProps {
  model : number;
}

interface IAppState {
  items: number[];
}

function GoalList(props) {
  return <ul>{props.data.map(v=><li>{v}</li>)}</ul>;
}

class DailyGoalApp extends React.Component<IAppProps, IAppState> {
  constructor(props) {
    super(props);
    this.state = {items: [1,2,3,4,5]};
  }

  componentDidMount() {
    this.setState(prevState => ({items: prevState.items.concat([1,2,3])}));
  }

  render() {
    return <GoalList data={this.state.items}/>;
  }
}

ReactDOM.render(
  <DailyGoalApp/>,
  document.getElementById("main")
);
