import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minutesToHumanTime'
})
export class MinutesToHumanTimePipe implements PipeTransform {

   transform(minutes: number ) : string {
  	return this.humanTime(minutes);
  }
  	/*
	* 12h 40m format
	*/
	humanTime(minutes: number): string{
		
		minutes = Math.trunc(minutes);
		if(minutes > 60){	
			let hours = Math.trunc(minutes / 60);
			let minRemainder = minutes % 60;
			return hours + "h " + minRemainder + "m";
		}
		else{
			return minutes + "m";
		}
	}

}
