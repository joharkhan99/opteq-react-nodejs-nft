// import React from "react";
// import ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";
// import registerServiceWorker from "./registerServiceWorker";

// ReactDOM.render(<App />, document.getElementById("root"));
// registerServiceWorker();

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import MyRecords from "./MyRecords";
// import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Search from "./Search";
import registerServiceWorker from "./registerServiceWorker";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      {/* <Route path="/MyRecord/:walletAddress" element={<MyRecords />} />
      <Route path="/MyRecord" element={<MyRecords />} />
      <Route path="/search" element={<Search />} /> */}

      <Route path="/search" element={<Search />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
registerServiceWorker();
