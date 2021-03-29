import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import PlayerPortrait from "../components/PlayerPortrait";
import TeamLogo from "../components/TeamLogo";

type StatsData = any[];
export default function Stats() {
  const [leaderData, setLeaderData] = useState<null | StatsData>(null);

  useEffect(() => {
    async function getLeagueLeaders(url: string) {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    }
    const skaterMetrics = (expression: string) => {
      return [
        {
          metric: "points",
          url: `/api/leaders/skaters/points?cayenneExp=${expression}`,
        },
        {
          metric: "goals",
          url: `/api/leaders/skaters/goals?cayenneExp=${expression}`,
        },
        {
          metric: "assists",
          url: `/api/leaders/skaters/assists?cayenneExp=${expression}`,
        },
      ];
    };

    const goalieMetrics = (expression: string) => {
      return [
        {
          metric: "gaa",
          url: `/api/leaders/goalies/gaa?cayenneExp=${expression}`,
        },
        {
          metric: "sv%",
          url: `/api/leaders/goalies/savePctg?cayenneExp=${expression}`,
        },
        {
          metric: "shutouts",
          url: `/api/leaders/goalies/shutouts?cayenneExp=${expression}`,
        },
      ];
    };

    const _leaderData: { [key: string]: any }[] = [
      {
        title: "Forwards",
        data: skaterMetrics("season=20202021 and gameType=2"),
      },
      {
        title: "Goalies",
        data: goalieMetrics("season=20202021 and gameType=2 and gamesPlayed>=4"),
      },
      {
        title: "Defensemen",
        data: skaterMetrics('season=20202021 and gameType=2 and player.positionCode="D"'),
      },
      {
        title: "Rookies",
        data: skaterMetrics('season=20202021 and gameType=2 and isRookie="Y"'),
      },
    ];

    const urls: string[] = [];
    _leaderData.forEach((group) => {
      group.data.forEach((metric: any) => {
        urls.push(metric.url);
      });
    });

    Promise.all(urls.map((url) => getLeagueLeaders(url))).then((responses) => {
      _leaderData.forEach((group) => {
        group.data.forEach((metric: any) => {
          metric.leaders = responses.shift()?.data;
        });
      });
      setLeaderData(_leaderData);
    });
  }, []);

  if (!leaderData) {
    return (
      <Container>
        <h1>Loading...</h1>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-2xl">League Leaders</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {leaderData.map((group) => {
          return <LeaderSection key={group.title} title={group.title} metrics={group.data} />;
        })}
      </div>
    </Container>
  );
}

function LeaderSection({ title, metrics }: { title: string; metrics: any }) {
  const [activeMetric, setActiveMetric] = useState(metrics[0].metric);
  const [activeLeader, setActiveLeader] = useState(0);

  const metricToShow = (metric: any) => {
    let { leaders } = metrics.find((m: any) => m.metric === activeMetric);
    return leaders.map((leader: any, index: number) => {
      const key = metric === "sv%" ? "savePctg" : metric;
      const stat = metric === "sv%" || metric === "gaa" ? leader[key].toPrecision(3) : leader[key];
      return (
        <p
          className={"flex justify-between" + (activeLeader === index ? " font-bold" : "")}
          key={leader.player.id}
          onMouseOver={() => {
            setActiveLeader(index);
          }}
        >
          <span>{leader.player.fullName}</span>
          <span>{stat}</span>
        </p>
      );
    });
  };

  const leaderToShow = (leader: number) => {
    let { leaders } = metrics.find((m: any) => m.metric === activeMetric);
    const player = leaders[leader];
    return <LeaderDetail activeMetric={activeMetric} player={player} />;
  };

  return (
    <div className="dark:bg-gray-700 p-4 rounded-lg">
      <header>
        <h3>{title}</h3>
        <div className="space-x-3">
          {metrics.map((metric: any) => {
            return (
              <button
                key={metric.metric}
                className={`hover:underline ${metric.metric === activeMetric ? "underline" : ""}`}
                onClick={() => {
                  setActiveMetric(metric.metric);
                  setActiveLeader(0);
                }}
              >
                {metric.metric.toUpperCase()}
              </button>
            );
          })}
        </div>
      </header>
      <div className="grid md:grid-cols-2">
        <div className="flex items-center justify-center">{leaderToShow(activeLeader)}</div>
        <div>{metricToShow(activeMetric)}</div>
      </div>
    </div>
  );
}

type LeaderDetailProps = {
  player: any;
  activeMetric: string;
};

function LeaderDetail({ player, activeMetric }: LeaderDetailProps) {
  const key = activeMetric === "sv%" ? "savePctg" : activeMetric;
  const stat = activeMetric === "sv%" || activeMetric === "gaa" ? player[key].toPrecision(3) : player[key];
  return (
    <>
      <Link to={`/players/${player.player.id}`}>
        <div className="flex flex-col items-center space-y-3">
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-4xl mr-2">#{player.player.sweaterNumber}</span>
              <h2 className="grid">
                <span>{player.player.firstName}</span>
                <span className="-mt-2">{player.player.lastName}</span>
              </h2>
            </div>
            <TeamLogo teamId={player.team?.id} teamName={player.team?.fullName} size="medium" />
          </div>
          <PlayerPortrait
            className="rounded-full"
            size="large"
            playerId={player.player.id}
            playerName={player.player.fullName}
          />
          <div className="text-center">
            <p className="text-xs">{activeMetric.toUpperCase()}</p>
            <p className="text-xl">{stat}</p>
          </div>
        </div>
      </Link>
    </>
  );
}
