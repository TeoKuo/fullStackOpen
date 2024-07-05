import { useEffect, useState } from 'react'

const indexOfMax=(arr) =>{
  //inspiration for indexOfMax function: https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
  var max = arr[0];
  var maxIndex = 0;
  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }
  return maxIndex;
}

const BestAnecdote = ({anecdotes, pisteet}) =>{
   const[paras,setParas]= useState(0)
   useEffect(() =>{
    setParas(indexOfMax(pisteet))
  }, [pisteet])

  return(
    <div>
      <h2>Anecdote with most votes</h2>
      <p>{anecdotes[paras]}</p>
      <p>has {pisteet[paras]} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [pisteet, setPisteet] = useState(new Uint8Array(anecdotes.length))

  const randInt = (min,max) =>{
    //source for random int generator https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
    const minCieled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    const randIntIs= Math.floor(Math.random()*(maxFloored-minCieled+1)+minCieled)
    console.log('Random number generated: ',randIntIs)
    return randIntIs
  }

  const handleClickNext = () =>{
    console.log("Next clicked")
    setSelected(randInt(0,anecdotes.length-1))
  }

  const handleClickVote = () =>{
    console.log("Voted", selected)
    const pisteetCopy = [...pisteet]
    pisteetCopy[selected] +=1
    setPisteet([...pisteetCopy])
    console.log(pisteetCopy)
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>has {pisteet[selected]} votes</p>
      <button onClick={handleClickVote}>vote</button>
      <button onClick={handleClickNext}>next anecdote</button>
      <BestAnecdote anecdotes={anecdotes} pisteet={pisteet}/>
    </div>
  )
}

export default App