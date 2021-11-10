import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Bag} from "./components";

function App(props) {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={() => <Home/>}/>
          <Route exact path="/bags" component={() => <Home/>}/>
          <Route exact path="/bags/:id" component={() => <Bag />}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;