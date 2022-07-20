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
                list: [
                        {
                            id: 0,
                            company: "",
                            fname: "",
                            lname: "",
                            mobile: ""
                        }
                    ]
            }
        }

        this.MAX_STEP = 1;
        this.MIN_STEP = 1;

        this.handleChange = this.handleChange.bind(this);
        this.stepClick = this.stepClick.bind(this); 
        this.navigationClick = this.navigationClick.bind(this); 
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
    }

    componentDidMount(){
        const sessionData = window.sessionStorage.getItem("formData");
        if (sessionData !== null && sessionData !== undefined) this.setState({formData: JSON.parse(sessionData)});
    }

    handleChange(t, element = null){
        const target = t.target ?? t;
        if(target.tagName === undefined){
            this.removeErrors(element);
        } else {
            this.removeErrors();
        }
        const type = target.type;
        const name = target.name;
        let value = target.value;
 
        //when dealing with the list items we check if the count is more than the id (stored in type), if it is then we just add onto the formData.list state,
        //if it isn't then we need to modify the existing data using a map
        if(name === "list"){
            const id = type;
            const exists = this.state.formData.list.find(item => item.id === id);
            
            if (exists === undefined) {
                this.setState(p =>({formData: {...p.formData, list: [...p.formData.list, value]}}),() => this.saveSession(this.state.formData));
            } else {
                this.setState(p => ({formData: {...p.formData, list: 
                    p.formData.list.map(d => {
                        if(d.id === id ) return value;
                        return d;
                    })
                }}),() => this.saveSession(this.state.formData));
            }
        //if it's not a list item, it just saves the item the same way it would on the normal exhibitor form.
        } else {
            this.setState((prevState) => ({
                formData: {...prevState.formData, [name]: value}
            }),() =>this.saveSession(this.state.formData));
        }

    }

    handleFinish(){
        const data = this.state.formData.list;
        if(data.length !== 0){
            if (!data[0].company.length > 0 ||
                !data[0].fname.length > 0 ||
                !data[0].lname.length > 0)
            return;
        }
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

        const url = "http://exhibitor.landscapeshow.co.uk/submit.php?type=access";
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
    
    handleDelete(id){
        this.setState(p => ({formData: 
            {...p.formData, list: p.formData.list.filter(d => d.id !== id)}
        }), () => {
            this.saveSession(this.state.formData);
        });
    }
    
    handleAdd(){
        this.setState(p => {
            const lastList = p.formData.list[p.formData.list.length - 1];
            const lastId = lastList.id;
            const template = {
                id: lastId + 1,
                company: lastList.company,
                fname: "",
                lname: "",
                mobile: ""
            }
            const newData = {formData: {...p.formData, list:[...p.formData.list, template]}};
            return newData;
        });
    }

    saveSession(data){
        window.sessionStorage.setItem("formData", JSON.stringify(data));
    }

    stepClick(e){
        if (!this.state.stepsActivated) return;
        const target = parseInt(e.target.getAttribute("value"));
        if (!this.state.stepStatus[target]) return;
        this.setState({currentStep: target });
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
            let input = required.tagName === "INPUT" ? required : required.querySelector("input");
            if (input === null || input.type === "file") input = required.querySelector("textarea");
            const name = input.name;
            if(name === "company" || name === "fname" || name === "lname") {
                const id = input.getAttribute("cid");
                if (data.list.find(i => i.id === parseInt(id))[name]?.length > 0) continue;
            } else {
                if (data[name]?.length > 0) continue;
            }
            
            required.classList.add("error");
            found = true;
        }
        if (found) return false;
        return true;
    }

    removeErrors(target){
        if (target === undefined) {
            const errors = document.querySelectorAll(".error");
            if (errors === undefined) return;
            for (let error of errors) {
                error.classList.remove("error");            
            }
        } else {
            target.classList.remove("error");
        }

    }



    render() {
        let step;
        switch (this.state.currentStep) {
            case 1:
                step = <AccessForm onDelete={this.handleDelete} 
                                data={this.state.formData.list} 
                                onChange={this.handleChange}
                                onAdd={this.handleAdd}/>
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
