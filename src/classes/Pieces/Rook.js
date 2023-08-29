import King from "./King";
import Piece from "./Piece";
export default class Rook extends Piece {
  constructor(color) {
    super(color);
    this.hasBeenMoved = null;
  }
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
          tempPiece instanceof Rook
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
    return val;
  }
}
