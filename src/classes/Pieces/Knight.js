import King from "./King";
import Piece from "./Piece";
export default class Knight extends Piece {
  calculateValidMoves(positionX, positionY, board) {
    let val = [];
    let checkFlag = false;
    for (let i = -2; i < 3; i++) {
      if (i === 0) continue;
      let j = 3 - Math.abs(i);
      let arr = [-j, j];
      for (let j = 0; j < 2; j++) {
        if (
          this.checkBoundaryCondition(positionX + i, positionY + arr[j]) &&
          (board[positionX + i][positionY + arr[j]].piece === null ||
            board[positionX + i][positionY + arr[j]].piece.color ===
              (this.color === "white" ? "black" : "white"))
        ) {
          if (board[positionX + i][positionY + arr[j]].piece instanceof King)
            checkFlag = true;
          val.push(`${positionX + i}-${positionY + arr[j]}`);
        }
      }
    }
    return { moves: val, checkFlag: checkFlag };
  }
  disambiguateMove(positionX, positionY, board) {
    let val = [];
    for (let i = -2; i < 3; i++) {
      if (i === 0) continue;
      let j = 3 - Math.abs(i);
      let arr = [-j, j];
      for (let j = 0; j < 2; j++) {
        if (
          this.checkBoundaryCondition(positionX + i, positionY + arr[j]) &&
          board[positionX + i][positionY + arr[j]].piece &&
          board[positionX + i][positionY + arr[j]].piece.color === this.color &&
          board[positionX + i][positionY + arr[j]].piece instanceof Knight
        ) {
          val.push(`${positionX + i}-${positionY + arr[j]}`);
        }
      }
    }
    return val;
  }
}
