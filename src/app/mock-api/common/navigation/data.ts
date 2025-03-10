/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'admin.farmmer',
        title: 'เกษตรกร',
        type: 'basic',
        icon: 'heroicons_outline:sun',
        link: '/admin/farmmer/list',
    },
    {
        id: 'admin.news',
        title: 'ข่าวสาร',
        type: 'basic',
        icon: 'heroicons_outline:newspaper',
        link: '/admin/news/list',
    },
    {
        id: 'admin.journal',
        title: 'วารสาร',
        type: 'basic',
        icon: 'heroicons_outline:clipboard-document-list',
        link: '/admin/journal/list',
    },
    {
        id: 'admin.faq',
        title: 'FAQ',
        type: 'basic',
        icon: 'heroicons_outline:academic-cap',
        link: '/admin/faq/list',
    },
    {
        id: 'contractor',
        title: 'ผู้รับเหมา',
        type: 'collapsable',
        icon: 'heroicons_outline:user',
        // link: '/news/list',
        children: [
            {
                id: 'admin.contractor',
                title: 'รายชื่อผู้รับเหมา',
                type: 'basic',
                // icon: 'heroicons_outline:newspaper',
                link: '/admin/contractor/list',
            },
            {
                id: 'admin.contractor-type',
                title: 'ประเภทผู้รับเหมา',
                type: 'basic',
                // icon: 'heroicons_outline:newspaper',
                link: '/admin/contractor-type/list',
            },
        ],
    },
    {
        id: 'admin.chat',
        title: 'แชท',
        type: 'basic',
        icon: 'heroicons_outline:chat-bubble-left-right',
        link: '/admin/chat',
    },
    {
        id: 'admin.chat',
        title: 'ตั้งค่าระบบ',
        icon: 'heroicons_outline:pencil-square',
        type: 'collapsable',
        children: [
            {
                id: 'admin.chat',
                title: 'แจ้งเตือน',
                type: 'basic',
                link: '/admin/confignoti',
            },
            {
                id: 'admin.pdpa',
                title: 'PDPA',
                type: 'basic',
                link: '/admin/pdpa/list',
            },
            {
                id: 'admin.condition',
                title: 'Term and Condition',
                type: 'basic',
                link: '/admin/condition/list',
            },
            {
                id: 'admin.contractor-type',
                title: 'จัดการข้อมูลโรงงาน',
                type: 'basic',
                link: '/admin/company/list',
            },
            {
                id: 'admin.contractor',
                title: 'จัดการข้อมูลบริษัท',
                type: 'basic',
                link: '/admin/company/detail',
            },
            {
                id: 'admin.user',
                title: 'จัดการผู้ใช้งาน',
                type: 'basic',
                link: '/admin/employee/list',
                // hidden: (item) => {

                //     var role = JSON.parse(localStorage.getItem('user'))

                //     if (role.type == 'Management') {
                //         return false
                //     }
                //     else {
                //         return true
                //     }
                // },
            },
            {
                id: 'admin.setting',
                title: 'ตั้งค่าวันที่ปิดฤดูการผลิต',
                type: 'basic',
                link: '/admin/config-year/list',
            },
        ],
    },


    // {
    //     id: 'admin.user',
    //     title: 'ข้อมูลบริษัท',
    //     type: 'collapsable',
    //     icon: 'heroicons_outline:pencil-square',
    //     children: [

    //     ],
    // },

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qr-code',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:rectangle-stack',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:bars-3',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'แดชบอร์ด',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    // {
    //     id: 'apps',
    //     title: 'Apps',
    //     type: 'group',
    //     icon: 'heroicons_outline:qr-code',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'pages',
    //     title: 'Pages',
    //     type: 'group',
    //     icon: 'heroicons_outline:document-duplicate',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'user-interface',
    //     title: 'UI',
    //     type: 'group',
    //     icon: 'heroicons_outline:rectangle-stack',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    // {
    //     id: 'navigation-features',
    //     title: 'Misc',
    //     type: 'group',
    //     icon: 'heroicons_outline:bars-3',
    //     children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    // },
    {
        id: 'purchase',
        title: 'ซื้อ',
        type: 'group',
        icon: 'heroicons_outline:inbox-arrow-down',
        children: [],
    },
    {
        id: 'sale',
        title: 'ขาย',
        type: 'group',
        icon: 'heroicons_outline:shopping-cart',
        children: [],
    },
    {
        id: 'inventory',
        title: 'คลังสินค้า',
        type: 'group',
        icon: 'heroicons_outline:cube',
        children: [],
    },
    {
        id: 'accounting',
        title: 'บัญชี/การเงิน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'delivery-workers',
        title: 'คนส่งของ',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'admin',
        title: 'จัดการพนักงาน',
        type: 'group',
        icon: 'heroicons_outline:users',
        children: [],
    },
    {
        id: 'reports',
        title: 'รายงาน',
        type: 'group',
        icon: 'heroicons_outline:clipboard-document-list',
        children: [],
    },
];
