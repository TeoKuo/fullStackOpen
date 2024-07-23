const Course = ({courses}) => {
    console.log(courses)
  
    const Header = ({course}) => {
      //console.log(course)
      return(
        <div>
          <h2>{course.name}</h2>
        </div>
      )
    }
  
    const Content = ({course}) => {
      //console.log(course)
      const parts = course.parts
      //console.log(parts)
      return(
        <div>
            {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises}></Part>)}
        </div>
      )
    }
  
    const Part = ({name, exercises}) => {
      return(
        <div>
          <p>
            {name} {exercises}
          </p>
        </div>
      )
    }
  
    const Total = ({course}) => {
      //console.log(course)
      const total = course.parts.map(part => part.exercises)
      //console.log(total)
      const initialValue = 0
      const totalSum = total.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue,
      )
      return(
        <div>
          <p><b>Total of {totalSum} exercises</b></p>
        </div>
      )
    }
  
  
    return (
      courses.map(course => <div key={course.id }>
        <Header course={course}></Header>
        <Content course={course}></Content>
        <Total course={course}></Total>
      </div>
    )
    )
  
  }

  export default Course