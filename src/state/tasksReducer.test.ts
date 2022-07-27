import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, tasksReducer, TasksStateType} from './tasksReducer';
import {addTodolistAC, removeTodolistAC} from './todolistReducer';

let startState: TasksStateType

beforeEach(() => {
     startState = {
        "todolistId1": [
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todolistId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "2", title: "milk", isDone: true },
            { id: "3", title: "tea", isDone: false }
        ]
    };
})

test('property with todolistId should be deleted', () => {
    const action = removeTodolistAC("todolistId2");
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    expect(keys.length).toBe(1);
    expect(endState["todolistId2"]).not.toBeDefined();
});

test('correct task should be added to correct array', () => {
    const action = addTaskAC("juice", "todolistId2");
    const endState = tasksReducer(startState, action)
    expect(endState["todolistId1"].length).toBe(3);
    expect(endState["todolistId2"].length).toBe(4);
    expect(endState["todolistId2"][0].id).toBeDefined();
    expect(endState["todolistId2"][0].title).toBe("juice");
    expect(endState["todolistId2"][0].isDone).toBe(false);
})

test('correct task should be renamed', () => {

    let newTitle = 'REST-API'
    const action = changeTaskTitleAC(`1`, newTitle, 'todolistId1')
    const endState = tasksReducer(startState, action)
    expect(endState['todolistId1'].length).toBe(3);
    expect(endState['todolistId1'][0].title).toBe('REST-API');
});

test('status of specified task should be changed', () => {
    const action = changeTaskStatusAC("2", false, "todolistId2");
    const endState = tasksReducer(startState, action)
    expect(endState["todolistId2"][1].isDone).toBe(false);
    expect(endState["todolistId1"][1].isDone).toBe(true);
});

test('new array should be added when new todolist is added', () => {
    const action = addTodolistAC("new todolist");
    const endState = tasksReducer(startState, action)
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k !== "todolistId1" && k !== "todolistId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});
