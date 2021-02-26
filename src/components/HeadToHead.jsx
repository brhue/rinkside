import { Link } from "react-router-dom";

export default function HeadToHead({ awayTeamStats, homeTeamStats, pastGames }) {
  const statsToShow = [
    { stat: "wins", display: "Wins" },
    { stat: "losses", display: "Losses" },
    { stat: "ot", display: "OT" },
    { stat: "pts", display: "Points" },
    { stat: "goalsPerGame", display: "Goals" },
    { stat: "goalsAgainstPerGame", display: "Goals Against" },
    { stat: "shotsPerGame", display: "Shots" },
    { stat: "shotsAllowed", display: "Shots" },
    { stat: "powerPlayPercentage", display: "Power Play %" },
    { stat: "penaltyKillPercentage", display: "Penalty Kill %" },
    { stat: "faceOffWinPercentage", display: "Face Off %" },
  ];
  const awayStats = awayTeamStats.stats[0].splits[0].stat;
  const awayStatsRankings = awayTeamStats.stats[0].splits[1].stat;
  const homeStats = homeTeamStats.stats[0].splits[0].stat;
  const homeStatsRankings = homeTeamStats.stats[0].splits[1].stat;
  return (
    <>
      <h2 className="text-xl mb-4 font-bold">Head to Head</h2>
      <div className="grid md:grid-cols-2">
        <table className="w-full table-auto whitespace-normal mb-4">
          <thead>
            <tr>
              <th className="text-right">{awayTeamStats.stats[0].splits[0].team.name}</th>
              <th></th>
              <th>{homeTeamStats.stats[0].splits[0].team.name}</th>
            </tr>
          </thead>
          <tbody>
            {statsToShow.map(({stat, display}) => {
              return (
                <tr key={stat}>
                  <td className="flex justify-between">
                    <span>{awayStatsRankings[stat]}</span> <span>{awayStats[stat]}</span>
                  </td>
                  <td className="text-center">{display}</td>
                  <td className="flex justify-between">
                    <span>{homeStats[stat]}</span> <span>{homeStatsRankings[stat]}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <PastGames pastGames={pastGames} />
      </div>
    </>
  );
}

function PastGames({ pastGames }) {
  return (
    <div className="">
      <h2 className="text-xl mb-4 font-bold">Previous Games</h2>
      {pastGames.dates
        .slice(-5)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .map((date) =>
          date.games.map((game) => (
            <Link key={game.gamePk} to={`/game/${game.gamePk}`} className="text-gray-700">
              <div className="flex justify-between px-4 py-2 items-center">
                <p>{date.date}</p>
                <p>
                  {game.teams.away.team.abbreviation} {game.teams.away.score}
                </p>
                <p>
                  {game.teams.home.score} {game.teams.home.team.abbreviation}
                </p>
                <span className="w-5">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
            </Link>
          ))
        )}
    </div>
  );
}
