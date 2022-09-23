import {appReducer, RequestStatusType, setAppErrorAC, setAppStatusAC} from './app-reducer';

type stateType = {
    status: RequestStatusType
    isInitialized: boolean
    error: null | string
}

let startState: stateType

beforeEach(() => {
    startState = {
        status: 'idle' as RequestStatusType,
        isInitialized: false as boolean,
        error: null as null | string
    }
})

test('correct error message should be set', () => {
    const endState = appReducer(startState, setAppErrorAC({error: 'some error'}))
    expect(endState.error).toBe('some error')
});

test('correct status should be set', () => {
    const endState = appReducer(startState, setAppStatusAC({status: 'succeeded'}))
    expect(endState.status).toBe('succeeded')
});
