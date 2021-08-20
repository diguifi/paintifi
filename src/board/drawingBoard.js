import ToolBox from '../tools/toolBox.js'
import SizeManager from './sizeManager.js'

export default class DrawingBoard {
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
    this.sizeManager = new SizeManager(this);
  }
  
  initDrawingMatrix() {
    this.drawingMatrix.splice(0, this.drawingMatrix.length);
    for(let i=0; i < this.boardRows; i++) {
      this.drawingMatrix.push([]);
      for(let j=0; j < this.boardColumns; j++) {
        this.drawingMatrix[i][j] = 0;
      }
    }
  }

  redrawDrawingMatrix() {
    for (let i=0; i < this.boardRows; i++) {
      for (let j=0; j < this.boardColumns; j++) {
        this.paintPixel(j,i,this.drawingMatrix[i][j]);
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

  getRealSizeCanvas() {
    const realCanvas = document.createElement('canvas');
    realCanvas.id = 'canvas-real';
    realCanvas.width = this.boardColumns;
    realCanvas.height = this.boardRows;
    const realCtx = realCanvas.getContext('2d');
    realCtx.canvas.width  = this.boardColumns;
    realCtx.canvas.height = this.boardRows;

    for(let i=0; i < this.boardRows; i++) {
      for(let j=0; j < this.boardColumns; j++) {
        if (this.drawingMatrix[i][j] === 0) {
          realCtx.globalCompositeOperation = 'destination-out';
        } else {
          realCtx.globalCompositeOperation = 'source-over';
        }

        realCtx.beginPath();
        realCtx.rect(j,i,1,1);
        realCtx.fillStyle = this.drawingMatrix[i][j];
        realCtx.fill();
      }
    }

    return realCanvas;
  }

  resizeArt(width, height) {
    this.boardColumns = height;
    this.boardRows = width;
    this.toolBox.undoredo.resetActions();
    this.resizeCanvas(this.width, this.height);
    this.initDrawingMatrix();
  }

  resizeEditor(maxWidth) {
    const newWidth = maxWidth - (maxWidth % this.boardColumns);
    const multiplier = newWidth/this.boardColumns;
    const newHeight = this.boardRows * multiplier;
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    const maxVh = Math.floor(vh - (vh * 0.1))
    if (newHeight > maxVh && maxWidth != this.sizeManager.minEditorWidth) {
      this.resizeEditor(this.sizeManager.minEditorWidth)
    } else {
      this.resizeCanvas(newWidth, newHeight);
      this.redrawDrawingMatrix();
    }
  }

  resizeCanvas(w, h) {
    this.width = w;
    this.height = h;
    this.ctx.canvas.width  = this.width;
    this.ctx.canvas.height = this.height;
    this.cellWidth = this.width/this.boardColumns;
    this.cellHeight = this.height/this.boardRows;
  }
}