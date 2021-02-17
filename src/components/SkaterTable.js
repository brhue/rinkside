export default function SkaterTable({ skaters, allPlayers }) {
  return (
    <table>
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
  );
}
