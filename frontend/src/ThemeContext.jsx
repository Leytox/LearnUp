import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const ThemeContext = createContext({
  dark: false,
  toggle: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(false); // Default theme is light

  // On mount, read the preferred theme from the persistence
  useEffect(() => {
    const isDark = Cookies.get("darkTheme") === "true";
    setDark(isDark);
  }, []);

  // To toggle between dark and light modes
  const toggle = () => {
    Cookies.set("darkTheme", !dark, { expires: 365, sameSite: "strict" });
    setDark(!dark);
  };

  const theme = dark ? "dark" : "light";

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};
