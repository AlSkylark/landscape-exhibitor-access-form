import style from "./ImageUpload.module.css";
import { useState } from "react";
import Spinner from "./Spinner";
import Success from "./Success";

function ImageUpload(props){
    const hidden = !props.required ? "hidden" : "";
    const required = props.required ? " required" : "";

    const dataURL = props.data[props.id];
    const [result, setResult] = useState(generateResult(extractFilename(dataURL === undefined ? "" : dataURL)));
    const [imgURL, setURL] = useState(dataURL);
    const [uploadState, setState] = useState(dataURL === undefined || dataURL.length === 0 ? 0 : 2);

    let ErrorType;
    (function (ErrorType) {
        ErrorType[ErrorType["Size"] = 0] = "Size";
        ErrorType[ErrorType["Type"] = 1] = "Type";
    })(ErrorType || (ErrorType = {}));


    function generateResult(data){
        if (data.length === 0) return;
        return (
            <div className="result">
                {data}
                <span className={style.deleteButton} onClick={(e) => deleteImage(e)}>🗑️</span>
            </div>
        );
    }

    function handleClick(e){
        if(uploadState === 2) e.preventDefault();
    }

    function uploadFile(e){
        if(uploadState > 0) return;
        let fileData = new FormData();

        const file = e.target.files[0];
        const fileName = extractFilename(file.name);

        if (file.size > 20971520) {
            generateError(file.name, ErrorType.Size);
            return;
        }
        
        const allowedTypes = [
            "image/png",
            "image/jpeg"
        ];

        if (!allowedTypes.includes(file.type)) {
            generateError(file.name, ErrorType.Type);
            return;
        }

        fileData.append("file", file);

        const companyName = props.data.FasciaBoard ?? "";
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        today = dd + '-' + mm + '-' + yyyy;
        const folderName = companyName.length === 0 ? "" : companyName + "-";
        
        fileData.append("fileFolder", folderName + today);

        const xhr = new XMLHttpRequest();

        new Promise((resolve) => {
            xhr.addEventListener("loadstart", beginHandler, false);
            xhr.addEventListener("load", completeHandler, false);
            xhr.addEventListener("error", errorHandler, false);
            xhr.open("POST", "http://exhibitor.landscapeshow.co.uk/upload");
            xhr.send(fileData);

            function beginHandler() {
                setResult(fileName);
                setState(1);
            }

            function completeHandler(event) {
                let eresult = JSON.parse(event.target.responseText);
                resolve({ "success": xhr.readyState === 4 && xhr.status === 201, "fileUrl": eresult.fileUrl });
            }

            function errorHandler(event) {
                resolve({ "success": false, "message": "Something went wrong!" });
            }
        }).then((upload) =>{
            if (upload.success) {
                setState(2);
                setResult(generateResult(fileName + " uploaded successfully!"));
                setURL(upload.fileUrl);
                props.onChange({name: props.id, value: upload.fileUrl});
            }
            else {
                //error message
                setState(0);
                setResult(upload.message);
            }
        });
    }
        
    function generateError(fileName, type) {
        setResult(`The file '${fileName}' ${type === ErrorType.Size ? "is too big!" : "is not a supported image file!"}`);
    }

    function extractFilename(path) {
        if (path.substring(0, 12) === "C:\\fakepath\\")
            return path.substring(12); // modern browser
        var x;
        x = path.lastIndexOf('/');
        if (x >= 0) // Unix-based path
            return path.substring(x + 1);
        x = path.lastIndexOf('\\');
        if (x >= 0) // Windows-based path
            return path.substring(x + 1);
        return path; // just the filename
    }

    function deleteImage(e){
        const field = e.target.parentNode.parentNode.querySelector("textarea");
        const init = { 
            method:"DELETE", 
            body: `{"url": "${field.value}"}` 
        };

        fetch("http://exhibitor.landscapeshow.co.uk/upload", init)
            .then((response) => {
                if(response.status === 200){
                    setResult(<span style={{color: "red", textAlign: "center"}}>File Deleted! Please upload another one.</span>);
                    setState(0);
                    props.onChange({name: props.id, value: ""});
                }
            });
        
    }

    let state;
    switch(uploadState) {
        case 0: //before upload
            state = <div className={style.fileButton}>{props.button}</div>;
            break;
        case 1: //uploading
            state = <div className={style.loadingBar}><Spinner /></div>;
            break;
        case 2: //uploaded
            state = <div className={style.loadingBar}><Success /></div>;
            break;
        default:
            state = <div className={style.fileButton}>{props.button}</div>;
            break;
    }

    return (
        <div className={style.ImageUpload + required}>
            <div className={style.title}>{<span>{props.fieldLabel} <span className={hidden}> * </span> </span> }</div>
            <div className={style.description}>{props.description}</div>
            <label className={style.uploadLabel} htmlFor={props.id} onClick={handleClick}>
                {state}
                <input type="file" id={props.id} onChange={(e) => uploadFile(e)} className={style.fileInput} accept=".png,.jpg,.jpeg"/>
                <textarea type="text" name={props.id} defaultValue={imgURL} className={style.imgURL}/>
            </label>
            {result}
        </div>

    );

}

export default ImageUpload;
