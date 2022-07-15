import style from "./Field.module.css";

function Field(props){
    const hidden = !props.required ? style.hidden : "";
    const required = props.required ? " required" : "";
    const name = props.fieldName;
    const data = props.value;
    return (
        <div className={style.field + required}>
        <label className={style.label} htmlFor={name}>
            <span className={style.labelText}>
                {props.fieldLabel}<span className={hidden}> * </span>
            </span>
            <input className={style.labelInput} ref={props.forwardRef} id={props.id} defaultValue={data[name] ?? ""} type={props.fieldType} name={name} onChange={props.onChange}/>
        </label>
        </div>
    );
}

export default Field;