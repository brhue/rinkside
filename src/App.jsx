import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Schedule from "./views/Schedule";
import Standings from "./views/Standings";
import SingleGame from "./views/SingleGame";
import Home from "./views/Home";

function App() {
  return (
    <Router>
      <div>
        <header className="m-b-1">
          <nav className="container d-flex align-items-baseline justify-content-between p-1">
            <h1>
              <Link to="/">Hockey Info</Link>
            </h1>
            <ul>
              {/* <li>
                <Link to="/games">Games</Link>
              </li> */}
              <li>
                <Link to="/standings">Standings</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <div className="container">
            <Switch>
              <Route path="/game/:gameId">
                <SingleGame />
              </Route>
              <Route path="/standings">
                <Standings />
              </Route>
              {/* <Route path="/games">
                <Schedule />
              </Route> */}
              <Route path="/">
                <Schedule />
              </Route>
            </Switch>
          </div>
        </main>
        <footer className="text-center m-t-auto p-1">
          <small> &copy; 2021 Bradley Donahue</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
