import React from 'react';
import { createRoot } from 'react-dom/client';
import PlayerContainer from "./PlayerContainer";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.scss";
//import reportWebVitals from './reportWebVitals';

const root = document.getElementById('root');
const container = createRoot(root);
container.render(
  <React.StrictMode>
    <PlayerContainer />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
