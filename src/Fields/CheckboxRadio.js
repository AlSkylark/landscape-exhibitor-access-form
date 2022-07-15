import "./CheckboxRadio.css";

function CheckboxRadio(props){
    let name = props.fieldLabel;

    function handleChange(e){
        props.onChange(e);
    }
    const checked = props.checked ? " checked" : "";

    return (   
    <label className="CheckboxRadio" htmlFor={name + "-" + props.id}>
        <div className={props.fieldType + checked}>
            <input className="labelInput" defaultChecked={props.checked} id={name + "-" + props.id} value={props.id} type={props.fieldType} name={props.listName} onChange={handleChange} />
            <span className="labelText">{props.fieldLabel}</span>
        </div>
    </label>
    );
}

export default CheckboxRadio;