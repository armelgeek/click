import * as React from "react";

interface CloseIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({ className = "", ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={24}
    height={24}
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default CloseIcon;
