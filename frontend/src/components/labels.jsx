//Надписи/label-ли за входните полета

import "../css/main.css"

export const Label = ({htmlForAttribute, text}) => {
    return <label className="labels" htmlFor={htmlForAttribute}>
        {text}
    </label>
}