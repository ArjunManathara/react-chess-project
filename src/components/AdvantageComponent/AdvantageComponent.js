import "./styles/AdvantageComponent.scss";
const AdvantageComponent = ({ graveYardArray, color }) => {
  const generatePieceName = (pieceNumber) => {
    if (pieceNumber === 0) return "pawn";
    else if (pieceNumber === 1) return "knight";
    else if (pieceNumber === 2) return "bishop";
    else if (pieceNumber === 3) return "rook";
    else if (pieceNumber === 4) return "queen";
    else return "";
  };
  if (
    graveYardArray &&
    graveYardArray.graveYardPieces &&
    graveYardArray.graveYardPieces.length > 0
  ) {
    return (
      <div className={"graveyardCtr " + color}>
        {graveYardArray.graveYardPieces.map((ele, index) => (
          <div
            className={"advantage " + generatePieceName(ele)}
            key={index}
          ></div>
        ))}
        {graveYardArray.points > 0 ? (
          <div className="points">{`+${graveYardArray.points}`}</div>
        ) : (
          ""
        )}
      </div>
    );
  } else return <div className={"graveyardCtr " + color}></div>; // Or render a default component if no match is found
};

export default AdvantageComponent;
