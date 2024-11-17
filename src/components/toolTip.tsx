import React, { useState } from "react";

interface ToolTipProps {
  text: string;
  children: React.ReactNode;
}

const ToolTip: React.FC<ToolTipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  const showToolTip = () => setVisible(true);
  const hideToolTip = () => setVisible(false);

  return (
    <div className="relative z-1000 inline-block" onMouseEnter={showToolTip} onMouseLeave={hideToolTip}>
      {children}
      {visible && (
        <div className="absolute bottom-full max-w-60 mb-2 w-max bg-gray-700 text-white text-sm rounded py-1 px-2 z-10">
          {text}
        </div>
      )}
    </div>
  );
};

export default ToolTip;
