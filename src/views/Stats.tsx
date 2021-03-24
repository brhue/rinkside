import { useState, useEffect } from "react";
import Container from "../components/Container";
import PlayerPortrait from "../components/PlayerPortrait";

const baseUrl =
  "https://statsapi.web.nhl.com/api/v1/teams?expand=team.leaders,leaders.person&leaderCategories=goals,assists,points";

type StatsData = {
  teams: any[];
};
type Categories = "goals" | "assists" | "points";

export default function Stats() {
  const [statsData, setStatsData] = useState<null | StatsData>(null);

  useEffect(() => {
    async function getLeagueLeaders() {
      const response = await fetch(baseUrl);
      const data = await response.json();
      setStatsData(data);
    }
    getLeagueLeaders();
  }, []);

  if (!statsData) {
    return (
      <Container>
        <h1>Loading...</h1>
      </Container>
    );
  }

  const { teams } = statsData;
  const topPlayers = (team: any, category: Categories) => {
    const { leaders } = team.teamLeaders.find((cat: any) => cat.leaderCategory === category);
    return leaders;
  };

  const topTen = (category: Categories) => {
    return teams
      .map((team) => topPlayers(team, category))
      .flat()
      .sort((p1, p2) => p2.value - p1.value)
      .slice(0, 10);
  };

  const goalLeaders = topTen("goals");
  const assistLeaders = topTen("assists");
  const pointLeaders = topTen("points");

  return (
    <Container>
      <h1>Stats View</h1>
      <div>
        <h2>Points</h2>
        {pointLeaders.map((player) => {
          return (
            <div key={player.person.id}>
              <PlayerPortrait playerId={player.person.id} playerName={player.person.fullName} size="medium" />
              {player.person.fullName} <span>{player.value}</span>
            </div>
          );
        })}
      </div>
      <div>
        <h2>Goals</h2>
        {goalLeaders.map((player) => {
          return (
            <div key={player.person.id}>
              {player.person.fullName} <span>{player.value}</span>
            </div>
          );
        })}
      </div>
      <div>
        <h2>Assists</h2>
        {assistLeaders.map((player) => {
          return (
            <div key={player.person.id}>
              {player.person.fullName} <span>{player.value}</span>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
