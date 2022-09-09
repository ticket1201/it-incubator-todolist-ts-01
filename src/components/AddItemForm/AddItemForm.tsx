import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

type AddItemFormPropsType = {
    addItem: (title: string) => void
    label: string
    disabled?: boolean
}

export const AddItemForm = memo((props: AddItemFormPropsType) => {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>(null)

    const isBtnDisabled = title.length > 100;

    const addItem = () => {
        if (title.trim() !== '') {
            props.addItem(title);
            setTitle('');
        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.currentTarget.value.length > 100) {
            setError('Maximum length exceeded')
        } else {
            if (error) {
                setError('')
            }
        }
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null);
        if (e.key === 'Enter') {
            addItem();
        }
    }

    return <div className={'addItemInput'}>
        <TextField value={title}
                   variant={'outlined'}
                   size={'small'}
                   label={!!error ? error : props.label}
                   error={!!error}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   style={{marginRight: '10px'}}
        />
        <Button
            disabled={isBtnDisabled || props.disabled}
            onClick={addItem}
            variant={'contained'}
            style={{maxWidth: '40px', maxHeight: '40px', minWidth: '40px', minHeight: '40px',}}
        >
            +
        </Button>

    </div>
})
