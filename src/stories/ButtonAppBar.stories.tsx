import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import ButtonAppBar from '../components/ButtonAppBar/ButtonAppBar';
import ReduxStoreProviderDecorator from './decorators/ReduxStoreProviderDecorator';

export default {
    title: 'TODOLIST/ButtonAppBar',
    component: ButtonAppBar,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof ButtonAppBar>;


const Template: ComponentStory<typeof ButtonAppBar> = () => <ButtonAppBar/>;

export const ButtonAppBarStory = Template.bind({});


