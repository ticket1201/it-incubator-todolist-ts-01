import {addTaskAC, tasksReducer, TasksStateType, updateTaskAC} from './tasksReducer';
import {addTodolistAC, removeTodolistAC} from './todolistReducer';
import {TaskPriorities, TaskStatuses} from '../../api/todolist-api';

let startState: TasksStateType

beforeEach(() => {
    startState = {
        'todolistId1': [
            {
                id: '1', title: 'CSS',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                isTaskChanging: false
            },
            {
                id: '2', title: 'JS',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                isTaskChanging: false
            },
            {
                id: '3', title: 'React',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId1',
                isTaskChanging: false
            }
        ],
        'todolistId2': [
            {
                id: '1', title: 'bread',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                isTaskChanging: false
            },
            {
                id: '2', title: 'milk',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                isTaskChanging: false
            },
            {
                id: '3', title: 'tea',
                status: TaskStatuses.New,
                deadline: '',
                description: '',
                priority: TaskPriorities.Low,
                startDate: '',
                addedDate: '',
                order: 0,
                todoListId: 'todolistId2',
                isTaskChanging: false
            }
        ]
    };
})

test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC('todolistId2');
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    expect(keys.length).toBe(1);
    expect(endState['todolistId2']).not.toBeDefined();
});

test('correct task should be added to correct array', () => {
    const action = addTaskAC('todolistId2', {
        id: '4', title: 'juice',
        status: TaskStatuses.New,
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        startDate: '',
        addedDate: '',
        order: 0,
        todoListId: 'todolistId2'
    });
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].id).toBeDefined();
    expect(endState['todolistId2'][3].title).toBe('juice');
    expect(endState['todolistId2'][3].status).toBe(TaskStatuses.New);
})

test('correct task should be renamed', () => {
    let title = 'REST-API'
    const action = updateTaskAC(`1`, 'todolistId1', {title})
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId1'][0].title).toBe('REST-API');
});

test('status of specified task should be changed', () => {
    const action = updateTaskAC('2', 'todolistId2', {status: TaskStatuses.Completed});
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.Completed);
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.New);
});

test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC({
        id: 'todolist3',
        title: 'new todolist',
        addedDate: '123',
        order: 0
    });
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});