import "./styles/RookComponent.scss";
const RookComponent = ({
  piece,
  onClick,
  style,
  onTransitionEnd,
  replacePromoted,
}) => {
  return (
    <div
      className={
        (replacePromoted ? "pawn " : "rook ") +
        (piece.color === "white" ? "white" : "black")
      }
      onClick={onClick}
      style={style}
      onTransitionEnd={onTransitionEnd}
    ></div>
  );
};

export default RookComponent;
