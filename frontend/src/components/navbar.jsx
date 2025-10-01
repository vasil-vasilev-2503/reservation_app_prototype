//Навигационен бар

import {useNavigate} from "react-router-dom";

export function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <button
                onClick={() => navigate('/home')}
                className="nav_button"
            >
                Home
            </button>
            <button
                onClick={() => navigate('/profile')}
                className="nav_button"
            >
                Profile
            </button>
        </nav>
    );
}