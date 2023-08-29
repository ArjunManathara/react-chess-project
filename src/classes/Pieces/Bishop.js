import King from "./King";
import Piece from "./Piece";
export default class Bishop extends Piece {
  calculateValidMoves(positionX, positionY, board) {
    let val = [];
    let checkFlag = false;
    let arr = [-1, 1];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        let dirx = arr[i];
        let diry = arr[j];
        while (
          this.checkBoundaryCondition(positionX + dirx, positionY + diry) &&
          (board[positionX + dirx][positionY + diry].piece === null ||
            board[positionX + dirx][positionY + diry].piece.color ===
              (this.color === "white" ? "black" : "white"))
        ) {
          val.push(`${positionX + dirx}-${positionY + diry}`);
          if (
            board[positionX + dirx][positionY + diry].piece &&
            board[positionX + dirx][positionY + diry].piece.color ===
              (this.color === "white" ? "black" : "white")
          ) {
            if (board[positionX + dirx][positionY + diry].piece instanceof King)
              checkFlag = true;
            break;
          }
          dirx += arr[i];
          diry += arr[j];
        }
      }
    }
    return { moves: val, checkFlag: checkFlag };
  }

  disambiguateMove(positionX, positionY, board) {
    //returns a list of positions from where a piece of the same kind could have reached the given position
    let val = [];
    let arr = [-1, 1];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        let dirx = arr[i];
        let diry = arr[j];
        while (
          this.checkBoundaryCondition(positionX + dirx, positionY + diry) &&
          (board[positionX + dirx][positionY + diry].piece === null ||
            (board[positionX + dirx][positionY + diry].piece.color ===
              this.color &&
              board[positionX + dirx][positionY + diry].piece instanceof
                Bishop))
        ) {
          if (board[positionX + dirx][positionY + diry].piece) {
            val.push(`${positionX + dirx}-${positionY + diry}`);
            break;
          }
          dirx += arr[i];
          diry += arr[j];
        }
      }
    }
    return val;
  }
}
