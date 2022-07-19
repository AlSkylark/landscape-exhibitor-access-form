import { useState } from "react";
import style from "./FieldRow.module.css";

function FieldRow(props){
    const id = props.id;
    const [data,setData] = useState({name: "list",
                                    type: id,
                                    value: props.data});
    
    function handleChange(e){
        const oldData = data;
        const newdata = {...oldData, value: {...oldData.value, [e.target.name]: e.target.value}};
        setData(newdata);
        props.onChange(newdata);
    }

    const invisible = !props.invisible ? "" : " "  + style.invisible;
    
    return (
        <div className={style.row}>
            <div className={style.header + " " + style.empty}></div>
            <div className={style.header}>Company on Badge</div>
            <div className={style.header}>First Name</div>
            <div className={style.header}>Surname</div>
            <div className={style.header}>Mobile Number</div>
            <div className={style.empty + " " + style.count}>{props.count + 1}</div>
            
            <input onChange={handleChange} value={data.value.company} name="company" placeholder="Company on Badge"></input>
            <input onChange={handleChange} value={data.value.fname} name="fname" placeholder="First Name"></input>
            <input onChange={handleChange} value={data.value.lname} name="lname" placeholder="Surname"></input>
            <input onChange={handleChange} value={data.value.mobile} name="mobile" placeholder="Mobile Number"></input>

            <div className={style.delete + invisible} >
                <span className="material-icons-round" onClick={() => props.onDelete(id)}>clear</span>
            </div>
        </div>
    );
}

export default FieldRow;