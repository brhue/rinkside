import React from "react";
import { formatISODate } from "../utils";

import Game from "../components/Game";
import Button from "../components/Button";

function Schedule(props) {
  const [scheduleData, setScheduleData] = React.useState({ games: [] });
  const [searchDay, setSearchDay] = React.useState(new Date());
  React.useEffect(() => {
    async function fetchGameData(day) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const scheduleUrl = `${baseUrl}schedule?expand=schedule.linescore,schedule.teams`;
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
        <div className="grid gap-4 sm:grid-cols-2">
          {scheduleData.games.map((game) => {
            return <Game {...game} key={game.gamePk} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Schedule;
