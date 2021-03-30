import { createContext, useContext, useEffect, useState } from "react";

type FavoritesItem = {
  id: number;
  name: string;
};

type Favorites = {
  teams: FavoritesItem[];
  players: FavoritesItem[];
};

type FavContextValue = {
  favorites: Favorites;
  addFavorite: (item: FavoritesItem, which: "player" | "team") => void;
  removeFavorite: (itemId: number, which: "player" | "team") => void;
};

const FavoritesContext = createContext<FavContextValue>({
  favorites: {
    players: [],
    teams: [],
  },
  addFavorite: () => {},
  removeFavorite: () => {},
});

function FavoritesProvider(props: any) {
  const [favorites, setFavorites] = useState<Favorites>({
    players: [],
    teams: [],
  });

  useEffect(() => {
    const favs = window.localStorage.getItem("favorites");
    if (favs) {
      const parsed = JSON.parse(favs);
      setFavorites(parsed);
    }
  }, []);

  useEffect(() => {
    console.log("...persist");
    window.localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(item: FavoritesItem, which: "player" | "team") {
    setFavorites((state) => {
      if (which === "player") {
        return {
          ...state,
          players: [...state.players, item],
        };
      } else {
        return {
          ...state,
          teams: [...state.teams, item],
        };
      }
    });
  }

  function removeFavorite(itemId: number, which: "player" | "team") {
    setFavorites((state) => {
      if (which === "player") {
        return {
          ...state,
          players: state.players.filter((player) => player.id !== itemId),
        };
      } else {
        return {
          ...state,
          teams: state.teams.filter((team) => team.id !== itemId),
        };
      }
    });
  }

  return <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }} {...props} />;
}

function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }
  return context;
}

export { FavoritesProvider, useFavorites };
