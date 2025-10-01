//Форма за регистрация

import {useNavigate} from "react-router-dom";
import {FormProvider, useForm} from "react-hook-form";
import {useEffect} from "react";
import axios from "axios";
import {Navbar} from "./navbar.jsx";
import {SubmitButton} from "./submit_button.jsx";
import {Input} from "../components/inputs.jsx";
import {Label} from "../components/labels.jsx";

export const RegisterForm = () => {
    const navigate = useNavigate();
    const methods = useForm();

    const changeLogin = () => {
        navigate("/login");
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
        const {username, password, email} = data
        const response = await axios.post('http://localhost:8080/register', {
            username,
            password,
            email
        })
        if (response.data.success === true) {
            navigate("/login");
            alert("Registered successfully!");
        }
        if (response.data.success === false) {
            alert("Attempt to register was unsuccessful!");
        }
    }


    return (
        <>
            <Navbar />
            <div className="main_content_wrapper">
                <div className="form_parent">
                    <FormProvider {...methods}>
                    <form className="form" onSubmit={methods.handleSubmit(onSubmit)}>
                        <p className="form_label">Register form</p>
                        <Label text={"Username"} htmlForAttribute={"username"} />
                        <Input type={"text"} id={"username"}></Input>
                        <Label text={"Password"} htmlForAttribute={"password"} />
                        <Input type={"text"} id={"password"}></Input>
                        <Label text={"Email"} htmlForAttribute={"email"} />
                        <Input type={"email"} id={"email"}></Input>
                        <SubmitButton text={"Register"}></SubmitButton>
                      </form>
                    </FormProvider>
                    <button className="button" onClick={changeLogin}>
                        Login instead
                    </button>
                </div>
            </div>
        </>
    )
};


