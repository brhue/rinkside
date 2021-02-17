import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import SkaterTable from "../components/SkaterTable";
import HeadToHead from "../components/HeadToHead";

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
  const awayTeamStats = gameData.liveData.boxscore.teams.away.teamStats.teamSkaterStats;
  const homeTeamPlayers = gameData.liveData.boxscore.teams.home.players;
  const homeTeamSkaters = gameData.liveData.boxscore.teams.home.skaters.filter(
    (skater) => !gameData.liveData.boxscore.teams.home.scratches.includes(skater)
  );
  const homeTeamStats = gameData.liveData.boxscore.teams.home.teamStats.teamSkaterStats;

  const gameTeamStats = {
    goals: {
      display: "Goals",
      away: awayTeamStats.goals,
      home: homeTeamStats.goals,
    },
    shots: {
      display: "Shots",
      away: awayTeamStats.shots,
      home: homeTeamStats.shots,
    },
    pim: {
      display: "PIM",
      away: awayTeamStats.pim,
      home: homeTeamStats.pim,
    },
    powerPlays: {
      display: "Power Plays",
      away: `${awayTeamStats.powerPlayGoals}/${awayTeamStats.powerPlayOpportunities}`,
      home: `${homeTeamStats.powerPlayGoals}/${homeTeamStats.powerPlayOpportunities}`,
    },
    ppPercentage: {
      display: "Power Play %",
      away: awayTeamStats.powerPlayPercentage,
      home: homeTeamStats.powerPlayPercentage,
    },
    foPercentage: {
      display: "Face-Off Win %",
      away: awayTeamStats.faceOffWinPercentage,
      home: homeTeamStats.faceOffWinPercentage,
    },
    blocked: {
      display: "Blocked",
      away: awayTeamStats.blocked,
      home: homeTeamStats.blocked,
    },
    takeaways: {
      display: "Takeaways",
      away: awayTeamStats.takeaways,
      home: homeTeamStats.takeaways,
    },
    giveaways: {
      display: "Giveaways",
      away: awayTeamStats.giveaways,
      home: homeTeamStats.giveaways,
    },
    hits: {
      display: "Hits",
      away: awayTeamStats.hits,
      home: homeTeamStats.hits,
    },
  };

  return (
    <div className="container">
      <div>
        <HeadToHead
          away={gameData.liveData.boxscore.teams.away.team.id}
          home={gameData.liveData.boxscore.teams.home.team.id}
        />
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>{gameData.liveData.boxscore.teams.away.team.triCode}</th>
              <th>{gameData.liveData.boxscore.teams.home.team.triCode}</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(gameTeamStats).map((category, i) => {
              return (
                <tr key={i}>
                  <td>{gameTeamStats[category].display}</td>
                  <td>{gameTeamStats[category].away}</td>
                  <td>{gameTeamStats[category].home}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div>
        <h2>{gameData.liveData.linescore.teams.away.team.name}</h2>
        <SkaterTable skaters={awayTeamSkaters} allPlayers={awayTeamPlayers} />
        <h2>{gameData.liveData.linescore.teams.home.team.name}</h2>
        <SkaterTable skaters={homeTeamSkaters} allPlayers={homeTeamPlayers} />
      </div>
    </div>
  );
}
