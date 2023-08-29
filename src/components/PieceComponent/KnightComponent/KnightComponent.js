import "./styles/KnightComponent.scss";
const KnightComponent = ({
  piece,
  onClick,
  style,
  onTransitionEnd,
  replacePromoted,
}) => {
  return (
    <div
      className={
        (replacePromoted ? "pawn " : "knight ") +
        (piece.color === "white" ? "white" : "black")
      }
      onClick={onClick}
      style={style}
      onTransitionEnd={onTransitionEnd}
    ></div>
  );
};

export default KnightComponent;
