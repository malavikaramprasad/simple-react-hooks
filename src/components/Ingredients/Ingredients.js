import React, { useState } from 'react';
import IngredientList from './IngredientList';
import IngredientForm from './IngredientForm';
import Search from './Search';

const Ingredients = () => {
  const [ingredients, setIngredients] = useState([]);

  const addIngredient = (newIngredients) => {
    fetch("https://react-hooks-update-3673e.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify({ newIngredients}),
      headers: { 'Content-Type': 'application/json' }
    }).then(response => {
      return response.json();
    }).then(responseData => {
        setIngredients(prevIngredients =>
          [...prevIngredients, { id: responseData.name, ...newIngredients }]
        );
    });
  }

  const removeIngredient = (ingredientId) => {
    setIngredients(prevIngredients => 
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredient} />

      <section>
        <Search />
        {/* Need to add list here! */}
        <IngredientList ingredients={ingredients} onRemoveItem={removeIngredient} />
      </section>
    </div>
  );
}

export default Ingredients;
