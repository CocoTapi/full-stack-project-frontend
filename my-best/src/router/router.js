import { createBrowserRouter } from "react-router-dom";
import RootLayout from '../pages/RootLayout';
import ErrorPage from '../pages/util/ErrorPage';
import HomePage from '../pages/HomePage';
import ActivitiesRootLayout from '../pages/activities/ActivitiesRootLayout';
import ActivitiesPage, { loader as activitiesLoader} from '../pages/activities/ActivitiesPage';
import LoginPage, { action as loginAction } from '../pages/auth/LoginPage';
import LoginLayout from '../pages/auth/LoginLayout';
import SignUpPage, { action as signUpAction } from '../pages/auth/SignUpPage';
import { action as logoutAction } from '../pages/auth/logout';
import { checkAuthLoader, loader as tokenLoader } from '../pages/util/checkAuth';
import ActivityDetailPage, { loader as activityLoader, action as deleteActivityAction } from '../pages/activities/ActivityDetailPage';
import EditActivityPage from '../pages/activities/EditActivityPage';
import NewActivityPage from '../pages/activities/NewActivityPage';
import { action as activityFormAction, loader as tagsLoader} from '../pages/activities/formAction';
import UserMainPage from "../pages/user_page/UserMainPage";
import UserPage, { loader as userDetailLoader } from "../pages/user_page/UserPage";

export const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      id: 'root',
      loader: tokenLoader,
      children: [
        { index: true, element: <HomePage /> },
        { 
          path: 'activities',
          element: <ActivitiesRootLayout />,
          children: [
            { 
              index: true, 
              element: <ActivitiesPage />,
              loader: activitiesLoader
            },
            {
              path: ':activityId',
              id: 'activity-detail',
              loader: activityLoader,
              children: [
                {
                  index: true,
                  element: <ActivityDetailPage /> ,
                  action: deleteActivityAction
                },
                {
                  path: 'edit',
                  element: <EditActivityPage />,
                  loader: tagsLoader,
                  action: activityFormAction
                }
              ]
            },
            {
              path: 'new',
              id: 'tags',
              element: <NewActivityPage />,
              loader: tagsLoader,
              action: activityFormAction
            }
          ]
        },
        {
          path: 'auth',
          element: <LoginLayout />,
          children: [
            {
              index: true,
              element: <LoginPage />,
              action: loginAction
            },
            {
              path: 'signup',
              element: <SignUpPage />,
              action: signUpAction
            },
          ]
        },
        {
          path: 'mypage',
          errorElement: <ErrorPage />,
          loader: checkAuthLoader,
          children: [
            { index: true, element: <UserMainPage />},
            {
              path: ':userId',
              id: 'user-detail',
              element: <UserPage />,
              loader: userDetailLoader
            }
          ]
        },
        {
          path: 'logout',
          action: logoutAction,
        },
      ],
    }
  ]);