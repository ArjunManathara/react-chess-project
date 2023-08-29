import King from "./King";
import Piece from "./Piece";
export default class Queen extends Piece {
  helperFun(xory, a, b) {
    return xory ? a : b;
  }
  rowColumnCheck(
    xory,
    changingVal,
    limit,
    increment,
    val,
    board,
    positionX,
    positionY,
    checkFlag
  ) {
    for (
      let i = changingVal + (increment ? 1 : -1);
      increment ? i < limit : i > limit;
      increment ? i++ : i--
    ) {
      if (
        this.checkBoundaryCondition(
          this.helperFun(xory, i, positionX),
          this.helperFun(xory, positionY, i)
        )
      ) {
        if (
          board[this.helperFun(xory, i, positionX)][
            this.helperFun(xory, positionY, i)
          ].piece === null
        )
          val.push(
            `${this.helperFun(xory, i, positionX)}-${this.helperFun(
              xory,
              positionY,
              i
            )}`
          );
        else if (
          board[this.helperFun(xory, i, positionX)][
            this.helperFun(xory, positionY, i)
          ].piece.color === (this.color === "white" ? "black" : "white")
        ) {
          val.push(
            `${this.helperFun(xory, i, positionX)}-${this.helperFun(
              xory,
              positionY,
              i
            )}`
          );
          if (
            board[this.helperFun(xory, i, positionX)][
              this.helperFun(xory, positionY, i)
            ].piece instanceof King
          )
            checkFlag.flag = true;
          break;
        } else break; //same color piece
      } else break;
    }
  }
  rowColumnCheckDisambiguation(
    xory,
    changingVal,
    limit,
    increment,
    val,
    board,
    positionX,
    positionY
  ) {
    for (
      let i = changingVal + (increment ? 1 : -1);
      increment ? i < limit : i > limit;
      increment ? i++ : i--
    ) {
      if (
        this.checkBoundaryCondition(
          this.helperFun(xory, i, positionX),
          this.helperFun(xory, positionY, i)
        )
      ) {
        let tempPiece =
          board[this.helperFun(xory, i, positionX)][
            this.helperFun(xory, positionY, i)
          ].piece;
        if (
          tempPiece &&
          tempPiece.color === this.color &&
          tempPiece instanceof Queen
        ) {
          val.push(
            `${this.helperFun(xory, i, positionX)}-${this.helperFun(
              xory,
              positionY,
              i
            )}`
          );
          break;
        } else if (tempPiece && tempPiece.color !== this.color) break; //different color piece
      } else break;
    }
  }

  calculateValidMoves(positionX, positionY, board) {
    let val = [];
    let checkFlag = { flag: false };
    this.rowColumnCheck(
      true,
      positionX,
      8,
      true,
      val,
      board,
      positionX,
      positionY,
      checkFlag
    );
    this.rowColumnCheck(
      true,
      positionX,
      -1,
      false,
      val,
      board,
      positionX,
      positionY,
      checkFlag
    );
    this.rowColumnCheck(
      false,
      positionY,
      8,
      true,
      val,
      board,
      positionX,
      positionY,
      checkFlag
    );
    this.rowColumnCheck(
      false,
      positionY,
      -1,
      false,
      val,
      board,
      positionX,
      positionY,
      checkFlag
    );
    let arr = [-1, 1];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        let dirx = arr[i];
        let diry = arr[j];
        while (
          this.checkBoundaryCondition(positionX + dirx, positionY + diry) &&
          (board[positionX + dirx][positionY + diry].piece == null ||
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
              checkFlag.flag = true;
            break;
          }
          dirx += arr[i];
          diry += arr[j];
        }
      }
    }
    return { moves: val, checkFlag: checkFlag.flag };
  }
  disambiguateMove(positionX, positionY, board) {
    let val = [];
    this.rowColumnCheckDisambiguation(
      true,
      positionX,
      8,
      true,
      val,
      board,
      positionX,
      positionY
    );
    this.rowColumnCheckDisambiguation(
      true,
      positionX,
      -1,
      false,
      val,
      board,
      positionX,
      positionY
    );
    this.rowColumnCheckDisambiguation(
      false,
      positionY,
      8,
      true,
      val,
      board,
      positionX,
      positionY
    );
    this.rowColumnCheckDisambiguation(
      false,
      positionY,
      -1,
      false,
      val,
      board,
      positionX,
      positionY
    );
    let arr = [-1, 1];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        let dirx = arr[i];
        let diry = arr[j];
        while (
          this.checkBoundaryCondition(positionX + dirx, positionY + diry) &&
          (board[positionX + dirx][positionY + diry].piece == null ||
            (board[positionX + dirx][positionY + diry].piece.color ===
              this.color &&
              board[positionX + dirx][positionY + diry].piece instanceof Queen))
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
