import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {AddItemForm} from './AddItemForm';
import {Button, TextField} from '@mui/material';

export default {
    title: 'TODOLIST/AddItemForm',
    component: AddItemForm,
    argTypes: {
        addItem: {
            description: 'Button clicked inside form'
        },
    },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

export const DefaultAddItemForm = Template.bind({});
DefaultAddItemForm.args = {
    addItem: action('Button clicked inside form')
};


const Template1: ComponentStory<typeof AddItemForm> = (args) => {
    let [title, setTitle] = useState('')
    let [error, setError] = useState<string | null>('Title is required')

    const addItem = () => {
        if (title.trim() !== '') {
            args.addItem(title);
            setTitle('');
        } else {
            setError('Title is required');
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error) setError(null);
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
}

export const AddItemFormWithError = Template1.bind({});