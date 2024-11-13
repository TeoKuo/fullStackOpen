import { useEffect, useState } from 'react'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  const timeout = 3000

  useEffect(()=>{
    personsService
    .getAll()
    .then(response =>{
      setPersons(response.data)
    })
    
  },[])

  const addPerson = (event) =>{
    event.preventDefault()

    const nimilista = persons.map(person => person.name)
    console.log(nimilista)

    if(newName === ''){
      event.preventDefault()
      console.log('Ei voi olla tyhjä')
      window.alert(`Field can't be empty`)}

    else if (nimilista.includes(newName)){
      event.preventDefault()
      console.log('Nimi jo listassa')
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)){
        const muutettava = persons.find(n => n.name === newName)
        console.log('Muutettava hlö',muutettava)
        personsService
        .changeNumber(muutettava.id, newNumber, persons)
        .then(response =>{
          setPersons(persons.map(person => person.id !== muutettava.id ? person : response))
          console.log('Uusi hlö',response)
          setNewName('')
          setNewNumber('')        
          setMessage(`${response.name} number changed`)
          setTimeout(()=>{
            setMessage('')
          }, timeout)  
        })
          .catch(error =>{
          console.error('failed to delete person',error)
          setError(true)
          setMessage(`${muutettava.nimi} was already deleted`)
          setTimeout(()=>{
            setError(false)
            setMessage('')
          }, timeout)})
      }

    } else{
      event.preventDefault()
      addName(event)
      console.log('nappia painettu',event.target)
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    console.log(event.target.value)
  }

  const addName = (event) =>{
    event.preventDefault()
    const nameObject ={
      name: newName,
      number: newNumber
    }

    personsService
      .create(nameObject)
        .then(returnedList => {
        setPersons(persons.concat(returnedList))
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${nameObject.name}`)
        setTimeout(()=>{
          setMessage('')
        }, timeout)
      })
    
    }

  const handleDelete = (nimi, id) =>{
    console.log(nimi)
    if (window.confirm(`Delete ${nimi} ?`)){
      console.log('Deleting '+id + ' ' + nimi)
      personsService
      .personDelete(id)
      .then(()=>{
        setPersons(persons.filter(person => person.id !== id))
        setMessage(`${nimi} deleted`)
        setTimeout(()=>{
          setMessage('')
        }, timeout)
      })
      .catch(error =>{
        console.error('failed to delete person',error)
        setError(true)
        setMessage(`${nimi} was already deleted`)
        setTimeout(()=>{
          setError(false)
          setMessage('')
        }, timeout)
      })
    } else (console.log('Deletion aborted'))
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} error={error}/>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} handleDelete={handleDelete}/>

    </div>
  )

}

const Persons = ({persons, filter, handleDelete}) =>{

  const personsToShow = filter===''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return(
    personsToShow.map(person=>
      <p key={person.name}>{person.name} {person.number} <button onClick={()=>handleDelete(person.name,person.id)}>Delete</button></p>
    ))
  
}

const PersonForm = ({addPerson,newName,newNumber,handleNameChange,handleNumberChange}) =>{
  return(
    <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleNameChange}/>
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange}/></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Filter = ({filter, handleFilterChange}) => {
  return(
  <form>
    <div>
      Filter shown with <input value={filter} onChange={handleFilterChange} />
    </div>
</form>
  )
}

const Notification = ({message, error}) => {
  if (message === '') {
    return ''
  }
  if (error){
    return(
      <div className="error">
        {message}
      </div>
    )
  }

  return(
    <div className="message">
      {message}
    </div>
  )
}

export default App
