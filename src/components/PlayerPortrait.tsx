const sizes = {
  small: 25,
  medium: 50,
  large: 75,
};

type PlayerPortraitProps = {
  playerId: number;
  playerName: string;
  size: keyof typeof sizes;
  className?: string;
};

export default function PlayerPortrait({ size, playerId, playerName, className, ...props }: PlayerPortraitProps) {
  return (
    <img
      width={sizes[size]}
      height={sizes[size]}
      src={`https://cms.nhl.bamgrid.com/images/headshots/current/60x60/${playerId}@2x.jpg`}
      alt={playerName}
      onError={(e) => {
        // This probably isn't the best way to do this...
        e.currentTarget.src = "https://cms.nhl.bamgrid.com/images/headshots/current/60x60/skater@2x.jpg";
      }}
      className={className}
      {...props}
    />
  );
}
