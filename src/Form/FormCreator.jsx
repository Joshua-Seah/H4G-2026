import { useState, useEffect } from "react";

export default function FormCreator({onChange}) {
    const [formContent, setFormContent] = useState([]);
    const [onEdit, setOnEdit] = useState(false); //Control whether form is edit mode or preview mode
    const [textField, setTextField] = useState("");
    const [optionDrafts, setOptionDrafts] = useState({}); //UI-only state for storing temp option input while edit qns. NOT part of schema and NOt exported

    useEffect(() => {
        if (onChange) onChange(formContent);
    }, [formContent]);

    const addQuestion = () => {
        const field = {
            "key": `${formContent.length + 1}`,
            "question": "Untitled question",
            "question_type": "short_answer", //"paragraph", "multichoice", "radio"
            "options": [] //Selected answer or response
        } //Json format for supabase
        setFormContent([...formContent, field]); //Add to formContent
    }
    const editField = (fieldKey, fieldLabel) => {
        const formFields = [...formContent];
        const fieldIndex = formFields.findIndex(f => f.key === fieldKey);
        if (fieldIndex > -1) {
            formFields[fieldIndex].question = fieldLabel;
            setFormContent(formFields);
        }
    }

    const editQuestionType = (fieldKey, fieldLabel) => {
        const formFields = [...formContent];
        const fieldIndex = formFields.findIndex(f => f.key === fieldKey);
        if (fieldIndex > -1) {
            formFields[fieldIndex].question_type = fieldLabel;
            setFormContent(formFields);
        }
    }

    const addAnswerOption = (fieldKey) => {
        const draft = optionDrafts[fieldKey];
        if (!draft || !draft.trim()) return;

        setFormContent((prev) =>
            prev.map((field) =>
            field.key === fieldKey
                ? { ...field, options: [...field.options, draft] }
                : field
            )
        );

        setOptionDrafts((prev) => ({
            ...prev,
            [fieldKey]: ""
        }));
    };

    const updateDraft = (fieldKey, value) => {
        setOptionDrafts((prev) => ({
            ...prev,
            [fieldKey]: value
        }));
    };

    return (<div>
        <h1> Form Creator</h1>
        {
            formContent.map((field) => {
                return (
                    <div key={field.key}>
                        <div>
                        <label>Question {field.key}</label>
                        <select onChange={(e) => editQuestionType(field.key, e.target.value)}>
                            <option value="short_answer">Short Answer</option>
                            <option value="singlechoice">Single Choice</option>
                            <option value="multichoice">Multichoice</option>
                        </select>
                        </div>
                        <div>
                        {
                            field.question_type == "short_answer" && 
                            <input type="text" placeholder="Untitled Question" onChange={(e) => editField(field.key, e.target.value)}/>
                        }
                        {
                            field.question_type == "multichoice" &&
                            <div>
                            <input type="text" placeholder="Untitled Question" onChange={(e) => editField(field.key, e.target.value)}/>
                            {field.options.map((item, index) => (
                                <label key={index} style={{ display: "block" }}>
                                    <input type="checkbox" />
                                    {item}
                                </label>
                            ))}
                            <div>
                            <input type="text" onChange={(e) => updateDraft(field.key, e.target.value)} value={optionDrafts[field.key] || ""} placeholder="Add an option" />
                            <button onClick={() => addAnswerOption(field.key, textField) }>Add</button>
                            </div>
                            </div>
                        }
                        {
                            field.question_type == "singlechoice" &&
                            <div>
                                <input type="text" placeholder="Untitled Question" onChange={(e) => editField(field.key, e.target.value)}/>
                                <p>
                                    {field.options.map((item, index) => (
                                        <label key={index}>
                                            <input type="radio" name={field.key} value={item}/>
                                            {item}
                                        </label>
                                    ))}
                                </p>
                                <div>
                                    <input type="text" onChange={(e) => updateDraft(field.key, e.target.value)} value={optionDrafts[field.key] || ""} placeholder="Add an option"/>
                                    <button onClick={() => addAnswerOption(field.key, textField) }>Add</button>
                                </div>
                            </div>
                        }
                        </div>
                    </div>
                    
                )
            })
        }
        <button onClick={addQuestion}>Add Question</button>
    </div>)
}