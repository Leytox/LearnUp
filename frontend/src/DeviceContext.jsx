import { createContext, useEffect, useState } from "react";

export const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <DeviceContext.Provider
      value={{ isMobile, isSearchVisible, setIsSearchVisible }}
    >
      {children}
    </DeviceContext.Provider>
  );
};
