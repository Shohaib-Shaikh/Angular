import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'shorten'
})

export class CustomPipe implements PipeTransform{

    transform(value: string, limit: number){
        if(value.length > limit){
            return value.slice(0,limit);
        }
        return value;
    }
}