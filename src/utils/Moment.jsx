import React from "react";
import moment from "moment";

const RelativeTime = ({ timestamp }) => {
  const relativeTime = moment(timestamp).fromNow();

  return <div>{relativeTime}</div>;
};

export default RelativeTime;