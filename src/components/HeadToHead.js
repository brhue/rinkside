import { useState, useEffect } from "react";

export default function HeadToHead({ away, home }) {
  const [awayTeamData, setAwayTeamData] = useState(null);
  const [homeTeamData, setHomeTeamData] = useState(null);

  useEffect(() => {
    async function getTeamData(teamId) {
      const url = `https://statsapi.web.nhl.com/api/v1/teams/${teamId}/stats`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    getTeamData(away)
      .then(setAwayTeamData)
      .catch((err) => {
        console.error(err);
      });
    getTeamData(home)
      .then(setHomeTeamData)
      .catch((err) => {
        console.error(err);
      });
  }, [away, home]);

  if (awayTeamData === null || homeTeamData === null) {
    return <h1>Loading...</h1>;
  }

  const awayStats = awayTeamData.stats[0].splits[0].stat;
  const awayStatsRankings = awayTeamData.stats[1].splits[0].stat;
  const homeStats = homeTeamData.stats[0].splits[0].stat;
  const homeStatsRankings = homeTeamData.stats[1].splits[0].stat;

  return (
    <>
      <h1>Head to Head</h1>
      <table className="headToHeadStats w-100">
        <thead>
          <tr>
            <th className="text-right">{awayTeamData.stats[0].splits[0].team.name}</th>
            <th></th>
            <th>{homeTeamData.stats[0].splits[0].team.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span>{awayStatsRankings.wins}</span> <span>{awayStats.wins}</span>
            </td>
            <td>Wins</td>
            <td>
              <span>{homeStats.wins}</span> <span>{homeStatsRankings.wins}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.losses}</span> <span>{awayStats.losses}</span>
            </td>
            <td>Losses</td>
            <td>
              <span>{homeStats.losses}</span> <span>{homeStatsRankings.losses}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.ot}</span> <span>{awayStats.ot}</span>
            </td>
            <td>OT</td>
            <td>
              <span>{homeStats.ot}</span> <span>{homeStatsRankings.ot}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.pts}</span> <span>{awayStats.pts}</span>
            </td>
            <td>Points</td>
            <td>
              <span>{homeStats.pts}</span> <span>{homeStatsRankings.pts}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.goalsPerGame}</span> <span>{awayStats.goalsPerGame}</span>
            </td>
            <td>Goals Per Game</td>
            <td>
              <span>{homeStats.goalsPerGame}</span> <span>{homeStatsRankings.goalsPerGame}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.goalsAgainstPerGame}</span> <span>{awayStats.goalsAgainstPerGame}</span>
            </td>
            <td>Goals Against Per Game</td>
            <td>
              <span>{homeStats.goalsAgainstPerGame}</span> <span>{homeStatsRankings.goalsAgainstPerGame}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.shotsPerGame}</span> <span>{awayStats.shotsPerGame}</span>
            </td>
            <td>Shots Per Game</td>
            <td>
              <span>{homeStats.shotsPerGame}</span> <span>{homeStatsRankings.shotsPerGame}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.shotsAllowed}</span> <span>{awayStats.shotsAllowed}</span>
            </td>
            <td>Shots Allowed Per Game</td>
            <td>
              <span>{homeStats.shotsAllowed}</span> <span>{homeStatsRankings.shotsAllowed}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.powerPlayPercentage}</span> <span>{awayStats.powerPlayPercentage}</span>
            </td>
            <td>Power Play %</td>
            <td>
              <span>{homeStats.powerPlayPercentage}</span> <span>{homeStatsRankings.powerPlayPercentage}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.penaltyKillPercentage}</span> <span>{awayStats.penaltyKillPercentage}</span>
            </td>
            <td>Penalty Kill %</td>
            <td>
              <span>{homeStats.penaltyKillPercentage}</span> <span>{homeStatsRankings.penaltyKillPercentage}</span>
            </td>
          </tr>
          <tr>
            <td>
              <span>{awayStatsRankings.faceOffWinPercentage}</span> <span>{awayStats.faceOffWinPercentage}</span>
            </td>
            <td>Face-Off Win %</td>
            <td>
              <span>{homeStats.faceOffWinPercentage}</span> <span>{homeStatsRankings.faceOffWinPercentage}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
