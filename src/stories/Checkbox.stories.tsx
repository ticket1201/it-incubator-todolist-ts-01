import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {EditableSpan} from '../components/EditableSpan/EditableSpan';
import {Checkbox} from '../components/CheckBox/Checkbox';
import {action} from '@storybook/addon-actions';

export default {
    title: 'TODOLIST/Checkbox',
    component: Checkbox
} as ComponentMeta<typeof EditableSpan>;

const onChangeHandler = action('Checkbox clicked')

const Template: ComponentStory<typeof Checkbox> = (args) => <Checkbox {...args} />;

export const CheckboxCheckedStory = Template.bind({});
CheckboxCheckedStory.args = {
    callback: onChangeHandler,
    isChecked: true
}

export const CheckboxIsNotCheckedStory = Template.bind({});
CheckboxIsNotCheckedStory.args = {
    callback: onChangeHandler,
    isChecked: false
}

