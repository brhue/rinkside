import Container from "../components/Container";
import { useState, useEffect } from "react";

const baseUrl = "https://api.nhle.com/stats/rest/en/leaders/";
const skatersUrl = `${baseUrl}skaters`;
const goaliesUrl = `${baseUrl}goalies`;

export default function Stats() {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    async function getLeagueLeaders() {
      const response = await fetch(`${skatersUrl}/goals?cayenneExp=season=20202021 and gameType=2`, {
        headers: {
          origin: "http://www.nhl.com",
        },
      });
      // const data = await response.json();
      // console.log(data);
      console.log(response);
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
  return (
    <Container>
      <h1>Stats View</h1>
    </Container>
  );
}
