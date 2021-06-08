export default class SizeManager {
  constructor(drawingBoard) {
    this.widthInput = document.getElementById('width-input');
    this.heightInput = document.getElementById('height-input');
    this.resizeBtn = document.getElementById('resize-btn');
    
    this.drawingBoard = drawingBoard;
    this.widthInput.value = this.drawingBoard.boardColumns;
    this.heightInput.value = this.drawingBoard.boardRows;
  }
}