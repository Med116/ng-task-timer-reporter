import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToHumanTime'
})
export class SecondsToHumanTimePipe implements PipeTransform {

   transform(minutes: number ) : string {
  	return this.humanTime(minutes);
  }
  	/*
	* 12h 40m 10s format
	*/
	humanTime(seconds: number): string{
		console.log("sec: " + seconds);

		let secondsRemainder : number = seconds % 60;
		secondsRemainder = Math.trunc(secondsRemainder);

		seconds = Math.trunc(seconds);

		let minutes : number = seconds / 60; 
		minutes = Math.trunc(minutes);

		if(minutes > 60){	
			let hours = Math.trunc(minutes / 60);
			let minRemainder = minutes % 60;

			return hours + "h " + minRemainder + "m" + secondsRemainder + "s";
		}
		else{
			return minutes + "m" + secondsRemainder + "s";
		}
	}

}
