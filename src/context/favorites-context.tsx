import React, { createContext, useContext, useEffect, useState } from "react";

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

const FavoritesContext = createContext<FavContextValue | undefined>(undefined);
type FavoritesProviderProps = {
  children: React.ReactNode;
};
function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<Favorites>(() => {
    const defaultState = { players: [], teams: [] };
    try {
      const localState = window.localStorage.getItem("favorites");
      return localState ? JSON.parse(localState) : defaultState;
    } catch (e) {
      return defaultState;
    }
  });

  useEffect(() => {
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
  const value = { favorites, addFavorite, removeFavorite };
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used inside a FavoritesProvider");
  }
  return context;
}

export { FavoritesProvider, useFavorites };
