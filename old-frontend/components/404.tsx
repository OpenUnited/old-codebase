import React from 'react';
import { Button, Result, Row } from 'antd';
import { useRouter } from 'next/router';
import { ContainerFlex } from '../components';

type Props = {
  onClick?: () => void;
};

const NotFound404: React.FunctionComponent<Props> = ({ onClick }) => {
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
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
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

export default NotFound404;