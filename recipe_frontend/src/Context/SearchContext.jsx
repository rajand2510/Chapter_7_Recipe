import React, { createContext, useContext, useState, useEffect } from "react";

// Hook for debounce
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

// Context
const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 600);

  return (
    <SearchContext.Provider value={{ searchText, setSearchText, debouncedSearch }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used inside SearchProvider");
  return context;
};
