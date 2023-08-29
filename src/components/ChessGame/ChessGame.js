import React, { useState, useEffect, useRef } from "react";
import AdvantageComponent from "../AdvantageComponent/AdvantageComponent";
import GameStateComponent from "../GameStateComponent/GameStateComponent";
import Pawn from "../../classes/Pieces/Pawn";
import Knight from "../../classes/Pieces/Knight";
import Bishop from "../../classes/Pieces/Bishop";
import Rook from "../../classes/Pieces/Rook";
import King from "../../classes/Pieces/King";
import Queen from "../../classes/Pieces/Queen";
import "./styles/ChessGame.scss";
import MoveList from "../MoveList/MoveList";
import BoardComponent from "../BoardComponent/BoardComponent";
const ChessGame = () => {
  const tempBoardRef = useRef(null);
  const tempGraveyardRef = useRef(null);
  const [board, setBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [validMovesForSelectedPiece, setValidMovesForSelectedPiece] =
    useState(null);
  const [movesSoFar, setMovesSoFar] = useState(null);
  const [flip, setFlip] = useState(null);
  const [animationState, setAnimationState] = useState(null);
  const [promotionEvent, setPromotionEvent] = useState(null);
  const [moveNavigationPointer, setMoveNavigationPointer] = useState(null);
  const [graveYard, setGraveYard] = useState(null);

  const pieces = ["R", "N", "B", "Q", "K", "B", "N", "R"];

  const getPieces = (rowIndex, colIndex) => {
    if (rowIndex === 0 || rowIndex === 7) {
      return pieces[colIndex] + (rowIndex === 7 ? "1" : "0");
    } else if (rowIndex === 1 || rowIndex === 6) {
      return "P" + (rowIndex === 6 ? "1" : "0");
    }

    return null;
  };

  const initialiseGame = () => {
    const initialBoard = [];
    for (let i = 0; i < 8; i++) {
      const row = [];
      for (let j = 0; j < 8; j++) {
        let piece = getPieces(i, j);
        if (piece !== null) {
          if (piece[0] === "P")
            piece = new Pawn(piece[1] === "1" ? "white" : "black");
          else if (piece[0] === "N")
            piece = new Knight(piece[1] === "1" ? "white" : "black");
          else if (piece[0] === "B")
            piece = new Bishop(piece[1] === "1" ? "white" : "black");
          else if (piece[0] === "R")
            piece = new Rook(piece[1] === "1" ? "white" : "black");
          else if (piece[0] === "Q")
            piece = new Queen(piece[1] === "1" ? "white" : "black");
          else if (piece[0] === "K")
            piece = new King(piece[1] === "1" ? "white" : "black");
        }
        row.push({
          xcord: i,
          ycord: j,
          piece: piece,
        });
      }
      initialBoard.push(row);
    }

    let updateAllValidMovesObject = updateAllValidMoves(initialBoard, "black");
    setBoard(updateAllValidMovesObject.tempBoard);
    //initial graveyard setting
    let initialGraveYard = {
      white: [
        { count: 8, points: 1 },
        { count: 2, points: 3 },
        { count: 2, points: 3 },
        { count: 2, points: 5 },
        { count: 1, points: 9 },
      ],
      black: [
        { count: 8, points: 1 },
        { count: 2, points: 3 },
        { count: 2, points: 3 },
        { count: 2, points: 5 },
        { count: 1, points: 9 },
      ],
    };
    setGraveYard(initialGraveYard);
    setCurrentPlayer("white");
    setFlip(false);
    setMoveNavigationPointer(-1);
    setMovesSoFar([]);
  };
  useEffect(() => {
    initialiseGame();
    tempBoardRef.current = null;
    tempGraveyardRef.current = null;
    return () => {
      //cleanup refs on component unmount
      tempBoardRef.current = null;
      tempGraveyardRef.current = null;
    };
  }, []);

  const handlePieceClick = (e, positionX, positionY, piece) => {
    //Highlight all valid squares for clicked piece if piece color is same as current player
    //on clicking any piece while promotion event is going on, promotion event will be cancelled
    if (moveNavigationPointer !== movesSoFar.length - 1) {
      // to lock piece click unless it's on the latest move
      e.stopPropagation(); //prevent handleSquareClick being called if not latest move
      return;
    }
    if (promotionEvent) {
      setPromotionEvent(null);
      setSelectedPiece(null); //selected piece is deselected
      return;
    }
    if (piece === null || piece.color !== currentPlayer) return;
    e.stopPropagation(); //prevent handleSquareClick being called due to event bubbling
    if (selectedPiece && selectedPiece.piece === piece) {
      setSelectedPiece(null);
      setValidMovesForSelectedPiece(false);
    } else {
      setSelectedPiece({ x: positionX, y: positionY, piece: piece });
      setValidMovesForSelectedPiece(true);
    }
  };

  const handleSquareClick = (rowIndex, colIndex, piece) => {
    if (promotionEvent) {
      setPromotionEvent(null);
      setSelectedPiece(null);
      if (animationState) {
        setAnimationState({
          prevPos: animationState.prevPos,
          newPos: animationState.prevPos,
          promotionUndo: true,
        });
      }
      return;
    }
    if (selectedPiece === null) return;
    if (
      board[selectedPiece.x][selectedPiece.y].validMoves.includes(
        `${rowIndex}-${colIndex}`
      )
    ) {
      let tempObj = movelistUpdateBoard(rowIndex, colIndex, piece);
      if (tempObj.promotionInProgress) {
        setSelectedPiece(null);
        if (animationState) setAnimationState(tempObj.newestMove);
        return;
      }
      let tempArr = [...movesSoFar];
      let newestMove = tempObj.newestMove;
      let updateAllValidMovesObject = updateAllValidMoves(
        tempObj.tempBoard,
        currentPlayer
      );
      newestMove.checkState = updateAllValidMovesObject.tempGameState;
      let tempGraveyard = deepCopyGraveyard(graveYard);
      tempGraveyard = graveYardUpdate(tempGraveyard, newestMove, true);
      if (tempGraveyard) setGraveYard(tempGraveyard);
      tempArr.push(newestMove);
      setMovesSoFar(tempArr);
      if (animationState) {
        setAnimationState(newestMove);
        setValidMovesForSelectedPiece(false);
        setMoveNavigationPointer(moveNavigationPointer + 1);
        tempBoardRef.current = updateAllValidMovesObject.tempBoard;
      } else {
        setStatesAfterUpdateValidMoves(
          updateAllValidMovesObject.tempBoard,
          updateAllValidMovesObject.tempGameState
        );
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
        setMoveNavigationPointer(moveNavigationPointer + 1);
      }
    }
  };

  function updateDisambiguation(pieces) {
    let repeatingCols = new Map();
    let repeatingRows = new Map();
    pieces.forEach((coords) => {
      repeatingCols.set(coords.y, (repeatingCols.get(coords.y) || 0) + 1);
      repeatingRows.set(coords.x, (repeatingRows.get(coords.x) || 0) + 1);
    });
    pieces.forEach((piece) => {
      piece.disambiguation = piece.y;
      if (repeatingCols.get(piece.y) > 1) {
        if (repeatingRows.get(piece.x) > 1) {
          piece.disambiguation = piece.y + piece.x;
        } else {
          piece.disambiguation = piece.x;
        }
      }
    });
    return pieces;
  }

  const movelistUpdateBoard = (rowIndex, colIndex, piece) => {
    let tempBoard = deepCopyBoard(board);
    let tempPiece = matchingObject(selectedPiece.piece);
    let moves = [];
    if (
      tempPiece &&
      (tempPiece instanceof Bishop ||
        tempPiece instanceof Knight ||
        tempPiece instanceof Queen ||
        tempPiece instanceof Rook)
    ) {
      let result = tempPiece.disambiguateMove(rowIndex, colIndex, tempBoard);
      moves = result.map((ele) => {
        let [xval, yval] = ele.split("-");
        xval = +xval;
        yval = +yval;
        return {
          x: 8 - xval,
          y: String.fromCharCode("a".charCodeAt(0) + yval),
          disambiguation: "",
        };
      });
    }
    let disambiguatedMove = "";
    if (moves.length > 1) {
      moves = updateDisambiguation(moves);
      moves.forEach((piece) => {
        if (
          piece.x === selectedPiece.x &&
          piece.y === String.fromCharCode("a".charCodeAt(0) + selectedPiece.y)
        )
          disambiguatedMove = piece.disambiguation;
      });
    }
    let checkObject = {
      enPassantCheck: false,
      castleCheck: false,
    };
    if (tempPiece instanceof Pawn && tempPiece.checkPromotionMove(rowIndex)) {
      setPromotionEvent({
        color: currentPlayer,
        row: rowIndex,
        column: colIndex,
        oldRow: selectedPiece.x,
        oldCol: selectedPiece.y,
      });
      return {
        tempBoard: tempBoard,
        newestMove: {
          prevPos: { x: selectedPiece.x, y: selectedPiece.y, piece: tempPiece },
          newPos: {
            x: rowIndex,
            y: colIndex,
            piece: tempBoard[rowIndex][colIndex].piece,
          },
        },
        promotionInProgress: true,
      };
    }
    if (tempPiece instanceof Pawn) {
      if (tempBoard[rowIndex][colIndex].piece) {
        disambiguatedMove = String.fromCharCode(
          "a".charCodeAt(0) + selectedPiece.y
        );
      }
    }
    if (
      (tempPiece instanceof King || tempPiece instanceof Rook) &&
      tempPiece.hasBeenMoved === null
    ) {
      tempPiece.hasBeenMoved = moveNavigationPointer + 1;
    }
    checkObject = updateBoard(
      checkObject,
      tempBoard,
      selectedPiece.x,
      selectedPiece.y,
      tempPiece,
      rowIndex,
      colIndex
    );
    let newestMove = {};
    if (checkObject.enPassantCheck) {
      let capturedPawn = new Pawn(
        currentPlayer === "white" ? "black" : "white"
      );
      capturedPawn.enPassantFlag = true;
      newestMove = {
        prevPos: {
          x: selectedPiece.x,
          y: selectedPiece.y,
          piece: selectedPiece.piece,
        },
        newPos: { x: rowIndex, y: colIndex, piece: piece },
        capturedPiece: { x: selectedPiece.x, y: colIndex, piece: capturedPawn },
        disambiguatedMove: String.fromCharCode(
          "a".charCodeAt(0) + selectedPiece.y
        ),
      };
    } else {
      if (
        moveNavigationPointer >= 0 &&
        movesSoFar[moveNavigationPointer].prevPos.piece &&
        movesSoFar[moveNavigationPointer].prevPos.piece instanceof Pawn
      ) {
        let prevPos = movesSoFar[moveNavigationPointer].prevPos;
        let newPos = movesSoFar[moveNavigationPointer].newPos;
        if (
          prevPos.piece.checkDoubleMove(
            prevPos.x,
            prevPos.y,
            newPos.x,
            newPos.y
          ) &&
          prevPos.piece.color !== currentPlayer
        ) {
          if (
            tempBoard[newPos.x][newPos.y].piece &&
            tempBoard[newPos.x][newPos.y].piece instanceof Pawn &&
            tempBoard[newPos.x][newPos.y].piece.color !== currentPlayer &&
            tempBoard[newPos.x][newPos.y].piece.enPassantFlag
          ) {
            tempBoard[newPos.x][newPos.y].piece.enPassantFlag = false; // check previous move double move and undo the enPassantFlag if enPassant is not done
          }
        }
      }
      if (checkObject.castleCheck) {
        let tempRook = new Rook(currentPlayer);
        tempRook.hasBeenMoved = moveNavigationPointer + 1;
        newestMove = {
          prevPos: {
            x: selectedPiece.x,
            y: selectedPiece.y,
            piece: tempPiece,
          },
          newPos: { x: rowIndex, y: colIndex, piece: piece },
          rookMove: {
            prevPos: {
              x: rowIndex,
              y: colIndex - selectedPiece.y > 0 ? colIndex + 1 : colIndex - 2,
              piece: tempRook,
            },
            newPos: {
              x: rowIndex,
              y: colIndex - selectedPiece.y > 0 ? colIndex - 1 : colIndex + 1,
              piece: null,
            },
          },
        };
      } else {
        newestMove = {
          prevPos: {
            x: selectedPiece.x,
            y: selectedPiece.y,
            piece: tempPiece,
          },
          newPos: { x: rowIndex, y: colIndex, piece: piece },
          disambiguatedMove: disambiguatedMove,
        };
      }
    }
    return {
      tempBoard: tempBoard,
      newestMove: newestMove,
      promotionInProgress: false,
    };
  };

  const updateAllValidMoves = (tempBoard, currentPlayer) => {
    /* currentPlayer who just made the move, update all possible moves of opponent's pieces and return this board state and a
    gamestate object for detecting check, checkmate or a stalemate
    */
    let checkFlag = false;
    let currentPlayerPieces = [];
    let opponentPlayerPieces = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (tempBoard[i][j].piece) {
          if (tempBoard[i][j].piece.color === currentPlayer) {
            currentPlayerPieces.push({
              xcord: i,
              ycord: j,
              piece: tempBoard[i][j].piece,
            });
          } else
            opponentPlayerPieces.push({
              xcord: i,
              ycord: j,
              piece: tempBoard[i][j].piece,
            });
        }
      }
    }
    //check if there is any check applied on opponent's king after current move
    checkFlag = testCheckCondition(currentPlayerPieces, tempBoard, -1, -1);
    let moveFlag = false;
    for (let i = 0; i < opponentPlayerPieces.length; i++) {
      let result = opponentPlayerPieces[i].piece.calculateValidMoves(
        opponentPlayerPieces[i].xcord,
        opponentPlayerPieces[i].ycord,
        tempBoard
      );
      let moves = result.moves;
      moves = moves.filter((move) => {
        let oldx = opponentPlayerPieces[i].xcord;
        let oldy = opponentPlayerPieces[i].ycord;
        let [xval, yval] = move.split("-");
        xval = +xval;
        yval = +yval;
        let oldVal = matchingObject(tempBoard[oldx][oldy].piece);
        let copyval = matchingObject(tempBoard[xval][yval].piece);

        let checkObject = {
          //Pawn en passant
          enPassantCheck: false,
          //castle checking
          castleCheck: false,
        };
        checkObject = updateBoard(
          checkObject,
          tempBoard,
          oldx,
          oldy,
          oldVal,
          xval,
          yval
        );
        let flag = testCheckCondition(
          currentPlayerPieces,
          tempBoard,
          checkObject.enPassantCheck ? oldx : xval,
          yval
        );
        undoUpdateBoard(
          checkObject,
          tempBoard,
          oldx,
          oldy,
          copyval,
          oldVal,
          xval,
          yval
        );
        if (flag) return false;
        else return true;
      });
      if (
        !checkFlag &&
        opponentPlayerPieces[i].piece &&
        opponentPlayerPieces[i].piece instanceof King
      ) {
        let castleMoves = opponentPlayerPieces[i].piece.checkCastlePossible(
          opponentPlayerPieces[i].xcord,
          opponentPlayerPieces[i].ycord,
          tempBoard,
          moves
        );
        castleMoves = castleMoves.filter((move) => {
          let oldx = opponentPlayerPieces[i].xcord;
          let oldy = opponentPlayerPieces[i].ycord;
          let [xval, yval] = move.split("-");
          xval = +xval;
          yval = +yval;
          let oldVal = matchingObject(tempBoard[oldx][oldy].piece);
          let copyval = matchingObject(tempBoard[xval][yval].piece);

          let checkObject = {
            //Pawn en passant
            enPassantCheck: false,
            //castle checking
            castleCheck: false,
          };
          checkObject = updateBoard(
            checkObject,
            tempBoard,
            oldx,
            oldy,
            oldVal,
            xval,
            yval
          );
          let flag = testCheckCondition(
            currentPlayerPieces,
            tempBoard,
            checkObject.enPassantCheck ? oldx : xval,
            yval
          );
          undoUpdateBoard(
            checkObject,
            tempBoard,
            oldx,
            oldy,
            copyval,
            oldVal,
            xval,
            yval
          );
          if (flag) return false;
          else return true;
        });
        moves.push(...castleMoves);
      }
      tempBoard[opponentPlayerPieces[i].xcord][
        opponentPlayerPieces[i].ycord
      ].validMoves = moves;
      if (moves.length > 0) moveFlag = true;
    }
    let tempGameState = "";
    if (moveFlag) {
      if (checkFlag) {
        tempGameState = "check";
      }
    } else {
      if (checkFlag) {
        tempGameState = "checkmate";
      } else {
        tempGameState = "stalemate";
      }
    }
    return { tempBoard: tempBoard, tempGameState: tempGameState };
  };

  const setStatesAfterUpdateValidMoves = (tempBoard) => {
    setSelectedPiece(null);
    setValidMovesForSelectedPiece(false);
    setBoard(tempBoard);
  };
  // Returns new object to ensure deep copying of state variables
  const matchingObject = (piece) => {
    let val = null;
    if (piece instanceof Pawn) {
      val = new Pawn(piece.color);
      val.enPassantFlag = piece.enPassantFlag;
    } else if (piece instanceof Knight) {
      val = new Knight(piece.color);
    } else if (piece instanceof Bishop) {
      val = new Bishop(piece.color);
    } else if (piece instanceof Rook) {
      val = new Rook(piece.color);
      val.hasBeenMoved = piece.hasBeenMoved; //special case for castling
    } else if (piece instanceof Queen) {
      val = new Queen(piece.color);
    } else if (piece instanceof King) {
      val = new King(piece.color);
      val.hasBeenMoved = piece.hasBeenMoved; //special case for castling
    }
    return val;
  };

  const getPieceName = (piece) => {
    if (piece instanceof Pawn) return "";
    else if (piece instanceof Knight) return "N";
    else if (piece instanceof Bishop) return "B";
    else if (piece instanceof Rook) return "R";
    else if (piece instanceof King) return "K";
    else if (piece instanceof Queen) return "Q";
    else return "null";
  };
  const getPieceNumber = (piece) => {
    //get graveyard state index number
    if (piece instanceof Pawn) return 0;
    else if (piece instanceof Knight) return 1;
    else if (piece instanceof Bishop) return 2;
    else if (piece instanceof Rook) return 3;
    else if (piece instanceof Queen) return 4;
  };

  //loops through current player pieces to detect whether there is a check to opponent's king
  const testCheckCondition = (
    currentPlayerPieces,
    tempBoard,
    ignoreX,
    ignoreY
  ) => {
    for (let i = 0; i < currentPlayerPieces.length; i++) {
      if (
        currentPlayerPieces[i].piece &&
        (currentPlayerPieces[i].xcord !== ignoreX ||
          currentPlayerPieces[i].ycord !== ignoreY)
      ) {
        let result = currentPlayerPieces[i].piece.calculateValidMoves(
          currentPlayerPieces[i].xcord,
          currentPlayerPieces[i].ycord,
          tempBoard
        ).checkFlag;
        if (result) return true;
      }
    }
    return false;
  };

  //update board based on current move
  const updateBoard = (
    checkObject,
    tempBoard,
    x,
    y,
    tempPiece,
    rowIndex,
    colIndex
  ) => {
    if (tempPiece instanceof Pawn) {
      if (tempPiece.checkDoubleMove(x, y, rowIndex, colIndex)) {
        tempPiece = matchingObject(tempPiece);
        tempPiece.enPassantFlag = true;
      }
      if (
        tempPiece.checkEnPassantMove(
          x,
          y,
          rowIndex,
          colIndex,
          tempBoard[rowIndex][colIndex].piece
        )
      ) {
        checkObject.enPassantCheck = true;
      }
    }
    if (tempPiece instanceof King) {
      if (tempPiece.checkCastleMove(x, y, rowIndex, colIndex)) {
        checkObject.castleCheck = true;
      }
    }

    tempBoard[rowIndex][colIndex].piece = tempPiece;
    tempBoard[x][y].piece = null;

    if (checkObject.enPassantCheck) {
      tempBoard[x][colIndex].piece = null;
    }
    if (checkObject.castleCheck) {
      tempBoard[x][colIndex - y > 0 ? colIndex - 1 : colIndex + 1].piece =
        tempBoard[x][colIndex - y > 0 ? colIndex + 1 : colIndex - 2].piece;
      tempBoard[x][colIndex - y > 0 ? colIndex + 1 : colIndex - 2].piece = null;
    }
    return checkObject;
  };

  //undo update on board
  const undoUpdateBoard = (
    checkObject,
    tempBoard,
    x,
    y,
    deletedPiece,
    tempPiece,
    rowIndex,
    colIndex
  ) => {
    tempBoard[rowIndex][colIndex].piece = deletedPiece;
    tempBoard[x][y].piece = tempPiece;
    if (checkObject.enPassantCheck) {
      tempBoard[x][colIndex].piece = new Pawn(
        tempPiece.color === "white" ? "black" : "white"
      );
      tempBoard[x][colIndex].piece.enPassantFlag = true; //replace lost pawn
    }
    if (checkObject.castleCheck) {
      tempBoard[x][colIndex - y > 0 ? colIndex + 1 : colIndex - 2].piece =
        tempBoard[x][colIndex - y > 0 ? colIndex - 1 : colIndex + 1].piece;
      tempBoard[x][colIndex - y > 0 ? colIndex - 1 : colIndex + 1].piece = null;
    }
  };

  const deepCopyBoard = (board) => {
    return board.map((row) =>
      row.map((obj) => ({
        xcord: obj.xcord,
        ycord: obj.ycord,
        piece: matchingObject(obj.piece),
        validMoves: [],
      }))
    );
  };

  const deepCopyGraveyard = (graveYard) => {
    let tempGraveyard = { white: null, black: null };
    tempGraveyard.white = graveYard.white.map((obj) => ({
      count: obj.count,
      points: obj.points,
    }));
    tempGraveyard.black = graveYard.black.map((obj) => ({
      count: obj.count,
      points: obj.points,
    }));
    return tempGraveyard;
  };

  const graveYardUpdate = (tempGraveyard, newestMove, direction) => {
    //direction represents forward or backward movement
    let prevPos = newestMove.prevPos;
    let newPos = newestMove.newPos;
    let enPassant = newestMove.capturedPiece;
    let rookMove = newestMove.rookMove;
    let promotionStatus = newestMove.promotionStatus;
    if (promotionStatus) {
      tempGraveyard[prevPos.piece.color][getPieceNumber(prevPos.piece)].count +=
        direction ? -1 : 1;
      if (newPos.piece) {
        tempGraveyard[newPos.piece.color][getPieceNumber(newPos.piece)].count +=
          direction ? -1 : 1;
      }
      tempGraveyard[promotionStatus.piece.color][
        getPieceNumber(promotionStatus.piece)
      ].count += direction ? 1 : -1;
      return tempGraveyard;
    }
    if (rookMove) return null; // no pieces are captured, hence there is no need to make any state update to the graveyard.
    if (enPassant) {
      tempGraveyard[enPassant.piece.color][
        getPieceNumber(enPassant.piece)
      ].count += direction ? -1 : 1;
      return tempGraveyard;
    }
    if (newPos.piece) {
      tempGraveyard[newPos.piece.color][getPieceNumber(newPos.piece)].count +=
        direction ? -1 : 1;
      return tempGraveyard;
    } else return null; //if newPos.piece is null it means there was no piece captured
  };

  const graveYardPieces = (graveYard, color) => {
    let otherColor = color === "white" ? "black" : "white";
    let array = [];
    let points = 0;
    for (let i = graveYard[color].length - 1; i >= 0; i--) {
      let n = graveYard[color][i].count - graveYard[otherColor][i].count;
      for (let j = 0; j < Math.abs(n); j++) {
        if (n > 0) {
          array.push(i);
          points += graveYard[color][i].points;
        } else {
          points -= graveYard[color][i].points;
        }
      }
    }
    if (points < 0) points = 0; // only show net positive points
    return { graveYardPieces: array, points: points };
  };

  const promotionalPieces = (color) => {
    return [
      new Queen(color),
      new Rook(color),
      new Bishop(color),
      new Knight(color),
    ];
  };

  const handlePromotion = (piece, rowIndex, colIndex) => {
    let tempBoard = deepCopyBoard(board);
    let tempPiece = matchingObject(tempBoard[rowIndex][colIndex].piece);
    tempBoard[rowIndex][colIndex].piece = piece;
    tempBoard[promotionEvent.oldRow][promotionEvent.oldCol].piece = null;
    let tempArr = [...movesSoFar];
    let newestMove = {
      prevPos: {
        x: promotionEvent.oldRow,
        y: promotionEvent.oldCol,
        piece: new Pawn(promotionEvent.color),
      },
      newPos: { x: rowIndex, y: colIndex, piece: tempPiece },
      promotionStatus: { x: rowIndex, y: colIndex, piece: piece },
      checkState: "",
    };
    let tempGraveyard = deepCopyGraveyard(graveYard);
    //If going through with promotion, undoing any enPassantFlags for previous move
    if (
      moveNavigationPointer >= 0 &&
      movesSoFar[moveNavigationPointer].prevPos.piece &&
      movesSoFar[moveNavigationPointer].prevPos.piece instanceof Pawn
    ) {
      let prevPos = movesSoFar[moveNavigationPointer].prevPos;
      let newPos = movesSoFar[moveNavigationPointer].newPos;
      if (
        prevPos.piece.checkDoubleMove(
          prevPos.x,
          prevPos.y,
          newPos.x,
          newPos.y
        ) &&
        prevPos.piece.color !== currentPlayer
      ) {
        if (
          tempBoard[newPos.x][newPos.y].piece &&
          tempBoard[newPos.x][newPos.y].piece instanceof Pawn &&
          tempBoard[newPos.x][newPos.y].piece.color !== currentPlayer &&
          tempBoard[newPos.x][newPos.y].enPassantFlag
        )
          tempBoard[newPos.x][newPos.y].piece.enPassantFlag = false; // check previous move double move and undo the enPassantFlag if enPassant is not done
      }
    }

    let tempObj = updateAllValidMoves(tempBoard, currentPlayer);
    newestMove.checkState = tempObj.tempGameState;
    if (newestMove.newPos.piece) {
      newestMove.disambiguatedMove = String.fromCharCode(
        "a".charCodeAt(0) + newestMove.prevPos.y
      );
    } else {
      newestMove.disambiguatedMove = "";
    }
    tempArr.push(newestMove);
    setMovesSoFar(tempArr);
    tempGraveyard = graveYardUpdate(tempGraveyard, newestMove, true);
    setGraveYard(tempGraveyard);
    setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
    if (animationState) setAnimationState({ prevPos: null, newPos: null });
    setPromotionEvent(null);
    setMoveNavigationPointer(moveNavigationPointer + 1);
    setStatesAfterUpdateValidMoves(tempObj.tempBoard);
  };
  const toggleAnimation = (animationState) => {
    if (animationState) {
      setAnimationState(null);
      tempBoardRef.current = null;
    } else {
      setAnimationState({
        prevPos: null,
        newPos: null,
      });
    }
  };

  const handleTransitionEnd = () => {
    if (animationState) {
      if (tempBoardRef.current === null) {
        //castling involves two calls to this handleTransitionEnd() function. One of these can be ignored by using this condition
        return;
      }
      if (animationState.moveback) {
        setStatesAfterUpdateValidMoves(tempBoardRef.current);
        if (tempGraveyardRef.current) {
          setGraveYard(tempGraveyardRef.current);
          tempGraveyardRef.current = null;
        }
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
        tempBoardRef.current = null;
        setAnimationState({ prevPos: null, newPos: null });
        setMoveNavigationPointer(moveNavigationPointer - 1);
        return;
      } else if (animationState.moveforward) {
        setStatesAfterUpdateValidMoves(tempBoardRef.current);
        if (tempGraveyardRef.current) {
          setGraveYard(tempGraveyardRef.current);
          tempGraveyardRef.current = null;
        }
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
        tempBoardRef.current = null;
        setAnimationState({ prevPos: null, newPos: null });
        return;
      } else if (animationState.promotionUndo) {
        setAnimationState({ prevPos: null, newPos: null });
        return;
      } else {
        setStatesAfterUpdateValidMoves(tempBoardRef.current);
        if (tempGraveyardRef.current) {
          setGraveYard(tempGraveyardRef.current);
          tempGraveyardRef.current = null;
        }
        setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
        setAnimationState({ prevPos: null, newPos: null });
        tempBoardRef.current = null;
        return;
      }
    } else return;
  };
  const toggleFlip = () => {
    setFlip(!flip);
    setSelectedPiece(null);
  };

  const moveNavigationBackward = (undoLatestMoveObject) => {
    if (moveNavigationPointer === -1) {
      //already at game start
      return;
    } else {
      if (promotionEvent) {
        setPromotionEvent(null);
        if (animationState) {
          setAnimationState({
            prevPos: animationState.prevPos,
            newPos: animationState.prevPos,
            promotionUndo: true,
          });
        }
      }
      if (
        animationState &&
        (animationState.prevPos !== null || animationState.newPos !== null) &&
        animationState?.promotionUndo
      )
        return;
      let tempBoard = deepCopyBoard(board);
      if (undoLatestMoveObject && undoLatestMoveObject.doubleMovePawn) {
        tempBoard[undoLatestMoveObject.doubleMovePawn.x][
          undoLatestMoveObject.doubleMovePawn.y
        ].piece.enPassantFlag = true;
      }
      let prevPos = movesSoFar[moveNavigationPointer].prevPos;
      let newPos = movesSoFar[moveNavigationPointer].newPos;
      let enPassant = movesSoFar[moveNavigationPointer].capturedPiece;
      let rookMove = movesSoFar[moveNavigationPointer].rookMove;
      let promotionStatus = movesSoFar[moveNavigationPointer].promotionStatus;
      let tempGraveyard = deepCopyGraveyard(graveYard);
      tempGraveyard = graveYardUpdate(
        tempGraveyard,
        movesSoFar[moveNavigationPointer],
        false
      );
      tempBoard[prevPos.x][prevPos.y].piece = prevPos.piece;
      tempBoard[newPos.x][newPos.y].piece = newPos.piece;
      if (
        undoLatestMoveObject &&
        (undoLatestMoveObject.kingRookMoved || undoLatestMoveObject.castleCase)
      ) {
        tempBoard[prevPos.x][prevPos.y].piece.hasBeenMoved = null;
      }
      if (enPassant) {
        tempBoard[enPassant.x][enPassant.y].piece = enPassant.piece;
        if (animationState) {
          let updateAllValidMovesObject = updateAllValidMoves(
            tempBoard,
            currentPlayer
          );
          tempBoardRef.current = updateAllValidMovesObject.tempBoard;
          tempGraveyardRef.current = tempGraveyard;
          setAnimationState({
            prevPos: newPos,
            newPos: prevPos,
            moveback: true,
            capturedPiece: enPassant,
            checkState: updateAllValidMovesObject.tempGameState,
          });
          return;
        }
      }
      if (rookMove) {
        tempBoard[rookMove.prevPos.x][rookMove.prevPos.y].piece =
          rookMove.prevPos.piece;
        if (undoLatestMoveObject && undoLatestMoveObject.castleCase) {
          rookMove.prevPos.piece.hasBeenMoved = null;
        }
        tempBoard[rookMove.newPos.x][rookMove.newPos.y].piece =
          rookMove.newPos.piece;
        if (animationState) {
          let updateAllValidMovesObject = updateAllValidMoves(
            tempBoard,
            currentPlayer
          );
          tempBoardRef.current = updateAllValidMovesObject.tempBoard;
          tempGraveyardRef.current = tempGraveyard;
          setAnimationState({
            prevPos: newPos,
            newPos: prevPos,
            rookMove: { prevPos: rookMove.newPos, newPos: rookMove.prevPos },
            moveback: true,
            checkState: updateAllValidMovesObject.tempGameState,
          });
          return;
        }
      }

      if (animationState) {
        let updateAllValidMovesObject = updateAllValidMoves(
          tempBoard,
          currentPlayer
        );
        tempBoardRef.current = updateAllValidMovesObject.tempBoard;
        tempGraveyardRef.current = tempGraveyard;
        if (promotionStatus) {
          setAnimationState({
            prevPos: newPos,
            newPos: prevPos,
            moveback: true,
            replacePromoted: true,
            checkState: updateAllValidMovesObject.tempGameState,
          });
          return;
        }
        setAnimationState({
          prevPos: newPos,
          newPos: prevPos,
          moveback: true,
          checkState: updateAllValidMovesObject.tempGameState,
        });
        return;
      }
      let updateAllValidMovesObject = updateAllValidMoves(
        tempBoard,
        currentPlayer
      );
      setStatesAfterUpdateValidMoves(updateAllValidMovesObject.tempBoard);
      if (tempGraveyard) setGraveYard(tempGraveyard);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setMoveNavigationPointer(moveNavigationPointer - 1);
    }
  };

  const moveNavigationForward = () => {
    if (
      movesSoFar &&
      movesSoFar.length > 0 &&
      moveNavigationPointer < movesSoFar.length - 1
    ) {
      //deal with multiple clicks while animation is playing
      if (promotionEvent) setPromotionEvent(null);
      if (
        animationState &&
        (animationState.prevPos !== null || animationState.newPos !== null)
      )
        return;
      let tempBoard = deepCopyBoard(board);
      let prevPos = movesSoFar[moveNavigationPointer + 1].prevPos;
      let newPos = movesSoFar[moveNavigationPointer + 1].newPos;
      let enPassant = movesSoFar[moveNavigationPointer + 1].capturedPiece;
      let rookMove = movesSoFar[moveNavigationPointer + 1].rookMove;
      let promotionStatus =
        movesSoFar[moveNavigationPointer + 1].promotionStatus;
      let tempGraveyard = deepCopyGraveyard(graveYard);
      tempGraveyard = graveYardUpdate(
        tempGraveyard,
        movesSoFar[moveNavigationPointer + 1],
        true
      );
      tempBoard[prevPos.x][prevPos.y].piece = null;
      tempBoard[newPos.x][newPos.y].piece = prevPos.piece;

      if (enPassant) {
        tempBoard[enPassant.x][enPassant.y].piece = null;
        if (animationState) {
          let updateAllValidMovesObject = updateAllValidMoves(
            tempBoard,
            currentPlayer
          );
          tempBoardRef.current = updateAllValidMovesObject.tempBoard;
          tempGraveyardRef.current = tempGraveyard;
          setAnimationState({
            prevPos: prevPos,
            newPos: newPos,
            moveforward: true,
            checkState: updateAllValidMovesObject.tempGameState,
          });
          setMoveNavigationPointer(moveNavigationPointer + 1);
          return;
        }
      }
      if (rookMove) {
        tempBoard[rookMove.prevPos.x][rookMove.prevPos.y].piece = null;
        tempBoard[rookMove.newPos.x][rookMove.newPos.y].piece =
          rookMove.prevPos.piece;
        if (animationState) {
          let updateAllValidMovesObject = updateAllValidMoves(
            tempBoard,
            currentPlayer
          );
          tempBoardRef.current = updateAllValidMovesObject.tempBoard;
          tempGraveyardRef.current = tempGraveyard;
          setAnimationState({
            prevPos: prevPos,
            newPos: newPos,
            rookMove: { prevPos: rookMove.prevPos, newPos: rookMove.newPos },
            moveforward: true,
            checkState: updateAllValidMovesObject.tempGameState,
          });
          setMoveNavigationPointer(moveNavigationPointer + 1);
          return;
        }
      }
      if (promotionStatus) {
        tempBoard[newPos.x][newPos.y].piece = promotionStatus.piece;
        tempBoard[prevPos.x][prevPos.y].piece = null;
        if (animationState) {
          let updateAllValidMovesObject = updateAllValidMoves(
            tempBoard,
            currentPlayer
          );
          tempBoardRef.current = updateAllValidMovesObject.tempBoard;
          tempGraveyardRef.current = tempGraveyard;
          setAnimationState({
            prevPos: prevPos,
            newPos: newPos,
            moveforward: true,
            checkState: updateAllValidMovesObject.tempGameState,
          });
          setMoveNavigationPointer(moveNavigationPointer + 1);
          return;
        }
      }
      if (animationState) {
        let updateAllValidMovesObject = updateAllValidMoves(
          tempBoard,
          currentPlayer
        );
        tempBoardRef.current = updateAllValidMovesObject.tempBoard;
        tempGraveyardRef.current = tempGraveyard;
        setAnimationState({
          prevPos: prevPos,
          newPos: newPos,
          moveforward: true,
          checkState: updateAllValidMovesObject.tempGameState,
        });
        setMoveNavigationPointer(moveNavigationPointer + 1);
        return;
      }
      let updateAllValidMovesObject = updateAllValidMoves(
        tempBoard,
        currentPlayer
      );
      setStatesAfterUpdateValidMoves(updateAllValidMovesObject.tempBoard);
      if (tempGraveyard) setGraveYard(tempGraveyard);
      setCurrentPlayer(currentPlayer === "white" ? "black" : "white");
      setMoveNavigationPointer(moveNavigationPointer + 1);
    }
  };
  const moveSelectedPosition = (index) => {
    if (promotionEvent) {
      setPromotionEvent(null);
      if (animationState)
        // promotionUndo case only
        setAnimationState({ prevPos: null, newPos: null });
    }
    let tempNavigationIndex = moveNavigationPointer;
    if (index === tempNavigationIndex)
      //already at current index
      return;
    let tempBoard = deepCopyBoard(board);
    let currentColor = currentPlayer;
    let tempGraveyard = deepCopyGraveyard(graveYard);
    while (index !== tempNavigationIndex) {
      currentColor = currentColor === "white" ? "black" : "white";
      let prevPos =
        movesSoFar[tempNavigationIndex + (index > tempNavigationIndex ? 1 : 0)]
          .prevPos;
      let newPos =
        movesSoFar[tempNavigationIndex + (index > tempNavigationIndex ? 1 : 0)]
          .newPos;
      let enPassant =
        movesSoFar[tempNavigationIndex + (index > tempNavigationIndex ? 1 : 0)]
          .capturedPiece;
      let rookMove =
        movesSoFar[tempNavigationIndex + (index > tempNavigationIndex ? 1 : 0)]
          .rookMove;
      let promotionStatus =
        movesSoFar[tempNavigationIndex + (index > tempNavigationIndex ? 1 : 0)]
          .promotionStatus;
      let tempGraveyardval = graveYardUpdate(
        tempGraveyard,
        movesSoFar[tempNavigationIndex + (index > tempNavigationIndex ? 1 : 0)],
        index > tempNavigationIndex ? true : false
      );
      if (tempGraveyardval) tempGraveyard = tempGraveyardval;
      if (index > tempNavigationIndex) {
        tempBoard[prevPos.x][prevPos.y].piece = null;
        tempBoard[newPos.x][newPos.y].piece = prevPos.piece;

        if (enPassant) {
          tempBoard[enPassant.x][enPassant.y].piece = null;
        }
        if (rookMove) {
          tempBoard[rookMove.prevPos.x][rookMove.prevPos.y].piece = null;
          tempBoard[rookMove.newPos.x][rookMove.newPos.y].piece =
            rookMove.prevPos.piece;
        }
        if (promotionStatus) {
          tempBoard[newPos.x][newPos.y].piece = promotionStatus.piece;
          tempBoard[prevPos.x][prevPos.y].piece = null;
        }
        tempNavigationIndex++;
      } else if (index < tempNavigationIndex) {
        tempBoard[prevPos.x][prevPos.y].piece = prevPos.piece;
        tempBoard[newPos.x][newPos.y].piece = newPos.piece;
        if (enPassant) {
          tempBoard[enPassant.x][enPassant.y].piece = enPassant.piece;
        }

        if (rookMove) {
          tempBoard[rookMove.prevPos.x][rookMove.prevPos.y].piece =
            rookMove.prevPos.piece;
          tempBoard[rookMove.newPos.x][rookMove.newPos.y].piece =
            rookMove.newPos.piece;
        }
        tempNavigationIndex--;
      }
    }
    setGraveYard(tempGraveyard);
    let updateAllValidMovesObject = updateAllValidMoves(
      tempBoard,
      currentColor === "white" ? "black" : "white"
    );
    setStatesAfterUpdateValidMoves(updateAllValidMovesObject.tempBoard);
    setCurrentPlayer(currentColor);
    setMoveNavigationPointer(index);
  };

  const undoLatestMove = () => {
    if (
      movesSoFar &&
      movesSoFar.length > 0 &&
      moveNavigationPointer === movesSoFar.length - 1
    ) {
      let undoLatestMoveObject = {};
      if (movesSoFar[movesSoFar.length - 1].rookMove) {
        //castling case
        undoLatestMoveObject.castleCase = true;
      } else if (
        movesSoFar[movesSoFar.length - 1].prevPos.piece instanceof King ||
        movesSoFar[movesSoFar.length - 1].prevPos.piece instanceof Rook
      ) {
        if (
          movesSoFar[movesSoFar.length - 1].prevPos.piece.hasBeenMoved ===
          movesSoFar.length - 1
        ) {
          undoLatestMoveObject.kingRookMoved = true;
        }
      }
      if (movesSoFar.length >= 2) {
        let prevPos = movesSoFar[movesSoFar.length - 2].prevPos;
        let newPos = movesSoFar[movesSoFar.length - 2].newPos;
        if (
          prevPos.piece instanceof Pawn &&
          prevPos.piece.checkDoubleMove(
            prevPos.x,
            prevPos.y,
            newPos.x,
            newPos.y
          )
        ) {
          if (
            board[newPos.x][newPos.y].piece instanceof Pawn &&
            board[newPos.x][newPos.y].piece.color === currentPlayer
          ) {
            undoLatestMoveObject.doubleMovePawn = { x: newPos.x, y: newPos.y }; // set enPassantFlag which might have been set as false to true
          }
        }
      }
      moveNavigationBackward(undoLatestMoveObject);
      setMovesSoFar(movesSoFar.slice(0, -1));
    }
  };

  const numericalToChessNotation = (row, col) => {
    const colLetter = String.fromCharCode("a".charCodeAt(0) + col);
    const rowNumber = 8 - row;
    return colLetter + rowNumber;
  };

  const processMovesToChessNotation = (movesList) => {
    return movesList.map(
      (ele) =>
        (ele.rookMove
          ? ele.prevPos.y - ele.newPos.y > 0
            ? "O-O-O"
            : "O-O"
          : `${getPieceName(ele.prevPos.piece)}${
              ele.disambiguatedMove ? ele.disambiguatedMove : ""
            }${
              ele.newPos.piece || ele.capturedPiece ? "x" : ""
            }${numericalToChessNotation(ele.newPos.x, ele.newPos.y)}${
              ele.promotionStatus
                ? "=" + getPieceName(ele.promotionStatus.piece)
                : ""
            }`) +
        `${
          ele.checkState === "check"
            ? "+"
            : ele.checkState === "checkmate"
            ? "#"
            : ""
        }`
    );
  };

  const getGameStateText = () => {
    if (movesSoFar) {
      if (
        movesSoFar.length > 0 &&
        movesSoFar[movesSoFar.length - 1].checkState === "checkmate"
      ) {
        let numericalNotation = movesSoFar.length % 2 === 0 ? "0-1" : "1-0";
        return {
          numericalNotation: numericalNotation,
          comment: `Checkmate. ${
            movesSoFar.length % 2 === 0 ? "Black " : "White "
          } is victorious`,
        };
      } else if (
        movesSoFar.length > 0 &&
        movesSoFar[movesSoFar.length - 1].checkState === "stalemate"
      ) {
        return { numericalNotation: "1/2-1/2", comment: "Draw by Stalemate" };
      } else {
        return {
          numericalNotation: null,
          comment: `${
            movesSoFar.length % 2 === 0 ? "White" : "Black"
          }'s turn to play`,
        };
      }
    }
  };

  return (
    <div className="container">
      <MoveList
        moves={movesSoFar && processMovesToChessNotation(movesSoFar)}
        currentMoveIndex={moveNavigationPointer}
        handleMoveClick={moveSelectedPosition}
        handlePrevious={moveNavigationBackward}
        handleNext={moveNavigationForward}
        lastIndex={movesSoFar && movesSoFar.length - 1}
      />
      <BoardComponent
        board={board}
        currentPlayer={currentPlayer}
        promotionEvent={promotionEvent}
        flip={flip}
        selectedPiece={selectedPiece}
        validMovesForSelectedPiece={validMovesForSelectedPiece}
        movesSoFar={movesSoFar}
        moveNavigationPointer={moveNavigationPointer}
        animationState={animationState}
        handleSquareClick={handleSquareClick}
        handlePieceClick={handlePieceClick}
        handleTransitionEnd={handleTransitionEnd}
        promotionalPieces={promotionalPieces}
        handlePromotion={handlePromotion}
      />
      <div className="buttonsControl">
        <button className="flipButton " onClick={() => toggleFlip()}>
          Flip Board
        </button>
        <button
          className={
            "flipButton " +
            (movesSoFar &&
            (moveNavigationPointer === -1 ||
              moveNavigationPointer !== movesSoFar.length - 1)
              ? "disabled "
              : "")
          }
          onClick={() => undoLatestMove()}
        >
          Undo Last Move
        </button>
        <button
          className={"animationButton " + (animationState ? "enabled " : "")}
          onClick={() => toggleAnimation(animationState)}
        >
          Animation
        </button>
      </div>
      <GameStateComponent
        gameObject={getGameStateText()}
        newGameFunction={initialiseGame}
      />
      <AdvantageComponent
        graveYardArray={graveYard && graveYardPieces(graveYard, "white")}
        color={flip ? "white" : "black"}
      />
      <AdvantageComponent
        graveYardArray={graveYard && graveYardPieces(graveYard, "black")}
        color={flip ? "black" : "white"}
      />
    </div>
  );
};

export default ChessGame;
