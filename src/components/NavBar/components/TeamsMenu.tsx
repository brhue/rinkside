import { Link } from "react-router-dom";

import { Menu, MenuButton, MenuItems } from "../../Menu";
import { teams } from "../../../utils";
import TeamLogo from "../../TeamLogo";

type Divisions = keyof typeof teams;
type TeamsMenuProps = {
  onItemClick: () => void;
};

export default function TeamsMenu({ onItemClick }: TeamsMenuProps) {
  return (
    <>
      <Menu>
        {({ isOpen, setIsOpen }) => (
          <>
            <MenuButton className="w-full px-3 py-2 text-left rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
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
            </MenuButton>
            <MenuItems
              className={`flex flex-col sm:flex-row drop-down w-full sm:w-max ${
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
                                onItemClick();
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
            </MenuItems>
          </>
        )}
      </Menu>
    </>
  );
}
