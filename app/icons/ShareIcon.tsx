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
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1_76)">
      <path
        d="M22 3L9.21802 10.083"
        stroke="#333"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M11.698 20.334L22 3.001H2L9.218 10.084L11.698 20.334Z"
        stroke="#333"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_76">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>

  // thin icon
  // <svg
  //   width="40"
  //   height="40"
  //   viewBox="0 0 40 40"
  //   fill="none"
  //   xmlns="http://www.w3.org/2000/svg"
  // >
  //   <path
  //     d="M37.8592 6.49005C37.7847 6.34198 37.6704 6.21766 37.529 6.13108C37.3877 6.04451 37.2249 5.99913 37.0592 6.00005H2.89919C2.71505 5.99813 2.53497 6.05404 2.38427 6.15988C2.23358 6.26573 2.11987 6.41618 2.0592 6.59005C1.99343 6.76227 1.98217 6.95054 2.02688 7.12938C2.07159 7.30823 2.17013 7.46903 2.3092 7.59005L14.3092 17.86V36.05C14.3103 36.2389 14.3708 36.4225 14.4821 36.5751C14.5933 36.7276 14.7497 36.8413 14.9292 36.9C15.022 36.9143 15.1164 36.9143 15.2092 36.9C15.3489 36.9 15.4867 36.8675 15.6117 36.805C15.7367 36.7426 15.8454 36.6518 15.9292 36.5401L37.7492 7.40005C37.8464 7.27167 37.9078 7.11978 37.9271 6.95991C37.9465 6.80004 37.923 6.6379 37.8592 6.49005ZM5.32922 7.81005H33.1292L15.3592 16.38L5.32922 7.81005ZM16.1292 18L34.1292 9.31005L16.1292 33.31V18Z"
  //     fill="#333"
  //   />
  // </svg>
);
