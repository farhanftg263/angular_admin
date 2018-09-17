export const navItems = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-speedometer',
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
  },*/
  {
    title: true,
    name: 'Manager'
  },
  {
    name: 'Manage Admin User',
    url: '/base',
    icon: 'icon-puzzle',
    children: [   
      {
        name: 'Manage Users',
        url: '/admin_user/summary',
        icon: 'icon-puzzle'
      },
      {
        name: 'Roles',
        url: '/base/forms',
        icon: 'icon-puzzle'
      },
    ]
  },{
    name: 'Manage Master',
    url: '/base',
    icon: 'icon-puzzle',
    children: [   
      {
        name: 'Manage CMS',
        url: '/cms/summary',
        icon: 'icon-puzzle'
      },
      {
        name: 'Manage Global App Settings',
        url: '/base/forms',
        icon: 'icon-puzzle'
      },
      {
        name: 'Manage Email Template',
        url: '/base/forms',
        icon: 'icon-puzzle'
      },
      
    ]
  },
  
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