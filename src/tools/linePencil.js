export default class LinePencil {
  constructor(drawingBoard) {
    document.getElementById('canvas-linetool').onmouseup = this.drawEndPoint.bind(this);
    document.getElementById('canvas-linetool').ontouchend = this.drawEndPoint.bind(this);
    this.drawingBoard = drawingBoard;
    this.startPoint = [];
    this.currentPoint = [];
    this.previewMatrix = this.getCloneOfMatrix(this.drawingBoard.drawingMatrix);
    this.started = false;
  }
  
  getCloneOfMatrix(matrix) {
    return matrix.map((arr) => {
      return arr.slice();
    });
  }
  
  drawEndPoint() {
    if (this.started) {
      this.started = false;
      this.repaintCanvas();
    }
  }
  
  calculatePoints(x,y) {
    const x0 = this.startPoint[0]
    const y0 = this.startPoint[1];
    const x1 = x;
    const y1 = y;
    const dx = x1-x0;
    const dy = y1-y0;
    
    if (Math.abs(y1 - y0) < Math.abs(x1 - x0)) {
      if (x0 > x1)
        return this.plotLineLow(x1, y1, x0, y0);
      else
        return this.plotLineLow(x0, y0, x1, y1);
    } else {
      if (y0 > y1)
        return this.plotLineHigh(x1, y1, x0, y0)
      else
        return this.plotLineHigh(x0, y0, x1, y1)
    }
  }
  
  plotLineLow(x0, y0, x1, y1) {
    let points = [];
    let dx = x1 - x0;
    let dy = y1 - y0;
    let yi = 1;
    
    if (dy < 0) {
      yi = -1;
      dy = dy * (-1);
    }
    
    let D = (2 * dy) - dx;
    let yres = y0;
    
    for (let i = x0; i < x1; i++) {
      const xres = i;
      points.push([xres, yres]);
      if (D > 0) {
        yres = yres + yi;
        D = D + (2 * (dy - dx));
      } else {
        D = D + 2*dy;
      }  
    }
    
    const hasStartingPoint = this.pointsContainPoint(points, [x0,y0]);
    const hasCurrentPoint = this.pointsContainPoint(points, [x1,y1]);
    if (!hasStartingPoint)
      points.push([x0,y0]);
    if (!hasCurrentPoint)
      points.push([x1,y1]);
    
    return points;
  }
  
  plotLineHigh(x0, y0, x1, y1) {
    let points = [];
    let dx = x1 - x0;
    let dy = y1 - y0;
    let xi = 1;
    
    if (dx < 0) {
      xi = -1;
      dx = dx * (-1);
    }
    
    let D = (2 * dx) - dy;
    let xres = x0;
    
    for (let i = y0; i < y1; i++) {
      const yres = i;
      points.push([xres, yres]);
      if (D > 0) {
        xres = xres + xi;
        D = D + (2 * (dx - dy));
      } else {
        D = D + 2*dx;
      }  
    }
    
    const hasStartingPoint = this.pointsContainPoint(points, [x0,y0]);
    const hasCurrentPoint = this.pointsContainPoint(points, [x1,y1]);
    if (!hasStartingPoint)
      points.push([x0,y0]);
    if (!hasCurrentPoint)
      points.push([x1,y1]);
    
    return points;
  }
  
  pointsContainPoint(points, testPoint) {
    return points.some((pointArr) => {
      pointArr[0] == testPoint[0] && pointArr[1] == testPoint[1]
    });
  }
  
  showPreview() {
    this.repaintCanvas(true);
  }
  
  repaintCanvas(preview = false) {
    for (let i=0; i<this.drawingBoard.boardColumns; i++) {
      for (let j=0; j<this.drawingBoard.boardRows; j++) {
        this.drawingBoard.paintPixel(i,j,this.previewMatrix[j][i],preview);
      }
    }
  }
  
  draw(x,y) {
    if (!this.started) {
      this.started = true;
      this.startPoint = [x,y];
    }
    this.previewMatrix = this.getCloneOfMatrix(this.drawingBoard.drawingMatrix);
    let color = this.drawingBoard.toolBox.colorPicker.value;
    
    const points = this.calculatePoints(x,y);
    for (const point of points) {
      this.previewMatrix[point[1]][point[0]] = color;
    }
    this.showPreview();
  }
}