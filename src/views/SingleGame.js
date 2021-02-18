import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlayerTable from "../components/PlayerTable";
import HeadToHead from "../components/HeadToHead";

export default function SingleGame() {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
  const [awayTeamData, setAwayTeamData] = useState(null);
  const [homeTeamData, setHomeTeamData] = useState(null);

  useEffect(() => {
    async function getTeamData(teamId) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const url = `${baseUrl}teams/${teamId}?expand=team.stats,team.schedule.next,team.schedule.previous`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    async function fetchGameData(gameId) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const gameUrl = `${baseUrl}game/${gameId}/feed/live`;
      const response = await fetch(gameUrl);
      const data = await response.json();
      const away = data.liveData.boxscore.teams.away.team.id;
      const home = data.liveData.boxscore.teams.home.team.id;
      const awayData = await getTeamData(away);
      const homeData = await getTeamData(home);

      console.log(data);
      setGameData(data);
      setAwayTeamData(awayData);
      setHomeTeamData(homeData);
    }

    fetchGameData(gameId);
  }, [gameId]);

  if (gameData === null || awayTeamData === null || homeTeamData === null) {
    return <h1>Loading...</h1>;
  }

  const awayTeamPlayers = gameData.liveData.boxscore.teams.away.players;
  const awayTeamSkaters = gameData.liveData.boxscore.teams.away.skaters.filter(
    (skater) => !gameData.liveData.boxscore.teams.away.scratches.includes(skater)
  );
  const awayTeamGoalies = gameData.liveData.boxscore.teams.away.goalies;
  const awayTeamStats = gameData.liveData.boxscore.teams.away.teamStats.teamSkaterStats;
  const homeTeamPlayers = gameData.liveData.boxscore.teams.home.players;
  const homeTeamSkaters = gameData.liveData.boxscore.teams.home.skaters.filter(
    (skater) => !gameData.liveData.boxscore.teams.home.scratches.includes(skater)
  );
  const homeTeamGoalies = gameData.liveData.boxscore.teams.home.goalies;
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
          awayTeamStats={{ stats: awayTeamData.teams[0].teamStats}}
          homeTeamStats={{ stats: homeTeamData.teams[0].teamStats}}
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
        <PlayerTable skaters={awayTeamSkaters} allPlayers={awayTeamPlayers} />
        <PlayerTable goalies={awayTeamGoalies} allPlayers={awayTeamPlayers} />
        <h2>{gameData.liveData.linescore.teams.home.team.name}</h2>
        <PlayerTable skaters={homeTeamSkaters} allPlayers={homeTeamPlayers} />
        <PlayerTable goalies={homeTeamGoalies} allPlayers={homeTeamPlayers} />
      </div>
    </div>
  );
}
