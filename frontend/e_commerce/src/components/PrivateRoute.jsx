import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!userInfo) {
        // Redirect to login, but save where user was trying to go
        return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
    }

    return children;
};

export default PrivateRoute;
