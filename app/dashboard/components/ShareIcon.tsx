import React from "react";
export const ShareIcon = ({
  fill = "currentColor",
  filled,
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: any) => (
  <svg
    width="26"
    height="20"
    viewBox="0 0 26 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M25.0847 0L10.1779 20L9.16026 8.06027L0 0.179109L25.0847 0ZM9.60307 8.08129L10.5175 18.8097L23.9113 0.839617L9.60307 8.08129ZM23.7132 0.448261L1.17281 0.609203L9.40354 7.69063L23.7132 0.448261Z"
      fill="black"
    />
  </svg>
);
