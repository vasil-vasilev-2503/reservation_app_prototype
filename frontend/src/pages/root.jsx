//Root jsx файл - дефинира рутирането/навигацията до всяка страница на frontend

import {createRoot} from "react-dom/client";
import {StrictMode} from "react";
import {LoginForm} from "../components/login_form.jsx";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Home} from "./home.jsx";
import {ProfilePage} from "./profile.jsx";
import {ChangePassword} from "../components/change_password_form.jsx";
import {RegisterForm} from "../components/register_form.jsx";
import {NotFound} from "../components/not_found.jsx";



createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/changePassword" element={<ChangePassword />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    </StrictMode>,
)