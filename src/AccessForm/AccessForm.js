
import { useEffect, useState } from "react";
import FieldRow from "../Fields/FieldRow";
import style from "./AccessForm.module.css";

function AccessForm(props){
    const {onChange, onDelete, data, onAdd} = props;
    const count = data.length;
    const [fields, setFields] = useState([]);
    
    useEffect(() =>{
        let fieldsArr = []
        for (let i = 0; i < count; i++){
            fieldsArr.push(<FieldRow key={data[i].id} id={data[i].id} 
                        data={data[i]} 
                        onChange={onChange} 
                        invisible={count === 1} 
                        count={i}
                        onDelete={onDelete} />);
        }
        setFields(fieldsArr);
    },[count, onChange, onDelete, data])
    

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
            <div>
                <button className={style.add} onClick={onAdd}>Add More</button>
            </div>
        </div>

    );
}

export default AccessForm;