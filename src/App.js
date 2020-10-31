import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import originalImage from './images/original_image.jpg';
import './App.css';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('./images', false, /\.(png|jpg|svg)$/));

class App extends Component {
  constructor() {
    super()
    this.state = {
      pieces: [],
      shuffled: [],
      solved: []
    };
  }

  componentDidMount() {
    const pieces = [...Array(9)]
      .map((_, i) => (
        {
          img: images[i]['default'],
          order: i,
          board: 'shuffled'
        }
      ));

    this.setState({
      pieces,
      shuffled: this.shufflePieces(pieces),
      solved: [...Array(9)]
    });
  }

  handleDrop(e, index, targetName) {
    let target = this.state[targetName];
    if (target[index]) return;

    const pieceOrder = e.dataTransfer.getData('text');
    const pieceData = this.state.pieces.find(p => p.order === +pieceOrder);
    const origin = this.state[pieceData.board];

    if (targetName === pieceData.board) target = origin;
    origin[origin.indexOf(pieceData)] = undefined;
    target[index] = pieceData;
    pieceData.board = targetName;

    this.setState({ [pieceData.board]: origin, [targetName]: target })
  }

  handleDragStart(e, order) {
    const dt = e.dataTransfer;
    dt.setData('text/plain', order);
    dt.effectAllowed = 'move';
  }
  shufflePieces(pieces) {
    const shuffled = [...pieces];

    for (let i = shuffled.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tmp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = tmp;
    }

    return shuffled;
  }
  renderPieceContainer(piece, index, boardName) {
    console.log('images',this.state.solved)
    return (
      <li
        key={index}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => this.handleDrop(e, index, boardName)}>
        {
          piece && <img
            draggable
            onDragStart={(e) => this.handleDragStart(e, piece.order)}
            src={piece.img}/>
        }
    
      </li>
    );
  }

  render() {
  
    return (

      <div className="App" style={{display:'flex'}}>
        <ul className="App__shuffled-board">
          {this.state.shuffled.map((piece, i) => this.renderPieceContainer(piece, i, 'shuffled'))}
        </ul>
        
        <ol className="App__solved-board" style={{ backgroundImage: `url(${originalImage})` }}>
          {this.state.solved.map((piece, i) => this.renderPieceContainer(piece, i, 'solved'))}
        </ol>
      </div>
    );
  }
}

export default App;
