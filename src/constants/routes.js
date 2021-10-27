import { PublicLayout } from "components/Layouts/PublicLayout";
import { PrivateLayout } from "components/Layouts/PrivateLayout";
import SignIn from "features/Auth/SignIn";
import SignUp from "features/Auth/SignUp";
import Settings from "features/Settings";
import { lazy} from "react";
import ChatRoom from "features/ChatRoom";
import StreamHub from 'features/StreamHub'
import { Redirect } from "react-router";
import Admin from "features/Admin";
const Home = lazy(() => import("features/Home/index.jsx"));

const ForgotPassword = lazy(() =>
  import("features/Auth/ForgotPassword/index.jsx")
);
const RentPlayer = lazy(() => import("features/RentPlayer/index.jsx"));

const routes = [
  {
    path: "/",
    exact: true,
    layout: PrivateLayout,
    main: Home
  },
  {
    path: "/admin",
    exact: true,
    layout: PublicLayout,
    main: Admin
  },
  {
    path: "/signin",
    exact: true,
    layout: PublicLayout,
    main: SignIn
  },
  {
    path: "/signup",
    exact: true,
    layout: PublicLayout,
    main: SignUp
  },
  {
    path: "/setting/profile",
    exact: false,
    layout: PrivateLayout,
    main: Settings
  },
  {
    path: "/setting/privacy",
    exact: false,
    layout: PrivateLayout,
    main: Settings
  },
  {
    path: "/setting/wallet",
    exact: false,
    layout: PrivateLayout,
    main: Settings
  },
  {
    path: "/forgot-password",
    exact: false,
    layout: PublicLayout,
    main: ForgotPassword
  },
  {
    path: "/playerdou",
    exact: false,
    layout: PrivateLayout,
    main: RentPlayer
  },
  {
    path: "/streamhub",
    exact: false,
    layout: PublicLayout,
    main: StreamHub
  },
  {
    path: "/chat-room",
    exact: false,
    layout: PrivateLayout,
    main: ChatRoom
  }
];

export default routes;