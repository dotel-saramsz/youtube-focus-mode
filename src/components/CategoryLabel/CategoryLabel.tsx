import * as React from "react";
import "./CategoryLabel.css";
import classNames from "classnames";

interface CategoryLabelProps {
    text: string;
    isChosen: boolean;
    isClickable: boolean;
    onClicked: (category: string) => void;
}

export const CategoryLabel: React.FC<CategoryLabelProps> = (
    props
): JSX.Element => {
    let labelClasses = classNames({
        "category-label": true,
        "category-label-chosen": props.isChosen,
        "category-label-unchosen": !props.isChosen,
        "category-label-clickable": props.isClickable,
        "category-label-unclickable": !props.isClickable,
    });

    return (
        <div
            className={labelClasses}
            onClick={() => props.onClicked(props.text)}
        >
            {props.text}
        </div>
    );
};
