import {HiOutlineHome, HiOutlineUser, HiOutlineUsers, HiOutlineCalendarDays, HiOutlineEnvelope } from 'react-icons/hi2'

export const ORDER_PAGE = (orderId:string) => `/order/${orderId}`
export const HOME_PAGE = ""
export const DASHBOARD_PAGE = '/dashboard'
export const POST_AD_PAGE = "/my-ads/create"
export const APPEALS_PAGE = "/appeals"
export const MY_ADS_PAGE = "/my-ads"


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