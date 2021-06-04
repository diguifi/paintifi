export default class Eraser {
  constructor(drawingBoard) {
    this.drawingBoard = drawingBoard;
  }
  
  draw(x,y) {    
    let color = 0;
    this.drawingBoard.erasing = true;
    this.drawingBoard.paintPixel(x,y,color);
  }
}