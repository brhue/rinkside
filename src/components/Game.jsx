import { Link } from "react-router-dom";

export default function Game(props) {
  const { currentPeriodOrdinal, currentPeriodTimeRemaining } = props.linescore;
  const { away, home } = props.teams;

  return (
    <Link className="block mb-4" to={`/game/${props.gamePk}`}>
      <div className="grid grid-cols-3 items-center justify-items-center border">
        <img
          width="50"
          height="50"
          src={`https://www-league.nhlstatic.com/images/logos/teams-20202021-light/${props.teams.away.team.id}.svg`}
          alt={props.teams.away.team.name}
        />
        <span>
          {props.teams.away.score} - {props.teams.home.score}
        </span>
        <img
          width="50"
          height="50"
          src={`https://www-league.nhlstatic.com/images/logos/teams-20202021-light/${props.teams.home.team.id}.svg`}
          alt={props.teams.home.team.name}
        />
        <span>{`${away.leagueRecord.wins}-${away.leagueRecord.losses}-${away.leagueRecord.ot}`}</span>
        <span></span>
        <span>{`${home.leagueRecord.wins}-${home.leagueRecord.losses}-${home.leagueRecord.ot}`}</span>
        <div className="grid col-span-3 grid-cols-3 w-full justify-items-center">
          <p className="status-items">
            {props.linescore.teams.away.powerPlay && <span className="power-play">PP</span>}
            {props.linescore.teams.away.goaliePulled && <span className="empty-net">EN</span>}
          </p>
          {props.linescore.currentPeriod === 0 ? (
            <p>{formatDate(new Date(props.gameDate))}</p>
          ) : (
            <p>
              {currentPeriodTimeRemaining} {currentPeriodOrdinal}
            </p>
          )}
          <p className="status-items">
            {props.linescore.teams.home.powerPlay && <span className="power-play">PP</span>}
            {props.linescore.teams.home.goaliePulled && <span className="empty-net">EN</span>}
          </p>
        </div>
      </div>
    </Link>
  );
}

function formatDate(date) {
  // This is necessary until safari supports timeStyle and dateStyle options.
  const timeString = date.toLocaleTimeString();
  const [time, abbrev] = timeString.split(" ");
  const parts = time.split(":");
  parts.pop();
  return `${parts.join(":")} ${abbrev}`;
  // Empty array uses browser's default locale.
  // return date.toLocaleTimeString([], { timeStyle: 'short' });
}
