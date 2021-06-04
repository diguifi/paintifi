import Bucket from './bucket.js';
import Eraser from './eraser.js';
import Pencil from './pencil.js';
import LinePencil from './linePencil.js';
import UndoRedo from './undoRedo.js';

export default class ToolBox {
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