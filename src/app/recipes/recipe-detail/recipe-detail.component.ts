import { Component, OnInit } from '@angular/core';
import { Recipe } from 'src/app/shared/recipe.model';
import { RecipeService } from '../recipes.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit{

  recipe: Recipe = {name: "", description: "", imagePath: "", ingredients: []};
  id: number = -1;

  constructor(private recipeService: RecipeService, private aRoute: ActivatedRoute,
    private router: Router){}

  ngOnInit(){
    this.aRoute.params.subscribe(
      (params: Params)=>{
          this.id = +params['id'];
          this. recipe = this.recipeService.getRecipe(this.id);
      }
    );
  }


  onAddToShoppingList(){
    this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  editRecipe(){
    this.router.navigate(['edit'], {relativeTo: this.aRoute})
  }

  onDeleteRecipe(){
    this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
