import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/rescueRushLogo.svg';

const ResouseNavBar = () => {
    const location = useLocation();
    const menuItems = [
        { path: '/', label: 'Home' },
        { path: '/working-schedule', label: 'Working Schedule' },
        { path: '/Medicalresources', label: 'Medical Resources' },
        { path: '/staff-detail', label: 'Staff Detail' },
        { path: '/leave-management', label: 'Leave management' },
    ];

    return (

        <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            width: '200px',
            minHeight: '100vh', 
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)' 
        }}>
            
            <img 
                src={logo} 
                alt="Rescue Rush Logo" 
                style={{ 
                    width: '150px', 
                    display: 'block',
                    margin: '0 auto 30px' 
                }}
            />

            {/* Menu items mapping */}
            {menuItems.map((item) => (
                <Link
                    key={item.path}
                    to={item.path}
                    style={{
                        display: 'block',
                        padding: '12px 15px', 
                        color: location.pathname === item.path ? '#333333' : '#666666', 
                        backgroundColor: location.pathname === item.path ? '#f0f0f6' : 'transparent',
                        textDecoration: 'none',
                        margin: '8px 0', 
                        borderRadius: '4px', 
                        fontSize: '15px', 
                        fontWeight: 500, 
                        transition: 'all 0.2s ease', 
                        fontFamily: "'Segoe UI', sans-serif" 
                    }}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
};

export default ResouseNavBar;