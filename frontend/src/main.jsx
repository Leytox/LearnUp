import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { ThemeProvider } from "./ThemeContext.jsx";
import { DeviceProvider } from "./DeviceContext.jsx";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <I18nextProvider i18n={i18n}>
    <DeviceProvider>
      <UserProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </UserProvider>
    </DeviceProvider>
  </I18nextProvider>,
);
