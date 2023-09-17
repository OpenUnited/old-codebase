import React from 'react';
import { Avatar } from 'antd';
import { EditOutlined } from '@ant-design/icons';

type Props = {
  style?: any;
  onClick: any;
  className?: string;
}

const EditIcon: React.FunctionComponent<Props> = ({ style, onClick, className }) => {
  const iconStyle = { ...style, cursor: 'pointer' };
  return (
    <span
      style={iconStyle}
      onClick={onClick}
      className={className}
    >
      <Avatar
        style={{
          backgroundColor: '#1890ff'
        }}
        icon={<EditOutlined />}
      />
    </span>
  )
}

export default EditIcon;
