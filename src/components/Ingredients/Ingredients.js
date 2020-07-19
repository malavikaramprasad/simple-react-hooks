import React, { useState, useCallback } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  
  // By default useEffect gets executed after every component render cycle or whenever this gets re-rendered.
  // The funtion passed to useEffect gets executed
  // useEffects with second arguement as [] ats as componentDidMount
  // The second arguement will control when to run useEffect. Only when the dependent changes, it will execute
  // Commenting down below since we are making a request in Search.js. (Don't want redundant calls)
  
  // useEffect(() => {
  //   fetch("https://react-hooks-update-3673e.firebaseio.com/ingredients.json")
  //     .then(response => { return response.json() })
  //     .then(responseData => {
  //       const ingredients = [];
  //       for (const key in responseData) {
  //         ingredients.push({
  //           id: key,
  //           title: responseData[key].title,
  //           amount: responseData[key].amount
  //         })
  //       }
  //       setIngredients(ingredients);
  //     })
  // }, []);
  
  const addIngredient = (newIngredients) => {
    fetch("https://react-hooks-update-3673e.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(newIngredients),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => { return response.json();})
    .then(responseData => {
        setIngredients(prevIngredients =>
          [...prevIngredients, { id: responseData.name, ...newIngredients }]
        );
    });
  }

  const removeIngredient = (ingredientId) => {
    fetch(`https://react-hooks-update-3673e.firebaseio.com/ingredients/${ingredientId}.json`, {method: 'DELETE'})
      .then(response => { 
          setIngredients(prevIngredients =>
            prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
          );
      });
  }

  const onFilterIngredient = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredient} />

      <section>
        <Search onFilterIngredient={onFilterIngredient}/>
        {/* Need to add list here! */}
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
