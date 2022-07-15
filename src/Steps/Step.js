import style from "./Step.module.css";

function Step(props){
    const selected = props.currentStep === parseInt(props.value) ? style.selected : style.nonselected;
    const status = props.status[props.value] ? "" : " " + style.disabled;
    return (
        <div className={style.Step + status} value={props.value} onClick={props.onClick}>
            {props.stepName}
            <div className={selected}></div>
        </div>
    );
    
}

export default Step;