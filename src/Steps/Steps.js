import Step from "./Step";
import style from './Steps.module.css';

function Steps(props){
    document.documentElement.style.setProperty("--current-step",props.currentStep);
    return (
        <div className={style.wrapper}>
            <div className={style.Steps}>
                <Step currentStep={props.currentStep} value="1" 
                stepName="Access Form" status={props.status} onClick={props.onClick}/>
            </div>
        </div>
        );
}

export default Steps;