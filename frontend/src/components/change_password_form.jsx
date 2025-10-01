//Форза за промяна на парола

import "../css/main.css"
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Navbar} from "./navbar.jsx";
import {useForm} from "react-hook-form";
import {SubmitButton} from "./submit_button.jsx";

export  function ChangePassword() {




    const navigate = useNavigate();
    const {register, handleSubmit} = useForm()

    const changePassword = async (data) => {
        const {new_password} = data;
        const changePasswordApiCall = await axios.post('http://localhost:8080/change_password', {
            new_password
        }, {
            withCredentials: true,
        });

        const callData = changePasswordApiCall.data
        if (callData.success === true) {
            alert("Successfully changed password!");
            navigate("/login");
        }
        else if(callData.success === false) {
            alert("Failed to change password!");
        }
    }


    return (
     <>
        <Navbar />
        <div className="main_content_wrapper">
          <div className="form_parent">
            <form className="form" onSubmit={handleSubmit(changePassword)}>
                <label className="inner_text" htmlFor="new_password">Type in new password</label>
                <input
                    type="password"
                    id="new_password"
                    {...register("new_password")}
                />
                <SubmitButton text={"Change password"}></SubmitButton>
            </form>
          </div>
        </div>
     </>
    )
}
