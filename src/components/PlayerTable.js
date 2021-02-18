export default function PlayerTable({ skaters, allPlayers, goalies }) {
  return (
    <>
      {skaters && (
        <table className="w-100">
          <thead>
            <tr>
              <th>Player</th>
              <th>Position</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>+/-</th>
              <th>Shots</th>
              <th>PIM</th>
              <th>TOI</th>
            </tr>
          </thead>
          <tbody>
            {skaters.map((skater) => {
              return (
                <tr key={skater}>
                  <td>{allPlayers[`ID${skater}`].person.fullName}</td>
                  <td>{allPlayers[`ID${skater}`].position.abbreviation}</td>
                  <td>{allPlayers[`ID${skater}`].stats.skaterStats.goals}</td>
                  <td>{allPlayers[`ID${skater}`].stats.skaterStats.assists}</td>
                  <td>{allPlayers[`ID${skater}`].stats.skaterStats.plusMinus}</td>
                  <td>{allPlayers[`ID${skater}`].stats.skaterStats.shots}</td>
                  <td>{allPlayers[`ID${skater}`].stats.skaterStats.penaltyMinutes}</td>
                  <td>{allPlayers[`ID${skater}`].stats.skaterStats.timeOnIce}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {goalies && (
        <table className="w-100">
          <thead>
            <tr>
              <th>Goalie</th>
              <th>Saves</th>
              <th>Shots</th>
              <th>Save %</th>
              <th>TOI</th>
            </tr>
          </thead>
          <tbody>
            {goalies.map((goalie) => {
              const savePercentage = allPlayers[`ID${goalie}`].stats.goalieStats.saves / allPlayers[`ID${goalie}`].stats.goalieStats.shots;
              return (
                <tr key={goalie}>
                  <td>{allPlayers[`ID${goalie}`].person.fullName}</td>
                  <td>{allPlayers[`ID${goalie}`].stats.goalieStats.saves}</td>
                  <td>{allPlayers[`ID${goalie}`].stats.goalieStats.shots}</td>
                  <td>
                    {savePercentage ? savePercentage.toFixed(3) : "-"}
                  </td>
                  <td>{allPlayers[`ID${goalie}`].stats.goalieStats.timeOnIce}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
