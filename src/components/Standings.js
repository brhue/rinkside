import { useState, useEffect } from "react";

export default function Standings(props) {
  const [standingsData, setStandingsData] = useState({ teamRecords: [] });
  useEffect(() => {
    async function fetchStandingsData() {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const standingsUrl = `${baseUrl}standings/byLeague`;
      const response = await fetch(standingsUrl);
      const data = await response.json();
      setStandingsData(data.records[0]);
    }
    fetchStandingsData();
  }, []);

  function handleSort(sortKey, direction) {
    const sortedArray = [...standingsData.teamRecords];
    if (sortKey === "goals") {
      sortedArray.sort((a, b) => {
        return (b.goalsScored - a.goalsScored) * direction;
      });
    } else if (sortKey === "points") {
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
    setStandingsData({ teamRecords: sortedArray });
  }

  const { teamRecords } = standingsData;

  return (
    <div className="container">
      <table className="w-100">
        <thead>
          <tr>
            <th>Team</th>
            <th>
              <abbr title="Games Played">GP</abbr>
            </th>
            <th>
              <abbr title="Wins">W</abbr>
            </th>
            <th>
              <abbr title="Losses">L</abbr>
            </th>
            <th>
              <abbr title="Overtime Losses">OT</abbr>
            </th>
            <th
              data-dir={1}
              onClick={(e) => {
                const direction = e.currentTarget.getAttribute("data-dir");
                e.currentTarget.setAttribute("data-dir", -direction);
                handleSort("points", direction);
              }}
            >
              <abbr title="Points">PTS</abbr>
            </th>
            <th
              data-dir={1}
              onClick={(e) => {
                const direction = e.currentTarget.getAttribute("data-dir");
                e.currentTarget.setAttribute("data-dir", -direction);
                handleSort("goals", direction);
              }}
            >
              <abbr title="Goals Scored">G</abbr>
            </th>
            <th>
              <abbr title="Goals Against">GA</abbr>
            </th>
            <th
              data-dir={1}
              onClick={(e) => {
                const direction = e.currentTarget.getAttribute("data-dir");
                e.currentTarget.setAttribute("data-dir", -direction);
                handleSort("diff", direction);
              }}
            >
              <abbr title="Goal Differential">DIFF</abbr>
            </th>
          </tr>
        </thead>
        <tbody>
          {teamRecords.map((team) => (
            <tr key={team.team.id}>
              <th>{team.team.name}</th>
              <td>{team.gamesPlayed}</td>
              <td>{team.leagueRecord.wins}</td>
              <td>{team.leagueRecord.losses}</td>
              <td>{team.leagueRecord.ot}</td>
              <td>{team.points}</td>
              <td>{team.goalsScored}</td>
              <td>{team.goalsAgainst}</td>
              <td>{team.goalsScored - team.goalsAgainst}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
