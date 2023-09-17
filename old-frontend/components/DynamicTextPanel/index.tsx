import React, { useState } from 'react';


type Params = {
  text: string;
  className?: any;
  length?: number;
};

const DynamicTextPanel = ({ text, className, length = 150}: Params) => {
  const [showMore, setShowMore] = useState<boolean>(false);

  return (
    <>
      <span className={className}>
        {
          (showMore || text.length <= length)
            ? text
            : `${text.substr(0, length)}...`
        }
      </span>
      {
        text.length > length ? (
          <span
              className="ml-5 pointer text-xs"
              onClick={() => {setShowMore(!showMore)}}
            >
              { showMore ? "Show Less" : "Show more" }
            </span>
        ) : null
      }
    </>
  )
};

export default DynamicTextPanel;