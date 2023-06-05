import {
    HomeIcon,
    RectangleGroupIcon,
    UserGroupIcon,
    UsersIcon,
    ChatBubbleLeftEllipsisIcon,
    AcademicCapIcon,
    StarIcon,
    EnvelopeIcon
} from "@heroicons/react/24/outline"
import { NavLink } from 'react-router-dom';
import { useAuth } from "../contexts/Auth/AuthContext";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
    const { signOut } = useAuth();

    return (
        <div className="h-screen overflow-clip">
            <div className="navbar bg-base-100">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">Festify Admin</a>
                </div>
                <div className="flex-none gap-2">
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80" />
                            </div>
                        </label>
                        <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 z-20">
                            <li>
                                <a className="justify-between">
                                    Profile
                                    <span className="badge">New</span>
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            <li><a onClick={signOut}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="drawer lg:drawer-open">
                <input type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col p-10 bg-base-200">
                    {children}
                </div>
                <div className="drawer-side">
                    <ul className="menu p-4 w-64 h-full bg-base-100 text-base-content">

                        <p className="menu-title">General</p>
                        <li>
                            <NavLink to="/" className="p-3 focus:bg-neutral">
                                <HomeIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Home</span>
                            </NavLink>
                        </li>

                        <div className="divider h-0.5 my-2"></div>
                        <p className="menu-title">Content</p>
                        <li>
                            <NavLink to="/seasons" className="p-3 focus:bg-neutral">
                                <RectangleGroupIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Seasons</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/lessons" className="p-3 focus:bg-neutral">
                                <AcademicCapIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Lessons</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/rewards" className="p-3 focus:bg-neutral">
                                <StarIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Rewards</span>
                            </NavLink>
                        </li>

                        <div className="divider h-0.5 my-2"></div>
                        <p className="menu-title">Notifications</p>
                        <li>
                            <NavLink to="/notifications" className="p-3 focus:bg-neutral">
                                <ChatBubbleLeftEllipsisIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Notifications</span>
                            </NavLink>
                            <NavLink to="/emails" className="p-3 focus:bg-neutral">
                                <EnvelopeIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Emails</span>
                            </NavLink>
                        </li>

                        <div className="divider h-0.5 my-2"></div>
                        <p className="menu-title">Administration</p>
                        <li>
                            <NavLink to="/users" className="p-3 focus:bg-neutral">
                                <UsersIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Users</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admins" className="p-3 focus:bg-neutral">
                                <UserGroupIcon className="w-5 h-5 ml-3" />
                                <span className="ml-2 text-md">Admins</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    )
}