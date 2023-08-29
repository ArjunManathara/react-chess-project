import Piece from "./Piece";
import Rook from "./Rook";
export default class King extends Piece {
  constructor(color) {
    super(color);
    this.hasBeenMoved = null;
  }
  calculateValidMoves(positionX, positionY, board) {
    let val = [];
    let checkFlag = false;
    let dir = [
      [0, 1],
      [1, 1],
      [1, 0],
      [1, -1],
      [0, -1],
      [-1, -1],
      [-1, 0],
      [-1, 1],
    ];
    for (let i = 0; i < dir.length; i++) {
      if (
        this.checkBoundaryCondition(
          positionX + dir[i][0],
          positionY + dir[i][1]
        )
      ) {
        if (
          board[positionX + dir[i][0]][positionY + dir[i][1]].piece === null
        ) {
          val.push(`${positionX + dir[i][0]}-${positionY + dir[i][1]}`);
        } else if (
          board[positionX + dir[i][0]][positionY + dir[i][1]].piece.color ===
          (this.color === "white" ? "black" : "white")
        ) {
          val.push(`${positionX + dir[i][0]}-${positionY + dir[i][1]}`);
          if (
            board[positionX + dir[i][0]][positionY + dir[i][1]].piece instanceof
            King
          )
            checkFlag = true;
        }
      }
    }
    return { moves: val, checkFlag: checkFlag };
  }

  checkCastleMove(prevX, prevY, currX, currY) {
    if (prevX === currX && Math.abs(prevY - currY) === 2) return true;
    else return false;
  }

  checkCastlePossible(positionX, positionY, board, moves) {
    let val = [];
    let leftEndIndex = 0;
    let rightEndIndex = 7;
    if (this.hasBeenMoved !== null) return val;
    if (moves.length > 0) {
      for (let i = 0; i < moves.length; i++) {
        let [xval, yval] = moves[i].split("-");
        xval = +xval;
        yval = +yval;
        if (positionX === xval && Math.abs(positionY - yval) === 1) {
          if (positionY - yval > 0) {
            //kingside castling
            if (
              board[positionX][leftEndIndex].piece &&
              board[positionX][leftEndIndex].piece instanceof Rook &&
              board[positionX][leftEndIndex].piece.hasBeenMoved === null
            ) {
              let emptyBetweenRookandKing = true;
              for (let i = 1; i < positionY; i++) {
                if (board[positionX][i].piece !== null) {
                  emptyBetweenRookandKing = false;
                  break;
                }
              }
              if (emptyBetweenRookandKing)
                val.push(`${positionX}-${positionY - 2}`);
            }
          } else {
            //queenside castling
            if (
              board[positionX][rightEndIndex].piece &&
              board[positionX][rightEndIndex].piece instanceof Rook &&
              board[positionX][rightEndIndex].piece.hasBeenMoved === null
            ) {
              let emptyBetweenRookandKing = true;
              for (let i = rightEndIndex - 1; i > positionY; i--) {
                if (board[positionX][i].piece !== null) {
                  emptyBetweenRookandKing = false;
                  break;
                }
              }
              if (emptyBetweenRookandKing)
                val.push(`${positionX}-${positionY + 2}`);
            }
          }
        }
      }
    }

    return val;
  }
}
