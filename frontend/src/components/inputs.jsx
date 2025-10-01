//Входни полета

import "../css/main.css"
import {useFormContext} from "react-hook-form";

export const Input = ({type, id}) => {
    const {register} = useFormContext();
    return <input className="inputs" type={type} id={id} {...register(id)}></input>
}