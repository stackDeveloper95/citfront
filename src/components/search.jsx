import React, { useState, useEffect } from 'react';
import './form.css';
import './search.css';
import SearchIcon from '@mui/icons-material/Search';
import { api } from '../convex/_generated/api';
import { useQuery } from 'convex/react';
import { Link } from 'react-router-dom';


const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const tasks = useQuery(api.project.get);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (tasks) {
      setData(tasks); // Set projects once tasks are available
    }
  }, [tasks]);
  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  return (
    <div className='px-2 pt-2 bg-dark' id='searchbar'>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          aria-label="Search"
          aria-describedby="search-icon"
          onChange={handleInputChange}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          id="search-icon"
        >
          <SearchIcon /> {/* Bootstrap Icons */}
        </button>
      </div>

      <div className="results">
        {filteredData.length > 0 ? (
          filteredData.map((item, index) => (
            <div key={index} className="card mb-2" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 15px' }}>
              <h6 className="card-title mb-0">{item.projectName}</h6>
              <Link className="btn btn-sm btn-outline-primary" to={`/profile/${item.fileId}`}>view profile</Link>
            </div>
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>


      <hr id='hr' />


    </div>
  )
}

export default Search