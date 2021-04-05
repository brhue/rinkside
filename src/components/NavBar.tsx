import * as React from "react";
import { Link } from "react-router-dom";

import { teams } from "../utils";
import TeamLogo from "./TeamLogo";
type Divisions = keyof typeof teams;

export default function NavBar() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const domNode = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const onMouseDown = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.nodeName === "BUTTON") return;
      if (!domNode.current?.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onMouseDown, true);
    return () => {
      document.removeEventListener("click", onMouseDown, true);
    };
  }, []);
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
          <button className="w-full p-4 sm:p-2 text-left dark:hover:bg-gray-700" onClick={() => setIsOpen(!isOpen)}>
            Teams
            <span className="inline-block h-5 w-5 align-middle">
              <svg
                className={`${isOpen ? "transform rotate-180" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
          <div
            ref={domNode}
            className={`flex flex-col sm:flex-row drop-down w-max ${
              isOpen ? "h-auto visible" : "invisible h-0 hidden"
            }`}
          >
            {Object.keys(teams).map((division) => {
              return (
                <div key={division} className="p-4 whitespace-nowrap flex-shrink-0">
                  <h3>{division}</h3>
                  <ul>
                    {teams[division as Divisions].map((team) => {
                      return (
                        <li key={team.id}>
                          <Link
                            className="block hover:underline py-2"
                            onClick={() => {
                              setIsOpen(false);
                              setShowMenu(false);
                            }}
                            to={`/teams/${team.id}`}
                          >
                            <TeamLogo
                              className="inline-block"
                              teamId={team.id}
                              teamName={team.shortName}
                              size="small"
                            />{" "}
                            {team.shortName}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
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
