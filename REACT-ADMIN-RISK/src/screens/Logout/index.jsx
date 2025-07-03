import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../services/api/apiClient';
import AlertNotify from '../../components/global/AlertNotify';

const AUTH_STORAGE = "AUTHENTICATED_USER"

function Logout() {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');

    const fetchLogout = async () => {
        try {
            await apiClient("/api/Auth/logout", "POST");
        } catch (error) {
            throw new Error(error);
        }
    }

    useEffect(() => {
        try {
            fetchLogout();
            localStorage.removeItem(AUTH_STORAGE);

            // Simulate a short delay before redirecting
            const timer = setTimeout(() => {
                navigate('/login');
            }, 1000);

            return () => clearTimeout(timer);
        } catch (error) {
            setErrorMsg(error);
        }
    }, [navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20vh' }}>
            {errorMsg &&
                <AlertNotify
                    severity="warning"
                    message={errorMsg}
                    onClose={() => setErrorMsg('')}
                />
            }
            <h2>You have been logged out</h2>
            <p>Redirecting to login page...</p>
        </div>
    );
}

export default Logout;