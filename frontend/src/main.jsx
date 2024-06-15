import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { ThemeProvider } from "./ThemeContext.jsx";
import { DeviceProvider } from "./DeviceContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <DeviceProvider>
    <UserProvider>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </UserProvider>
  </DeviceProvider>,
);
