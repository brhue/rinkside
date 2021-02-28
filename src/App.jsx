import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Schedule from "./views/Schedule";
import Standings from "./views/Standings";
import SingleGame from "./views/SingleGame";
import Home from "./views/Home";

function App() {
  return (
    <Router>
      <header className="p-4 border-b mb-4">
        <nav className="container mx-auto flex items-center justify-between">
          <h1 className="font-bold text-3xl">
            <Link to="/">Rinkside</Link>
          </h1>
          <ul>
            {/* <li>
                  <Link to="/games">Games</Link>
                </li> */}
            <li>
              <Link className="" to="/standings">Standings</Link>
            </li>
          </ul>
        </nav>
      </header>
      <main className="px-4">
        <div className="container mx-auto">
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
      <footer className="p-4 text-center">
        <small> &copy; 2021 Bradley Donahue</small>
      </footer>
    </Router>
  );
}

export default App;
