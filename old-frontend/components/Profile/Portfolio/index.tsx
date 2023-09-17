import React from 'react'
import {Row, Col, Spin, Empty} from 'antd'
import {useQuery} from '@apollo/react-hooks'
import {GET_REVIEWS} from '../../../graphql/queries'
import ReactPlayer from 'react-player'
import {StarScore, DynamicTextPanel} from '../../../components'
import {getProp} from '../../../utilities/filters';
import {formatDate} from '../../../utilities/utils';
import {useRouter} from "next/router";
import Link from 'next/link';
import Loading from "../../Loading";


const Portfolio: React.FunctionComponent = () => {
  const router = useRouter();
  const {personSlug} = router.query;

  const {
    data: reviewsData,
    error: reviewError,
    loading: reviewLoading
  } = useQuery(GET_REVIEWS, {
    variables: {personSlug}
  })

  if (reviewLoading) return <Loading/>

  const reviews = reviewsData?.reviews || [];

  return (
    <>
      <div className="profile-section">
        <h3 className="section-title" style={{marginBottom: 20}}>Portfolio</h3>
        {reviewLoading ? (
          <Spin size="large"/>
        ) : !reviewError && (
          <>
            {reviews.length > 0 ? reviews.map((review: any, index: number) => {
              return (
                <div key={`review-${index}`} className="grey-border p-24 mb-24">
                  <Row>
                    <Col span={17}>
                      <Link
                        href={`/${personSlug}/portfolio/${getProp(review, 'id', '')}`}
                      >
                        <a className="text-grey-9">{getProp(review, 'product.name', '')}</a>
                      </Link>

                      <p className="pr-15 text-sm mb-14">
                        <strong>Summary: </strong>
                        <DynamicTextPanel
                          text={getProp(review, 'product.shortDescription', '')}
                          className="text-grey"
                        />
                      </p>
                      <Row className="mb-14">
                        <StarScore
                          score={parseInt(getProp(review, 'score', 0))}
                          style={{margin: '1px 16px 0px 0'}}
                        />
                        <span className="text-grey-9 text-sm">
                          {formatDate(getProp(review, 'updatedAt', new Date()))}
                        </span>
                      </Row>
                      <p className="pr-15 text-sm">
                        <strong>Review: </strong>
                        <DynamicTextPanel
                          text={getProp(review, 'text', '')}
                          className="text-grey"
                        />
                      </p>
                    </Col>
                    <Col xs={24} sm={24} md={7}>
                      <ReactPlayer
                        className="portfolio-video"
                        width="100%"
                        height="160px"
                        url={getProp(review, 'product.videoUrl', '')}
                      />
                    </Col>
                  </Row>
                </div>
              )
            }): <Empty style={{ margin: "30px auto"}} description="Portfolio is empty" />}
          </>
        )}
      </div>
    </>
  )
}

export default Portfolio;