import "./styles/GameStateComponent.scss";
const GameStateComponent = ({ gameObject, newGameFunction }) => {
  return (
    <div className="gameState">
      {gameObject && gameObject.numericalNotation ? (
        <div className="gameNumber">
          {gameObject && gameObject.numericalNotation}
        </div>
      ) : (
        ""
      )}
      <div className="gameComment">{gameObject && gameObject.comment}</div>
      {gameObject && gameObject.numericalNotation ? (
        <button className="newGameButton" onClick={() => newGameFunction()}>
          New Game
        </button>
      ) : (
        ""
      )}
    </div>
  );
};

export default GameStateComponent;
