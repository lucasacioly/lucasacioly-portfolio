import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CoordinatesService {
  destinationCoordinates!: { top: number, left: number };

  setCoordinates(coordinates: { top: number, left: number }) :void{
    this.destinationCoordinates = coordinates;
  }

  getCoordinates() : { top: number, left: number }{
    return this.destinationCoordinates;
  }
}
