import { Component, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../../shared/recipe.model';
import { RecipeService } from '../recipes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs-compat';


@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})

export class RecipeListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  recipes: Recipe[]=[];


  constructor(private recipeService: RecipeService,
    private router: Router,
    private aRoute: ActivatedRoute){
  }

  ngOnInit(){
    this.subscription = this.recipeService.recipesChanged.subscribe(
      (recipes: Recipe[])=>{
        this.recipes = recipes;
      }
    );

    this.recipes = this.recipeService.getRecipes();

  }

  onNewRecipe(){
      this.router.navigate(['new'], {relativeTo: this.aRoute});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
