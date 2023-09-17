import React from "react";
import {PagesBarProps} from "../interfaces";
import PageButton from "./PageButton";
import {Button} from "antd";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";

const PagesBar = ({number, active, changePage, hasNext, hasPrev}: PagesBarProps) => {
    return (<>
            {number > 1 ? (
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Button style={{margin: "36px 8px"}} disabled={!hasPrev} icon={<LeftOutlined/>}
                            onClick={() => changePage(active - 1)}/>
                    {Array.from({length: number}, (p, i) => i + 1).map(pageNumber => (
                        <PageButton changePage={changePage} key={pageNumber} number={pageNumber}
                                    active={pageNumber === active}/>
                    ))}
                    <Button style={{margin: "36px 8px"}} disabled={!hasNext} icon={<RightOutlined/>}
                            onClick={() => changePage(active + 1)}/>
                </div>
            ) : null}
        </>
    );
}

export default PagesBar;
