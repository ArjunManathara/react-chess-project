import "./styles/KingComponent.scss";
const KingComponent = ({ piece, onClick, style, onTransitionEnd }) => {
  return (
    <div
      className={"king " + (piece.color === "white" ? "white" : "black")}
      onClick={onClick}
      style={style}
      onTransitionEnd={onTransitionEnd}
    ></div>
  );
};

export default KingComponent;
