
export default class Piece {
    constructor( color ){
        this.color = color;
    }
    checkBoundaryCondition(x,y) {
        return (x<=7 && x>=0 && y<=7 && y>=0);   
    }
}







