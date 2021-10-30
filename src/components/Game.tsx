import { Link } from "react-router-dom";
import StatusItem from "./StatusItem";
import TeamLogo from "./TeamLogo";

type GameProps = {
  linescore: any;
  teams: any;
  gamePk: number;
  gameDate: string;
  status: GameStatus;
};

type GameStatus = {
  abstractGameStatus: string;
  codedGameStatus: string;
  detailedState: string;
  statusCode: string;
  startTimeTBD: boolean;
};

export default function Game(props: GameProps) {
  const { currentPeriodOrdinal, currentPeriodTimeRemaining } = props.linescore;
  const { away, home } = props.teams;

  return (
    <Link className="block" to={`/game/${props.gamePk}`}>
      <div className="grid grid-cols-3 items-center justify-items-center bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="text-center">
          <TeamLogo size="medium" teamId={props.teams.away.team.id} teamName={props.teams.away.team.name} />
          <p className="font-semibold">{props.teams.away.team.abbreviation}</p>
        </div>
        <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-xl">
          {props.teams.away.score} - {props.teams.home.score}
        </span>
        <div className="text-center">
          <TeamLogo size="medium" teamId={props.teams.home.team.id} teamName={props.teams.home.team.name} />
          <p className="font-semibold">{props.teams.home.team.abbreviation}</p>
        </div>
        <span className="text-sm text-gray-600">{`${away.leagueRecord.wins}-${away.leagueRecord.losses}-${away.leagueRecord.ot}`}</span>
        <span></span>
        <span className="text-sm text-gray-600">{`${home.leagueRecord.wins}-${home.leagueRecord.losses}-${home.leagueRecord.ot}`}</span>
        <div className="grid col-span-3 grid-cols-3 w-full justify-items-center">
          <p className="text-white">
            {props.linescore.teams.away.powerPlay && <StatusItem>PP</StatusItem>}
            {props.linescore.teams.away.goaliePulled && <StatusItem>EN</StatusItem>}
          </p>
          {/* TODO: Should I abstract this out to handle all possible game status states?
           * Can all be found here: https://statsapi.web.nhl.com/api/v1/gameStatus
           */}
          {props.status.statusCode === "1" || props.status.statusCode === "2" ? (
            <p>{formatDate(new Date(props.gameDate))}</p>
          ) : (
            <p>
              {currentPeriodTimeRemaining} {currentPeriodOrdinal}
            </p>
          )}
          <p className="text-white">
            {props.linescore.teams.home.powerPlay && <StatusItem>PP</StatusItem>}
            {props.linescore.teams.home.goaliePulled && <StatusItem>EN</StatusItem>}
          </p>
        </div>
      </div>
    </Link>
  );
}

function formatDate(date: Date) {
  // This is necessary until safari supports timeStyle and dateStyle options.
  const timeString = date.toLocaleTimeString();
  const [time, abbrev] = timeString.split(" ");
  const parts = time.split(":");
  parts.pop();
  return `${parts.join(":")} ${abbrev}`;
  // Empty array uses browser's default locale.
  // return date.toLocaleTimeString([], { timeStyle: 'short' });
}