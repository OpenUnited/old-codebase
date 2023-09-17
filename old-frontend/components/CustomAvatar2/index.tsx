import React, {useEffect, useState} from 'react';
import {Avatar} from 'antd';
import {useQuery} from "@apollo/react-hooks";
import {GET_PERSON_INFO} from "../../graphql/queries";
import Link from "next/link";
import {apiDomain} from "../../utilities/constants";

interface ICustomAvatar2Props {
  person: {
      firstName: string
    slug: string
  }
  size?: number
}

export const CustomAvatar2 = ({person, size = 35}:ICustomAvatar2Props) => {
  
  const personSlug = person.slug
  const {data: profileData} = useQuery(GET_PERSON_INFO, {variables: {personSlug}})

  const [profile, setProfile] = useState<any>({
      id: '',
      firstName: '',
      bio: '',
      slug: '',
      avatar: '',
      skills: [],
      websites: [],
      websiteTypes: []
  });

  useEffect(() => {
    if (profileData?.personInfo) {
        setProfile(profileData.personInfo);
    }
  }, [profileData]);
  
  
  return (
    <Link href={`/${person.slug}`}>
      <Avatar size={size} 
        style={{
          marginRight: size >= 100 ? 40 : 5,
          lineHeight: `${size}px`,
          userSelect: 'none',
          cursor: 'pointer'
          }} src={apiDomain + profile.avatar}/>
    </Link>
  )
}

export default CustomAvatar2;
