import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PlayerView() {
  const { playerId } = useParams();
  const [playerData, setPlayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function getPlayer() {
      setIsLoading(true);
      try {
        const response = await fetch(`https://statsapi.web.nhl.com/api/v1/people/${playerId}`);
        const data = await response.json();
        setIsLoading(false);
        setPlayerData(data);
      } catch (err) {
        setIsError(true);
      }
    }
    getPlayer();
  }, [playerId]);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>There was an error fetching the data.</p>

  const player = playerData.people[0];

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h1>Player View for {player.fullName}</h1>
      </div>
    </>
  );
}
