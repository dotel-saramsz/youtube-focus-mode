import * as React from "react";
import { Row, Col } from "antd";
import { CategoryLabel } from "../CategoryLabel/CategoryLabel";
import "./CategoriesDisplay.css";

interface CategoryDisplayProps {
    chosenCategories: string[];
}

export const CategoriesDisplay: React.FC<CategoryDisplayProps> = (props) => {
    return (
        <Row gutter={[8, 8]}>
            {props.chosenCategories.map((category) => (
                <Col>
                    <CategoryLabel
                        text={category}
                        isChosen={props.chosenCategories.includes(category)}
                        isClickable={true}
                        onClicked={(category: string) => {
                            console.log("No actions taken!");
                        }}
                    />
                </Col>
            ))}
        </Row>
    );
};
