import React, { useState, useCallback } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  
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
    setIsLoading(true);
    fetch("https://react-hooks-update-3673e.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(newIngredients),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
        setIsLoading(false);
        return response.json();
    })
    .then(responseData => {
        setIngredients(prevIngredients =>
          [...prevIngredients, { id: responseData.name, ...newIngredients }]
        );
    })
    .catch(error => {
      setError('Something went wrong');
    });
  }

  const removeIngredient = (ingredientId) => {
    setIsLoading(true);
    fetch(`https://react-hooks-update-3673e.firebaseio.com/ingredients/${ingredientId}.json`, {method: 'DELETE'})
      .then(response => { 
        setIsLoading(false);
          setIngredients(prevIngredients =>
            prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
          );
      })
      .catch(error => {
        setError('Something went wrong');
      });
  }

  const onFilterIngredient = useCallback(filteredIngredients => {
    setIngredients(filteredIngredients);
  }, []);

  const clearError = () => {
    setError(null);
    setIsLoading(false)
  }
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}> {error} </ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={isLoading}/>

      <section>
        <Search onFilterIngredient={onFilterIngredient}/>
        {/* Need to add list here! */}
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
