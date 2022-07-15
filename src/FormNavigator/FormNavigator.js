import "./FormNavigator.css";

function FormNavigator(props){
    let previous;
    let next;

    switch (props.currentStep) {
        case props.maxStep:
            previous = props.maxStep === 1 ? "" : <div className="button prev" onClick={(e) => {props.onClick(false)}}>PREVIOUS</div>;
            next = <div className="button" onClick={(e) => {props.onClick(true, e)}}>FINISH</div>
            break;
        case 1:
            previous = "";
            next = <div className="button" onClick={(e) => {props.onClick(true, e)}}>NEXT</div>
            break;
        case 997: 
            next = "";
            previous = <div className="button prev" onClick={(e) => {props.onClick(false)}}>PREVIOUS</div>;
            break;
        case 998:
        case 999:
            next = "";
            previous = "";
            break;

        default:
            next = <div className="button" onClick={(e) => {props.onClick(true, e)}}>NEXT</div>
            previous = <div className="button prev" onClick={(e) => {props.onClick(false)}}>PREVIOUS</div>;
            break;
        
    }

    return (
        <div className="FormNavigator">
            {previous}
            {next}
        </div>
    );
}

export default FormNavigator;