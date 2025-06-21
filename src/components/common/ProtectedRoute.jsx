import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/router';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, userRole } = useContext(AuthContext);
    const router = useRouter();

    if (!isAuthenticated) {
        router.push('/auth/sign-in');
        return null;
    }

    // Define role-based access
    const roleRoutes = {
        learner: '/learner/home',
        admin: '/admin/dashboard',
        parent: '/parent/dashboard',
    };

    if (roleRoutes[userRole]) {
        router.push(roleRoutes[userRole]);
        return null;
    }

    return children;
};

export default ProtectedRoute;