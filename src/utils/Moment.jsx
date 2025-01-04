import React from "react";
import moment from "moment";

const RelativeTime = ({ timestamp }) => {
  const relativeTime = moment(timestamp).fromNow();

  return <div className="text-gray-400 font-main">{relativeTime}</div>;
};

export default RelativeTime;