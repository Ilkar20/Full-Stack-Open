const SearchForm = ({ query, onChange }) => (
  <div>
    filter countries 
    <input 
    value={query} 
    onChange={onChange}
    style={{ marginLeft: "0.5rem", padding: "0.3rem"}} />
  </div>
);

export default SearchForm;