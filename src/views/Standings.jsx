import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Standings(props) {
  const [standingsData, setStandingsData] = useState([]);
  useEffect(() => {
    async function fetchStandingsData() {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const standingsUrl = `${baseUrl}standings/byLeague`;
      const response = await fetch(standingsUrl);
      const data = await response.json();
      setStandingsData(data.records[0].teamRecords);
    }
    fetchStandingsData();
  }, []);

  function handleSort(sortKey, direction) {
    const sortedArray = [...standingsData];
    if (sortKey === "g") {
      sortedArray.sort((a, b) => {
        return (b.goalsScored - a.goalsScored) * direction;
      });
    } else if (sortKey === "pts") {
      sortedArray.sort((a, b) => {
        return (b.points - a.points) * direction;
      });
    } else if (sortKey === "diff") {
      sortedArray.sort((a, b) => {
        const aDiff = a.goalsScored - a.goalsAgainst;
        const bDiff = b.goalsScored - b.goalsAgainst;
        return (bDiff - aDiff) * direction;
      });
    }
    setStandingsData(sortedArray);
  }

  const tableData = standingsData.map((team) => {
    return {
      team: { ...team.team },
      gp: team.gamesPlayed,
      w: team.leagueRecord.wins,
      l: team.leagueRecord.losses,
      ot: team.leagueRecord.ot,
      pts: team.points,
      g: team.goalsScored,
      ga: team.goalsAgainst,
      diff: team.goalsScored - team.goalsAgainst,
    };
  });

  if (tableData.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-x-scroll">
      <table className="table-auto w-full whitespace-nowrap">
        <thead className="text-left border-b">
          <tr>
            {Object.keys(tableData[0]).map((key) => {
              return (
                <th
                  className="p-1"
                  key={key}
                  data-dir={1}
                  onClick={(e) => {
                    const direction = e.currentTarget.getAttribute("data-dir");
                    e.currentTarget.setAttribute("data-dir", -direction);
                    handleSort(key, direction);
                  }}
                >
                  {key.toUpperCase()}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((team) => (
            <tr key={team.name}>
              {Object.values(team).map((val, i) => {
                if (i === 0) {
                  return (
                    <td key={i}>
                      <Link to={`/teams/${val.id}`}>{val.name}</Link>
                    </td>
                  );
                }
                return (
                  <td key={i} className="p-1">
                    {val}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
