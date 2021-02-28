import React from "react";
import { formatISODate } from "../utils";

import Game from "../components/Game";

function Schedule(props) {
  const [scheduleData, setScheduleData] = React.useState({ games: [] });
  const [searchDay, setSearchDay] = React.useState(new Date());
  React.useEffect(() => {
    async function fetchGameData(day) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const scheduleUrl = `${baseUrl}schedule?expand=schedule.linescore`;
      const response = await fetch(scheduleUrl + `&date=${day}`);
      const data = await response.json();
      setScheduleData(data.dates[0]);
      console.log(data);
    }
    fetchGameData(formatISODate(searchDay));
  }, [searchDay]);
  return (
    <>
      <div className="mb-4 flex justify-between items-center text-sm">
        <button
          className="rounded-lg border px-3 py-2 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
          onClick={() => {
            setSearchDay(new Date(searchDay.setDate(searchDay.getDate() - 1)));
          }}
        >
          Previous Day
        </button>
        <span>{searchDay.toDateString()}</span>
        <button
          className="rounded-lg border px-4 py-2 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors"
          onClick={() => {
            setSearchDay(new Date(searchDay.setDate(searchDay.getDate() + 1)));
          }}
        >
          Next Day
        </button>
      </div>
      <div className="">
        <h2 className="text-xl font-semibold mb-4">Today's Games</h2>
        {scheduleData.games.map((game) => {
          return <Game {...game} key={game.gamePk} />;
        })}
      </div>
    </>
  );
}

export default Schedule;
