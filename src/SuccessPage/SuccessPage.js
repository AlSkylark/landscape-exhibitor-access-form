import style from "./SuccessPage.module.css"
import Success from "../Fields/Success";


function SuccessPage(props){
    return (
        <div className={style.big}>
            <Success />
            <div>Submitted Successfully!</div>
        </div>
    );
}

export default SuccessPage;