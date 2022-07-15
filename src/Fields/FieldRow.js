import style from "./FieldRow.module.css";

function FieldRow(props){
    return (
        <div className={style.row}>
            <div className={style.header + " " + style.empty}></div>
            <div className={style.header}>Company Name</div>
            <div className={style.header}>First Name</div>
            <div className={style.header}>Surname</div>
            <div className={style.header}>Mobile Number</div>
            <div className={style.empty}>{props.count}</div>
            <input></input>
            <input></input>
            <input></input>
            <input></input>
        </div>
    );
}

export default FieldRow;