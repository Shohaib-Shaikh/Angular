import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "../shared/recipe.model";
import { Observable } from "rxjs";
import { DataStorageService } from "../shared/data-storage.service";
import { RecipeService } from "./recipes.service";


@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {


    constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService ){};


    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipeService.recipes;
        if(recipes.length === 0){
            return this.dataStorageService.fetchRecipe();
        }else{
            return recipes;
        }
    }

}