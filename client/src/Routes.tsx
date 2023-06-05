import { lazy, Suspense, ComponentType } from "react"
import { Routes as Switch, Route } from "react-router-dom"
import SidebarLayout from "./layouts/SidebarLayout";
import Loading from "./components/Loading/Loading"
import NotFound from "./pages/404/404";

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

// Pages with layout and lazy loading
const Home = lazy(() => import("./pages/Home/Home"))
const HomeWithLayout = withLayout(SidebarLayout, Home)

const Admins = lazy(() => import("./pages/Admins/Admins"))
const AdminsWithLayout = withLayout(SidebarLayout, Admins)

const Users = lazy(() => import("./pages/Users/Users"))
const UsersWithLayout = withLayout(SidebarLayout, Users)

const Seasons = lazy(() => import("./pages/Seasons/Seasons"))
const SeasonsWithLayout = withLayout(SidebarLayout, Seasons)

const Lessons = lazy(() => import("./pages/Lessons/Lessons"))
const LessonsWithLayout = withLayout(SidebarLayout, Lessons)

const Rewards = lazy(() => import("./pages/Rewards/Rewards"))
const RewardsWithLayout = withLayout(SidebarLayout, Rewards)

const Notifications = lazy(() => import("./pages/Notifications/Notifications"))
const NotificationsWithLayout = withLayout(SidebarLayout, Notifications)

const Emails = lazy(() => import("./pages/Emails/Emails"))
const EmailsWithLayout = withLayout(SidebarLayout, Emails)

const SignIn = lazy(() => import("./pages/SignIn/SignIn"))
const SignInWithSuspense = withSuspense(SignIn)

export default function Routes() {
    return (
        <Switch>
            {/* General */}
            <Route
                path="/"
                element={<HomeWithLayout />}
            />

            {/* Content */}
            <Route
                path="/lessons"
                element={<LessonsWithLayout />}
            />
            <Route
                path="/seasons"
                element={<SeasonsWithLayout />}
            />
            <Route
                path="/rewards"
                element={<RewardsWithLayout />}
            />

            {/* Notifications */}
            <Route
                path="/notifications"
                element={<NotificationsWithLayout />}
            />
            <Route
                path="/emails"
                element={<EmailsWithLayout />}
            />

            {/* Administration */}
            <Route
                path="/users"
                element={<UsersWithLayout />}
            />
            <Route
                path="/admins"
                element={<AdminsWithLayout />}
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