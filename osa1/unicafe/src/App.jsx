import { useState } from 'react'


const Statistics = ({good, neutral, bad, all, average, positiveCount}) => {

  if (good==0 && neutral == 0 && bad == 0){
    return(<div>
      <h2>Statistics:</h2>
      <p>No Feedback given yet</p>
      </div>)
    }
  else{
    return(
    <div>
      <h2>Statistics:</h2>
      <table>
        <tbody>
          <StatisticLine text='Good:' value={good}/>
          <StatisticLine text='Neutral: ' value={neutral}/>
          <StatisticLine text="Bad: " value={bad}/>
          <StatisticLine text="All: "value={all}/>
          <StatisticLine text="Average:"value={average}/>
          <StatisticLine text="Positive: "value={positiveCount} text2="%"/>
        </tbody>
      </table>
    </div>
    )
  }
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const StatisticLine = ({text,value,text2})=>{
  return(
  <tr>
    <td>{text}</td>
    <td>{value}</td>
    <td>{text2}</td>
  </tr>)
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [positiveCount, setPositiveCount] = useState(0)

  const updateStatistics = (newGood, newNeutral, newBad, newAll) => {
    const newAverage = (newGood - newBad) / newAll
    const newPositiveCount = (newGood/newAll)*100
    setAverage(newAverage)
    setPositiveCount(newPositiveCount)
  }

  const goodClick = () =>{
    //console.log('old good',good)
    const newGood = good +1
    const newAll = all+1
    //console.log('new good',newGood)
    setGood(newGood)
    setAll(newAll)
    updateStatistics(newGood, neutral, bad, newAll)
  }

  const neutralClick = () =>{
    //console.log('old neutral',neutral)
    const newNeutral = neutral +1
    const newAll = all +1
    //console.log('new neutral',newNeutral)
    setNeutral(newNeutral)
    setAll(newAll)
    updateStatistics(good, newNeutral, bad, newAll)
  }

  const badClick = () =>{
    //console.log('old bad', bad)
    const newBad = bad +1
    const newAll = all+1
    //console.log('new bad',newBad)
    setBad(newBad)
    setAll(newAll)
    updateStatistics(good, neutral, newBad, newAll)
  }


  return (
    <div>
      <h1>Give feedback!</h1>
      <Button handleClick={goodClick} text='Good'/>
      <Button handleClick={neutralClick} text='Neutral'/>
      <Button handleClick={badClick} text='Bad'/>
      <Statistics good={good} neutral={neutral} bad={bad} all={all} average={average} positiveCount={positiveCount} />
    </div>
  )
}

export default App