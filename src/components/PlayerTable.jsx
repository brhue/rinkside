export default function PlayerTable({ skaters, allPlayers, goalies }) {
  // TODO: Is there a better way to do this?
  const skaterStats = [
    {
      key: "goals",
      display: "Goals",
    },
    {
      key: "assists",
      display: "Assists",
    },
    {
      key: "plusMinus",
      display: "+/-",
    },
    {
      key: "shots",
      display: "Shots",
    },
    {
      key: "blocked",
      display: "Blocks",
    },
    {
      key: "hits",
      display: "Hits",
    },
    {
      key: "penaltyMinutes",
      display: "PIM",
    },
    {
      key: "timeOnIce",
      display: "TOI",
    },
  ];
  const goalieStats = [
    {
      key: "saves",
      display: "Saves",
    },
    {
      key: "shots",
      display: "Shots",
    },
    {
      key: "savePercentage",
      display: "Save %",
    },
    {
      key: "timeOnIce",
      display: "TOI",
    },
  ];
  return (
    <>
      {skaters && (
        <table className="table-auto w-full whitespace-nowrap">
          <thead className="text-left border-b">
            <tr>
              <th className="p-1">Player</th>
              {skaterStats.map((stat) => (
                <th key={stat.key} className="p-1">
                  {stat.display}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {skaters.map((skater) => {
              return (
                <tr key={skater} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-1">{allPlayers[`ID${skater}`].person.fullName}</td>
                  {skaterStats.map((stat) => (
                    <td key={stat.key} className="p-1">
                      {allPlayers[`ID${skater}`].stats.skaterStats[stat.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {goalies && (
        <table className="table-auto w-full whitespace-nowrap">
          <thead className="text-left border-b">
            <tr>
              <th className="p-1">Goalie</th>
              {goalieStats.map((stat) => (
                <th key={stat.key} className="p-1">
                  {stat.display}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {goalies.map((goalie) => {
              // Calculate this here because I swear sometimes it doesn't exist on the stats object.
              const savePercentage =
                allPlayers[`ID${goalie}`].stats.goalieStats.saves / allPlayers[`ID${goalie}`].stats.goalieStats.shots;
              return (
                <tr key={goalie} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <td className="p-1">{allPlayers[`ID${goalie}`].person.fullName}</td>
                  {goalieStats.map((stat) => {
                    if (stat.key === "savePercentage") {
                      return (
                        <td key={stat.key} className="p-1">
                          {savePercentage ? savePercentage.toFixed(3) : "-"}
                        </td>
                      );
                    }
                    return (
                      <td key={stat.key} className="p-1">
                        {allPlayers[`ID${goalie}`].stats.goalieStats[stat.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </>
  );
}
