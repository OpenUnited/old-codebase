import React from "react";
import {Button} from "antd";
import {PageButtonProps} from "../interfaces";

const PageButton = ({number, active, changePage}: PageButtonProps) => {
    const style = active ? "" : ""
    return (
        <Button style={{margin: "36px 8px"}} key={number} className={style} onClick={() => changePage(number)}>
            {number}
        </Button>
    );
}

export default PageButton;
