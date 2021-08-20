export default class UndoRedo {
  constructor(drawingBoard) {
    document.onkeydown = (e) => this.checkAction(e);
    document.getElementById('canvas-undoredo').onmouseup = () => this.saveState();
    document.getElementById('canvas-undoredo').ontouchend = () => this.saveState();
    document.getElementById('undo-btn').onclick = () => this.undo();
    document.getElementById('redo-btn').onclick = () => this.redo();
    this.drawingBoard = drawingBoard;
    this.actions = [];
    this.index = 0;
    this.saveState();
  }
  
  checkAction(e) {
    if ((e.ctrlKey && e.keyCode == 89) || (e.ctrlKey && e.shiftKey && e.keyCode == 90)) {
      this.redo();
      return;
    }
    if (e.ctrlKey && e.keyCode == 90) {
      this.undo();
      return;
    }
  }
  
  saveState() {
    this.actions.splice(this.index, this.actions.length);
    const copyOfMatrix = this.getCloneOfMatrix();
    this.actions.push(copyOfMatrix);
    this.index = this.actions.length;
  }
  
  getCloneOfMatrix() {
    return this.drawingBoard.drawingMatrix.map((arr) => {
      return arr.slice();
    });
  }
  
  undo() {
    if (this.index - 2 >= 0) {
      this.index -= 1;
      this.drawDrawingMatrixState(this.actions[this.index-1]);
    }
  }
  
  redo() {
    if (this.index + 1 <= this.actions.length) {
      this.index += 1;
      this.drawDrawingMatrixState(this.actions[this.index-1]);
    }
  }
  
  drawDrawingMatrixState(drawingMatrixState) {    
    for (let i = 0; i < this.drawingBoard.boardRows; i++) {
      for (let j = 0; j < this.drawingBoard.boardColumns; j++) {
        this.drawingBoard.paintPixel(i,j,drawingMatrixState[j][i]);
      }
    }
  }

  resetActions() {
    this.actions.splice(0, this.actions.length);
    this.index = 0;
  }
}