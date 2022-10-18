import {
    createTask,
    deleteTask,
    fetchTasks,
    tasksReducer,
    TasksStateType,
    updateTask
} from './tasksReducer';
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

test('task should be added to todolist', () => {
    const action = fetchTasks.fulfilled({tasks: startState['todolistId2'], todolistId: 'todolistId1'}, '', 'todolistId1');
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId1'][1].title).toBe('milk');
});


test('correct task should be deleted', () => {
    const action = deleteTask.fulfilled({todolistId: 'todolistId2', id: '2'}, '', {todolistId: 'todolistId2', taskId: '2'});
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'].length).toBe(2);
    expect(endState['todolistId2'][1].id).toBe('3');
});

test('correct task should be added to correct array', () => {
   let task = {
       id: '4', title: 'juice',
       status: TaskStatuses.New,
       deadline: '',
       description: '',
       priority: TaskPriorities.Low,
       startDate: '',
       addedDate: '',
       order: 0,
       todoListId: 'todolistId2'
   }

    const action = createTask.fulfilled({todoListId:'todolistId2', task}, '', {todolistsId:'todolistId2', title: 'juice'});
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId2'].length).toBe(4);
    expect(endState['todolistId2'][0].title).toBe('juice');
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New);
})

test('correct task should be renamed', () => {
    const task = {
        id: '3', title: 'REST-API', description: '',
        todoListId: 'todolistId1',
        status: TaskStatuses.Completed,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: '',
        entityStatus: 'idle'
    }
    const action = updateTask.fulfilled({todolistId: 'todolistId1', taskId: '3', model: task},'requestId',  {todolistId: 'todolistId1', taskId: '3', model: task});

    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId1'][2].title).toBe('REST-API');
});

test('status of specified task should be changed', () => {
    const task = {
        id: '2', title: 'REST-API', description: '',
        todoListId: 'todolistId2',
        status: TaskStatuses.New,
        order: 0,
        priority: TaskPriorities.Low,
        startDate: '',
        deadline: '',
        addedDate: '',
        entityStatus: 'idle'
    }
    const action = updateTask.fulfilled(
        {taskId: `2`, todolistId: 'todolistId2', model: {...task, status: TaskStatuses.Completed}}, '', {taskId: `2`, todolistId: 'todolistId2', model: {status: TaskStatuses.Completed}});
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.Completed);
    expect(endState['todolistId1'][1].status).toBe(TaskStatuses.New);
});

/*
test('new array should be added when new todolist is added', () => {
    const action = addTodolists.fulfilled({todolist:{
            id: 'todolist3',
            title: 'new todolist',
            addedDate: '123',
            order: 0
        }
    });
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== 'todolistId1' && k !== 'todolistId2');
    if (!newKey) {
        throw Error('new key should be added')
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});*/
