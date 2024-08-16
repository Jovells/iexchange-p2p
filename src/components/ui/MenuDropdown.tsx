import Link from 'next/link';
import { useState, useEffect, useRef, ReactNode } from 'react';

interface DropdownProps {
    title: string;
    icon: string;
    dropdownItems: any[];
    children?: ReactNode;
    itemIcon?: string;
}

const MenuDropdown: React.FC<DropdownProps> = ({ title, icon, dropdownItems, children, itemIcon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleOutsideClick = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
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
                className="inline-flex items-center px-4 py-2 pl-1 pr-0 lg:pl-0 bg-transparent text-[#33343E] font-roboto font-medium text-sm leading-5 tracking-widest rounded-md focus:outline-none"
            >
                <img src={icon} alt="icon" className="w-5 h-5 ml-2 lg:ml-6 mr-2" />
                <span className="hidden lg:flex">{title}</span>
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
                    className="w-auto absolute right-0 w-48 mt-0 py-4 t-6 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg z-10"
                >
                    {children}
                    {dropdownItems.length > 0 && (
                        <div className="min-w-[200px] py-4 space-y-3">
                            {dropdownItems.map((item, index) => (
                                <Link
                                    key={index}
                                    href={item.link}
                                    className="flex flex-row px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {item.icon && <img src={item.icon} alt="icon" className="w-5 h-5 mr-2" />}
                                    <span>
                                        {item.label}
                                    </span>
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
