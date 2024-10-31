import {HiOutlineHome, HiOutlineUser, HiOutlineUsers, HiOutlineCalendarDays, HiOutlineEnvelope } from 'react-icons/hi2'

export const ORDER_PAGE = (orderId:string) => `/order/${orderId}`
export const HOME_PAGE = "/";
export const HOME_PAGE_ALT = "https://iexchange.tech";
export const DASHBOARD_PAGE = '/dashboard'
export const POST_AD_PAGE = "/my-ads/create"
export const ORDER_HISTORY_PAGE = "/dashboard/history/orders"
export const APPEALS_PAGE = "/appeals"
export const MY_ADS_PAGE = "/my-ads"
export const QUICK_TRADE_PAGE = "/quick";
export const SELECT_PAYMENT_METHOD_PAGE = (searchParams: string) => QUICK_TRADE_PAGE + `/2?${searchParams}`;


export const WELCOME_PAGE = "/"
export const FAQ_PAGE = "/faq"
export const HELP_PAGE = "/help"
export const PRIVACY_POLICY_PAGE = "/privacy-policy"

export const primaryNavigationLinks = [
    {
        title: "P2P",
        isActive: false,
        href: HOME_PAGE,
        needsAuth: false
    },
    {
        title: "Apeals",
        isActive: false,
        href: APPEALS_PAGE,
        needsAuth: false
    },
    {
        title: "My ads",
        isActive: false,
        href: MY_ADS_PAGE,
        needsAuth: true
    },
    {
        title: "help Center",
        icon: HiOutlineUser,
        isActive: false,
        href: HELP_PAGE,
        needsAuth: false
    },
    {
        title: "Account",
        icon: HiOutlineEnvelope,
        isActive: false,
        needsAuth: true
    }
]

export const resourcesLinks = [
    {
        title: "Welcome",
        href: WELCOME_PAGE
    },
    {
        title: "FAQ",
        href: FAQ_PAGE
    },
    {
        title: "Help",
        href: HELP_PAGE
    },
    {
        title: "Privacy Policy",
        href: PRIVACY_POLICY_PAGE
    },
]


export const PROTECTED_ROUTES = [
    ORDER_PAGE,
    POST_AD_PAGE,
    DASHBOARD_PAGE,
]