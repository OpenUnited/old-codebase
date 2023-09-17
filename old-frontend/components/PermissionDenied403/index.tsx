import React from 'react';
import { Button, Result, Row } from 'antd';
import { useRouter } from 'next/router';
import { ContainerFlex } from '../../components';

type Props = {
  onClick?: () => void;
};

const PermissionDenied403: React.FunctionComponent<Props> = ({ onClick }) => {
    const router = useRouter();

    return (
        <ContainerFlex>
            <Row
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flexGrow: 1,
            }}
            >
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                <Button
                    type="primary"
                    onClick={() => (onClick ? onClick() : router.push('/'))}
                >
                    Back Home
                </Button>
                }
            />
            </Row>
        </ContainerFlex>
    );
};

export default PermissionDenied403;