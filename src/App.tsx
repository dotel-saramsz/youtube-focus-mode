import * as React from "react";
import logo from "./assets/logo.svg";
import { Row, Col } from "antd";
import { Body } from "./components/Body/Body";
import { Toggler } from "./components/Toggler/Toggler";
import "./App.css";

const App = () => {
    return (
        <div className="App">
            <Row>
                <Col span={24}>
                    <Body />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Toggler />
                </Col>
            </Row>
        </div>
    );
};

export default App;
