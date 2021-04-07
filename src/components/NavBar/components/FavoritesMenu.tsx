import { useFavorites } from "../../../context/favorites-context";

import { Menu, MenuButton, MenuItems } from "../../Menu";
import TeamLogo from "../../TeamLogo";
import { Link } from "react-router-dom";
import PlayerPortrait from "../../PlayerPortrait";

type FavoritesMenuProps = {
  onItemClick: () => void;
};
export default function FavoritesMenu({ onItemClick }: FavoritesMenuProps) {
  const { favorites } = useFavorites();
  const { teams, players } = favorites;
  return (
    <Menu>
      {({ isOpen, setIsOpen }) => (
        <>
          <MenuButton className="w-full p-4 sm:p-2 text-left dark:hover:bg-gray-700">
            Favorites
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
            {teams.length ? (
              <div className="p-4 whitespace-nowrap flex-shrink-0">
                <h3 className="text-sm text-gray-400">Teams</h3>
                <ul>
                  {teams.map((team) => (
                    <li key={team.id}>
                      <Link
                        className="block hover:underline py-2"
                        onClick={() => {
                          setIsOpen(false);
                          onItemClick();
                        }}
                        to={`/teams/${team.id}`}
                      >
                        <TeamLogo className="inline-block" teamId={team.id} teamName={team.name} size="small" />
                        {team.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {players.length ? (
              <div className="p-4 whitespace-nowrap flex-shrink-0">
                <h3 className="text-sm text-gray-400">Players</h3>
                <ul>
                  {players.map((player) => (
                    <li key={player.id}>
                      <Link
                        className="block hover:underline py-2"
                        onClick={() => {
                          setIsOpen(false);
                          onItemClick();
                        }}
                        to={`/players/${player.id}`}
                      >
                        <PlayerPortrait
                          className="inline-block rounded-full"
                          playerId={player.id}
                          playerName={player.name}
                          size="small"
                        />
                        {player.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </MenuItems>
        </>
      )}
    </Menu>
  );
}
