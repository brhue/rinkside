import React from "react";

const sizes = {
  small: 25,
  medium: 50,
  large: 75,
};

type TeamLogoProps = {
  teamId: number;
  teamName: string;
  size: keyof typeof sizes;
  className?: string;
};

export default function TeamLogo({ teamId, teamName, size, ...props }: TeamLogoProps) {
  return (
    <img
      width={sizes[size]}
      height={sizes[size]}
      src={`https://www-league.nhlstatic.com/images/logos/teams-20202021-light/${teamId}.svg`}
      alt={teamName}
      {...props}
    />
  );
}
