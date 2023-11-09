import $ from "jQuery";
const jsonpath = require("jsonpath");

const searchButton = $("#searchButton");
searchButton.on("click", search);

async function search() {
    var ingredient = $("#searchInput").val().replace(" ", "_");
    console.log(ingredient);
    var queryResult = await getJSON('https://www.themealdb.com/api/json/v1/1/filter.php', {i: ingredient});
    var mealIds = jsonpath.query(queryResult, "$.meals..idMeal");
    var recipes = await getRecipes(mealIds);
    console.log(recipes[0].ingredients);
}

async function getJSON(url, data) {
    return await $.ajax({
        url: url,
        type: 'GET',
        data: data,
        dataType: 'json',
        CORS: true,
    }).done((data, textStatus, jqXHR) => {
        console.log(data);
        console.log(textStatus);
        console.log(jqXHR.responseText);
        return JSON.parse(jqXHR.responseText);
    });
}

async function getRecipes(mealIds) {
    const recipes = [];
    for(var mealId of mealIds) {
        var mealJson = await getJSON('https://www.themealdb.com/api/json/v1/1/lookup.php', {i: mealId});
        var meal = mealJson.meals[0];
        console.log(JSON.stringify(meal));
        var recipeData = {
            name: meal.strMeal,
            thumbnail: meal.strMealThumb,
            instructions: meal.strInstructions,
            ingredients: getIngredients(meal),
        }
        recipes.push(recipeData);
    }
    return recipes;
}

function getIngredients(mealJson) {
    var ingredients = [];
    for(let i = 1; i <= 20; i++) {
        var ingredient = JSON.stringify(jsonpath.query(mealJson, `$.strIngredient${i}`));
        var measure = JSON.stringify(jsonpath.query(mealJson, `$.strMeasure${i}`));
        if(measure === "" || measure === null || ingredient === "" || ingredient === null) {
            break;
        }
        ingredients.push(`${measure} ${ingredient}`);
    }
    return ingredients;
}
