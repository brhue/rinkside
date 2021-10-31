import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import TeamLogo from "../components/TeamLogo";

type TeamRecord = {
  team: {
    id: number;
    name: string;
  };
  leagueRecord: {
    wins: number;
    losses: number;
    ot: number;
  };
  regulationWins: number;
  goalsAgainst: number;
  goalsScored: number;
  points: number;
  divisionRank: string;
  divisionL10Rank: string;
  divisionRoadRank: string;
  divisionHomeRank: string;
  conferenceRank: string;
  conferenceL10Rank: string;
  conferenceRoadRank: string;
  conferenceHomeRank: string;
  leagueRank: string;
  leagueL10Rank: string;
  leagueRoadRank: string;
  leagueHomeRank: string;
  wildCardRank: string;
  row: number;
  gamesPlayed: number;
  streak: any;
  pointsPercentage: number;
  ppDivisionRank: string;
  ppConferenceRank: string;
  ppLeagueRank: string;
  lastUpdated: string;
};

type StandingsRecord = {
  standingsType: StandingsType;
  league?: any;
  conference?: any;
  division?: any;
  teamRecords: TeamRecord[];
};

type StandingsType = "byLeague" | "byConference" | "byDivision" | "wildCard";

export default function Standings() {
  const [standingsData, setStandingsData] = useState<StandingsRecord[]>([]);
  const params: { type: string } = useParams();
  const standingsType = params.type;
  useEffect(() => {
    async function fetchStandingsData() {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const standingsUrl = `${baseUrl}standings/${standingsType}`;
      const response = await fetch(standingsUrl);
      const data = await response.json();
      setStandingsData(data.records);
    }
    fetchStandingsData();
  }, [standingsType]);

  if (standingsData.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex gap-4">
        <Link to="/standings/byLeague">League</Link>
        <Link to="/standings/byConference">Conference</Link>
        <Link to="/standings/byDivision">Division</Link>
        <Link to="/standings/wildCard">Wildcard</Link>
      </div>
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-0">
        {standingsData.map((record) => {
          return (
            // We add the standings type to conference name to create a unique key when looking at
            // wildcard standings versus conference.
            <React.Fragment
              key={record.division?.name || record.conference?.name + record.standingsType || record.league?.name}
            >
              <h2>{record.division?.name || record.conference?.name || record.league?.name}</h2>
              <StandingsTable records={record.teamRecords} />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

type StandingsTableProps = {
  records: TeamRecord[];
};

function StandingsTable({ records }: StandingsTableProps & React.ComponentPropsWithoutRef<"div">) {
  const [standingsData, setStandingsData] = useState(records);

  function handleSort(sortKey: string, direction: number) {
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
    } else if (sortKey === "ga") {
      sortedArray.sort((a, b) => {
        return (b.goalsAgainst - a.goalsAgainst) * direction;
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
  return (
    <div className="py-2 min-w-full inline-block align-middle">
      <div className="bg-white dark:bg-gray-800 sm:rounded-lg overflow-hidden shadow">
        <table className="min-w-full whitespace-nowrap divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="text-left bg-gray-50 dark:bg-gray-700">
            <tr>
              {Object.keys(tableData[0]).map((key) => {
                return (
                  <th
                    scope="col"
                    className="px-3 py-4 text-xs uppercase tracking-wider"
                    key={key}
                    data-dir={1}
                    onClick={(e) => {
                      const direction = Number(e.currentTarget.getAttribute("data-dir"));
                      e.currentTarget.setAttribute("data-dir", String(-direction));
                      handleSort(key, direction);
                    }}
                  >
                    {key}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tableData.map((team) => (
              <tr key={team.team.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {Object.values(team).map((val, i) => {
                  if (typeof val === "object") {
                    return (
                      <td key={i} className="px-3 py-2">
                        <Link to={`/teams/${val.id}`} className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <TeamLogo size="medium" teamId={val.id} teamName={val.name} className="h-10 w-10" />
                          </div>
                          <span className="flex-shrink-0 ml-2">{val.name}</span>
                        </Link>
                      </td>
                    );
                  }
                  return (
                    <td key={i} className="px-3 py-2">
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
