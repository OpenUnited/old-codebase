import React from "react";
import Link from "next/link";
import {Row, Col, Card, Tag} from "antd";
import {useQuery} from "@apollo/react-hooks";
import ReactPlayer from "react-player";
import {GET_PRODUCTS} from "../../graphql/queries";
import {getProp} from "../../utilities/filters";
import {TagType} from "../../graphql/types";
// @ts-ignore
import CheckCircle from "../../public/assets/icons/check-circle.svg";
import parse from "html-react-parser";
import {useRouter} from "next/router";
import Loading from "../Loading";

let pluralize = require("pluralize");

const ProductTab: React.FunctionComponent = () => {
  const {data, loading} = useQuery(GET_PRODUCTS, {
    fetchPolicy: "no-cache"
  });
  const router = useRouter();

  const getAvailableTaskText = (availableTasks: number) => {
    if (availableTasks === 0) return "";
    return `${availableTasks} available ${pluralize("challenge", availableTasks)}`;
  }

  const getAvailableInitiativeText = (initiatives: number) => {
    if (initiatives === 0) return "";
    return `${initiatives} available ${pluralize("initiative", initiatives)}`;
  }

  const goTo = (link: string, e?: any) => {
    if (e) {
      e.preventDefault();
    }
    router.push(link).then();
  }

  if (loading) return <Loading/>;

  return (
    <Row gutter={[16, 16]} className="card product-list" style={{margin: "0 auto"}}>
      {
        data && data.products.map((product: any, idx: number) => {
          const availableTasks = getProp(product, "availableTaskNum", 0);
          const initiatives = getProp(product, "initiativeSet", []).length;
          return (
            <Col key={idx} xs={24} sm={12} md={12} lg={8}>
              <Card
                cover={
                  <ReactPlayer
                    width="100%"
                    height="200px"
                    url={product.videoUrl ? product.videoUrl : ""}
                  />
                }
              >
                <div onClick={
                  () => goTo(`/${getProp(product, "owner", "products")}/${product.slug}`)
                }>
                  <div className="pb-50">
                    {
                      getProp(product, "tag", []).map((tag: TagType, idx: number) => (
                        <Tag key={`tag-${idx}`}>{tag.name}</Tag>
                      ))
                    }
                    <div>
                      <Link href={`/${getProp(product, "owner", "products")}/${product.slug}`}>
                        {getProp(product, "name", "")}
                      </Link>
                    </div>
                    <div className="text-grey html-description">
                      {parse(getProp(product, "shortDescription", ""))}
                    </div>
                  </div>
                  <div style={{
                    position: "absolute",
                    bottom: 16
                  }}>
                    {availableTasks > 0 && (
                      <Link href={`/${getProp(product, "owner", "products")}/${product.slug}/challenges`}>
                        <div>
                          <img
                            src={CheckCircle}
                            className="check-circle-icon"
                            alt="status"
                          />
                          <span>
                            {getAvailableTaskText(availableTasks)}
                          </span>
                        </div>
                      </Link>
                    )}
                    <span>
                      {availableTasks > 0 && (<>&nbsp;&nbsp;</>)}
                      <Link href={`/${getProp(product, "owner", "products")}/${product.slug}/initiatives`}>
                        {getAvailableInitiativeText(initiatives)}
                      </Link>
                    </span>
                  </div>
                </div>
              </Card>
            </Col>
          )
        })
      }
    </Row>
  );
};

export default ProductTab;
