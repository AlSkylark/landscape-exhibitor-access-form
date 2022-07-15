import "./Header.css";
import logo from "../resources/logos.png";

function Header(props){
    return (
        <header>
            <div className="title"><span>ACCESS FORM</span></div>
            <div className="logo"><img src={logo} alt="Landscape Show Logo" /></div>
        </header>
    );
}

export default Header;