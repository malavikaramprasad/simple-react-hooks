import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onFilterIngredient } = props;
  const [searchText, setSearchText ] = useState('');
  const inputRef = useRef();

  // If we have [] as dependencies, then the cleanup fucntion runs when component gets unmounted
  useEffect(() => {
    const timer = setTimeout(() => {
      // Call this method only after user finished typing. So the === check.
      if(searchText === inputRef.current.value){
        const query = searchText.length === 0 ? '' : `?orderBy="title"&equalTo="${searchText}"`;
        fetch("https://react-hooks-update-3673e.firebaseio.com/ingredients.json" + query)
          .then(response => response.json())
          .then(responseData => {
            const ingredients = [];
            for (const key in responseData) {
              ingredients.push({
                id: key,
                title: responseData[key].title,
                amount: responseData[key].amount
              })
            }
            onFilterIngredient(ingredients)
          })
      }
    }, 500);
    // Use effect must return a function. We can use it for cleaning up.
    return () => { clearTimeout(timer)};
  }, [searchText, onFilterIngredient, inputRef])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input ref={inputRef} type="text" value={searchText} onChange={ evt => setSearchText(evt.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
