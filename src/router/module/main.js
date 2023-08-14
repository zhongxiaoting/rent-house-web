export default [
  {
    path: '/',
    name: 'MainView',
    redirect: '/home',
    component: () => import('/src/views/mainView'),
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../../views/home')
      },
      {
        path: 'jobDetails',
        name: 'JobDetails',
        component: () => import('/src/views/jobDetails'),
      },
      {
        path: 'houseNavigation',
        name: 'HouseNavigation',
        component: () => import('/src/views/houseNavigation'),
      },
      {
        path: '/list',
        name: 'ListView',
        component: () => import('../../views/list')
      },
      {
        path: '/analysis',
        name: 'Analysis',
        redirect: '/analysisHome',
        component: () => import('/src/views/analysis'),
        children: [
          {
            path: '/analysisHome',
            name: 'AnalysisHome',
            component: () => import('/src/views/analysis/childrenView/analysisHome'),
          }
        ]
      },
      {
        path: '/houseCompare',
        name: 'HouseCompare',
        component: () => import('/src/views/houseCompare')
      },
      {
        path: '/houseDetails',
        name: 'HouseDetails',
        component: () => import('/src/views/houseDetails')
      }
    ]
  },


]
