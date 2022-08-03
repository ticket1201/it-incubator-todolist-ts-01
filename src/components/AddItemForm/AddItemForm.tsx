import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import {Button, TextField} from '@mui/material';

type AddItemFormPropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const addItem = () => {
        if (title.trim() !== '') {
            props.addItem(title);
            setTitle('');
        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error) setError(null);
        if (e.key === 'Enter') {
            addItem();
        }
    }

    return <div>
        <TextField value={title}
                   variant={'outlined'}
                   size={'small'}
                   label={!!error ? 'Title is required' : 'Text'}
                   error={!!error}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   style={{marginRight: '10px'}}
        />
        <Button
            onClick={addItem}
            variant={'contained'}
            style={{maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px',}}
        >
            +
        </Button>

    </div>
})
