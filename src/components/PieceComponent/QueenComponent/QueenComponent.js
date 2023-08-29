import "./styles/QueenComponent.scss";
const QueenComponent = ({
  piece,
  onClick,
  style,
  onTransitionEnd,
  replacePromoted,
}) => {
  return (
    <div
      className={
        (replacePromoted ? "pawn " : "queen ") +
        (piece.color === "white" ? "white" : "black")
      }
      onClick={onClick}
      style={style}
      onTransitionEnd={onTransitionEnd}
    ></div>
  );
};

export default QueenComponent;
