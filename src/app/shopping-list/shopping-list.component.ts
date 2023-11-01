import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from './shopping-list.service';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy{
  ingredients: Ingredient[]=[];
  private idChangeSub: Subscription;

  constructor(private shoppingService: ShoppingService){}

  ngOnInit(){
    this.ingredients = this.shoppingService.getIngredients();
    this.idChangeSub = this.shoppingService.ingredientsChanged.subscribe(
      (ingredients: Ingredient[])=>{
        this.ingredients = ingredients;
      }
    );

  }

  onEditItem(index: number){
    this.shoppingService.startedEditing.next(index);
  }

  ngOnDestroy(){
    this.idChangeSub.unsubscribe();
  }
}
