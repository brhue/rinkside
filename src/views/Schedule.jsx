import React from "react";
import { formatISODate } from "../utils";
import "../styles.css";

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
    <div className="container">
      <div className="d-flex m-b-1 justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => {
            setSearchDay(new Date(searchDay.setDate(searchDay.getDate() - 1)));
          }}
        >
          Previous Day
        </button>
        <span>{searchDay.toDateString()}</span>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSearchDay(new Date(searchDay.setDate(searchDay.getDate() + 1)));
          }}
        >
          Next Day
        </button>
      </div>
      <div>
        {scheduleData.games.map((game) => {
          return <Game {...game} key={game.gamePk} />;
        })}
      </div>
    </div>
  );
}

export default Schedule;
