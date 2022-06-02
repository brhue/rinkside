import React from "react";
import { formatISODate } from "../utils";

import Game from "../components/Game";
import Button from "../components/Button";
import { useFavorites } from "../context/favorites-context";
import { client } from "../utils/api-client";

function Schedule(props) {
  const [scheduleData, setScheduleData] = React.useState({ dates: [] });
  const [searchDay, setSearchDay] = React.useState(new Date());
  const { favorites } = useFavorites();
  const [error, setError] = React.useState(false);
  React.useEffect(() => {
    setError(false);
    client(
      `schedule?expand=schedule.linescore,schedule.teams,schedule.game.seriesSummary&date=${formatISODate(searchDay)}`
    )
      .then((data) => {
        setScheduleData(data);
      })
      .catch(() => {
        // TODO: Improve error handling.
        setError(true);
      });
  }, [searchDay]);
  const favoriteTeams = favorites.teams;

  if (error) {
    return <p>There was an issue loading schedule information. Reload to try again.</p>;
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center text-sm">
        <Button
          onClick={() => {
            setSearchDay(new Date(searchDay.setDate(searchDay.getDate() - 1)));
          }}
        >
          Previous Day
        </Button>
        <span>{searchDay.toDateString()}</span>
        <Button
          onClick={() => {
            setSearchDay(new Date(searchDay.setDate(searchDay.getDate() + 1)));
          }}
        >
          Next Day
        </Button>
      </div>
      <div className="">
        <h2 className="text-xl font-semibold mb-4">Today's Games</h2>
        {scheduleData.dates[0]?.games.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {scheduleData.dates.map((date) =>
              date.games.map((game) => {
                let hasFavorite = false;
                favoriteTeams.forEach((team) => {
                  if (game.teams.away.team.id === team.id || game.teams.home.team.id === team.id) {
                    hasFavorite = true;
                  }
                });
                return (
                  <div key={game.gamePk} className="relative">
                    {hasFavorite && (
                      <div className={`h-6 w-6 absolute top-2 left-2 text-yellow-400`}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    <Game {...game} key={game.gamePk} />
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <p className="text-center">No games today.</p>
        )}
      </div>
    </>
  );
}

export default Schedule;
