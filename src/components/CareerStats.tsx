import { SyntheticEvent, useState } from "react";

type CareerStatsProps = {
  splits: any[];
  tableStats: Record<string, { title: string; abbr: string }>;
};

export default function CareerStats({ splits, tableStats }: CareerStatsProps) {
  const [leagueToShow, setLeagueToShow] = useState("National Hockey League");

  function handleLeagueChange(e: SyntheticEvent) {
    // console.log(e.target);
    const target = e.target as HTMLSelectElement;
    setLeagueToShow(target.value);
  }

  // TODO: This is kinda gross?
  const leagues: string[] = Array.from(
    new Set(
      splits.reduce((acc, season) => {
        acc.push(season.league.name);
        return acc;
      }, [])
    )
  );

  const splitsToShow = splits.filter((split: any) => split.league.name === leagueToShow);
  return (
    <div className="overflow-x-scroll">
      <h2 className="text-xl text-center">Career Stats</h2>
      <div>
        <select className="text-black" name="league" id="league" value={leagueToShow} onChange={handleLeagueChange}>
          {leagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </div>
      <table className="w-full text-center whitespace-nowrap">
        <thead>
          <tr>
            <th className="p-2">Season</th>
            {Object.keys(tableStats).map((key) => (
              <th key={key} className="p-2">
                <abbr title={tableStats[key].title}>{tableStats[key].abbr.toUpperCase()}</abbr>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {splitsToShow.map((split: any) => (
            <tr key={split.season + "-" + split.sequenceNumber} className="dark:even:bg-gray-700">
              <td className="p-2">{split.season}</td>
              {Object.keys(tableStats).map((key, i) => (
                <td key={i} className="p-2">
                  {split.stat[key] ?? "--"}
                </td>
              ))}
            </tr>
          ))}
          {/* <tr>
            <td className="p-2">Career</td>
            {Object.keys(tableStats).map((key) => (
              <td key={key} className="p-2">
                {careerRegularSeasonStats.splits[0].stat[key]}
              </td>
            ))}
          </tr> */}
        </tbody>
      </table>
    </div>
  );
}
