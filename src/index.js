import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import LoadingScreen from "./common/View/LoadingScreen";
import config from "./config";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter basename={config.ENDPOINT}>
        <Suspense fallback={<LoadingScreen />}>
            <App />
        </Suspense>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
