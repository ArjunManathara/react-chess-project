import "./styles/PawnComponent.scss";
const PawnComponent = ({ piece, onClick, style, onTransitionEnd }) => {
  return (
    <div
      className={"pawn " + (piece.color === "white" ? "white" : "black")}
      onClick={onClick}
      style={style}
      onTransitionEnd={onTransitionEnd}
    ></div>
  );
};

export default PawnComponent;
