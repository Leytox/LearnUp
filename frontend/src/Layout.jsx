import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CookieConsent from "./components/CookieConsent/CookieConsent.jsx";
import { Helmet } from "react-helmet";
import GoTop from "./components/GoTop/GoTop.jsx";
import { ThemeContext } from "./ThemeContext.jsx";
import { useContext } from "react";

export default function Layout({ children }) {
  const { dark } = useContext(ThemeContext);
  return (
    <div className={"layout"} data-theme={dark ? "dark" : "light"}>
      <Helmet>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://img.icons8.com/?size=100&id=upriWUiUBVHf&format=png&color=000000"
        />
      </Helmet>
      <Header />
      <GoTop />
      <CookieConsent />
      {children}
      <Footer />
    </div>
  );
}
