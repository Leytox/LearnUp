import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import CookieConsent from "./components/CookieConsent/CookieConsent.jsx";
import { Helmet } from "react-helmet";

export default function Layout({ children }) {
  return (
    <>
      <Helmet>
        <link
          rel="icon"
          type="image/x-icon"
          href="https://img.icons8.com/?size=100&id=upriWUiUBVHf&format=png&color=000000"
        />
      </Helmet>
      <Header />
      <CookieConsent />
      {children}
      <Footer />
    </>
  );
}
