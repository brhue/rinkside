import { Link } from "react-router-dom";

export default function HeadToHead({ awayTeamStats, homeTeamStats, pastGames }) {
  const awayStats = awayTeamStats.stats[0].splits[0].stat;
  const awayStatsRankings = awayTeamStats.stats[0].splits[1].stat;
  const homeStats = homeTeamStats.stats[0].splits[0].stat;
  const homeStatsRankings = homeTeamStats.stats[0].splits[1].stat;

  return (
    <>
      <h2>Head to Head</h2>
      <table className="headToHeadStats w-100">
        <thead>
          <tr>
            <th className="text-right">{awayTeamStats.stats[0].splits[0].team.name}</th>
            <th></th>
            <th>{homeTeamStats.stats[0].splits[0].team.name}</th>
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
      <PastGames pastGames={pastGames} />
    </>
  );
}

function PastGames({ pastGames }) {
  return (
    <div className="pastGames">
      <h2>Previous Games</h2>
      {pastGames.dates
        .slice(-5)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((date) =>
          date.games.map((game) => (
            <Link key={game.gamePk} to={`/game/${game.gamePk}`} style={{ color: "#333" }}>
              <div className="d-flex justify-content-between">
                <p>{date.date}</p>
                <p>
                  {game.teams.away.team.abbreviation} {game.teams.away.score}
                </p>
                <p>
                  {game.teams.home.score} {game.teams.home.team.abbreviation}
                </p>
              </div>
            </Link>
          ))
        )}
    </div>
  );
}
