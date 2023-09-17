import React, {useEffect, useState} from 'react';
import { GET_AM_LOGIN_URL, GET_PERSON } from '../../graphql/queries';
import { Button, message } from "antd";
import Loading from "../Loading";
import {useMutation, useLazyQuery} from "@apollo/react-hooks";
import {FAKE_LOGIN} from "../../graphql/mutations";


type Props = {
  buttonTitle?: string,
  fullWidth?: boolean,
  updatePersonData: any,
};

const LoginViaAM: React.FunctionComponent<Props> = ({ buttonTitle = "Sign in",
                                                      fullWidth =  false,
                                                      updatePersonData }) => {
  
  const [loadAMLogin, {data: authMachineData}] = useLazyQuery(GET_AM_LOGIN_URL);
  const [loading, setLoading] = useState(false);

  const [fake_login, { data: fakeLoginData }] = useMutation(FAKE_LOGIN);
  const [loadPerson, {data: personData}] = useLazyQuery(GET_PERSON, {fetchPolicy: "no-cache"});

  useEffect(() => {
    if (authMachineData && authMachineData?.getAuthmachineLoginUrl) {
      window.location.replace(authMachineData.getAuthmachineLoginUrl);
    }
  }, [authMachineData]);

  useEffect(() => {
    setLoading(false);
    updatePersonData(personData);
  }, [personData]);

  useEffect(() => {
    if(fakeLoginData) {
      let person = fakeLoginData.fakeLogin.person;
      loadPerson({variables:
        {"id": person.id}
      });
    }
  }, [fakeLoginData])

  const loginViaAM = () => {
    setLoading(true);
    
    if (process.env.APPLICATION_MODE === 'development') {
      fake_login({variables: 
        { "personId": process.env.TEST_USER, }
      });
    }
    else {
      loadAMLogin();
      if (authMachineData?.getAuthmachineLoginUrl === null)
      {
        message.error("Error").then();
        setLoading(false);
      }
    }

  }

  if ((loading && authMachineData?.getAuthmachineLoginUrl) ||
    (loading && fakeLoginData)
  )
    { return <Loading />}

  return (
    <Button className="ml-auto btn-sign"
            style={{width: fullWidth ? "100%" : "auto"}}
            onClick={() => loginViaAM()}>{buttonTitle}</Button>
  );
};
export default LoginViaAM;
