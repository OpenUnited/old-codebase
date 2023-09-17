import {Col, Row} from "antd";
import ReactPlayer from "react-player";

type Params = {
  videoLink: string;
};

const VideoPlayer = ({ videoLink }: Params) => {

  return (
    <Row>
      <Col span={24}>
        {videoLink.includes("embed")
          ? (
            <>
              <div style={{position: "relative", height: "250px", width: "100%"}}>
                <iframe src={videoLink}
                        frameBorder="0"
                        allowFullScreen
                        style={{width: "calc(100vw - 30px)", height: "250px", maxWidth: "430px"}}/>
              </div>
            </>
          ) : (
            <ReactPlayer
              width="100%"
              style={{maxWidth: "430px"}}
              height="280px"
              className="mr-10"
              url={videoLink}
            />
          )}
      </Col>
    </Row>
  )
};

export default VideoPlayer;