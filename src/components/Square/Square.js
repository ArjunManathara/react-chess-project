import King from "../../classes/Pieces/King";
import "./styles/Square.scss";
const Square = ({
  isSelectedPiece,
  isPreviousMove,
  isCheckState,
  isValidSquare,
  isTargetSquare,
  piece,
  onClick,
  children,
}) => {
  return (
    <div className="square " onClick={onClick}>
      <div
        className={
          "layer " +
          (isSelectedPiece ? "selected " : "") +
          (isValidSquare ? (piece === null ? "valid " : "threat ") : "") +
          (isCheckState && piece instanceof King ? "check " : "") +
          (isPreviousMove ? "previous " : "") +
          (isTargetSquare ? "target " : "")
        }
      >
        {children}
      </div>
    </div>
  );
};

export default Square;
