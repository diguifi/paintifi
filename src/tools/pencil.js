export default class Pencil {
  constructor(drawingBoard) {
    this.drawingBoard = drawingBoard;
  }
  
  draw(x,y) {    
    let color = this.drawingBoard.toolBox.colorPicker.value;
    
    if (this.drawingBoard.erasing) {
      color = 0;
    }
    
    this.drawingBoard.paintPixel(x,y,color);
  }
}