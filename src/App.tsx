import React from 'react';
import './App.css';
import TodoList, {TaskType} from "./TodoList";



function App() {

    // BLL: business logic layer

    const tasks_1: Array<TaskType> = [
        { id: 1, title: 'HTML&CSS', isDone: true },
        { id: 2, title: 'JS/TS', isDone: true },
        { id: 3, title: 'React', isDone: false }
    ]

    const tasks_2: Array<TaskType> = [
        { id: 4, title: 'Meat', isDone: false },
        { id: 5, title: 'Fish', isDone: false },
        { id: 6, title: 'Bear', isDone: false }
    ]

    //ui

    return (
        <div className="App">
            <TodoList title={'What to learn'} tasks={tasks_1}/>
            <TodoList title={'What to buy'} tasks={tasks_2}/>
        </div>
    );
}

export default App;
