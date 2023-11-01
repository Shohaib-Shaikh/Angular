import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Observable } from 'rxjs';
import { RecipeService } from '../recipes/recipes.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private httpClient: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.httpClient
      .put(
        'https://recipe-56e12-default-rtdb.firebaseio.com/recipe.json',
        recipes
      )
      .subscribe((data) => {
        console.log(data);
      });
  }

  fetchRecipe() {
    return this.httpClient
      .get<Recipe[]>(
        'https://recipe-56e12-default-rtdb.firebaseio.com/recipe.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }
}
