import React from "react";
import Avatar from "antd/lib/avatar/avatar";
import Link from "next/link";
import { Button, Tag } from "antd";

type Props = {};

const VacancyBox: React.FunctionComponent<Props> = ({}) => {
  const vacancyData = [
    {
      title: "Backend Software Developer",
      productName: "Booking.com",
      date: "3d ago",
      tags: ["new-tag", "some", "asp."],
      location: "Evotec SE-Hamburg",
      job: "Part-time",
      logo: "https://cdn.freelogovectors.net/svg07/booking-com-icon-logo.svg",
    },
    {
      title: "Initiative US Lead",
      productName: "AuthMachine",
      date: "2d ago",
      tags: ["new-tag", "some", "asp."],
      location: "Remote",
      job: "Part-time",
      logo:
        "https://upload.wikimedia.org/wikipedia/commons/d/df/IPhone_icon_aqua.png",
    },
  ];

  return (
    <>
      <div className="vacancy-box-title">
        <p>
          <b>Vacancies</b>
        </p>
      </div>
      {vacancyData.map((item) => (
        <div className="vacancy-box-item" key={item.title}>
          <Avatar src={item.logo} />
          <div className="vacancy-box-item-body">
            <Link href="/">{item.title}</Link>
            <p>
              <b>{item.productName}</b> • <b className="high">{item.date}</b>
            </p>
            <span>
              {item.tags.map((tag) => (
                <Tag color="default" key={tag}>
                  {tag}
                </Tag>
              ))}
            </span>
            <br />
            <span>
              {item.location} • {item.job}
            </span>
          </div>
        </div>
      ))}
      <div className="center mt-30">
        <Button>See all vacancies</Button>
      </div>
    </>
  );
};

export default VacancyBox;
