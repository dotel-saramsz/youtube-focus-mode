import * as React from "react";
import { Row, Col } from "antd";
import { CategoryLabel } from "../CategoryLabel/CategoryLabel";
import "./CategoriesSelector.css";

interface CategorySelectorProps {
    allCategories: string[];
    chosenCategories: string[];
    onCategoryChosen: (category: string) => void;
}

export const CategoriesSelector: React.FC<CategorySelectorProps> = (props) => {
    return (
        <Row gutter={[8, 8]}>
            {props.allCategories.map((category) => (
                <Col>
                    <CategoryLabel
                        text={category}
                        isChosen={props.chosenCategories.includes(category)}
                        isClickable={true}
                        onClicked={props.onCategoryChosen}
                    />
                </Col>
            ))}
        </Row>
    );
};
