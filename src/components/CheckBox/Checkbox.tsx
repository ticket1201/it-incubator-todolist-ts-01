import React, {ChangeEvent} from 'react';

type CheckboxPropsType = {
    isChecked: boolean
    callback: (isChecked:boolean)=>void
}

export const Checkbox = (props:CheckboxPropsType) => {
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked;
        props.callback(newIsDoneValue);
    }

    return (
        <input type="checkbox" onChange={onChangeHandler} checked={props.isChecked}/>
    );
};

