import Square from "../Square/Square";
import PieceComponent from "../PieceComponent/PieceComponent";
import PromotionModal from "../PromotionModal/PromotionModal";
import "./styles/BoardComponent.scss";
const BoardComponent = ({
  board,
  currentPlayer,
  promotionEvent,
  flip,
  selectedPiece,
  validMovesForSelectedPiece,
  movesSoFar,
  moveNavigationPointer,
  animationState,
  handleSquareClick,
  handlePieceClick,
  handleTransitionEnd,
  promotionalPieces,
  handlePromotion,
}) => {
  return (
    <div
      className={
        "chessctr " +
        (flip ? "flip " : "") +
        (animationState ? "animation " : "")
      }
    >
      <div className={"chessboard " + (promotionEvent ? "promotion" : "")}>
        {board &&
          board.map((row, index) => (
            <div className="row" key={index}>
              {row.map((square) => (
                <Square
                  key={`${square.xcord}-${square.ycord}`}
                  isSelectedPiece={
                    selectedPiece &&
                    selectedPiece.x === square.xcord &&
                    selectedPiece.y === square.ycord
                  }
                  isPreviousMove={
                    movesSoFar &&
                    movesSoFar.length > 0 &&
                    moveNavigationPointer >= 0 &&
                    moveNavigationPointer < movesSoFar.length &&
                    movesSoFar[moveNavigationPointer].prevPos &&
                    movesSoFar[moveNavigationPointer].newPos &&
                    ((movesSoFar[moveNavigationPointer].prevPos.x ===
                      square.xcord &&
                      movesSoFar[moveNavigationPointer].prevPos.y ===
                        square.ycord) ||
                      (movesSoFar[moveNavigationPointer].rookMove
                        ? movesSoFar[moveNavigationPointer].rookMove.prevPos
                            .x === square.xcord &&
                          movesSoFar[moveNavigationPointer].rookMove.prevPos
                            .y === square.ycord
                        : movesSoFar[moveNavigationPointer].newPos.x ===
                            square.xcord &&
                          movesSoFar[moveNavigationPointer].newPos.y ===
                            square.ycord))
                  }
                  isCheckState={
                    (movesSoFar &&
                    moveNavigationPointer >= 0 &&
                    moveNavigationPointer < movesSoFar.length
                      ? movesSoFar[moveNavigationPointer].checkState ===
                          "check" ||
                        movesSoFar[moveNavigationPointer].checkState ===
                          "checkmate"
                      : false) &&
                    square.piece &&
                    square.piece.color === currentPlayer &&
                    (animationState === null ||
                      (animationState.newPos === null &&
                        animationState.prevPos === null))
                  }
                  isValidSquare={
                    validMovesForSelectedPiece &&
                    selectedPiece &&
                    board[selectedPiece.x][selectedPiece.y].validMoves.includes(
                      `${square.xcord}-${square.ycord}`
                    )
                  }
                  isTargetSquare={
                    animationState &&
                    animationState.newPos !== null &&
                    square.xcord === animationState.newPos.x &&
                    square.ycord === animationState.newPos.y &&
                    !animationState.promotionUndo
                  }
                  piece={square.piece}
                  onClick={() =>
                    handleSquareClick(square.xcord, square.ycord, square.piece)
                  }
                >
                  {animationState &&
                  animationState.moveback &&
                  animationState.prevPos &&
                  animationState.prevPos.x === square.xcord &&
                  animationState.prevPos.y === square.ycord &&
                  animationState.prevPos.piece ? (
                    <div className="ghostPiece">
                      <PieceComponent piece={animationState.prevPos.piece} />
                    </div>
                  ) : animationState &&
                    animationState.moveback &&
                    animationState.capturedPiece &&
                    animationState.capturedPiece.x === square.xcord &&
                    animationState.capturedPiece.y === square.ycord ? (
                    <div className="ghostPiece">
                      <PieceComponent
                        piece={animationState.capturedPiece.piece}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                  <PieceComponent
                    piece={square.piece}
                    fun={(e) =>
                      handlePieceClick(
                        e,
                        square.xcord,
                        square.ycord,
                        square.piece
                      )
                    }
                    onTransitionEnd={
                      !promotionEvent ? () => handleTransitionEnd() : null
                    }
                    transformLocation={
                      animationState &&
                      animationState.prevPos &&
                      animationState.prevPos.x === square.xcord &&
                      animationState.prevPos.y === square.ycord
                        ? animationState
                        : animationState &&
                          animationState.rookMove &&
                          animationState.rookMove.prevPos.x === square.xcord &&
                          animationState.rookMove.prevPos.y === square.ycord
                        ? animationState.rookMove
                        : null
                    }
                    flipState={flip}
                    replacePromoted={
                      animationState &&
                      animationState.replacePromoted &&
                      animationState.prevPos &&
                      animationState.prevPos.x === square.xcord &&
                      animationState.prevPos.y === square.ycord
                    }
                  ></PieceComponent>
                </Square>
              ))}
            </div>
          ))}
      </div>
      <PromotionModal
        promotionEvent={promotionEvent}
        promotionalPieces={promotionalPieces}
        flip={flip}
        handlePromotion={handlePromotion}
      />
      <div className={"files " + (flip ? "flip" : "")}>
        <span>a</span>
        <span>b</span>
        <span>c</span>
        <span>d</span>
        <span>e</span>
        <span>f</span>
        <span>g</span>
        <span>h</span>
      </div>
      <div className={"ranks " + (flip ? "flip" : "")}>
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
        <span>6</span>
        <span>7</span>
        <span>8</span>
      </div>
    </div>
  );
};
export default BoardComponent;
