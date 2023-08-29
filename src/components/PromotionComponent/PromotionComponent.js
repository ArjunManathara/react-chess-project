import Queen from "../../classes/Pieces/Queen";
import Rook from "../../classes/Pieces/Rook";
import Bishop from "../../classes/Pieces/Bishop";
import Knight from "../../classes/Pieces/Knight";
import "./styles/PromotionComponent.scss";

const PromotionComponent = ({ piece, fun }) => {
  if (piece instanceof Queen)
    return (
      <div className="promotion-component">
        <div className="promotion-queen" onClick={fun}></div>
      </div>
    );
  else if (piece instanceof Rook)
    return (
      <div className="promotion-component">
        <div className="promotion-rook" onClick={fun}></div>
      </div>
    );
  else if (piece instanceof Bishop)
    return (
      <div className="promotion-component">
        <div className="promotion-bishop" onClick={fun}></div>
      </div>
    );
  else if (piece instanceof Knight)
    return (
      <div className="promotion-component">
        <div className="promotion-knight" onClick={fun}></div>
      </div>
    );
};

export default PromotionComponent;
