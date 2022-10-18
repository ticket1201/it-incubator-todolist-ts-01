import {v1} from 'uuid';
import {
    changeTodolistFilterAC,
    changeTodolistTitle,
    FilterValuesType,
    deleteTodolist, TodolistDomainType,
    todolistReducer, addTodolist,
} from './todolistReducer';

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>


beforeEach(() => {
    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: 'What to learn', filter: 'all', order: 0, addedDate: '', entityStatus: 'idle'},
        {id: todolistId2, title: 'What to buy', filter: 'all', order: -1, addedDate: '', entityStatus: 'idle'}
    ]
})


test('correct todolist should be removed', () => {
    const endState = todolistReducer(startState, deleteTodolist.fulfilled({id: todolistId1},'', todolistId1))
    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('correct todolist should be added', () => {
    let title = 'New Todolist';
    const endState = todolistReducer(startState, addTodolist.fulfilled({
        todolist: {
            id: 'todolist3',
            title,
            addedDate: '123',
            order: 0
        }
    }, '', title))
    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(title);
});

test('correct todolist should change its name', () => {
    let newTodolistTitle = 'New Todolist';
    const endState = todolistReducer(startState, changeTodolistTitle.fulfilled({id: todolistId2, title: newTodolistTitle}, '', {id: todolistId2, title: newTodolistTitle}));
    expect(endState[0].title).toBe('What to learn');
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('correct filter of todolist should be changed', () => {
    let newFilter: FilterValuesType = 'completed';
    const endState = todolistReducer(startState, changeTodolistFilterAC({value: newFilter, todolistId: todolistId2}));
    expect(endState[0].filter).toBe('all');
    expect(endState[1].filter).toBe(newFilter);
});
