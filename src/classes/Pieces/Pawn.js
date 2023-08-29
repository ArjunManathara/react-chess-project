import King from "./King";
import Piece from "./Piece";
export default class Pawn extends Piece {
  constructor(color) {
    super(color);
    this.enPassantFlag = false;
  }
  helperFun(color, val) {
    if (color === "white") return val;
    else return -val;
  }
  calculateValidMoves(positionX, positionY, board) {
    let val = [];
    let checkFlag = false;

    //2 moves forward from starting position
    if (
      (this.color === "white" && positionX === 6) ||
      (this.color === "black" && positionX === 1)
    ) {
      if (
        this.checkBoundaryCondition(
          positionX + this.helperFun(this.color, -2),
          positionY
        ) &&
        board[positionX + this.helperFun(this.color, -1)][positionY].piece ==
          null &&
        board[positionX + this.helperFun(this.color, -2)][positionY].piece ==
          null
      )
        val.push(`${positionX + this.helperFun(this.color, -2)}-${positionY}`);
    }
    // //1 move forward standard
    if (
      this.checkBoundaryCondition(
        positionX + this.helperFun(this.color, -1),
        positionY
      ) &&
      board[positionX + this.helperFun(this.color, -1)][positionY].piece == null
    ) {
      val.push(`${positionX + this.helperFun(this.color, -1)}-${positionY}`);
    }
    //diagonal attack position 1
    if (
      this.checkBoundaryCondition(
        positionX + this.helperFun(this.color, -1),
        positionY + 1
      ) &&
      board[positionX + this.helperFun(this.color, -1)][positionY + 1].piece
        ?.color === (this.color === "white" ? "black" : "white")
    ) {
      val.push(
        `${positionX + this.helperFun(this.color, -1)}-${positionY + 1}`
      );
      if (
        board[positionX + this.helperFun(this.color, -1)][positionY + 1]
          .piece instanceof King
      )
        checkFlag = true;
    }
    //diagonal attack position 2
    if (
      this.checkBoundaryCondition(
        positionX + this.helperFun(this.color, -1),
        positionY - 1
      ) &&
      board[positionX + this.helperFun(this.color, -1)][positionY - 1].piece
        ?.color === (this.color === "white" ? "black" : "white")
    ) {
      val.push(
        `${positionX + this.helperFun(this.color, -1)}-${positionY - 1}`
      );
      if (
        board[positionX + this.helperFun(this.color, -1)][positionY - 1]
          .piece instanceof King
      )
        checkFlag = true;
    }
    //en passant moves
    let dir = [-1, 1];

    for (let i = 0; i < dir.length; i++) {
      if (
        this.checkBoundaryCondition(positionX, positionY + dir[i]) &&
        board[positionX][positionY + dir[i]].piece &&
        board[positionX][positionY + dir[i]].piece.color ===
          (this.color === "white" ? "black" : "white") &&
        board[positionX][positionY + dir[i]].piece instanceof Pawn &&
        board[positionX][positionY + dir[i]].piece.enPassantFlag
      )
        val.push(
          `${positionX + this.helperFun(this.color, -1)}-${positionY + dir[i]}`
        );
    }
    return { moves: val, checkFlag: checkFlag };

    //promotion
  }

  checkDoubleMove(prevX, prevY, currX, currY) {
    //check if pawn has just moved two squares ahead
    if (currX - prevX === this.helperFun(this.color, -2) && prevY === currY)
      return true;
    return false;
  }
  checkEnPassantMove(prevX, prevY, currX, currY, piece) {
    //check if pawn has executed an en passant move
    if (
      currX - prevX === this.helperFun(this.color, -1) &&
      Math.abs(currY - prevY) === 1 &&
      piece === null
    ) {
      return true;
    }
    return false;
  }
  checkPromotionMove(currX) {
    if (this.color === "white" && currX === 0) {
      return true;
    } else if (this.color === "black" && currX === 7) return true;
    return false;
  }
}
