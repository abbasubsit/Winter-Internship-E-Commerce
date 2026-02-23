import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ children, role }) => {
    const { userInfo } = useSelector((state) => state.auth);

    // Not logged in → send to login
    if (!userInfo) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but wrong role → send to home
    if (userInfo.role !== role) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RoleRoute;
