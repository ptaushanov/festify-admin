import { lazy, LazyExoticComponent, Suspense } from "react"
import { Routes as Switch, Route } from "react-router-dom"
import Loading from "./components/Loading/Loading"
import NotFound from "./pages/404/404";

const withSuspense = (WrappedComponent: LazyExoticComponent<() => JSX.Element>) => {
    return () => (
        <Suspense fallback={<Loading />}>
            <WrappedComponent />
        </Suspense>
    );
};

// Pages with layout and lazy loading
const Home = lazy(() => import("./pages/Home/Home"))
const HomeWithSuspense = withSuspense(Home)

const Admins = lazy(() => import("./pages/Admins/Admins"))
const AdminsWithSuspense = withSuspense(Admins)

const Users = lazy(() => import("./pages/Users/Users"))
const UsersWithSuspense = withSuspense(Users)

const Seasons = lazy(() => import("./pages/Seasons/Seasons"))
const SeasonsWithSuspense = withSuspense(Seasons)

const Lessons = lazy(() => import("./pages/Lessons/Lessons"))
const LessonsWithLayout = withSuspense(Lessons)

const Rewards = lazy(() => import("./pages/Rewards/Rewards"))
const RewardsWithSuspense = withSuspense(Rewards)

const Notifications = lazy(() => import("./pages/Notifications/Notifications"))
const NotificationsWithSuspense = withSuspense(Notifications)

const Emails = lazy(() => import("./pages/Emails/Emails"))
const EmailsWithSuspense = withSuspense(Emails)

export default function Routes() {
    return (
        <Switch>
            {/* General */}
            <Route
                path="/"
                element={<HomeWithSuspense />}
            />

            {/* Content */}
            <Route
                path="/lessons"
                element={<LessonsWithLayout />}
            />
            <Route
                path="/seasons"
                element={<SeasonsWithSuspense />}
            />
            <Route
                path="/rewards"
                element={<RewardsWithSuspense />}
            />

            {/* Notifications */}
            <Route
                path="/notifications"
                element={<NotificationsWithSuspense />}
            />
            <Route
                path="/emails"
                element={<EmailsWithSuspense />}
            />

            {/* Administration */}
            <Route
                path="/users"
                element={<UsersWithSuspense />}
            />
            <Route
                path="/admins"
                element={<AdminsWithSuspense />}
            />

            {/* 404 Not Found */}
            <Route
                path="*"
                element={<NotFound />}
            />
        </Switch>
    )
}
