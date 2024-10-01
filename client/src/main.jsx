import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import rootReducer from "./redux/reducers/index.js";
import React from "react";
import { SocketProvider } from "./socket.jsx";

const store = configureStore({
  reducer: rootReducer,
});

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <SocketProvider>
        <HelmetProvider>
          <App />
          <Toaster />
        </HelmetProvider>
      </SocketProvider>
    </BrowserRouter>
  </Provider>
);
