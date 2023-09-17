import React, {useEffect, useState} from "react";
// @ts-ignore
import footer from "../../../public/assets/edit_bottom.png";
import {useQuery} from "@apollo/react-hooks";
import {GET_PERSON_INFO} from "../../../graphql/queries";
import {useRouter} from "next/router";
import {ProfileType} from "../../../components/Portfolio/interfaces";
import EditProfile from "../../../components/Portfolio/EditProfile";
import {Layout} from "antd";
import Header from "../../../components/Header";
import ContainerFlex from "../../../components/ContainerFlex";
import {connect} from "react-redux";
import Forbidden403 from "../../../components/403";


const {Content} = Layout;


const EditPerson = (user: any) => {
    const router = useRouter();
    const {personSlug} = router.query;

    const [profile, setProfile] = useState<ProfileType>({
        id: '',
        firstName: '',
        bio: '',
        slug: '',
        avatar: '',
        skills: [],
        websites: [],
        websiteTypes: [],
        preferences: null
    });
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [redirect, setRedirect] = useState<boolean>(false);
    const {data: profileData} = useQuery(GET_PERSON_INFO, {variables: {personSlug}});

    useEffect(() => {
        if (profileData?.personInfo) {
            setProfile(profileData.personInfo);
        }
    }, [profileData]);

    useEffect(() => {
        if (user.user && profile.id) {
            if (user.user.id !== profile.id && !redirect) {
                setRedirect(true);
            } else {
                setIsCurrentUser(true);
            }
        }
    }, [profile, user]);

    useEffect(() => {
        if (redirect) {
            router.push('/');
        }
    }, [redirect]);


    return (
        <ContainerFlex>
            <Layout>
                <Header/>
                <Content className="main-page">
                        <EditProfile profile={profile} setProfile={setProfile}/>
                        <img style={{width: "100%"}} src={footer} alt=""/>
                    </Content>
            </Layout>
        </ContainerFlex>
    );
}

const mapStateToProps = (state: any) => ({
    user: state.user
})

export default connect(mapStateToProps, null)(EditPerson);
