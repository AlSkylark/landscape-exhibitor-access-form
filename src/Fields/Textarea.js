import { useState } from "react";
import style from "./Textarea.module.css";

function Textarea(props){
    const hidden = !props.required ? style.hidden : "";
    const required = props.required ? " required" : "";
    const name = props.fieldName;
    const [data, setData] = useState(props.value[name] ?? "");
    const [wordCount, setCount] = useState(data.split(" ").filter(v => v.length > 0).length);

    function handleChange(e) {
        const dt = e.target.value;
        const newCount = dt.split(" ").filter(v => v.length > 0).length
        setCount(newCount);
        
        // let newData;
         if (newCount > props.limit) {
            let count = 0;
            let newData = dt.split(" ")
                            .reduce((p, c) => {
                                count += c.length > 0 ? 1 : 0;
                                if (count <= props.limit) p.push(c);
                                return p;
                            }, []).join(" ");   
            setData(newData);
            e.target.value = newData;
            setCount(newData.split(" ").filter(v => v.length > 0).length)
        } else {
            setData(e.target.value);
        }

        props.onChange(e);
    }
    

    return (
        <div className={style.field + required}>
        <label className={style.label} htmlFor={name}>
            <span className={style.labelText}>
                {props.fieldLabel}<span className={hidden}> * </span>
            </span>
            <textarea 
                className={style.labelInput} 
                value={props.value[name]} 
                type={props.fieldType} 
                name={name} 
                onChange={(e) => handleChange(e)} 
                placeholder={props.placeholder}
                onDragEnter={e => e.preventDefault()}
            />
            <div className={style.limit} >{wordCount}/{props.limit} Words</div>
        </label>
        </div>
    );
}

export default Textarea;