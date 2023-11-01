import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";


@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css'],
})

export class AlertComponent implements OnDestroy{

    @Input() message: string;
    @Output() resetError =  new EventEmitter<boolean>();

    constructor(){}


    onClose(){
        this.resetError.emit(true);
    }


    ngOnDestroy(){}



}