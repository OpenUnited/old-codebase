import React from 'react';
import { Avatar } from 'antd';

type Props = {
  style?: any,
  onClick: any,
  className?: string,
  icon: any,
  backgroundColor: string,
}

const AvatarIcon: React.FunctionComponent<Props> = ({ icon, style, onClick, className, backgroundColor = "#1890ff" }) => {
  const iconStyle = { ...style, cursor: "pointer" };
  return (
    <span
      style={iconStyle}
      onClick={onClick}
      className={className}
    >
      <Avatar
        style={{
          backgroundColor
        }}
        icon={icon}
      />
    </span>
  )
}

export default AvatarIcon;
