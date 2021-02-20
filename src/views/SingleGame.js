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
    goals: {
      display: "Goals",
      away: awayTeamStats.goals,
      home: homeTeamStats.goals,
    },
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
      <div className="toggle-controls">
        <button onClick={() => setInfoToShow("game")}>Game Stats</button>
        <button onClick={() => setInfoToShow("head")}>Head to Head</button>
      </div>
      {infoToShow === "game" && (
        <div>
          <LiveStats {...gameData} />
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>{gameData.liveData.boxscore.teams.away.team.triCode}</th>
                <th>{gameData.liveData.boxscore.teams.home.team.triCode}</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(gameTeamStats).map((category, i) => {
                return (
                  <tr key={i}>
                    <td>{gameTeamStats[category].display}</td>
                    <td>{gameTeamStats[category].away}</td>
                    <td>{gameTeamStats[category].home}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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
          <button onClick={() => setShowTeamStats("away")}>
            {gameData.liveData.linescore.teams.away.team.abbreviation}
          </button>
          <button onClick={() => setShowTeamStats("home")}>
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

function LiveStats({ liveData, gameData }) {
  const { away } = liveData.linescore.teams;
  const { home } = liveData.linescore.teams;

  const { allPlays } = liveData.plays;
  const awayGoals = liveData.plays.scoringPlays.filter((play) => allPlays[play].team.id === away.team.id);
  const homeGoals = liveData.plays.scoringPlays.filter((play) => allPlays[play].team.id === home.team.id);
  const { penaltyPlays } = liveData.plays;

  return (
    <div>
      <p>
        <span>{new Date(gameData.datetime.dateTime).toLocaleDateString()}</span>
        {" "}
        <span>{gameData.venue.name}</span>
      </p>
      <p className="text-center">
        <span>{liveData.linescore.currentPeriodTimeRemaining} {liveData.linescore.currentPeriodOrdinal}</span>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", textAlign: "center" }}>
        <p>{away.team.name}</p>
        <p>
          {away.goals} - {home.goals}
        </p>
        <p>{home.team.name}</p>
        <p>{away.shotsOnGoal}</p>
        <p>SHOTS</p>
        <p>{home.shotsOnGoal}</p>
      </div>
      <h2>Goals</h2>
      <div className="d-flex" style={{ justifyContent: "space-evenly" }}>
        <ScoringPlays goals={awayGoals} allPlays={allPlays} />
        <ScoringPlays goals={homeGoals} allPlays={allPlays} />
      </div>
      <div>
        <PenaltyPlays penalties={penaltyPlays} allPlays={allPlays} />
      </div>
    </div>
  );
}

function PenaltyPlays({ penalties, allPlays }) {
  return (
    <div>
      <h2>Penalties</h2>
      {penalties.map((play) => (
        <div key={play}>
          {allPlays[play].team.triCode} {allPlays[play].result.description} {allPlays[play].about.periodTime}{" "}
          {allPlays[play].about.ordinalNum}
        </div>
      ))}
    </div>
  );
}

function ScoringPlays({ goals, allPlays }) {
  return (
    <div className="p-1" style={{ fontSize: "0.8rem" }}>
      {goals.map((play) => (
        <div
          key={play}
          className=""
          style={{
            padding: ".375rem",
            backgroundColor: "#e4e4e4",
            borderRadius: 8,
            boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <p>
            {allPlays[play].players[0].player.fullName} ({allPlays[play].players[0].seasonTotal})
          </p>
          <p>
            {allPlays[play].players
              .filter((player) => player.playerType === "Assist")
              .map((player) => (
                <small key={player.player.id}>
                  {player.player.fullName} ({player.seasonTotal})
                </small>
              ))}
          </p>
          <p>
            <small>
              {allPlays[play].about.periodTime} - {allPlays[play].about.ordinalNum}
            </small>
            <small>{}</small>
          </p>
        </div>
      ))}
    </div>
  );
}
