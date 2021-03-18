import * as React from "react";
import logo from "./assets/logo.svg";
import { Toggler } from "./components/Toggler/Toggler";
import "./App.css";

const App = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Watch YouTube without distractions!!!</p>
                <Toggler />
            </header>
        </div>
    );
};

export default App;
