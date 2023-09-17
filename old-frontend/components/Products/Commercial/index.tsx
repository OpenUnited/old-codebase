
import React from 'react';
import { RouteComponentProps, matchPath } from 'react-router';
import { Row, Divider } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_PARTNERS } from 'graphql/queries';
import { PARTNER_TYPES } from 'graphql/types';
import { getProp } from 'utilities/filters';
import { randomKeys } from 'utilities/utils';
import CustomAvatar from 'components/CustomAvatar';
import Loading from "../../Loading";

type Params = {
  productSlug?: any
} & RouteComponentProps;

const Commercial: React.FunctionComponent<Params> = ({ match }) => {
  const params: any = matchPath(match.url, {
    path: "/products/:productSlug/partners",
    exact: false,
    strict: false
  });
  const { data, error, loading } = useQuery(GET_PARTNERS, {
    variables: {
      productSlug: params.params.productSlug
    }
  });

  if(loading) return <Loading/>

  return (
    <>
      {
        !error && (
          <>
            {
              getProp(data, 'partners', []).map((partner: any, idx: number) => (
                <React.Fragment key={randomKeys()}>
                  <Row>
                    <div className="my-auto mr-8">
                      { CustomAvatar(partner.company, "name", 64) }
                    </div>
                    <div className="contributor-item my-auto">
                      <div className="contributor-item__name font-bold">
                        {getProp(partner, 'company.name', '')}
                      </div>
                      <div>
                        {PARTNER_TYPES[getProp(partner, 'role', 0)]}
                      </div>
                    </div>
                  </Row>
                  {
                    idx !== data.partners.length - 1 ? <Divider /> : null
                  }
                </React.Fragment>
              ))
            }
          </>
        )
      }
    </>
  );
};

export default Commercial;