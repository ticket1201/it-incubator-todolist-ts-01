import {v1} from 'uuid';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, TasksReducer} from './TasksReducer';
import {TasksStateType} from '../App';

test('correct task should be removed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let taskId = v1()

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId, title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'React Book', isDone: true}
        ]
    }

    const endState = TasksReducer(startState, removeTaskAC(taskId, todolistId1))

    expect(endState[todolistId1].length).toBe(1);
    expect(endState[todolistId1][0].title).toBe('JS');
});

test('correct task should be add', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let newTitle = 'REST-API'

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: v1(), title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'React Book', isDone: true}
        ]
    }

    const endState = TasksReducer(startState, addTaskAC(newTitle, todolistId1))

    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId1][0].title).toBe('REST-API');
});

test('correct task should be renamed', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let taskId = v1()
    let newTitle = 'REST-API'

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId, title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'React Book', isDone: true}
        ]
    }

    const endState = TasksReducer(startState, changeTaskTitleAC(taskId, newTitle, todolistId1))

    expect(endState[todolistId1].length).toBe(2);
    expect(endState[todolistId1][0].title).toBe('REST-API');
});



test('correct task should change status', () => {
    let todolistId1 = v1();
    let todolistId2 = v1();
    let taskId = v1()

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId, title: 'HTML&CSS', isDone: true},
            {id: v1(), title: 'JS', isDone: true}
        ],
        [todolistId2]: [
            {id: v1(), title: 'Milk', isDone: true},
            {id: v1(), title: 'React Book', isDone: true}
        ]
    }

    const endState = TasksReducer(startState, changeTaskStatusAC(taskId, false, todolistId1))

    expect(endState[todolistId1].length).toBe(2);
    expect(endState[todolistId1][0].isDone).toBe(false);
});