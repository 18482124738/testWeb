export default [
  // account
  {
    path: '/account',
    component: '../layouts/AccountLayout',
    routes: [{
        path: '/account',
        redirect: '/Account/login'
      },
      {
        path: '/account/login',
        component: './Account/Login'
      },
      {
        path: '/account/register',
        component: './Account/Register'
      },
      {
        path: '/account/register-result',
        component: './Account/RegisterResult'
      },
    ],
  },
  //user
  {
    path: '/user',
    component: '../layouts/UserCenterLayout',
    Routes: ['src/pages/Authorized'],
    // authority: ['admin', 'user'],
    routes: [{
        path: '/user/student',
        name: 'home',
        icon: 'student',
        routes: [{
          path: '/user/student/layout',
          name: 'tearchMenu',
          component: './Student/StudentLayout',
          routes: [{
              path: '/user/student/layout',
              redirect: '/user/student/layout/courseList'
            },
            {
              path: '/user/student/layout/courseList',
              name: 'student.course',
              component: './Student/Course/CourseList',
            },
            {
              path: '/user/student/layout/order',
              name: 'student.order',
              component: './Student/Order/OrderList',
            },
            {
              path: '/user/student/layout/balance',
              name: 'student.order',
              component: './Student/Balance/PaymentDetail',
            },
            {
              path: '/user/student/layout/userinfo',
              name: 'student.userinfo',
              component: './Student/Center/UserInfo',
            }
          ],
        }],
      },
      {
        path: '/user/management',
        name: 'home',
        icon: 'teacher',
        routes: [

          {
            path: '/user/management/teacher',
            name: 'teachers',
            component: '../layouts/ManagementLayout',
            routes: [{
                path: '/user/management/teacher',
                redirect: '/user/management/teacher/index/courseManagement'
              },
              {
                path: '/user/management/teacher/index',
                name: 'tearchIndex',
                component: './Teacher/TeachLayout',
                routes: [{
                    path: '/user/management/teacher/index',
                    redirect: '/user/management/teacher/index/courseManagement'
                  },
                  {
                    path: '/user/management/teacher/index/courseManagement',
                    name: 'courseManagement',
                    component: './Teacher/Course/CourseManagement',
                  },
                  {
                    path: '/user/management/teacher/index/termManagement',
                    name: 'courseManagement',
                    component: './Teacher/Term/TermManagement',
                  },
                  {
                    path: '/user/management/teacher/index/TermRedactCtn',
                    name: 'courseManagement',
                    component: './Teacher/Term/TermRedactCtn',
                  },
                  {
                    path: '/user/management/teacher/index/courseQusetionList',
                    name: 'courseQusetionList',
                    component: './Teacher/Course/CourseQusetionList',
                  },
                  {
                    path: '/user/management/teacher/index/examinationManagement',
                    name: 'courseManagement',
                    component: './Teacher/Course/ExaminationManagement',
                  },
                  {
                    path: '/user/management/teacher/index/CourseQusetionList',
                    name: 'courseManagement',
                    component: './Teacher/Course/CourseQusetionList',
                  },
                  {
                    path: '/user/management/teacher/index/courseInfoDetail',
                    name: 'courseManagement',
                    component: './Teacher/Course/CourseInfoDetail',
                    routes: [{
                        path: '/user/management/teacher/index/courseInfoDetail',
                        redirect: '/user/management/teacher/index/courseInfoDetail/term'
                      },
                      // {
                      //   path: '/user/management/teacher/index/courseInfoDetail/comment',
                      //   name: 'courseCatalog',
                      //   component: './Teacher/Comment/CatalogList',
                      // },
                      {
                        path: '/user/management/teacher/index/courseInfoDetail/term',
                        name: 'courseterm',
                        component: './Teacher/Term/TermList',
                      },
                      {
                        path: '/user/management/teacher/index/courseInfoDetail/recource',
                        name: 'courseterm',
                        component: './Teacher/Recource/RecourceList',
                      },
                    ]
                  },
                  {
                    path: '/user/management/teacher/index/termDetail',
                    name: 'courseManagement',
                    component: './Teacher/Term/TermDetail'
                  },
                  {
                    path: '/user/management/teacher/index/creatCourse',
                    name: 'creatCourse',
                    component: './Teacher/Course/CreatCourse',
                  },
                  {
                    path: '/user/management/teacher/index/courseDetails',
                    name: 'courseDetails',
                    component: './Teacher/Course/CourseDetails',
                  },
                  {
                    path: '/user/management/teacher/index/teachContent',
                    name: 'teachContent',
                    component: './Teacher/Course/TeachContent',
                  },
                  {
                    path: '/user/management/teacher/index/video',
                    name: 'videoCourse',
                    component: './Teacher/Video/VideoList',
                  },
                  {
                    path: '/user/management/teacher/index/recource',
                    name: 'courseDetails',
                    component: './Teacher/Recource/RecourceList',
                  },
                ],
              },
              {
                path: '/user/management/teacher/personal',
                name: 'tearchIndex',
                component: './Teacher/PersonalLayout',
                routes: [{
                    path: '/user/management/teacher/personal',
                    redirect: '/user/management/teacher/personal/courseManagement'
                  },
                  {
                    path: '/user/management/teacher/personal/courseManagement',
                    name: 'courseManagement',
                    component: './Teacher/Course/CourseManagement',
                  },
                  {
                    path: '/user/management/teacher/personal/creatCourse',
                    name: 'creatCourse',
                    component: './Teacher/Course/CreatCourse',
                  },
                  {
                    path: '/user/management/teacher/personal/teacherInfo',
                    name: 'teacherInfo',
                    component: './Teacher/Center/TeacherInfo',
                  },
                ],
              },
              {
                path: '/user/management/teacher/org',
                name: 'tearchIndex',
                component: './Teacher/OrgLayout',
                routes: [{
                    path: '/user/management/teacher/org',
                    redirect: '/user/management/teacher/org/personnelManagement'
                  },
                  {
                    path: '/user/management/teacher/org/personnelManagement',
                    name: 'personnelManagement',
                    component: './Teacher/Organization/Personnel',
                  },
                  {
                    path: '/user/management/teacher/org/creatCourse',
                    name: 'creatCourse',
                    component: './Teacher/Course/CreatCourse',
                  },
                ],
              },
              {
                path: '/user/management/teacher/finance',
                name: 'tearchIndex',
                component: './Teacher/FinanceLayout',
                routes: [{
                    path: '/user/management/teacher/finance',
                    redirect: '/user/management/teacher/finance/courseManagement'
                  },
                  {
                    path: '/user/management/teacher/finance/courseManagement',
                    name: 'courseManagement',
                    component: './Teacher/Course/CourseManagement',
                  },
                  {
                    path: '/user/management/teacher/finance/creatCourse',
                    name: 'creatCourse',
                    component: './Teacher/Course/CreatCourse',
                  },
                ],
              }
            ],
          },
        ],
      }

    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // dashboard
      {
        path: '/',
        redirect: '/home/index-page'
      },
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        routes: [{
          path: '/home/index-page',
          name: 'index-page',
          component: './Home/IndexPage',
        }],
      },
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        routes: [{
          path: '/home/index-page',
          name: 'index-page',
          component: './Home/IndexPage',
        }],
      },
      {
        path: '/course',
        name: 'course',
        icon: 'home',
        routes: [{
          path: '/course/info-page',
          name: 'info-page',
          component: './Home/PayCourse/CourseInfoPage'          
        }],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
