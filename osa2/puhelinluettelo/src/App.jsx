import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '0440 654 321'},
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

  const addPerson = (event) =>{

    const nimilista = persons.map(person => person.name)
    console.log(nimilista)

    if (nimilista.includes(newName)){
      event.preventDefault()
      console.log('Nimi jo listassa')
      window.alert(`${newName} is already added to phonebook`)

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
    setPersons(persons.concat(nameObject))
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter}/>

    </div>
  )

}

const Persons = ({persons, filter}) =>{

  const personsToShow = filter===''
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

    return(
    personsToShow.map(person=>
      <p key={person.name}>{person.name} {person.number}</p>
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

export default App
