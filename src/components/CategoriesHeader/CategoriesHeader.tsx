import * as React from "react";
import { Row, Col } from "antd";
import { EditFilled, CheckOutlined } from "@ant-design/icons";
import { AppMode } from "../../types";
import "./CategoriesHeader.css";

interface CategoriesHeaderProps {
    appMode: AppMode;
    onModeChanged: () => void;
}

export const CategoriesHeader: React.FC<CategoriesHeaderProps> = (
    props
): JSX.Element => {
    let text: string;
    let iconElement: JSX.Element;
    if (props.appMode == AppMode.Display) {
        text = "Chosen Categories";
        iconElement = (
            <EditFilled
                style={{ fontSize: "24px" }}
                onClick={props.onModeChanged}
            />
        );
    } else {
        text = "Choose Categories";
        iconElement = (
            <CheckOutlined
                style={{
                    fontSize: "24px",
                    color: "#357B45",
                }}
                onClick={props.onModeChanged}
            />
        );
    }
    return (
        <div className="category-header">
            <Row justify="space-between">
                <Col>
                    <span className="category-header-title">{text}</span>
                </Col>
                <Col className="category-header-icon">{iconElement}</Col>
            </Row>
        </div>
    );
};
