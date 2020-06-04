import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// 官方文档：https://react.docschina.org/tutorial/tutorial.html
// 进阶参考：https://blog.csdn.net/xxdesky/article/details/103427340

function Square(props) {
  let winnerClassName = null;
  if (props.winnerResult) {
    winnerClassName =
      props.winnerResult.winner &&
      props.winnerResult.winnerNumbers.some((number) => number === props.index)
        ? 'red'
        : null;
  }
  return (
    <button key={props.index} className="square" onClick={props.onClick}>
      <span className={winnerClassName}>{props.value}</span>
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        index={i}
        winnerResult={this.props.winnerResult}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let boardRows = [];
    for (let squareCount = 0; squareCount < 9; squareCount += 3) {
      let squares = [];
      for (
        let squareIndex = squareCount;
        squareIndex < squareCount + 3;
        squareIndex++
      ) {
        squares.push(this.renderSquare(squareIndex));
      }
      boardRows.push(
        <div key={squareCount} className="board-row">
          {squares}
        </div>,
      );
    }

    return <div>{boardRows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      asc: true,
      clickedNumbers: [],
      stepNumber: 0,
      xIsNext: true,
      winnerResult: null,
    };
  }

  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return {
          winner: squares[a],
          winnerNumbers: lines[i],
        };
      }
    }
    return null;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winnerResult = this.calculateWinner(squares);
    if (winnerResult || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      clickedNumbers: this.state.clickedNumbers.concat(i),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winnerResult: winnerResult,
    });
  }

  jumpTo(step) {
    const history = this.state.history.slice();
    const current = history[step];
    const winnerResult = this.calculateWinner(current.squares);
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      winnerResult: winnerResult,
    });
  }

  sort() {
    this.setState({
      asc: !this.state.asc,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerResult = this.calculateWinner(current.squares);

    const coordinates = [
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
      [2, 2],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';
      let coordinate;
      if (this.state.clickedNumbers.length && move) {
        coordinate = `(${coordinates[this.state.clickedNumbers[move - 1]].join(
          ', ',
        )})`;
      }
      let className = this.state.stepNumber === move ? 'bold' : null;
      return (
        <li key={move} className={className}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
          &nbsp;{coordinate}
        </li>
      );
    });

    let status;
    if (winnerResult) {
      status = 'Winner：' + winnerResult.winner;
    } else if (this.state.stepNumber !== 9) {
      status = `Next player：${this.state.xIsNext ? 'X' : 'O'}`;
    } else if (this.state.stepNumber === 9) {
      status = 'Draw';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winnerResult={winnerResult}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.asc ? moves : moves.reverse()}</ol>
        </div>
        <div>
          <button onClick={() => this.sort()}>sort</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
