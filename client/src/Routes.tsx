import { lazy, Suspense, ComponentType } from "react"
import { Routes as Switch, Route, Navigate, useLocation } from "react-router-dom"
import SidebarLayout from "./layouts/SidebarLayout";
import Loading from "./components/Loading/Loading"
import NotFound from "./pages/404/404";

import { useAuth } from "./contexts/Auth/AuthContext";

interface LayoutProps {
    children: React.ReactNode;
}

const withLayout = <P extends object>(
    LayoutComponent: ComponentType<LayoutProps>,
    WrappedComponent: ComponentType<P>
): React.FC<P> => {
    return (props: P) => (
        <LayoutComponent>
            <Suspense fallback={<Loading />}>
                <WrappedComponent {...props} />
            </Suspense>
        </LayoutComponent>
    );
};

const withSuspense = <P extends object>(
    WrappedComponent: ComponentType<P>
): React.FC<P> => {
    return (props: P) => (
        <Suspense fallback={<Loading />}>
            <WrappedComponent {...props} />
        </Suspense>
    );
}

const withPrivateRoute = <P extends object>(
    WrappedComponent: ComponentType<P>
): React.FC<P> => {
    return (props: P) => {
        const { currentUser } = useAuth()
        const location = useLocation();

        if (!currentUser) return (
            <Navigate to={`/sign-in?redirect=${encodeURIComponent(location.pathname)}`} replace />
        )
        return <WrappedComponent {...props} />
    }
}

// Pages with layout and lazy loading
const Home = lazy(() => import("./pages/Home/Home"))
const HomeWithLayout = withLayout(SidebarLayout, Home)
const HomeWithPrivateRoute = withPrivateRoute(HomeWithLayout)

const Admins = lazy(() => import("./pages/Admins/Admins"))
const AdminsWithLayout = withLayout(SidebarLayout, Admins)
const AdminsWithPrivateRoute = withPrivateRoute(AdminsWithLayout)

const Users = lazy(() => import("./pages/Users/Users"))
const UsersWithLayout = withLayout(SidebarLayout, Users)
const UsersWithPrivateRoute = withPrivateRoute(UsersWithLayout)

const Seasons = lazy(() => import("./pages/Seasons/Seasons"))
const SeasonsWithLayout = withLayout(SidebarLayout, Seasons)
const SeasonsWithPrivateRoute = withPrivateRoute(SeasonsWithLayout)

const Lessons = lazy(() => import("./pages/Lessons/Lessons"))
const LessonsWithLayout = withLayout(SidebarLayout, Lessons)
const LessonsWithPrivateRoute = withPrivateRoute(LessonsWithLayout)

const Rewards = lazy(() => import("./pages/Rewards/Rewards"))
const RewardsWithLayout = withLayout(SidebarLayout, Rewards)
const RewardsWithPrivateRoute = withPrivateRoute(RewardsWithLayout)

const Notifications = lazy(() => import("./pages/Notifications/Notifications"))
const NotificationsWithLayout = withLayout(SidebarLayout, Notifications)
const NotificationsWithPrivateRoute = withPrivateRoute(NotificationsWithLayout)

const Emails = lazy(() => import("./pages/Emails/Emails"))
const EmailsWithLayout = withLayout(SidebarLayout, Emails)
const EmailsWithPrivateRoute = withPrivateRoute(EmailsWithLayout)

const SignIn = lazy(() => import("./pages/SignIn/SignIn"))
const SignInWithSuspense = withSuspense(SignIn)

export default function Routes() {
    return (
        <Switch>
            {/* General */}
            <Route
                path="/"
                element={<HomeWithPrivateRoute />}
            />

            {/* Content */}
            <Route
                path="/lessons"
                element={<LessonsWithPrivateRoute />}
            />
            <Route
                path="/seasons"
                element={<SeasonsWithPrivateRoute />}
            />
            <Route
                path="/rewards"
                element={<RewardsWithPrivateRoute />}
            />

            {/* Notifications */}
            <Route
                path="/notifications"
                element={<NotificationsWithPrivateRoute />}
            />
            <Route
                path="/emails"
                element={<EmailsWithPrivateRoute />}
            />

            {/* Administration */}
            <Route
                path="/users"
                element={<UsersWithPrivateRoute />}
            />
            <Route
                path="/admins"
                element={<AdminsWithPrivateRoute />}
            />

            {/* Sign In */}
            <Route
                path="/sign-in"
                element={<SignInWithSuspense />}
            />

            {/* Not Found */}
            <Route
                path="*"
                element={<NotFound />}
            />
        </Switch>
    )
}