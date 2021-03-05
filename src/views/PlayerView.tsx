import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// TODO: Properly type this?
type PlayerData = {
  copyright: String;
  people: any[];
};

export default function PlayerView() {
  const { playerId } = useParams<{ playerId: string }>();
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getPlayer() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://statsapi.web.nhl.com/api/v1/people/${playerId}?expand=person.stats,stats.team&stats=yearByYear,gameLog`
        );
        const data = await response.json();
        setIsLoading(false);
        setPlayerData(data);
      } catch (err) {
        setIsError(true);
      }
    }
    getPlayer();
  }, [playerId]);

  if (isLoading || playerData === null) return <p>Loading...</p>;
  if (isError) return <p>There was an error fetching the data.</p>;

  const player = playerData.people[0];
  const { stats } = player;
  const [yearByYearStats, gameLogStats] = stats;
  const { stat: currentSeasonStats, season } = yearByYearStats.splits[yearByYearStats.splits.length - 1];
  const statsToShow: { [key: string]: { title: string; val: number } } = {
    gp: { title: "Games Played", val: currentSeasonStats.games },
    g: { title: "Goals", val: currentSeasonStats.goals },
    a: { title: "Assists", val: currentSeasonStats.assists },
    p: { title: "Points", val: currentSeasonStats.points },
    "+/-": { title: "Plus Minus", val: currentSeasonStats.plusMinus },
    pim: { title: "Penalty Minutes", val: currentSeasonStats.pim },
    ppg: { title: "Power Play Goals", val: currentSeasonStats.powerPlayGoals },
    ppp: { title: "Power Play Points", val: currentSeasonStats.powerPlayPoints },
    shg: { title: "Shorthanded Goals", val: currentSeasonStats.shortHandedGoals },
    shp: { title: "Shorthanded Points", val: currentSeasonStats.shortHandedPoints },
    gwg: { title: "Game Winning Goals", val: currentSeasonStats.gameWinningGoals },
    otg: { title: "Overtime Goals", val: currentSeasonStats.overTimeGoals },
    s: { title: "Shots", val: currentSeasonStats.shots },
    "s%": { title: "Shot Percentage", val: currentSeasonStats.shotPct },
  };

  const tableStats: { [key: string]: { title: string; abbr: string } } = {
    games: { title: "Games Played", abbr: "gp" },
    goals: { title: "Goals", abbr: "g" },
    assists: { title: "Assists", abbr: "a" },
    points: { title: "Points", abbr: "p" },
    plusMinus: { title: "Plus Minus", abbr: "+/-" },
    pim: { title: "Penalty Minutes", abbr: "pim" },
    powerPlayGoals: { title: "Power Play Goals", abbr: "ppg" },
    powerPlayPoints: { title: "Power Play Points", abbr: "ppp" },
    shortHandedGoals: { title: "Shorthanded Goals", abbr: "shg" },
    shortHandedPoints: { title: "Shorthanded Points", abbr: "shp" },
    gameWinningGoals: { title: "Game Winning Goals", abbr: "gwg" },
    overTimeGoals: { title: "Overtime Goals", abbr: "otg" },
    shots: { title: "Shots", abbr: "s" },
    shotPct: { title: "Shot Percentage", abbr: "s%" },
  };

  const lastFiveGames: Array<{ [key: string]: any }> = gameLogStats.splits.slice(0, 5);
  const lastFiveSums = lastFiveGames.reduce(
    (sum: { goals: number; points: number; assists: number }, game) => {
      sum.goals += game.stat.goals;
      sum.assists += game.stat.assists;
      sum.points += game.stat.points;
      return sum;
    },
    { goals: 0, points: 0, assists: 0 }
  );

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 space-y-4">
        <div className="space-y-4">
          <div className="text-center">
            <div className="relative inline-block">
              <img
                className="rounded-2xl"
                width="336"
                height="336"
                src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerId}@2x.jpg`}
                alt={`Headshot of ${player.fullName}`}
              />
              <span className="absolute top-2 left-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                {"#" + player.primaryNumber}
              </span>
              <span className="absolute top-2 right-2 bg-gray-100 dark:bg-gray-900 p-2 rounded-lg">
                {player.primaryPosition.abbreviation}
              </span>
            </div>
          </div>
          <h2 className="text-2xl text-center tracking-wide uppercase">{player.fullName}</h2>
          <div className="flex space-x-4 justify-center">
            <p className="grid p-2 rounded-lg bg-gray-100 bg-gradient-to-b dark:from-gray-600 dark:to-gray-700 shadow-md">
              <span>Born</span> <span>{new Date(player.birthDate).toLocaleDateString()}</span>
            </p>
            <p className="grid p-2 rounded-lg bg-gray-100 bg-gradient-to-b dark:from-gray-600 dark:to-gray-700 shadow-md">
              <span>Age</span> <span>{player.currentAge}</span>
            </p>
            <p className="grid p-2 rounded-lg bg-gray-100 bg-gradient-to-b dark:from-gray-600 dark:to-gray-700 shadow-md">
              <span>Nationality</span> <span>{player.nationality}</span>
            </p>
          </div>
        </div>
        <div className="grid grid-rows-3 sm:grid-rows-none sm:grid-cols-3 text-center gap-4 animate-fade">
          <p className="flex flex-col p-2 rounded-xl bg-gradient-to-b dark:from-gray-600 dark:to-gray-700 shadow-md">
            <span className="text-xl font-bold">Goals</span>
            <span>{currentSeasonStats.goals}</span>
            <span>Season Avg: {(currentSeasonStats.goals / currentSeasonStats.games).toFixed(2)}</span>
            <span>Last 5 Avg: {(lastFiveSums.goals / 5).toFixed(2)}</span>
          </p>
          <p className="flex flex-col p-2 rounded-xl bg-gradient-to-b dark:from-gray-600 dark:to-gray-700 shadow-md">
            <span className="text-xl font-bold">Assists</span>
            <span>{currentSeasonStats.assists}</span>
            <span>Season Avg: {(currentSeasonStats.assists / currentSeasonStats.games).toFixed(2)}</span>
            <span>Last 5 Avg: {(lastFiveSums.assists / 5).toFixed(2)}</span>
          </p>
          <p className="flex flex-col p-2 rounded-xl bg-gradient-to-b dark:from-gray-600 dark:to-gray-700 shadow-md">
            <span className="text-xl font-bold">Points</span>
            <span>{currentSeasonStats.points}</span>
            <span>Season Avg: {`${(currentSeasonStats.points / currentSeasonStats.games).toFixed(2)}`}</span>
            <span>Last 5 Avg: {`${(lastFiveSums.points / 5).toFixed(2)}`}</span>
          </p>
        </div>
        <div className="overflow-x-scroll">
          <table className="w-full text-center whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-2">Season</th>
                {Object.keys(statsToShow).map((key) => (
                  <th key={key} className="p-2">
                    <abbr title={statsToShow[key].title}>{key.toUpperCase()}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">{season}</td>
                {Object.values(statsToShow).map((val, i) => (
                  <td key={i} className="p-2">
                    {val.val}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-scroll">
          <h2 className="text-xl text-center">Last 5 Games</h2>
          <table className="w-full text-center whitespace-nowrap">
            <thead>
              <tr>
                <th className="p-2">Opponent</th>
                <th className="p-2">Date</th>
                {Object.keys(tableStats).map((key) => (
                  <th key={key} className="p-2">
                    <abbr title={tableStats[key].title}>{tableStats[key].abbr.toUpperCase()}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lastFiveGames.map((game: { [key: string]: any }) => (
                <tr
                  key={game.game.gamePk}
                  className="even:bg-gray-200 hover:bg-gray-300 dark:even:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                >
                  <td className="p-2">{game.opponent.abbreviation}</td>
                  <td className="p-2">{game.date}</td>
                  {/** stat values */}
                  {Object.keys(tableStats).map((key) => (
                    <td key={key} className="p-2">
                      {game.stat[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
