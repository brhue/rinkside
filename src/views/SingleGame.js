import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SkaterTable from "../components/SkaterTable";

export default function SingleGame() {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    async function fetchGameData(gameId) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const gameUrl = `${baseUrl}game/${gameId}/feed/live`;
      const response = await fetch(gameUrl);
      const data = await response.json();
      setGameData(data);
      console.log(data);
    }

    fetchGameData(gameId);
  }, [gameId]);

  if (gameData === null) {
    return <h1>Loading...</h1>;
  }

  const awayTeamPlayers = gameData.liveData.boxscore.teams.away.players;
  const awayTeamSkaters = gameData.liveData.boxscore.teams.away.skaters.filter(
    (skater) => !gameData.liveData.boxscore.teams.away.scratches.includes(skater)
  );
  const homeTeamPlayers = gameData.liveData.boxscore.teams.home.players;
  const homeTeamSkaters = gameData.liveData.boxscore.teams.home.skaters.filter(
    (skater) => !gameData.liveData.boxscore.teams.home.scratches.includes(skater)
  );

  return (
    <div className="container">
      <h1>Single Game View</h1>
      <h2>Game: {gameId}</h2>
      <div>
        <h2>{gameData.liveData.linescore.teams.away.team.name}</h2>
        <SkaterTable skaters={awayTeamSkaters} allPlayers={awayTeamPlayers} />
        <h2>{gameData.liveData.linescore.teams.home.team.name}</h2>
        <SkaterTable skaters={homeTeamSkaters} allPlayers={homeTeamPlayers} />
      </div>
    </div>
  );
}
