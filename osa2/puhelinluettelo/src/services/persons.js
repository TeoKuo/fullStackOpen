import axios from "axios";
const baseUrl = 'http://localhost:3001/persons'

const getAll = () =>{
    return axios.get(baseUrl)
}

const create = newObject =>{
    const request = axios.post(baseUrl,newObject)
    return request.then(response => response.data)
}

const personDelete = (id) =>{
    const deletedUrl = baseUrl.concat('/'+id)
    console.log(deletedUrl)
    const request = axios.delete(deletedUrl)
    return request
}

const changeNumber = (id, newnumber, persons)=>{
    const url = baseUrl.concat('/'+id)
    const person = persons.find(n => n.id === id)
    const changedPerson = {...person, number: newnumber}
    const request = axios.put(url,changedPerson)
    return request.then(response => response.data)
    
}

export default {getAll, create, personDelete,changeNumber}