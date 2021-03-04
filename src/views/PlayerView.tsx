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
  console.log(lastFiveGames);
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <img
          src={`https://cms.nhl.bamgrid.com/images/headshots/current/168x168/${playerId}@2x.jpg`}
          alt={`Headshot of ${player.fullName}`}
        />
        <h2>{player.fullName}</h2>
        <p>Number: {player.primaryNumber}</p>

        <p>Born {new Date(player.birthDate).toLocaleDateString()}</p>
        <p>Age {player.currentAge}</p>
        <p>
          From {player.birthCity}, {player.birthStateProvince || player.birthCountry}
        </p>
        <p className="flex flex-col">
          <span>Goals {currentSeasonStats.goals}</span>
          <span>Season Avg: {(currentSeasonStats.goals / currentSeasonStats.games).toFixed(2)}</span>
          <span>Last 5 Avg: {(lastFiveSums.goals / 5).toFixed(2)}</span>
        </p>
        <p className="flex flex-col">
          <span>Assists {currentSeasonStats.assists}</span>
          <span>Season Avg: {(currentSeasonStats.assists / currentSeasonStats.games).toFixed(2)}</span>
          <span>Last 5 Avg: {(lastFiveSums.assists / 5).toFixed(2)}</span>
        </p>
        <p className="flex flex-col">
          <span>Points {currentSeasonStats.points}</span>
          <span>Season Avg: {(currentSeasonStats.points / currentSeasonStats.games).toFixed(2)}</span>
          <span>Last 5 Avg: {(lastFiveSums.points / 5).toFixed(2)}</span>
        </p>
        <div className="overflow-x-scroll">
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>Season</th>
                {Object.keys(statsToShow).map((key) => (
                  <th key={key}>
                    <abbr title={statsToShow[key].title}>{key.toUpperCase()}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{season}</td>
                {Object.values(statsToShow).map((val, i) => (
                  <td key={i}>{val.val}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="overflow-x-scroll">
          <h2>Last 5 Games</h2>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>Opponent</th>
                <th>Date</th>
                {Object.keys(tableStats).map((key) => (
                  <th key={key}>
                    <abbr title={tableStats[key].title}>{tableStats[key].abbr.toUpperCase()}</abbr>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lastFiveGames.map((game: { [key: string]: any }) => (
                <tr key={game.game.gamePk}>
                  <td>{game.opponent.abbreviation}</td>
                  <td>{game.date}</td>
                  {/** stat values */}
                  {Object.keys(tableStats).map((key) => (
                    <td key={key}>{game.stat[key]}</td>
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
