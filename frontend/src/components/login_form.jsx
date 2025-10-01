//Форма за вписване

import {useNavigate} from "react-router-dom";
import {FormProvider, useForm} from "react-hook-form";
import {useEffect} from "react";
import axios from "axios";
import {Navbar} from "./navbar.jsx";
import {SubmitButton} from "./submit_button.jsx";
import {Label} from "./labels.jsx";
import {Input} from "./inputs.jsx";

export const LoginForm = () => {
    const navigate = useNavigate();
    const methods = useForm();

    const changeRegister = () => {
        navigate("/");
    }


    useEffect(() => {
        const sessionCheck = async () => {
            const request = await axios.get('http://localhost:8080/check-session', {withCredentials: true});
            const requestData = request.data;
            if(requestData.success === true) {
                navigate("/home");
            }
        }
        sessionCheck();
    }, [navigate])

    const onSubmit = async (data) => {
        const {username, password} = data
        if (username === "" || password === "") {
            alert("Please enter all fields to proceed with logging in!");
        }
        const response = await axios.post('http://localhost:8080/login', {
            username,
            password,
        }, {
            withCredentials: true,
        });
        if (response.data.success === true) {
            navigate("/home");
            alert("Logged in successfully!");
        } else {
            alert("Attempt to login was unsuccessful");
        }
    }


    return (
        <>
            <Navbar/>
            <div className="main_content_wrapper">
                <div className="form_parent">
                   <FormProvider {...methods}>
                     <form className="form" onSubmit={methods.handleSubmit(onSubmit)}>
                        <p className="form_label">Login form</p>
                        <Label text={"Username"} htmlForAttribute={"username"} />
                        <Input type={"text"} id={"username"}></Input>
                        <Label text={"Password"} htmlForAttribute={"password"} />
                        <Input type={"text"} id={"password"}></Input>
                        <SubmitButton text={"Login"}></SubmitButton>
                     </form>
                   </FormProvider>
                    <button className="button" onClick={changeRegister}>
                        Register instead
                    </button>
                </div>
            </div>
        </>
    );
};