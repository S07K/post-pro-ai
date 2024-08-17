import React from "react";
export const ArrowLeftIcon = ({
  fill = "currentColor",
  className= '',
  filled,
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size/2}
    height={size}
    viewBox="0 0 12 24"
  >
    <path
      fill={fill}
      className={className}
      fillRule="evenodd"
      d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"
    />
  </svg>
);
