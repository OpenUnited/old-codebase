import React from "react";
import {Row} from "antd";
import {StarFilled, StarOutlined} from "@ant-design/icons"

type Props = {
    score: number;
    style?: any;
    className?: string;
};

const StarScore: React.FunctionComponent<Props> = ({score, style, className}) => {

    const getStarItems = (score: number) => {
        const renderItems = [];
        for (let i = 0; i < 5; i += 1) {
            if (i < score) {
                renderItems.push(
                    <StarFilled key={i} style={{color: '#FAAD14', fontSize: 16, marginRight: 8}}/>
                )
            } else {
                renderItems.push(
                    <StarOutlined key={i} style={{color: '#D9D9D9', fontSize: 16, marginRight: 8}}/>
                )
            }
        }
        return renderItems;
    }

    const stars = getStarItems(score);

    return (
        <Row style={style} className={className}>{stars}</Row>
    )
}

export default StarScore;
