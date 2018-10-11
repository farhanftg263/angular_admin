export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
    modid:1  
    
  },
  /*{
    title: true,
    name: 'Theme'
  },
  {
    name: 'Colors',
    url: '/theme/colors',
    icon: 'icon-drop'
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    icon: 'icon-pencil'
  },
  {
    title: true,
    name: 'Manager'
  },*/
  {
    name: 'Manage Admin User',
    url: '/base',
    icon: 'fa fa-users',
    children: [   
      {
        name: 'Manage Users',
        url: '/admin_user/summary',
        icon: 'fa fa-user',
        modid:2
      },
      {
        name: 'Roles',
        url: '/roles/summary',
        icon: 'fa fa-user-secret',
        modid:3
      },
    ]
  },
  {
    name: 'Manage App Users',
    url: '/base',
    icon: 'icon-puzzle',
    children: [   
      {
        name: 'Manage App User',
        url: '/app_user/summary',
        icon: 'fa fa-user',
        modid:4
      },      
    ]
  },  
  {
    name: 'Manage Master',
    url: '/base',
    icon: 'fa fa-wrench',
    children: [   
      {
        name: 'Manage CMS',
        url: '/cms/summary',
        icon: 'fa fa-bell-o',
        modid:5
      },
      {
        name: 'Manage Global App Settings',
        url: '/global_setting/summary',
        icon: 'fa fa-file-text-o',
        modid:6
      },
      {
        name: 'Manage Price',
        url: '/manage_price/summary',
        icon: 'fa fa-fw fa-money',
        modid:7
      },
      {
        name: 'Manage Email Template',
        url: '/email_template/summary',
        icon: 'fa fa-envelope',
        modid:8
      },
      
    ]
  },
  {
    name: 'Manage Rewards',
    url: '/base',
    icon: 'fa fa-fw fa-dollar',
    children: [   
      {
        name: 'Manage Product',
        url: '/product/summary',
        icon: 'fa fa-product-hunt',
        modid:9
      },
      {
        name: 'Manage Redemption Request',
        url: '/redemption_request/summary',
        icon: 'fa fa-fw fa-arrow-right',
        modid:10
      },
      
    ]
  },
  {
    name: 'Manage Photo',
    icon: 'fa fa-fw fa-photo',
    children: [   
      {
        name: 'Photo',
        url: '/photo/summary',
        icon: 'fa fa-fw fa-photo',
        modid:11
      },
    ]
  },
  {
    name: 'Manage Reports',
    url: '/base',
    icon: 'fa fa-tasks',
    children: [   
      {
        name: 'Stats',
        url: '/stats/summary',
        icon: 'icon-star',
        modid:14
      },
      {
        name: 'Revenue',
        url: '/revenue/summary',
        icon: 'icon-star',
        modid:15
      },
      {
        name: 'User Registartion',
        url: '/user_registration/summary',
        icon: 'fa fa-user',
        modid:16
      },
      {
        name: 'Leaderboard',
        url: '/leaderboard/summary',
        icon: 'fa fa-fw fa-bar-chart-o',
        modid:17
      },
      
    ]
  },
  {
    name: 'Contact Admin',
    url: '/contact-admin/summary',
    icon: 'fa fa-file-text-o',
    modid:12  
    
  },
  {
    name: 'Feedback',
    url: '/feedback/summary',
    icon: 'fa fa-file-text-o',
    modid:13  
    
  }
  
  /*{
    name: 'Pages',
    url: '/pages',
    icon: 'icon-star',
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'icon-star'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'icon-star'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'icon-star'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'icon-star'
      }
    ]
  },*/
];