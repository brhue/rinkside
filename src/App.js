import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Schedule from "./components/Schedule";
import Standings from "./components/Standings";

function App() {
  return (
    <Router>
      <div>
        <header className="m-b-1">
          <nav className="container d-flex align-items-baseline justify-content-between">
            <h1>
              <Link to="/">Hockey Info</Link>
            </h1>
            <ul>
              <li>
                <Link to="/standings">Standings</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Switch>
            <Route path="/standings">
              <Standings />
            </Route>
            <Route path="/">
              <Schedule />
            </Route>
          </Switch>
        </main>
        <footer className="text-center m-t-auto p-1">
          <small> &copy; 2021 Bradley Donahue</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
