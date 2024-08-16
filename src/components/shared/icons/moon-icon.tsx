// import
import { FC, SVGProps } from "react";

// MoonIconProps
type MoonIconProps = SVGProps<SVGSVGElement>;

const MoonIcon: FC<MoonIconProps> = ({
  width,
  height,
  fill,
  stroke,
  ...otherProps
}) => {
  return (
    <svg
      {...otherProps}
      width={width}
      height={height}
      fill={fill ?? "none"}
      stroke={stroke ?? "currentColor"}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.03 12.42C2.39 17.57 6.76 21.76 11.99 21.99C15.68 22.15 18.98 20.43 20.96 17.72C21.78 16.61 21.34 15.87 19.97 16.12C19.3 16.24 18.61 16.29 17.89 16.26C13 16.06 9 11.97 8.98 7.13996C8.97 5.83996 9.24 4.60996 9.73 3.48996C10.27 2.24996 9.62 1.65996 8.37 2.18996C4.41 3.85996 1.7 7.84996 2.03 12.42Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MoonIcon;
