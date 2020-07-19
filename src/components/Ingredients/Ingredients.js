import React, { useReducer, useCallback } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';
import ErrorModal from '../UI/ErrorModal';

const ingredientReducer = (currIngredients, action) => {
  switch(action.type) {
    case 'SET':
      return action.ingredients;
    case 'ADD':
      return [...currIngredients, action.ingredient]
    case 'DELETE':
      return currIngredients.filter(ingredient => ingredient.id !== action.id); 
    default:
      throw new Error("In default case");
  }
}

const httpReducer = (httpState, action) => {
  switch(action.type) {
    case 'SEND_REQUEST':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...httpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.error };
    case 'CLEAR':
      return { ...httpState, error: null};
    default: 
      throw new Error("In default case");  
  }
}

const Ingredients = () => {
  const [ingredients, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, {loading: false, error: null})
  
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
    dispatchHttp({ type: 'SEND_REQUEST'});
    fetch("https://react-hooks-update-3673e.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(newIngredients),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      dispatchHttp({ type: 'RESPONSE' });
        return response.json();
    })
    .then(responseData => {
        dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...newIngredients } })
    })
    .catch(error => {
      dispatchHttp({ type: 'ERROR', error:'Something went wrong'});
    });
  }

  const removeIngredient = (ingredientId) => {
    dispatchHttp({ type: 'SEND_REQUEST' });
    fetch(`https://react-hooks-update-3673e.firebaseio.com/ingredients/${ingredientId}.json`, {method: 'DELETE'})
      .then(response => { 
        dispatchHttp({ type: 'RESPONSE' });
        dispatch({ type: 'DELETE', id: ingredientId})
      })
      .catch(error => {
        dispatchHttp({ type: 'ERROR', error: 'Something went wrong' });
      });
  }

  const onFilterIngredient = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients});
  }, []);

  const clearError = () => {
    dispatchHttp({ type: 'CLEAR' });

  }
  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}> {httpState.error} </ErrorModal>}
      <IngredientForm onAddIngredient={addIngredient} loading={httpState.loading}/>

      <section>
        <Search onFilterIngredient={onFilterIngredient}/>
        {/* Need to add list here! */}
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
