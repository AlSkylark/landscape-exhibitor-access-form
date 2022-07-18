import React from "react";
import style from "./FormContainer.module.css"
import FormNavigator from "./FormNavigator/FormNavigator";
import Header from "./Header/Header";
import Finish from "./Finish/Finish";
import Spinner from "./Fields/Spinner";
import SuccessPage from "./SuccessPage/SuccessPage";
import AccessForm from "./AccessForm/AccessForm";

/**
 * Enum for special steps and clarity.
 */
const StepEnum = Object.freeze({
    Finish: 997,
    Spinner: 998,
    Success: 999
});

class FormContainer extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            stepsActivated: true,
            validationActive: true, //SET TO TRUE AFTER DEBUG
            submissionStatus: 0,
            currentStep: 1,
            stepStatus: {1:true},
            formData: {
                list: [0]
            },
            extras: 0
        }

        this.MAX_STEP = 1;
        this.MIN_STEP = 1;

        this.handleChange = this.handleChange.bind(this);
        this.stepClick = this.stepClick.bind(this); 
        this.navigationClick = this.navigationClick.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
    }

    componentDidMount(){
        const sessionData = window.sessionStorage.getItem("formData");
        if (sessionData !== null) this.setState({formData: JSON.parse(sessionData)});
    }

    handleChange(t){
        //this.removeErrors();
        const target = t.target ?? t;
        const type = target.type;
        const name = target.name;
        let value = target.value;
 
        if(name === "list"){
            const count = this.state.formData.list.length - 1;
            if (count < type) {
                this.setState(p =>({formData: {...p.formData, list: [...p.formData.list, value]}}));
            } else {
                this.setState(p => ({formData: {...p.formData, list: 
                    p.formData.list.map((d,i) => {
                        if(i === type) return value;
                        return d;
                    })
                }}));
            }

        } else {
            this.setState((prevState) => ({
                formData: {...prevState.formData, [name]: value}
            }),() =>{
                //window.sessionStorage.setItem("formData", JSON.stringify(this.state.formData));
            });
        }
        
        console.log(this.state.formData);

    }

    handleFinish(){
        this.setState({currentStep: StepEnum.Finish});
    }

    handleSubmit(){
        if(!this.validateData()) return;
        this.setState({currentStep: StepEnum.Spinner});
        this.setState({stepsActivated: false});
        let formData = new FormData();
        const data = this.state.formData;
        for (let item in data){
            let value = data[item];
            value = typeof value === "object" ? JSON.stringify(value) : value;
            formData.append(item, value);
        }

        const url = "http://exhibitor.landscapeshow.co.uk/submit.php";
        fetch(url, {method: "POST", body: formData})
            .then((r) => {
                if(r.status === 201) return r.json();
                const obj = JSON.stringify({status: r.status, message: r.statusText});
                throw Error(obj);
            }).then(v => {
                this.setState({submissionStatus: 201});
                this.setState({currentStep: StepEnum.Success});
            })
            .catch(e =>{ 
                const m = JSON.parse(e.message);
                this.setState({submissionStatus: m.status});
                this.setState({currentStep: StepEnum.Finish});
                this.setState({stepsActivated: true});
                return  m.status + " " + m.message;
            })

    }

    handlePriceChange(price){
        this.setState({extras: price});
    }

    stepClick(e){
        if (!this.state.stepsActivated) return;
        const target = parseInt(e.target.getAttribute("value"));
        if (!this.state.stepStatus[target]) return;
        this.setState({currentStep: target });
        console.log(this.state.formData);
    }

    navigationClick(next, e = null){
        if(next && !this.validateData()) return;
        if(e != null && e.target.textContent === "FINISH") return this.handleFinish();

        this.setState((prev) => {
            let step = next ? prev.currentStep + 1 : prev.currentStep -1;
            step = step < this.MIN_STEP ? this.MIN_STEP : step;
            step = step >= this.MAX_STEP ? this.MAX_STEP : step;
            return {currentStep: step}
        }, () => {
            this.setState((prev) => {
                return {stepStatus: {...prev.stepStatus, [this.state.currentStep]:true}}
            })
        });
    }

    validateData(){
        if (!this.state.validationActive) return true;
        const data = this.state.formData;
        const listOfRequired = document.querySelectorAll(".required");
        let found = false;
        for (const required of listOfRequired) {
            required.classList.remove("error");
            let input = required.querySelector("input");
            if (input === null || input.type === "file") input = required.querySelector("textarea");
            const name = input.name;
            if (data[name]?.length > 0) continue;
            required.classList.add("error");
            found = true;
        }
        if (found) return false;
        return true;
    }

    removeErrors(){
        const errors = document.querySelectorAll(".error");
        if (errors === undefined) return;
        for (let error of errors) {
            error.classList.remove("error");            
        }
    }


    render() {
        let step;
        switch (this.state.currentStep) {
            case 1:
                step = <AccessForm data={this.state.formData.list} onChange={this.handleChange}/>
                break;
            case StepEnum.Finish: 
                step = <Finish 
                            price={this.state.extras} 
                            status={this.state.submissionStatus} 
                            data={this.state.formData} 
                            onChange={this.handleChange} 
                            submit={this.handleSubmit}
                        />
                break;
            case StepEnum.Spinner:
                step = <div className={style.spinner}><Spinner /></div>
                break;
            case StepEnum.Success:
                step = <SuccessPage />
                break;
            default:
                break;
        }
        return (
            <div className={style.container}>
                <Header />
                <div className={style.FormContainer}>
                    <div className={style.Sections}>
                            {step}
                    </div>
                    <FormNavigator maxStep={this.MAX_STEP} currentStep={this.state.currentStep} onClick={this.navigationClick}/>
                </div>
            </div>
        );
    }
}
export default FormContainer;


/**
 * Given an ID, which should be the same as the "name" in all checkboxes inputs, it loops through all children inputs and returns a string (concatenated with $>) of checked items.
 * @param {String} id 
 * @returns {String} A concatenated string.
 */
export function handleCheckboxes(id){
    const list = document.getElementById(id);

    let result = []
    for (const element of list.children){
        //element might be input straight away
        const input = element.querySelector("input") ?? element;
        
        //skip children without inputs
        if (input === null || input === undefined) continue;
        
        if(input.type !== "text"){
            if (input.checked) result.push(input.value);
        } else {
            const value = element.value;
            if (value.length > 0) result.push(value);
        }
    }
    return result.join("$>");
}

export const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
});
