import * as React from "react";
import { Link } from "react-router-dom";

import TeamsMenu from "./components/TeamsMenu";

export default function NavBar() {
  const [showMenu, setShowMenu] = React.useState(false);
  return (
    <nav className="container mx-auto flex items-center justify-between">
      <h1 className="font-bold text-3xl">
        <Link to="/">Rinkside</Link>
      </h1>
      <button className="sm:hidden" onClick={() => setShowMenu(!showMenu)}>
        {showMenu ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </button>
      <ul
        className={`flex flex-col sm:flex-row sm:space-x-4 ${
          showMenu ? "absolute top-16 left-0 h-auto w-full dark:bg-gray-800 z-10" : "hidden sm:flex"
        }`}
      >
        <li className="relative">
          <TeamsMenu onItemClick={() => setShowMenu(false)} />
        </li>
        <li>
          <Link className="block p-4 sm:p-2 dark:hover:bg-gray-700" to="/standings" onClick={() => setShowMenu(false)}>
            Standings
          </Link>
        </li>
        <li>
          <Link className="block p-4 sm:p-2 dark:hover:bg-gray-700" to="/stats" onClick={() => setShowMenu(false)}>
            Stats
          </Link>
        </li>
      </ul>
    </nav>
  );
}
