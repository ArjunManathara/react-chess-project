import React, { useRef, useEffect, useState } from "react";
import "./styles/MoveList.scss";
const MoveList = ({
  moves,
  currentMoveIndex,
  handleMoveClick,
  handlePrevious,
  handleNext,
  lastIndex,
}) => {
  const moveListContainerRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(null);

  const scrollToMoveHorizontal = (moveIndex) => {
    let moveList = moveListContainerRef.current.children;
    if (moveList && moveList.length === 1) {
      moveList = moveList[0];
    }
    const moveElement = moveList.children[moveIndex];
    if (!moveElement) return;
    let elementLeft =
      moveElement.offsetLeft - moveListContainerRef.current.scrollLeft;
    let elementWidth = moveElement.offsetWidth;
    if (moveElement.children && moveElement.children.length > 1) {
      elementLeft += moveElement.children[0].offsetWidth;
      elementWidth -= moveElement.children[0].offsetWidth;
    }
    const containerWidth = moveListContainerRef.current.offsetWidth;
    const containerLeft = moveListContainerRef.current.offsetLeft;
    let newTranslateX = 0;
    if (elementLeft < containerLeft) {
      newTranslateX =
        containerLeft - elementLeft - moveListContainerRef.current.scrollLeft;
    } else if (elementLeft > containerLeft + containerWidth) {
      newTranslateX =
        containerLeft +
        containerWidth -
        elementLeft -
        elementWidth -
        moveListContainerRef.current.scrollLeft;
    } else {
      newTranslateX =
        containerLeft +
        containerWidth * 0.45 -
        elementLeft -
        elementWidth / 2 -
        moveListContainerRef.current.scrollLeft;
    }
    moveListContainerRef.current.scrollLeft = -newTranslateX;
  };

  const scrollToMoveVertical = (moveIndex) => {
    let moveList = moveListContainerRef.current.children;
    if (moveList && moveList.length === 1) {
      moveList = moveList[0];
    }
    const moveElement = moveList.children[moveIndex];
    if (!moveElement) return;

    const elementTop =
      moveElement.offsetTop - moveListContainerRef.current.scrollTop;
    const elementHeight = moveElement.offsetHeight;
    const containerHeight = moveListContainerRef.current.offsetHeight;
    const containerTop = moveListContainerRef.current.offsetTop;
    let newTranslateY = 0;

    if (
      elementTop < containerTop + containerHeight &&
      elementTop >= containerTop
    ) {
      newTranslateY =
        containerTop +
        containerHeight / 2 -
        elementTop -
        elementHeight / 2 -
        moveListContainerRef.current.scrollTop;
    } else if (elementTop >= containerTop + containerHeight) {
      newTranslateY =
        -elementTop +
        containerTop +
        containerHeight -
        elementHeight +
        -moveListContainerRef.current.scrollTop;
    }

    moveListContainerRef.current.scrollTop = -newTranslateY;
  };

  const handleWindowResize = () => {
    setViewportWidth(window.innerWidth);
  };

  useEffect(() => {
    // Add event listener for window resize
    setViewportWidth(window.innerWidth);
    window.addEventListener("resize", handleWindowResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (viewportWidth < 620) {
      scrollToMoveHorizontal(currentMoveIndex);
    } else {
      scrollToMoveVertical(currentMoveIndex);
    }
    return () => {
      //cleanup ref on component unmount
      moveListContainerRef.current = null;
    };
  }, [currentMoveIndex, viewportWidth]);

  return (
    <div className="movelistMain">
      {viewportWidth >= 620 ? (
        <button
          className={
            "buttonStyle first-button " +
            (currentMoveIndex === -1 ? "disabled" : "")
          }
          onClick={() => {
            handleMoveClick(-1);
            if (viewportWidth >= 620 && moves && moves.length > 0) {
              scrollToMoveVertical(0);
            }
          }}
        />
      ) : (
        ""
      )}
      <button
        className={
          "buttonStyle previous-button " +
          (currentMoveIndex === -1 ? "disabled" : "")
        }
        onClick={() => handlePrevious()}
      />
      <div ref={moveListContainerRef} className="move-list-container">
        <ul className="move-list">
          {moves &&
            moves.map((move, index) => (
              <ul className="inner-list" key={index}>
                {(index + 1) % 2 ? (
                  <li className="numbering">{(index + 2) / 2} </li>
                ) : (
                  ""
                )}
                <li
                  className={`move ${
                    currentMoveIndex === index ? "current-move" : ""
                  }`}
                  onClick={() => {
                    handleMoveClick(index);
                    if (viewportWidth < 620) scrollToMoveHorizontal(index);
                    else scrollToMoveVertical(index);
                  }}
                >
                  {move}
                </li>
              </ul>
            ))}
        </ul>
      </div>
      <button
        className={
          "buttonStyle next-button " +
          ((currentMoveIndex === -1 && lastIndex === -1) ||
          currentMoveIndex === lastIndex
            ? "disabled"
            : "")
        }
        onClick={() => handleNext()}
      />
      {viewportWidth >= 620 ? (
        <button
          className={
            "buttonStyle last-button " +
            ((currentMoveIndex === -1 && lastIndex === -1) ||
            currentMoveIndex === lastIndex
              ? "disabled"
              : "")
          }
          onClick={() => handleMoveClick(lastIndex)}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default MoveList;
