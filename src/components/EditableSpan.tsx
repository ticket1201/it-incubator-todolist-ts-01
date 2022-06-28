import React, {ChangeEvent, useState} from 'react';

type EditableSpanPropsType = {
    title: string
    callback: (newTitle: string) => void
}

const EditableSpan = (props: EditableSpanPropsType) => {
    const [edit, setEdit] = useState(false)
    const [newTitle, setNewTitle] = useState(props.title)

    const changeEditableSpanHandler = () => {
        setEdit(!edit)
        addTask()
    }

    const addTask = () => {
            props.callback(newTitle);
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.currentTarget.value)
    }

    return (
        edit
            ? <input onBlur={changeEditableSpanHandler} onChange={onChangeHandler} value={newTitle} autoFocus/>
            : <span onDoubleClick={changeEditableSpanHandler}>{props.title}</span>

    );
};

export default EditableSpan;