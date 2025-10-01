//Страница - not found - Извежда се когато се опитаме да достъпим несъществуваща страница в навигацията на сървъра

import {Navbar} from "./navbar.jsx";

export const NotFound = () => {
    return (
        <>
            <Navbar />
            <div className="main_content_wrapper">
                <div className="form_parent">
                    <h1 className="header_text">Page not found!</h1>
                </div>
            </div>
        </>
    )
}