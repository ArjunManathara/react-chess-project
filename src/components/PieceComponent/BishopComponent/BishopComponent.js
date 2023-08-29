import "./styles/BishopComponent.scss";
const BishopComponent = ({
  piece,
  onClick,
  style,
  onTransitionEnd,
  replacePromoted,
}) => {
  return (
    <div
      className={
        (replacePromoted ? "pawn " : "bishop ") +
        (piece.color === "white" ? "white" : "black")
      }
      onClick={onClick}
      style={style}
      onTransitionEnd={onTransitionEnd}
    ></div>
  );
};

export default BishopComponent;
