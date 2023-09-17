import React, {useEffect, useState} from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_AM_REGISTER_URL } from '../../graphql/queries';
import { Button } from "antd";
import Loading from "../Loading";

type Props = {
    buttonTitle?: string,
    fullWidth?: boolean,
    margin: string
};

const RegisterViaAM: React.FunctionComponent<Props> = ({ buttonTitle = "Sign up",
                                                        fullWidth =  false ,
                                                       margin = ""}) => {
    const [loadAMRegister, {data: authMachineData}] = useLazyQuery(GET_AM_REGISTER_URL);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authMachineData && authMachineData?.getAuthmachineRegisterUrl) {
            window.location.replace(authMachineData.getAuthmachineRegisterUrl);
        }
    }, [authMachineData])

    const registerViaAM = () => {
        loadAMRegister();
        setLoading(true);
        if (authMachineData?.getAuthmachineRegisterUrl === null)
        {
            message.error("Error").then();
            setLoading(false)
        }
    }

    if (loading && authMachineData?.getAuthmachineRegisterUrl)
    { return <Loading />}

    return (
        <Button type={"primary"}
                className="ml-auto btn-sign"
                style={{width: fullWidth ? "100%" : "auto", margin: margin}}
                onClick={() => registerViaAM()}>{buttonTitle}</Button>
    );
};
export default RegisterViaAM;
