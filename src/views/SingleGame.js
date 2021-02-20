import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatISODate } from "../utils";

import PlayerTable from "../components/PlayerTable";
import HeadToHead from "../components/HeadToHead";

export default function SingleGame() {
  const { gameId } = useParams();
  const [gameData, setGameData] = useState(null);
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
      setGameData(data);
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
    // goals: {
    //   display: "Goals",
    //   away: awayTeamStats.goals,
    //   home: homeTeamStats.goals,
    // },
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
    <div className="container">
      <div className="toggle-controls m-b-1">
        <button className={infoToShow === "game" ? "active" : ""} onClick={() => setInfoToShow("game")}>
          Game Stats
        </button>
        <button className={infoToShow === "head" ? "active" : ""} onClick={() => setInfoToShow("head")}>
          Head to Head
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
      <div>
        <div className="toggle-controls">
          <button className={showTeamStats === "away" ? "active" : ""} onClick={() => setShowTeamStats("away")}>
            {gameData.liveData.linescore.teams.away.team.abbreviation}
          </button>
          <button className={showTeamStats === "home" ? "active" : ""} onClick={() => setShowTeamStats("home")}>
            {gameData.liveData.linescore.teams.home.team.abbreviation}
          </button>
        </div>
        <div style={{ overflowX: "scroll" }}>
          {showTeamStats === "away" && (
            <>
              <h2>{gameData.liveData.linescore.teams.away.team.name}</h2>
              <PlayerTable skaters={awayTeamSkaters} allPlayers={awayTeamPlayers} />
              <PlayerTable goalies={awayTeamGoalies} allPlayers={awayTeamPlayers} />
            </>
          )}
          {showTeamStats === "home" && (
            <>
              <h2>{gameData.liveData.linescore.teams.home.team.name}</h2>
              <PlayerTable skaters={homeTeamSkaters} allPlayers={homeTeamPlayers} />
              <PlayerTable goalies={homeTeamGoalies} allPlayers={homeTeamPlayers} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function LiveStats({ liveData, gameData, gameTeamStats }) {
  const { away } = liveData.linescore.teams;
  const { home } = liveData.linescore.teams;

  const { allPlays, scoringPlays, penaltyPlays } = liveData.plays;
  // const awayGoals = liveData.plays.scoringPlays.filter((play) => allPlays[play].team.id === away.team.id);
  // const homeGoals = liveData.plays.scoringPlays.filter((play) => allPlays[play].team.id === home.team.id);

  return (
    <div>
      <div className="m-b-1" style={{ backgroundColor: "#e4e4e4" }}>
        <p className="game-info-header">
          <span>{new Date(gameData.datetime.dateTime).toLocaleDateString()}</span> <span>{gameData.venue.name}</span>
        </p>
        <div style={{ padding: ".375rem" }}>
          <p className="text-center">
            <span>
              {liveData.linescore.currentPeriodTimeRemaining} {liveData.linescore.currentPeriodOrdinal}
            </span>
          </p>
          <div
            className="text-center"
            style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center" }}
          >
            <p>
              <img
                width="75"
                height="75"
                src={`https://www-league.nhlstatic.com/images/logos/teams-20202021-light/${away.team.id}.svg`}
                alt={away.team.name}
              />
            </p>
            <p>
              {away.goals} - {home.goals}
            </p>
            <p>
              <img
                width="75"
                height="75"
                src={`https://www-league.nhlstatic.com/images/logos/teams-20202021-light/${home.team.id}.svg`}
                alt={home.team.name}
              />
            </p>
            {/* <p>{away.shotsOnGoal}</p>
            <p>Shots</p>
            <p>{home.shotsOnGoal}</p> */}
          </div>
          <table className="w-100 text-center">
            <thead>
              <tr>
                <th>{liveData.boxscore.teams.away.team.triCode}</th>
                <th></th>
                <th>{liveData.boxscore.teams.home.team.triCode}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(gameTeamStats).map((category, i) => {
                return (
                  <tr key={i}>
                    <td>{gameTeamStats[category].away}</td>
                    <td>{gameTeamStats[category].display}</td>
                    <td>{gameTeamStats[category].home}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <ScoringPlays goals={scoringPlays} allPlays={allPlays} />
      <PenaltyPlays penalties={penaltyPlays} allPlays={allPlays} />
    </div>
  );
}

function PenaltyPlays({ penalties, allPlays }) {
  return (
    <div>
      <h2 className="m-b-1">Penalties</h2>
      {penalties.map((playId) => (
        <PlayCard
          key={playId}
          play={allPlays[playId]}
          imgUrl={`url(https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${allPlays[playId].players[0].player.id}@2x.jpg)`}
        >
          <p>{allPlays[playId].team.triCode}</p>
          <p>{allPlays[playId].result.description}</p>
          <p>
            {allPlays[playId].about.periodTime} {allPlays[playId].about.ordinalNum}
          </p>
        </PlayCard>
      ))}
    </div>
  );
}

function PlayCard({ play, imgUrl, children }) {
  return (
    <div
      key={play}
      className="d-flex m-b-1"
      style={{
        padding: ".625rem",
        backgroundColor: "#e4e4e4",
        borderRadius: 16,
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 75,
          height: 75,
          flex: "none",
          borderRadius: "50%",
          backgroundColor: "white",
          // backgroundImage: `url(https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${play.players[0].player.id}.jpg)`,
          backgroundImage: imgUrl,
          backgroundSize: "cover",
        }}
      ></div>
      <div
        style={{
          marginLeft: "1rem",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ScoringPlays({ goals, allPlays }) {
  return (
    <div className="">
      <h2 className="m-b-1">Goals</h2>
      {goals.map((playId) => (
        <PlayCard
          key={playId}
          play={allPlays[playId]}
          imgUrl={`url(https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${allPlays[playId].players[0].player.id}@2x.jpg)`}
        >
          <p>
            {allPlays[playId].players[0].player.fullName} ({allPlays[playId].players[0].seasonTotal})
          </p>
          <p>
            {allPlays[playId].players
              .filter((player) => player.playerType === "Assist")
              .map((player) => (
                <small key={player.player.id}>
                  {player.player.fullName} ({player.seasonTotal})
                </small>
              ))}
          </p>
          <p>
            <small>
              {allPlays[playId].about.periodTime} - {allPlays[playId].about.ordinalNum}
            </small>
            <small>{}</small>
          </p>
        </PlayCard>
      ))}
    </div>
  );
}
