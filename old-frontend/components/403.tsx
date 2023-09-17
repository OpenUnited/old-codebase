import React from 'react';
import {Button, Result, Row} from 'antd';
import {useRouter} from 'next/router';
import {ContainerFlex} from '../components';

type Props = {
    personSlug: string | string[] | undefined
};

const Forbidden403: React.FunctionComponent<Props> = ({personSlug}) => {
    const router = useRouter();

    const subTitle = `You don't have permissions to edit profile of ${personSlug}`

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
                    subTitle={subTitle}
                    extra={
                        <Button
                            type="primary"
                            onClick={() => router.push('/')}
                        >
                            Back Home
                        </Button>
                    }
                />
            </Row>
        </ContainerFlex>
    );
};

export default Forbidden403;
