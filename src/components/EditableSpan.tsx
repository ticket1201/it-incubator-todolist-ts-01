import React, {ChangeEvent, KeyboardEvent, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    callback: (title: string) => void
}

const EditableSpan = (props:EditableSpanPropsType) => {
    const [isActive, setIsActive] = useState(false)
    const [newTitle, setNewTitle] = useState(props.title)

    const changeIsActiveStatus = () => {
        setIsActive(!isActive)
    }

    const addTask = () => {
        if (newTitle !== "") {
            props.callback(newTitle);
        }
        changeIsActiveStatus()
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            addTask();
        }
    }

    return (
        isActive
            ? <input type="text" autoFocus onBlur={addTask} onChange={onChangeHandler} onKeyPress={onKeyPressHandler} value={newTitle}/>
            : <span onDoubleClick={changeIsActiveStatus}>{props.title}</span>
    );
};

export default EditableSpan;