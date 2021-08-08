export default class SizeManager {
  constructor(drawingBoard) {
    this.widthInput = document.getElementById('width-input');
    this.heightInput = document.getElementById('height-input');
    this.resizeBtn = document.getElementById('resize-btn');
    this.resizeBtn.onclick = this.resizeArt.bind(this);
    this.middleColEl = document.getElementById('middle');
    this.bodyEl = document.getElementById('body');
    this.bodyEl.onresize = () => this.resizedScreen();
    
    this.drawingBoard = drawingBoard;
    this.widthInput.value = this.drawingBoard.boardColumns;
    this.heightInput.value = this.drawingBoard.boardRows;
    this.resizedScreen();
  }

  resizedScreen(force = false) {
    if (this.middleColEl.offsetWidth <= 550 && (this.drawingBoard.width > 250 || force)) {
      this.drawingBoard.resizeEditor(250);
    }
    if (this.middleColEl.offsetWidth > 550 && (this.drawingBoard.width <= 250 || force)){
      this.drawingBoard.resizeEditor(500);
    }
  }

  resizeArt() {
    this.drawingBoard.resizeArt(+this.widthInput.value, +this.heightInput.value);
    this.resizedScreen(true);
  }
}