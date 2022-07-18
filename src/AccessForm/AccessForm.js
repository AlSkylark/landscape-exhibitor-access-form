
import { useState } from "react";
import FieldRow from "../Fields/FieldRow";
import style from "./AccessForm.module.css";

function AccessForm(props){
    const [fieldCount, addField] = useState(props.data.length ?? 1);
    
    function handleAdd(){
        addField(fieldCount + 1);
    }
    
    let fields = [];
    for (let i = 0; i < fieldCount; i++){
        fields.push(<FieldRow key={i} id={i} data={props.data[i]} onChange={props.onChange} invisible={fieldCount === 1} count={i + 1}/>);
    }

    return (
        <div className={style.wrapper}>
            <div className={style.description}>
                {<span>Please complete this form<b> for every individual </b>who will be on site during show days and build-up days.</span>}
            </div>
            <div className={style.main}>
                <div className={style.header}>
                    <div></div>
                    <div>Company on Badge</div>
                    <div>First Name</div>
                    <div>Surname</div>
                    <div>Mobile Number</div>
                    <div></div>
                </div>
                {fields}
            </div>
            <div><button onClick={handleAdd}>Add More</button></div>
        </div>

    );
}

export default AccessForm;