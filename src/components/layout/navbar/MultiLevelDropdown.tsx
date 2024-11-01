import { getImage } from '@/lib/utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ChevronDown, ChevronRight, CircleEllipsis } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface MenuItem {
  title: string;
  icon?: any;
  subMenu?: MenuItem[];
}

const MultiLevelDropdown = () => {
  const homeIcon = getImage("home.svg");
  const clockIcon = getImage("clock.svg");
  const profileCircleIcon = getImage("profile-circle.svg");
  const settingsIcon = getImage("settings.svg");

  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [openSubIndex, setOpenSubIndex] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const toggleSubMenu = (index: string) => {
    setOpenSubIndex(openSubIndex === index ? null : index);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
      setOpenIndex(null);
      setOpenSubIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const menuItems: MenuItem[] = [
    { title: 'wallet' },
    {
      title: 'Help',
      icon: settingsIcon,
      subMenu: [
        { title: 'How to Buy/Sell' },
        { title: 'Placing an Order' },
        { title: 'How to be a Merchant' },
        { title: 'How to be a Seller' },
      ],
    },
    { title: 'Orders History', icon: clockIcon },
    {
      title: 'Account',
      icon: profileCircleIcon,
      subMenu: [
        { title: 'Dashboard', icon: homeIcon },
        { title: 'Order History', icon: clockIcon },
        { title: 'Profile', icon: profileCircleIcon },
        { title: 'Settings', icon: settingsIcon },
      ],
    },
  ];

  const renderMenuItems = (items: MenuItem[], parentIndex?: string) => (
    <ul className="space-y-1 bg-white dark:bg-[#14161B] text-gray-600 dark:text-gray-300 text-sm py-4">
      {items.map((item, index) => {
        const itemIndex = parentIndex ? `${parentIndex}-${index}` : index.toString();

        return (
          <li key={itemIndex}>
            <button
              onClick={() => {
                if (item.subMenu) toggleMenu(itemIndex);
              }}
              className="flex items-center p-4 py-3 w-full text-left rounded hover:text-blue-400"
            >
              {item.icon && <img src={item.icon} alt={item.title} className="mr-2 h-5 w-5" />}
              {item.title === "wallet" ? (
                <ConnectButton chainStatus={"none"} accountStatus={"address"} showBalance={false} />
              ) : (
                <>
                  {item.title}
                  {item.subMenu && (
                    <span className="ml-auto">
                      {openIndex === itemIndex ? <ChevronDown className="text-gray-500 dark:text-gray-400" /> : <ChevronRight className="text-gray-500 dark:text-gray-400" />}
                    </span>
                  )}
                </>
              )}
            </button>
            {item.subMenu && openIndex === itemIndex && (
              <ul className="pl-0 mt-1 space-y-1">
                {item.subMenu.map((subItem, subIndex) => {
                  const subItemIndex = `${itemIndex}-${subIndex}`;
                  return (
                    <li key={subItemIndex}>
                      <button
                        onClick={() => {
                          if (subItem.subMenu) toggleSubMenu(subItemIndex);
                        }}
                        className="flex items-center p-4 py-3 pl-8 w-full text-left rounded hover:text-blue-400"
                      >
                        {subItem.icon && <img src={subItem.icon} alt={subItem.title} className="mr-2 h-5 w-5" />}
                        {subItem.title}
                        {subItem.subMenu && (
                          <span className="ml-auto">
                            {openSubIndex === subItemIndex ? <ChevronDown className="text-gray-500 dark:text-gray-400" /> : <ChevronRight className="text-gray-500 dark:text-gray-400" />}
                          </span>
                        )}
                      </button>
                      {subItem.subMenu && openSubIndex === subItemIndex && (
                        <ul className="pl-0 mt-1 space-y-1">
                          {renderMenuItems(subItem.subMenu, subItemIndex)}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="relative inline-block lg:hidden" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="rounded"
      >
        <CircleEllipsis />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 dark:border-gray-700 shadow-md rounded">
          {renderMenuItems(menuItems)}
        </div>
      )}
    </div>
  );
};

export default MultiLevelDropdown;
