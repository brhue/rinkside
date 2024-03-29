import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Game from "../components/Game";
import Container from "../components/Container";
import TeamLogo from "../components/TeamLogo";
import PlayerPortrait from "../components/PlayerPortrait";
import Button from "../components/Button";
import { useFavorites } from "../context/favorites-context";
import { client } from "../utils/api-client";

type TeamData = {
  copyright: string;
  teams: any[];
};
export default function Team() {
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const { teamId } = useParams<{ teamId: string }>();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    client(
      `teams/${teamId}?expand=team.stats,team.schedule.next,team.schedule.previous,schedule.linescore,team.leaders&leaderCategories=points,goals,assists`
    ).then((data) => setTeamData(data));
  }, [teamId]);

  if (!teamData) return <h1>Loading...</h1>;

  const team = teamData.teams[0];
  const seasonStats = team.teamStats[0].splits[0].stat;
  const seasonStatsRankings = team.teamStats[0].splits[1].stat;
  const { teamLeaders } = team;

  const isFavorite = favorites.teams.findIndex((item) => item.id === Number(teamId)) !== -1;
  return (
    <Container>
      <header className="flex items-center">
        <TeamLogo size="large" teamName={team.name} teamId={Number(teamId)} />
        <h1 className="text-xl">{team.name}</h1>
        <Button
          className="ml-auto"
          onClick={() => {
            const id = Number(teamId);
            isFavorite ? removeFavorite(id, "team") : addFavorite({ id, name: team.name }, "team");
          }}
        >
          {isFavorite ? "Unfavorite" : "Favorite"}
        </Button>
      </header>
      <div className="sm:grid grid-cols-2 dark:bg-gray-700 p-4 rounded-lg gap-4">
        <div className="text-center">
          <p>Last Game</p>
          {team.previousGameSchedule ? (
            <>
              <p>{team.previousGameSchedule.dates[0].date}</p>
              <Game {...team.previousGameSchedule.dates[0].games[0]} />
            </>
          ) : null}
        </div>
        <div className="text-center">
          <p>Next Game</p>
          {team.nextGameSchedule ? (
            <>
              <p>{team.nextGameSchedule.dates[0].date}</p>
              <Game {...team.nextGameSchedule.dates[0].games[0]} />
            </>
          ) : null}
        </div>
      </div>
      <h2>Team Stats</h2>
      <div className="grid sm:grid-cols-2 text-center dark:bg-gray-700 p-4 rounded-lg">
        <div>
          <p>Goals / Game</p>
          <p>
            <span>{seasonStats.goalsPerGame}</span> <span>{seasonStatsRankings.goalsPerGame}</span>
          </p>
        </div>
        <div>
          <p>Goals Against / Game</p>
          <p>
            <span>{seasonStats.goalsAgainstPerGame}</span> <span>{seasonStatsRankings.goalsAgainstPerGame}</span>
          </p>
        </div>
        <div>
          <p>Power Play %</p>
          <p>
            <span>{seasonStats.powerPlayPercentage}</span> <span>{seasonStatsRankings.powerPlayPercentage}</span>
          </p>
        </div>
        <div>
          <p>Penalty Kill %</p>
          <p>
            <span>{seasonStats.penaltyKillPercentage}</span> <span>{seasonStatsRankings.penaltyKillPercentage}</span>
          </p>
        </div>
      </div>
      <h2>Team Leaders</h2>
      <TeamLeaders teamLeaders={teamLeaders} />
    </Container>
  );
}

function TeamLeaders({ teamLeaders }: { teamLeaders: any[] }) {
  return (
    <div className="sm:flex sm:justify-between sm:space-x-4">
      {teamLeaders.map((category) => {
        const leader = category.leaders[0];
        return (
          <div key={category.leaderCategory}>
            <p className="mb-4">{category.leaderCategory.toUpperCase()}</p>
            <Link to={`/players/${leader.person.id}`}>
              <p className="flex items-center space-x-4">
                <PlayerPortrait
                  className="rounded-full"
                  size="medium"
                  playerId={leader.person.id}
                  playerName={leader.person.fullName}
                />{" "}
                <span>{leader.person.fullName}</span> <span>{leader.value}</span>
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
