import PromotionComponent from "../PromotionComponent/PromotionComponent";
import "./styles/PromotionModal.scss";

const PromotionModal = ({
  promotionEvent,
  promotionalPieces,
  flip,
  handlePromotion,
}) => {
  if (promotionEvent)
    return (
      <div
        className={
          "modal " +
          promotionEvent.color +
          " column-" +
          (promotionEvent.column + 1) +
          (flip ? " flip " : "")
        }
      >
        {promotionalPieces(promotionEvent.color).map((piece, index) => (
          <PromotionComponent
            key={index}
            piece={piece}
            fun={() =>
              handlePromotion(piece, promotionEvent.row, promotionEvent.column)
            }
          />
        ))}
      </div>
    );
  else return "";
};

export default PromotionModal;
