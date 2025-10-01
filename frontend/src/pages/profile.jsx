//Страница за потребителски профил

import "../css/main.css"
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Navbar} from "../components/navbar.jsx";

export  function ProfilePage() {


    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");


    useEffect(() => {
        const userInfoFetch = async () => {
            try {
                const fetching = await axios.get('http://localhost:8080/user_info_fetch', {
                    withCredentials: true,
                });

                const fetchingData = fetching.data;
                if (fetchingData.success === true) {
                    setUsername(fetchingData.username);
                    setEmail(fetchingData.email);
                } else {
                    alert("You are not logged in!");
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                alert("Failed to fetch user data!");
            }
        };

        userInfoFetch();
    }, []);


    const logOut = async () => {
        const logoutApiCall = await axios.post('http://localhost:8080/logout', {}, {
            withCredentials: true,
        });
        const callData = logoutApiCall.data
        if (callData.success === true) {
            alert("You logged out!");
            navigate("/login");
        }
        else if(callData.success === false) {
            alert("You are not logged in!");
        }
    }

    const changePassword = () => {
        navigate("/changePassword");
    }

    return (
     <>
        <Navbar />
        <div className="main_content_wrapper">
          <div className="form_parent">
            <div className="form">
                <p className="form_label" >Profile page</p>
                <p className="outer_text">Username: <span className="inner_text">{username}</span></p>
                <p className="outer_text">Email: <span className="inner_text">{email}</span></p>
            </div>
            <button className="button" onClick={logOut}>Logout</button>
            <button className="button" onClick={() => changePassword()}>Change password</button>
          </div>
        </div>
     </>
    )
}
