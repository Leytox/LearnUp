import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import CookieConsent from "./components/CookieConsent.jsx";

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <CookieConsent />
      {children}
      <Footer />
    </>
  );
}
