import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {EditableSpan} from './EditableSpan';

export default {
    title: 'TODOLIST/EditableSpan',
    component: EditableSpan,
    argTypes: {
        onChange:{
            description: 'new value'
        },
        value:{
            defaultValue: 'some text here',
            description: 'Start value'
        }
    },
} as ComponentMeta<typeof EditableSpan>;

const Template: ComponentStory<typeof EditableSpan> = (args) => <EditableSpan {...args} />;

export const EditableSpanStory = Template.bind({});


