import Pawn from "../../classes/Pieces/Pawn";
import Knight from "../../classes/Pieces/Knight";
import Bishop from "../../classes/Pieces/Bishop";
import Rook from "../../classes/Pieces/Rook";
import King from "../../classes/Pieces/King";
import Queen from "../../classes/Pieces/Queen";
import PawnComponent from "./PawnComponent/PawnComponent";
import KnightComponent from "./KnightComponent/KnightComponent";
import BishopComponent from "./BishopComponent/BishopComponent";
import RookComponent from "./RookComponent/RookComponent";
import KingComponent from "./KingComponent/Kingcomponent";
import QueenComponent from "./QueenComponent/QueenComponent";
const PieceComponent = ({
  piece,
  fun,
  onTransitionEnd,
  transformLocation,
  flipState,
  replacePromoted,
}) => {
  let destX = null,
    destY = null;
  let style = {};
  if (
    transformLocation &&
    transformLocation.newPos !== null &&
    transformLocation.prevPos !== null
  ) {
    destX = flipState
      ? -(transformLocation.newPos.y - transformLocation.prevPos.y) * 100
      : (transformLocation.newPos.y - transformLocation.prevPos.y) * 100;
    destY = flipState
      ? -(transformLocation.newPos.x - transformLocation.prevPos.x) * 100
      : (transformLocation.newPos.x - transformLocation.prevPos.x) * 100;
    style = {
      transform: `translate(${destX}%,${destY}%)`,
      transitionDuration: "350ms",
    };
  }

  if (piece instanceof Pawn) {
    return (
      <PawnComponent
        piece={piece}
        onClick={fun}
        style={style}
        onTransitionEnd={onTransitionEnd}
      />
    );
  } else if (piece instanceof Rook) {
    return (
      <RookComponent
        piece={piece}
        onClick={fun}
        style={style}
        onTransitionEnd={onTransitionEnd}
        replacePromoted={replacePromoted}
      />
    );
  } else if (piece instanceof Knight) {
    return (
      <KnightComponent
        piece={piece}
        onClick={fun}
        style={style}
        onTransitionEnd={onTransitionEnd}
        replacePromoted={replacePromoted}
      />
    );
  } else if (piece instanceof Bishop) {
    return (
      <BishopComponent
        piece={piece}
        onClick={fun}
        style={style}
        onTransitionEnd={onTransitionEnd}
        replacePromoted={replacePromoted}
      />
    );
  } else if (piece instanceof King) {
    return (
      <KingComponent
        piece={piece}
        onClick={fun}
        style={style}
        onTransitionEnd={onTransitionEnd}
      />
    );
  } else if (piece instanceof Queen) {
    return (
      <QueenComponent
        piece={piece}
        onClick={fun}
        style={style}
        onTransitionEnd={onTransitionEnd}
        replacePromoted={replacePromoted}
      />
    );
  }

  return null;
};

export default PieceComponent;
