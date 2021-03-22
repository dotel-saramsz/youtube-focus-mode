import * as React from "react";
import { Row, Col } from "antd";
import { CategoriesHeader } from "../CategoriesHeader/CategoriesHeader";
import { CategoriesDisplay } from "../CategoriesDisplay/CategoriesDisplay";
import { CategoriesSelector } from "../CategoriesSelector/CategoriesSelector";
import logo from "../../assets/logo.svg";
import { AppMode } from "../../types";
import "./Body.css";
import { CATEGORIES_NAMES_TO_IDS } from "../../constants";

export const Body = () => {
    const [appMode, setAppMode] = React.useState(AppMode.Select);
    const defaultChosen: string[] = [];
    const [chosenCategories, setChosenCategories] = React.useState(
        defaultChosen
    );

    const allCategories = Object.keys(CATEGORIES_NAMES_TO_IDS);

    const onCategoryChosen = (category: string) => {
        if (chosenCategories.includes(category)) {
            const newList = chosenCategories.filter((c) => c !== category);
            setChosenCategories(newList);
        } else {
            const newList = [...chosenCategories];
            newList.push(category);
            setChosenCategories(newList);
        }
    };

    const onModeChanged = () => {
        const currentMode = appMode;
        if (currentMode == AppMode.Display) {
            setAppMode(AppMode.Select);
        } else {
            // Save the current chosen categories in chrome backend
            setAppMode(AppMode.Display);
        }
    };

    return (
        <div className="app-body">
            <Row gutter={8} align="middle">
                <Col className="gutter-row" span={6}>
                    <img src={logo} className="app-logo" alt="logo" />
                </Col>
                <Col className="gutter-row" span={18}>
                    <span className="app-title">YouTube Focus Mode</span>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div className="app-description">
                        Choose the type of videos that you want to see in{" "}
                        <strong>Focus Mode</strong> and block distractions
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <CategoriesHeader
                        appMode={appMode}
                        onModeChanged={onModeChanged}
                    />
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <div className="category-box">
                        {appMode == AppMode.Display ? (
                            <CategoriesDisplay
                                chosenCategories={chosenCategories}
                            />
                        ) : (
                            <CategoriesSelector
                                allCategories={allCategories}
                                chosenCategories={chosenCategories}
                                onCategoryChosen={onCategoryChosen}
                            />
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};
