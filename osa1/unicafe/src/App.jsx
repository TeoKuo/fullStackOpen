import { useState } from 'react'



const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage] = useState(0)
  const [nPositive, setNPositive] = useState(0)

  const updateAverage =(props) =>{
    
  }

  const goodClick = () =>{
    //console.log('old good',good)
    const newGood = good +1
    console.log('new good',newGood)
    setGood(newGood)
    setAll(all+1)
  }

  const neutralClick = () =>{
    //console.log('old neutral',neutral)
    const newNeutral = neutral +1
    console.log('new neutral',newNeutral)
    setNeutral(newNeutral)
    setAll(all+1)
  }

  const badClick = () =>{
    //console.log('old bad', bad)
    const newBad = bad +1
    console.log('new bad',newBad)
    setBad(newBad)
    setAll(all+1)
  }


  return (
    <div>
      <h1>Give feedback!</h1>
      <button onClick={goodClick}>Good</button>
      <button onClick={neutralClick}>Neutral</button>
      <button onClick={badClick}>Bad</button>
      <h2>Statistics:</h2>
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
      <p>All: {all}</p>
      <p>Average: </p>
      <p>Positive:</p>
    </div>
  )
}

export default App