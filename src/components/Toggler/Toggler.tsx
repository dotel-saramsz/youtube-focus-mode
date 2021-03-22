import * as React from "react";
import { Switch, Row, Col } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";
import { MessageType } from "../../core/messaging";
import "./Toggler.css";

export const Toggler = () => {
    const [appEnabled, setAppEnabled] = React.useState(false);

    const onToggled = () => {
        // The app state was toggled by the user
        console.log(
            `[Toggler] Old App State: ${appEnabled}, New App State: ${!appEnabled}`
        );
        // Send the message to background script
        chrome.runtime.sendMessage({
            type: "TOGGLE_STATUS",
            appEnabled: !appEnabled,
        });
    };

    React.useEffect(() => {
        // Check the app status
        chrome.runtime.sendMessage({ type: "REQ_APP_STATUS" });

        // chrome.storage.local.get((items) => {
        //     if (
        //         items["appEnabled"] &&
        //         typeof items["appEnabled"] == "boolean"
        //     ) {
        //         setAppEnabled(items["appEnabled"]);
        //     }
        // });

        // Add the app status listener
        chrome.runtime.onMessage.addListener(
            (message: MessageType, sender, sendResponse) => {
                switch (message.type) {
                    case "APP_STATUS":
                        setAppEnabled(message.appEnabled);
                        break;
                    default:
                        break;
                }
            }
        );
    });

    return (
        <div className="toggler-container">
            <Row gutter={16} justify="center" align="middle">
                <Col className="gutter-row" span={10}>
                    <span className="toggler-text">Focus Mode</span>
                </Col>
                <Col className="toggler-switch" span={4}>
                    <Switch
                        checkedChildren={<CheckOutlined />}
                        unCheckedChildren={<CloseOutlined />}
                        checked={appEnabled}
                        onChange={onToggled}
                    />
                </Col>
            </Row>
        </div>
    );
};
