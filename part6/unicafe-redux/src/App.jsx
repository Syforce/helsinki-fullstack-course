import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const App = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)

    return (
        <div>
            <h2>give feedback</h2>
            <button onClick={() => dispatch({ type: 'GOOD' })}>good</button>
            <button onClick={() => dispatch({ type: 'OK' })}>ok</button>
            <button onClick={() => dispatch({ type: 'BAD' })}>bad</button>
            <button onClick={() => dispatch({ type: 'RESET' })}>reset</button>
            <h2>statistics</h2>
            <div>good {state.good}</div>
            <div>ok {state.ok}</div>
            <div>bad {state.bad}</div>
        </div>
    )
}

export default App
