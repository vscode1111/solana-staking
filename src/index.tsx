import ReactDOM from "react-dom";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { StoreContext } from "./hooks";
import { stores } from "./stores";

ReactDOM.render(
  <StoreContext.Provider value={stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StoreContext.Provider>,
  document.getElementById("app"),
);
