const Header = ({name}) => (
    <h1>{name}</h1>
)

const Content = ({parts}) => {
    return (
        <div>
          <Part part={parts[0]} />
          <Part part={parts[1]} />
          <Part part={parts[2]} />
        </div>
    )
}


const Part = ({part}) => (
            <p>
              {part.name} {part.exercises}
            </p>
          )

const Course = ({ course }) => { 
  console.log(course)
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

export default Course