import { useEffect, useRef } from "react";
import style from "./Address.module.css"
import Field from "./Field";


function Address(props){
    //DOM refs
    const autocomplete = useRef(undefined);
    const targetInput = useRef(null);
    const town = useRef(null);
    const county = useRef(null);
    const postcode = useRef(null);
    const country = useRef(null);

    const { onChange } = props;

    useEffect(() => {
        //google autocomplete + callback func
        const options = {
            fields: ["address_components"],
            componentRestrictions: {country: "gb"},
            types: ["address"]
        };
        autocomplete.current = new window.google.maps.places.Autocomplete(targetInput.current, options);
        autocomplete.current.addListener("place_changed", () => setAddress());

        function setAddress(){
            const place = autocomplete.current.getPlace();
            if (place === undefined) return;
            let address1 = "";
    
            for(const component of place.address_components){
                const cType = component.types[0];
                switch (cType) {
                    case "street_number":
                        address1 = component.long_name;
                        break;
                    case "route":
                        address1 += " " + component.short_name;
                        address1 = address1.trim();
                        break;
                    case "postal_town":
                        sendChange(town, component.short_name);
                        break;
                    case "administrative_area_level_2":
                        sendChange(county, component.short_name);
                        break;
                    case "country":
                        sendChange(country, component.long_name);
                        break;
                    case "postal_code":
                        sendChange(postcode, component.short_name);
                        break;
                    default:
                        break;
                }
            }
    
            targetInput.current.value = address1;
            onChange(targetInput.current);
        }

        function sendChange(ref, component){
            ref.current.value = component;
            onChange(ref.current);
        }

    },[onChange]);

    return (
        <div className={style.wrapper}>

            <Field 
                fieldName="Address1" 
                required={props.required} 
                forwardRef={targetInput} 
                id="TargetAddressInput" 
                value={props.data} 
                fieldLabel="ADDRESS: " 
                fieldType="Text" 
                onChange={onChange}
            />

            <Field 
                fieldName="Address2" 
                id="Address2"
                value={props.data} 
                fieldLabel="" 
                fieldType="Text" 
                onChange={onChange}
            />

            <div className={style.joint}>

                <Field 
                    fieldName="Town" 
                    id="Town" 
                    required={props.required} 
                    forwardRef={town} 
                    value={props.data} 
                    fieldLabel="Town" 
                    fieldType="Text" 
                    onChange={onChange}
                />

                <Field 
                    fieldName="County" 
                    id="County" 
                    required={props.required} 
                    forwardRef={county} 
                    value={props.data} 
                    fieldLabel="County" 
                    fieldType="Text" 
                    onChange={onChange}
                />

            </div>
            <div className={style.joint2}>

                <Field 
                    fieldName="Postcode" 
                    id="Postcode" 
                    required={props.required} 
                    forwardRef={postcode} 
                    value={props.data} 
                    fieldLabel="Postcode" 
                    fieldType="Text" 
                    onChange={onChange}
                />

                <Field 
                    fieldName="Country" 
                    id="Country" 
                    required={props.required} 
                    forwardRef={country} 
                    value={props.data} 
                    fieldLabel="Country" 
                    fieldType="Text" 
                    onChange={onChange}
                />

            </div>
        </div>
    );
}

export default Address;