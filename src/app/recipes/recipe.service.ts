import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Recipe } from "./recipe.model";

@Injectable()
export class RecipeService{
  recipeChanged = new Subject<Recipe[]>();


  //  private recipes: Recipe[] = [
  //       new Recipe('A Test',
  //       'Simple Test File',
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD6k861fVrHN8DgH0ecAmnKwnlE_OOfkRqXg&usqp=CAU',
  //       [
  //         new Ingredient('Meat', 1),
  //         new Ingredient('French Fiew', 5)
  //       ]),
  //       new Recipe('A Test1',
  //       'Simple Test File',
  //       'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD6k861fVrHN8DgH0ecAmnKwnlE_OOfkRqXg&usqp=CAU',
  //       [ 
  //         new Ingredient('Buns',2),
  //         new Ingredient('Meat',3)
  //       ])
  //     ];
  private recipes: Recipe[] = [];
       
      constructor(private slService: ShoppingListService){}

      setRecipe(recipes: Recipe[]){
        this.recipes=recipes;
        this.recipeChanged.next(this.recipes.slice());

      }
      getRecipes() {
         return this.recipes.slice();
      }

      getRecipe(index : number){
        return this.recipes[index];
      }

      addIngredientToShoppingList(ingredients: Ingredient[]){
        this.slService.addIngredients(ingredients);
      }

      addRecipe(recipe: Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());


      }
      updateRecipe(index: number, newRecipe: Recipe){
        this.recipes[index]= newRecipe;
        this.recipeChanged.next(this.recipes.slice());
      }
      deleteRecipe(index: number){
        this.recipes.splice(index,1);
        this.recipeChanged.next(this.recipes.slice());
    }
}