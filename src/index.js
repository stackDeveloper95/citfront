import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.min.js";
import App from './App';
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { SnackbarProvider } from "notistack";
import "./custom.scss"

const convex = new ConvexReactClient("https://precise-mammoth-342.convex.cloud");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <SnackbarProvider maxSnack={3}>
        <App />
      </SnackbarProvider>
    </ConvexProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
