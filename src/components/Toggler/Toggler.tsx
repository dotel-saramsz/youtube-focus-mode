import * as React from "react";
import { Button } from "antd";

export const Toggler = () => {
    const [appEnabled, setAppEnabled] = React.useState(false);

    const onToggled = () => {
        // The app state was toggled by the user
        console.log(
            `Old App State: ${appEnabled}, New App State: ${!appEnabled}`
        );
        setAppEnabled(!appEnabled);
    };

    return (
        <div className="toggleSwitch">
            <Button
                type={appEnabled ? "default" : "primary"}
                onClick={onToggled}
            >
                {appEnabled ? "Disable" : "Enable"}
            </Button>
        </div>
    );
};
