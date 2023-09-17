import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
// @ts-ignore
import ShowMoreText from "react-show-more-text";

type Params = {
  text: string;
  className?: any;
  length?: number;
  style?: object;
};

const DynamicHtml = ({ text, className, length = 150, style }: Params) => {
  const [showMore, setShowMore] = useState<boolean>(text.length > length);

  useEffect(() => {
    setShowMore(text.length > length);
  }, [text])

  return (
    <>
      <ShowMoreText
        lines={3}
        more="Show more"
        less="Show less"
        className={className}
        expanded={false}
        anchorClass="show-more-anchor"
      >
      {parse(text)}
      </ShowMoreText>
    </>
  )
};

export default DynamicHtml;
