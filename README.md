# chess-project-react

This project is basically a simple implementation for a chess game in ReactJS. Project has been deployed on : https://arjunmanathara.github.io/react-chess-project/

# Features

- Responsive web design
- Implementing the functionalities of a chess game and all the functionalities of the pieces including special moves such as en passant and castling
- Highlighting of valid moves on piece click
- Checking for check, checkmate, Stalemate conditions and if found, showing New Game option
- There is a move list component which keeps track of the moves and follows the chess notation. The functionality to browse through previously played moves is implemented
- Keeping track of lost material and showing net piece advantage
- Options for Flip Board, Undo Last Move and Animation are available

# Features that are not implemented

- Timing features such as fixing time controls and increment for each player
- There is no session management and ability for two players to play on different computers
- Some conditions such as checking of Draw by threefold repetition and Insufficient material have not been implemented
- Saving and importing move lists as chess notation has not been implemented

# How to install and run the app on your local computer

- Clone the app and use the `cd` command to navigate to the folder
- Open the terminal and run `npm install` to install dependencies
- Finally run the `npm start` command to launch the app on local

# Disclaimers

- The SVG images for the pieces have been sourced from Wikimedia : https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces
- The chess board image used and interactive features are built using Lichess as a model. Lichess : https://lichess.org/
