//Home страница - съдържа формата за резервации

import "../css/main.css";
import {useEffect} from "react";
import "../components/login_form.jsx";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import {useNavigate} from "react-router-dom";
import {BookingForm} from "../components/booking_form.jsx";




export function Home() {
    const navigate = useNavigate();
    useEffect(() => {
        const sessionCheck = async () => {
            const request = await axios.get('http://localhost:8080/check-session', {withCredentials: true});
            const requestData = request.data;
            if(requestData.success === false) {
                navigate("/login");
            }
        }
        sessionCheck();
    }, [navigate])

    return (
        <>
            <BookingForm/>
        </>
    );
}
