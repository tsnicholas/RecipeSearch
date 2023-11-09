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
    displayResults(recipes);
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
        var ingredient = convertToString(jsonpath.query(mealJson, `$.strIngredient${i}`));
        var measure = convertToString(jsonpath.query(mealJson, `$.strMeasure${i}`));
        if(measure === "" || measure === null || ingredient === "" || ingredient === null) {
            break;
        }
        ingredients.push(`${measure} ${ingredient}`);
    }
    return ingredients;
}

function convertToString(json) {
    var output = JSON.stringify(json);
    return output.substring(2, output.length - 2);
}

function displayResults(recipes) {
    var display = $("#recipeSection")[0];
    removeAllChildren(display);
    for(var recipe of recipes) {
        var recipeContainer = document.createElement("div");
        recipeContainer.classList.add("recipeContainer");
        recipeContainer.setAttribute("id", "recipeContainer");
        recipeContainer.appendChild(createThumbnail(recipe));
        recipeContainer.appendChild(createInfo(recipe));
        display.appendChild(recipeContainer);
    }
}

function removeAllChildren(parent) {
    while(parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function createThumbnail(recipe) {
    var image = document.createElement("img");
    image.setAttribute("src", recipe.thumbnail);
    image.setAttribute("alt", recipe.name);
    image.classList.add("thumbnail");
    return image;
}

function createInfo(recipe) {
    var container = document.createElement("div");
    container.classList.add("infoContainer");
    var name = document.createElement("h2");
    name.innerText = recipe.name;
    container.appendChild(name);
    return container;
}
