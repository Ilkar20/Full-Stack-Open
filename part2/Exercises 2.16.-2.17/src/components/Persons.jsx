const Persons = ({ persons, handleDelete }) => (
  <div>
    {persons.map(person => (
      <li key={person.id}>
        {person.name} {person.number}
        <button
        style={{ marginLeft: 10 }}
        onClick={() => handleDelete(person.id, person.name)}>delete</button>
      </li>
    ))}
  </div>
);

export default Persons