import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISODate } from "../utils";

import PlayerTable from "../components/PlayerTable";
import HeadToHead from "../components/HeadToHead";
import StatusItem from "../components/StatusItem";

import useGame from "../hooks/useGame";

export default function SingleGame() {
  const { gameId } = useParams();
  const { gameData } = useGame(gameId);
  // const [gameData, setGameData] = useState(null);
  const [awayTeamData, setAwayTeamData] = useState(null);
  const [homeTeamData, setHomeTeamData] = useState(null);
  const [showTeamStats, setShowTeamStats] = useState("away");
  const [infoToShow, setInfoToShow] = useState("head");
  const [pastGames, setPastGames] = useState(null);

  useEffect(() => {
    async function getTeamData(teamId) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const url = `${baseUrl}teams/${teamId}?expand=team.stats,team.schedule.next,team.schedule.previous`;
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    async function fetchGameData(gameId) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const gameUrl = `${baseUrl}game/${gameId}/feed/live`;
      const response = await fetch(gameUrl);
      const data = await response.json();
      const away = data.liveData.boxscore.teams.away.team.id;
      const home = data.liveData.boxscore.teams.home.team.id;
      const awayData = await getTeamData(away);
      const homeData = await getTeamData(home);
      const pastGamesData = await getPastGames(away, home);

      console.log(data);
      //setGameData(data);
      setAwayTeamData(awayData);
      setHomeTeamData(homeData);
      setPastGames(pastGamesData);
      if (data.gameData.status.abstractGameState === "Final" || data.gameData.status.abstractGameState === "Live") {
        setInfoToShow("game");
      }
    }

    async function getPastGames(teamId, opponentId) {
      const now = new Date();
      const url =
        `https://statsapi.web.nhl.com/api/v1/schedule?expand=schedule.teams&teamId=${teamId}&opponentId=${opponentId}&startDate=2018-10-03&endDate=` +
        formatISODate(new Date(now.setDate(now.getDate() - 1)));
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }

    fetchGameData(gameId);
  }, [gameId]);

  if (gameData === null || awayTeamData === null || homeTeamData === null || pastGames === null) {
    return <h1>Loading...</h1>;
  }

  const awayTeamPlayers = gameData.liveData.boxscore.teams.away.players;
  const awayTeamSkaters = gameData.liveData.boxscore.teams.away.skaters.filter(
    (skater) => !gameData.liveData.boxscore.teams.away.scratches.includes(skater)
  );
  const awayTeamGoalies = gameData.liveData.boxscore.teams.away.goalies;
  const awayTeamStats = gameData.liveData.boxscore.teams.away.teamStats.teamSkaterStats;
  const homeTeamPlayers = gameData.liveData.boxscore.teams.home.players;
  const homeTeamSkaters = gameData.liveData.boxscore.teams.home.skaters.filter(
    (skater) => !gameData.liveData.boxscore.teams.home.scratches.includes(skater)
  );
  const homeTeamGoalies = gameData.liveData.boxscore.teams.home.goalies;
  const homeTeamStats = gameData.liveData.boxscore.teams.home.teamStats.teamSkaterStats;

  const gameTeamStats = {
    shots: {
      display: "Shots",
      away: awayTeamStats.shots,
      home: homeTeamStats.shots,
    },
    pim: {
      display: "PIM",
      away: awayTeamStats.pim,
      home: homeTeamStats.pim,
    },
    powerPlays: {
      display: "Power Plays",
      away: `${awayTeamStats.powerPlayGoals}/${awayTeamStats.powerPlayOpportunities}`,
      home: `${homeTeamStats.powerPlayGoals}/${homeTeamStats.powerPlayOpportunities}`,
    },
    ppPercentage: {
      display: "Power Play %",
      away: awayTeamStats.powerPlayPercentage,
      home: homeTeamStats.powerPlayPercentage,
    },
    foPercentage: {
      display: "Face-Off Win %",
      away: awayTeamStats.faceOffWinPercentage,
      home: homeTeamStats.faceOffWinPercentage,
    },
    blocked: {
      display: "Blocked",
      away: awayTeamStats.blocked,
      home: homeTeamStats.blocked,
    },
    takeaways: {
      display: "Takeaways",
      away: awayTeamStats.takeaways,
      home: homeTeamStats.takeaways,
    },
    giveaways: {
      display: "Giveaways",
      away: awayTeamStats.giveaways,
      home: homeTeamStats.giveaways,
    },
    hits: {
      display: "Hits",
      away: awayTeamStats.hits,
      home: homeTeamStats.hits,
    },
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2 text-xs mb-4 sm:flex">
        <button
          className={`py-2 px-3 rounded-full sm:mr-2 ${
            infoToShow === "game" ? "bg-gray-900 dark:bg-gray-700 text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setInfoToShow("game")}
        >
          Game Stats
        </button>
        <button
          className={`py-2 px-4 rounded-full sm:mr-2 ${
            infoToShow === "head" ? "bg-gray-900 dark:bg-gray-700 text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setInfoToShow("head")}
        >
          Head to Head
        </button>
        <button
          className={`py-2 px-4 rounded-full sm:mr-2 ${
            infoToShow === "roster" ? "bg-gray-900 dark:bg-gray-700 text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setInfoToShow("roster")}
        >
          Rosters
        </button>
      </div>
      {infoToShow === "game" && (
        <div>
          <LiveStats {...gameData} gameTeamStats={gameTeamStats} />
        </div>
      )}
      {infoToShow === "head" && (
        <div>
          <HeadToHead
            awayTeamStats={{ stats: awayTeamData.teams[0].teamStats }}
            homeTeamStats={{ stats: homeTeamData.teams[0].teamStats }}
            pastGames={pastGames}
          />
        </div>
      )}
      {infoToShow === "roster" && (
        <div>
          <div className="grid grid-cols-2 gap-2 text-xs mb-4 sm:flex">
            <button
              className={`py-2 px-4 rounded-full sm:mr-2 ${
                showTeamStats === "away" ? "bg-gray-900 dark:bg-gray-700 text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setShowTeamStats("away")}
            >
              {gameData.liveData.linescore.teams.away.team.abbreviation}
            </button>
            <button
              className={`py-2 px-4 rounded-full sm:mr-2 ${
                showTeamStats === "home" ? "bg-gray-900 dark:bg-gray-700 text-white" : "hover:bg-gray-400 dark:hover:bg-gray-700 hover:text-white"
              }`}
              onClick={() => setShowTeamStats("home")}
            >
              {gameData.liveData.linescore.teams.home.team.abbreviation}
            </button>
          </div>
          <div className="rounded-lg shadow-md p-4 bg-white dark:bg-gray-800 overflow-x-scroll">
            {showTeamStats === "away" && (
              <>
                <h2 className="text-lg font-semibold">{gameData.liveData.linescore.teams.away.team.name}</h2>
                <PlayerTable skaters={awayTeamSkaters} allPlayers={awayTeamPlayers} />
                <PlayerTable goalies={awayTeamGoalies} allPlayers={awayTeamPlayers} />
              </>
            )}
            {showTeamStats === "home" && (
              <>
                <h2 className="text-lg font-semibold">{gameData.liveData.linescore.teams.home.team.name}</h2>
                <PlayerTable skaters={homeTeamSkaters} allPlayers={homeTeamPlayers} />
                <PlayerTable goalies={homeTeamGoalies} allPlayers={homeTeamPlayers} />
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function LiveStats({ liveData, gameData, gameTeamStats }) {
  const { away } = liveData.linescore.teams;
  const { home } = liveData.linescore.teams;

  const { allPlays, scoringPlays, penaltyPlays } = liveData.plays;
  // const awayGoals = liveData.plays.scoringPlays.filter((play) => allPlays[play].team.id === away.team.id);
  // const homeGoals = liveData.plays.scoringPlays.filter((play) => allPlays[play].team.id === home.team.id);

  return (
    <div className="md:grid md:grid-cols-2 md:gap-4">
      <div className="mb-4 shadow-md p-4 space-y-4 rounded-lg bg-white dark:bg-gray-800 md:self-start">
        <p className="bg-gray-900 dark:bg-gray-700 text-white py-2 px-4 text-sm rounded flex justify-between">
          <span>{new Date(gameData.datetime.dateTime).toLocaleDateString()}</span> <span>{gameData.venue.name}</span>
        </p>
        <div className="px-4">
          <div className="grid grid-cols-3 text-center text-sm text-white">
            <p>
              {liveData.linescore.teams.away.powerPlay && <StatusItem>PP</StatusItem>}
              {liveData.linescore.teams.away.goaliePulled && <StatusItem>EN</StatusItem>}
            </p>
            <p>
              <span className="rounded-xl bg-red-600 px-4 py-2">
                {liveData.linescore.currentPeriodTimeRemaining} {liveData.linescore.currentPeriodOrdinal}
              </span>
            </p>
            <p>
              {liveData.linescore.teams.home.powerPlay && <StatusItem>PP</StatusItem>}
              {liveData.linescore.teams.home.goaliePulled && <StatusItem>EN</StatusItem>}
            </p>
          </div>
          <table className="w-full text-center table-fixed">
            <thead>
              <tr>
                <th>
                  <p>
                    <img
                      className="mx-auto"
                      width="75"
                      height="75"
                      src={`https://www-league.nhlstatic.com/images/logos/teams-20202021-light/${away.team.id}.svg`}
                      alt={away.team.name}
                    />
                    {liveData.boxscore.teams.away.team.triCode}
                  </p>
                </th>
                <th>
                  <span className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-xl">
                    {away.goals} - {home.goals}
                  </span>
                </th>
                <th>
                  <p>
                    <img
                      className="mx-auto"
                      width="75"
                      height="75"
                      src={`https://www-league.nhlstatic.com/images/logos/teams-20202021-light/${home.team.id}.svg`}
                      alt={home.team.name}
                    />
                    {liveData.boxscore.teams.home.team.triCode}
                  </p>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {Object.keys(gameTeamStats).map((category, i) => {
                return (
                  <tr key={i}>
                    <td className="py-2">{gameTeamStats[category].away}</td>
                    <td>{gameTeamStats[category].display}</td>
                    <td>{gameTeamStats[category].home}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-4 rounded-lg shadow-md space-y-4 bg-white dark:bg-gray-800">
        <ScoringPlays goals={scoringPlays} allPlays={allPlays} />
        <PenaltyPlays penalties={penaltyPlays} allPlays={allPlays} />
      </div>
    </div>
  );
}

function PenaltyPlays({ penalties, allPlays }) {
  return (
    <div>
      <h2 className="text-xl mb-4 font-bold">Penalties</h2>
      {penalties.map((playId) => (
        <PlayCard
          key={playId}
          play={allPlays[playId]}
          imgUrl={`https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${allPlays[playId].players[0].player.id}@2x.jpg`}
        >
          <p>{allPlays[playId].result.description}</p>
          <p>
            <small>
              <span className="mr-1">
                {allPlays[playId].about.periodTime} - {allPlays[playId].about.ordinalNum}
              </span>
              <span className="text-white bg-gray-900 px-2 py-1 rounded-lg">{allPlays[playId].team.triCode}</span>
            </small>
          </p>
        </PlayCard>
      ))}
    </div>
  );
}

function PlayCard({ play, imgUrl, children }) {
  return (
    <div key={play} className="flex mb-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 items-center">
      <div className="rounded-full overflow-hidden bg-white flex-none">
        <img src={imgUrl} alt={play} width="75" height="75" />
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );
}

function ScoringPlays({ goals, allPlays }) {
  return (
    <div className="">
      <h2 className="text-xl mb-4 font-bold">Goals</h2>
      {goals.map((playId) => (
        <PlayCard
          key={playId}
          play={allPlays[playId]}
          imgUrl={`https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${allPlays[playId].players[0].player.id}@2x.jpg`}
        >
          <p>
            <span className="mr-1">
              {allPlays[playId].players[0].player.fullName} ({allPlays[playId].players[0].seasonTotal})
            </span>
            {allPlays[playId].result.strength.code !== "EVEN" && (
              <span className="text-sm text-white bg-red-600 px-2 py-1 rounded-lg">
                {allPlays[playId].result.strength.code}
              </span>
            )}
          </p>
          <p>
            {allPlays[playId].players
              .filter((player) => player.playerType === "Assist")
              .map((player) => (
                <small key={player.player.id} className="mr-1">
                  {player.player.fullName} ({player.seasonTotal})
                </small>
              ))}
          </p>
          <p>
            <small>
              <span className="mr-1">
                {allPlays[playId].about.periodTime} - {allPlays[playId].about.ordinalNum}
              </span>
              <span className="text-white bg-gray-900 px-2 py-1 rounded-lg">{allPlays[playId].team.triCode}</span>
            </small>
          </p>
        </PlayCard>
      ))}
    </div>
  );
}
