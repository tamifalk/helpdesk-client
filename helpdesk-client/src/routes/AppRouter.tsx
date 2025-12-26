import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "../pages/WelcomePage";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import TicketList from "../pages/TicketsList";
import TicketDetailsDrawer from "../pages/TicketDetailsDrawer";
import AddTicketDialog from "../pages/AddTicketDialog";
import { getTicketsById } from "../services/ticket.service";
import UsersList from "../pages/UsersList";
import UsersDetails from "../pages/UserDetails";
import { getUsers, getUsersById } from "../services/user.service";
import AddUserDialog from "../pages/AddUserDialog";
import RoleGuard from "../guard/RoleGuard";
import NotFound from "../components/NotFound";

const AppRouter = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/dashboard",
        element: <RoleGuard allowedRoles={["admin", "agent", "customer"]}><Dashboard /></RoleGuard>,
        children: [
            {
                path: "tickets",
                element: <TicketList />,
                children: [
                    {
                        path: "new",
                        element: <RoleGuard allowedRoles={["customer"]}><AddTicketDialog /></RoleGuard>

                    },
                    {
                        path: ":id",
                        element: <TicketDetailsDrawer />,
                        loader: async ({ params }) => {
                            const id = Number(params.id);

                            // הגנה קריטית: אם זה לא מספר אל תפנה לשרת בכלל
                            if (isNaN(id)) {
                                return null;
                            }

                            try {
                                const ticket = await getTicketsById(id);
                                return ticket;
                            } catch (error) {
                                console.error("Loader error:", error);
                                return null;
                            }
                        }
                    }
                ]
            },
            {
                path: "users",
                element: <RoleGuard allowedRoles={["admin"]}><UsersList /></RoleGuard>,
                loader: async () => {
                    try {
                        const data = await getUsers();
                        return data;
                    } catch (error) {
                        console.error("Loader error:", error);
                        return [];
                    }
                },
                // errorElement: <div>{showErrorAlert("שגיאה בטעינת המשתמשים")}</div>,
                children: [
                    {
                        path: "new",
                        element: <AddUserDialog />
                    },
                    {
                        path: ":id",
                        element: <UsersDetails />,
                        loader: async ({ params }) => {
                            const id = Number(params.id);

                            // הגנה קריטית: אם זה לא מספר אל תפנה לשרת בכלל
                            if (isNaN(id)) {
                                return null;
                            }

                            try {
                                const user = await getUsersById(id);
                                return user;
                            } catch (error) {
                                console.error("Loader error:", error);
                                return null;
                            }
                        }
                    }


                ]
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />
    }
]);




export default AppRouter;