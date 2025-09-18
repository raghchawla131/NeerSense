import React, { createContext, useContext, useMemo, useState } from "react";

const SearchContext = createContext(null);

export const SearchProvider = ({ children }) => {
  const [lastQuery, setLastQuery] = useState("");
  const [neerBotResult, setNeerBotResult] = useState(null);
  const [geminiData, setGeminiData] = useState(null);

  const value = useMemo(() => ({
    lastQuery,
    neerBotResult,
    geminiData,
    setLastQuery,
    setNeerBotResult,
    setGeminiData,
  }), [lastQuery, neerBotResult, geminiData]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

export const useSearch = () => {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
};

export default SearchContext;


