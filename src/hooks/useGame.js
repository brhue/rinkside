import { useEffect, useState } from "react";

export default function useGame(gameId) {
  const [gameData, setGameData] = useState(null);

  useEffect(() => {
    async function getGame(id) {
      const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
      const gameUrl = `${baseUrl}game/${id}/feed/live`;
      const response = await fetch(gameUrl);
      const data = await response.json();
      return data;
    }

    getGame(gameId).then((data) => {
      setGameData(data);
    });

    const id = setInterval(() => {
      getGame(gameId).then((data) => {
        setGameData(data);
      });
    }, 10000);

    return () => {
      clearInterval(id);
    };
  }, [gameId]);

  // TODO: Figure this out so we can update more efficiently.
  // useEffect(() => {
  //   async function getLiveDiff(id, timestamp) {
  //     const baseUrl = "https://statsapi.web.nhl.com/api/v1/";
  //     const gameUrl = `${baseUrl}game/${id}/feed/live/diffPatch?startTimecode=${timestamp}`;
  //     const response = await fetch(gameUrl);
  //     const data = await response.json();
  //     return data;
  //   }
  //   console.log('diff effect!')
  //   const id = setInterval(async () => {
  //     console.log("update!");
  //     if (gameData?.gameData?.status?.abstractGameState === "Live") {
  //       const diffData = await getLiveDiff(gameId, gameData?.metaData?.timeStamp);
  //       console.log(diffData);
  //       if (!Array.isArray(diffData)) {
  //         return setGameData(diffData);
  //       }
  //       setGameData((state) => {
  //         diffData.forEach((diff) => {
  //           diff.diff.forEach((diffItem) => {
  //             const { op, value, path } = diffItem;
  //             if (op === "replace") {
  //               const keys = path.slice(1).split("/");
  //               console.log(keys);
  //               let temp = state;
  //               let i;
  //               for (i = 0; i < keys.length - 1; i++) {
  //                 temp = temp[keys[i]];
  //               }
  //               temp[keys[i]] = value;
  //               console.log(temp);
  //             }
  //           });
  //         });
  //         return state;
  //       });
  //     }
  //   }, 10000);
  //   return () => {
  //     clearInterval(id);
  //   };
  // }, [gameData, gameId]);

  return {
    gameData,
  };
}
