import React from "react";
import PropTypes from "prop-types";

export const CardContent = ({ children }) => {
  return <div className="text-gray-700">{children}</div>;
};

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};
