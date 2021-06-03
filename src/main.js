class UndoRedo {
  constructor(drawingBoard) {
    document.onkeydown = (e) => this.checkAction(e);
    document.getElementById('canvas-undoredo').onmouseup = () => this.saveState();
    document.getElementById('canvas-undoredo').ontouchend = () => this.saveState();
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
}

class LinePencil {
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

class Eraser {
  constructor(drawingBoard) {
    this.drawingBoard = drawingBoard;
  }
  
  draw(x,y) {    
    let color = 0;
    this.drawingBoard.erasing = true;
    this.drawingBoard.paintPixel(x,y,color);
  }
}

class Pencil {
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

class Bucket {
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

class ToolBox {
  constructor(drawingBoard) {
    this.colorPicker = document.getElementById('color-picker');
    this.bucketBtn = document.getElementById('bucket-btn');
    this.bucketBtn.onclick = this.bucketClick.bind(this);
    this.pencilBtn = document.getElementById('pencil-btn');
    this.pencilBtn.onclick = this.pencilClick.bind(this);
    this.lineBtn = document.getElementById('line-btn');
    this.lineBtn.onclick = this.lineClick.bind(this);
    this.eraserBtn = document.getElementById('eraser-btn');
    this.eraserBtn.onclick = this.eraserClick.bind(this);
    this.downloadBtn = document.getElementById('download-btn');
    this.downloadBtn.onclick = this.downloadClick.bind(this);
    
    this.undoredo = new UndoRedo(drawingBoard);
    this.bucket = new Bucket(drawingBoard);
    this.pencil = new Pencil(drawingBoard);
    this.line = new LinePencil(drawingBoard);
    this.eraser = new Eraser(drawingBoard);
    this.pencilClick();
  }
  
  enableAllButtons() {
    this.bucketBtn.disabled = false;
    this.pencilBtn.disabled = false;
    this.lineBtn.disabled = false;
    this.eraserBtn.disabled = false;
  }
  
  bucketClick() {
    this.toolSelected = this.bucket;
    this.enableAllButtons();
    this.bucketBtn.disabled = true;
  }
  
  pencilClick() {
    this.toolSelected = this.pencil;
    this.enableAllButtons();
    this.pencilBtn.disabled = true;
  }
  
  lineClick() {
    this.toolSelected = this.line;
    this.enableAllButtons();
    this.lineBtn.disabled = true;
  }
  
  eraserClick() {
    this.toolSelected = this.eraser;
    this.enableAllButtons();
    this.eraserBtn.disabled = true;
  }
  
  downloadClick() {
    const link = document.createElement('a');
    link.download = 'pixel_art.png';
    link.href = document.getElementById('canvas').toDataURL();
    link.click();
  }
}

class DrawingBoard {
  constructor(configs) {
    this.c = document.getElementById('canvas');
    this.c.onmousemove = this.mouseMove.bind(this);
    this.c.onmousedown = this.mouseClick.bind(this);
    this.c.onmouseup = this.mouseClick.bind(this);
    this.c.ontouchmove = this.mouseMove.bind(this);
    this.c.ontouchstart = this.mouseClick.bind(this);
    this.c.ontouchend = this.mouseClick.bind(this);
    this.c.oncontextmenu = (e) => {return false;};
    this.ctx = this.c.getContext('2d');
    this.width = configs.width;
    this.height = configs.height;
    this.boardRows = configs.boardRows;
    this.boardColumns = configs.boardColumns;
    this.ctx.canvas.width  = this.width;
    this.ctx.canvas.height = this.height;
    this.cellWidth = this.width/this.boardRows;
    this.cellHeight = this.height/this.boardColumns;
    this.drawing = false;
    this.erasing = false;
    document.body.addEventListener('touchmove', (e) => { 
      e.preventDefault();
    }, { passive: false });
    
    this.x = -1;
    this.y = -1
    this.drawingMatrix = [];
    this.initDrawingMatrix();
    this.toolBox = new ToolBox(this);
  }
  
  initDrawingMatrix() {
    for(let i=0; i < this.boardRows; i++) {
      this.drawingMatrix.push([]);
      for(let j=0; j < this.boardColumns; j++) {
        this.drawingMatrix[i][j] = 0;
      }
    }
  }
  
  mouseMove(e) {
    e = e || window.event;
    let pos = this.getOffset(e);
    
    if (this.drawing || this.erasing) {
      this.draw(pos.x, pos.y);
    }
  }
  
  mouseClick(e) {
    e = e || window.event;
  
    let pos = this.getOffset(e);
  
    if (e.type === 'mousedown' || e.type === 'touchstart' || e.type === 'touchmove') {
      if (e.type === 'mousedown') {
        if (e.button == 0) {
          this.drawing = true;
          this.erasing = false;
        } else if (e.button == 2) {
          this.erasing = true;
          this.drawing = false;
        }
      } else {
        this.drawing = true;
        this.erasing = false;
      }
            
        this.draw(pos.x, pos.y);
      } else {
        this.x = -1;
        this.y = -1;
        this.drawing = false;
        this.erasing = false;
      }
  }
  
  getOffset(e) {
    let clientX = 0;
    let clientY = 0;
    if (e.touches) {
      if (e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
      
    let target = e.target || e.srcElement,
      rect = target.getBoundingClientRect(),
      offsetX = (clientX - rect.left),
      offsetY = (clientY - rect.top);
  
    return { x: (offsetX | 0), y: (offsetY | 0) };
  }
  
  reset() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  
  draw(rawX,rawY) {
    const x = Math.floor(rawX/this.cellWidth);
    const y = Math.floor(rawY/this.cellHeight);
    if (x == this.x && y == this.y) { return; }

    this.x = x;
    this.y = y;
    this.toolBox.toolSelected.draw(x,y);
  }
  
  paintPixel(x,y,color,preview=false) {
    if (color === 0) {
      this.ctx.globalCompositeOperation = 'destination-out';
      color = 0;
    } else {
      this.ctx.globalCompositeOperation = 'source-over';
    }
    
    this.ctx.beginPath();
    this.ctx.rect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    
    if (!preview) {
      this.drawingMatrix[y][x] = color;
    }
  }
}

const configs = {
  width: 500,
  height: 500,
  boardRows: 25,
  boardColumns: 25
};

const paint = new DrawingBoard(configs);