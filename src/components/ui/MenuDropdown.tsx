import Link from 'next/link';
import { useState, useEffect, useRef, ReactNode } from 'react';

interface DropdownProps {
  title: string;
  icon: string;
  notification?: string;
  dropdownItems: any[];
  children?: ReactNode;
  itemIcon?: string;
  onClick?: () => void;
}

const MenuDropdown: React.FC<DropdownProps> = ({
  title,
  icon,
  dropdownItems,
  notification,
  children,
  itemIcon,
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block text-left"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={toggleDropdown}
    >
      <button
        onClick={() => onClick?.()}
        className="inline-flex items-center px-4 py-2 pl-1 pr-0 lg:pl-0 bg-transparent text-[#33343E] dark:text-white font-medium text-[14px] rounded-md focus:outline-none"
      >
        <span className="flex items-center transition-colors duration-200 hover:text-[#01A2E4] dark:hover:text-[#01A2E4]">
          <img src={icon} alt="icon" className="w-5 h-5 mr-2 lg:mr-2" />
          <span className="flex gap-1">
            <span className="hidden lg:flex">{title}</span>
            {notification && (
              <span className=" inline-flex items-center justify-center p-1 text-xs font-bold leading-none text-red-100 bg-primary rounded-full">
                {notification}
              </span>
            )}
          </span>
        </span>
        <svg
          className="hidden lg:flex w-5 h-5 ml-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 min-w-48 mt-0 t-6 origin-top-right bg-white dark:bg-[#14161B] pt-2 rounded-lg shadow-md z-10 transition-opacity duration-200 ease-in-out"
          style={{ opacity: isOpen ? 1 : 0 }}
        >
          <div className="max-h-[500px] overflow-y-auto transition-all duration-200 ease-in-out">{children}</div>
          {dropdownItems.length > 0 && (
            <div className="min-w-[200px] py-4 space-y-3 border border-gray-200 dark:border-gray-800">
              {dropdownItems.map((item, index) => (
                <Link
                  target={item.link.startsWith("https") ? "_blank" : "_self"}
                  key={index}
                  href={item.link}
                  className="flex flex-row px-4 py-2 text-sm text-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                >
                  {item.icon && <img src={item.icon} alt="icon" className="w-5 h-5 mr-2" />}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MenuDropdown;
