export default class Bucket {
  constructor(drawingBoard) {
    this.drawingBoard = drawingBoard;
  }
  
  draw(x,y) {
    let color = this.drawingBoard.toolBox.colorPicker.value;
    let targetColor = this.drawingBoard.drawingMatrix[y][x];
    
    if (this.drawingBoard.erasing) {
      if (targetColor === 0) { return; }
      color = 0;
    } else {
      if (color === targetColor) { return; }
    }
    
    this.floodFill(x,y,targetColor,color);
  }
  
  floodFill(x,y,targetColor,colorOver) {
    if (y < 0) { return; }
    if (y >= this.drawingBoard.boardRows) { return; }
    if (x < 0) { return; }
    if (x >= this.drawingBoard.boardColumns) { return; }
    if (this.drawingBoard.drawingMatrix[y][x] !== targetColor) { return; }
    
    this.drawingBoard.paintPixel(x,y,colorOver);
    this.floodFill(x+1,y,targetColor,colorOver);
    this.floodFill(x-1,y,targetColor,colorOver);
    this.floodFill(x,y+1,targetColor,colorOver);
    this.floodFill(x,y-1,targetColor,colorOver);
  }
}