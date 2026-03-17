import { useState } from 'react'

const Button = ({ handleClick, text }) => (
    <button onClick={handleClick}>{text}</button>
)

const StatisticLine = ({ text, value }) => (
    <tr>
        <td>{text}</td>
        <td>{value}</td>
    </tr>
)

const Statistics = ({ good, neutral, bad }) => {
    const total = good + neutral + bad
    if (total === 0) {
        return (
            <div>
                <p>No feedback given</p>
            </div>
        )
    }

    const average = (good - bad) / total
    const positive = (good / total) * 100

    return (
        <div>
            <h2>Statistics</h2>
            <table>
                <tbody>
                <StatisticLine text="good" value={good} />
                <StatisticLine text="neutral" value={neutral} />
                <StatisticLine text="bad" value={bad} />
                <StatisticLine text="total" value={total} />
                <StatisticLine text="average" value={average.toFixed(2)} />
                <StatisticLine text="positive" value={positive.toFixed(2) + ' %'} />
                </tbody>
            </table>
        </div>
    )
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGood = () => setGood((current) => current + 1)
    const handleNeutral = () => setNeutral((current) => current + 1)
    const handleBad = () => setBad((current) => current + 1)

    return (
        <div>
            <h1>Give feedback</h1>
            <Button handleClick={handleGood} text="good" />
            <Button handleClick={handleNeutral} text="neutral" />
            <Button handleClick={handleBad} text="bad" />
            <Statistics good={good} neutral={neutral} bad={bad} />
        </div>
    )
}

export default App
