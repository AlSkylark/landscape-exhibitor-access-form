import style from "./Finish.module.css"
import Field from "../Fields/Field";
import { formatter } from "../FormContainer";

function Finish(props){
    let price = "";
    if (props.price > 0) {
        price = (
            <div className={style.PromoWrap}>
                <div className={style.Promo}>Promotional extras ordered = {formatter.format(props.price) + " + vat"}</div>
                <div className={style.PromoSub}>Invoice to be settled by return. Thank you 😊</div>
            </div>
        );
    }
    const submitErr = props.status === 400 ? "Something went wrong sending your submission! \n Please review your answers and try again." : "";

    return (
        <div className={style.wrapper}>
            <div className={style.inner}>
                <Field fieldName="Email" required="true" value={props.data} fieldLabel="EMAIL: " fieldType="Email" onChange={props.onChange}/>
                <Field fieldName="CompletedBy" required="true" value={props.data} fieldLabel="FORM COMPLETED BY: " fieldType="Text" onChange={props.onChange}/>
            </div>
            <div className={style.description}>
                <i>
                <p>By completing this form it is agreed that everybody named for access will comply to the Site Rules in place for the show.<br/>
                <a href="https://www.landscapeshow.co.uk/exhibitor-info-2022">View the Site Rules here.</a></p>
                <b>No badges will be sent to you before you arrive.</b>
                <p>The badges you order should be collected <b>from the Organisers Office</b> (at the front of the hall) when you arrive for Build Up.</p>
                </i>
            </div>
            {price}
            <div className={style.error}>{submitErr}</div>
            <button className={style.submit} onClick={props.submit}>SUBMIT</button>
        </div>
    );
}

export default Finish;