import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Schedule from "./views/Schedule";
import Standings from "./views/Standings";
import SingleGame from "./views/SingleGame";
import PlayerView from "./views/PlayerView.tsx";
import Team from "./views/Team";
import Stats from "./views/Stats";
import { FavoritesProvider } from "./context/favorites-context";
// import Home from "./views/Home";

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <header className="p-4 border-b mb-4 bg-white dark:bg-gray-800 dark:text-gray-50 dark:border-black">
          <nav className="container mx-auto flex items-center justify-between">
            <h1 className="font-bold text-3xl">
              <Link to="/">Rinkside</Link>
            </h1>
            <ul className="flex space-x-4">
              {/* <li>
                  <Link to="/games">Games</Link>
                </li> */}
              <li>
                <Link className="" to="/standings">
                  Standings
                </Link>
              </li>
              <li>
                <Link to="/stats">Stats</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="px-4">
          <div className="container mx-auto">
            <Switch>
              <Route path="/teams/:teamId">
                <Team />
              </Route>
              <Route path="/players/:playerId">
                <PlayerView />
              </Route>
              <Route path="/game/:gameId">
                <SingleGame />
              </Route>
              <Route path="/standings">
                <Standings />
              </Route>
              <Route path="/stats">
                <Stats />
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
    </FavoritesProvider>
  );
}

export default App;
