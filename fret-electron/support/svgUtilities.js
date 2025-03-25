// Copyright © 2025, United States Government, as represented by the Administrator of the National Aeronautics and Space Administration. All rights reserved.
// 
// The “FRET : Formal Requirements Elicitation Tool - Version 3.0” software is licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. 
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
class Arrow {
  constructor(x, y, color="green", circleCount = 0){
    this.x = x;
    this.y = y;
    this.color = color;
    this.circleCount = circleCount;
  }
  getX(){
    return(this.x);
  }
  draw(){
    //circle variables
    //main circle: circle under arrow, second circle: circle before arrow
    var circleRadius = 6;
    var circleDiameter = circleRadius * 2;
    var mainCircleX = (this.circleCount == 2)? this.x + circleDiameter : this.x;
    var secondCircleX = this.x;
    var circleY = this.y;
    var circleString = "";
    switch(this.circleCount){
      case 0:
      break;
      case 2:
        var secondCircle = new Circle(secondCircleX,circleY,circleRadius);
        circleString += "\n" + secondCircle.draw();
      case 1:
        var mainCircle = new Circle(mainCircleX,circleY,circleRadius);
        circleString += "\n" + mainCircle.draw();
      break;
      default: console.log("Unexpected Amount of Circles: Try 0,1, or 2");
      }
    //arrow positions
    var arrowHeight = 30; //estimated
    var arrowX = mainCircleX;
    var arrowY = (this.circleCount == 0)? this.y : this.y - circleRadius;
    arrowY -= arrowHeight; //for bottom alignment
    var arrowSVGString = `
    <marker id="Arrowhead" markerWidth="4" markerHeight="2.67" orient="auto"
      refX="0" refY="1.33" >
    <polygon points="0 0, 2 1.33, 0 2.67" fill="${this.color}"  />
  </marker>
    `
    var arrowLineSVGString = `
    <path d="m ${arrowX} ${arrowY} v15" stroke = "${this.color}" stroke-width = "7" marker-end="url(#Arrowhead)"/>
    `
    return(arrowSVGString + "\n" + arrowLineSVGString + "\n" + circleString);
  }
}

class Circle {
  constructor(x, y, radius, color = "black"){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }
  getX(){
    return(this.x);
  }
  getRadius(){
    return(this.radius);
  }
  draw(){
    var circleSVGString = `
    <circle cx = "${this.x}" cy = "${this.y}" r = "${this.radius}" fill = "${this.color}" />
    `
    return(circleSVGString);
  }
}

class VerticalLine {
  constructor( x, y1, y2, text, textColor = "black", lineColor = "black", lineWidth = 3) {
    this.x = x;
    this.topY = y1;
    this.bottomY = y2;
    this.lineWidth = lineWidth;
    this.lineColor = lineColor;
    this.textBox = new Text(text,20,textColor,"sans-serif","normal",x,y1-15);
  }
  getX(){
    return(this.x);
  }
  draw () {
    this.textBox.setAlignment("middle");
    var lineSVGString = `
    <line x1 = "${this.x}" y1 ="${this.topY}" x2="${this.x}" y2 = "${this.bottomY}" \
    stroke = "${this.lineColor}" stroke-width = "${this.lineWidth}" ></line>`
    return lineSVGString+"\n"+ this.textBox.draw();
  }
}

class Text {
  constructor(text, size = "20", fill = "black", font = "sans-serif", weight = "normal", x=0, y=0) {
    this.x = x; this.y = y; this.txt = text; this.size = size+"px"; this.font = font;
    this.weight = weight; this.fill = fill; this.alignment = 'start';
  }
  setPosition(x,y){
    this.x = x;
    this.y = y;
  }
  textSize(){
    return this.width;
  }

// horizontal alignment
  setAlignment(a){
    this.alignment = a;
  }

  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
  // anchor can be start, middle, end
  draw() {
    var svgText;
    svgText = `<text x = "${this.x}" y="${this.y}" font-family="${this.font}" font-size="${this.size}" \
    font-weight="${this.weight}" text-anchor="${this.alignment}" alignment-baseline="middle" fill="${this.fill}">${this.txt}</text>`
    return svgText
  }
}

class Rectangle {
  // class methods
  constructor(w, h, f='none', b='none', bw ='0', x=0, y=0) {
    this.x = x; this.y = y; this.width = w; this.height = h; this.fill = f; this.border = b;
    this.borderWidth = bw; this.name = null;
  }

  getClass() {return("Rectangle")}

  setPosition(x,y) {this.x = x; this.y = y}


  getH() {return this.height}
  getW() {return this.width}
  getBW() {return this.borderWidth}
  getX() {return this.x}
  getY() {return this.y}
  rightX() {return (this.getX() + this.width)}
  bottomY() {return this.getY() + this.height}
  middleX() {return (this.getX() + this.rightX())/2}
  middleY() {return (this.getY() + this.bottomY())/2}

  // tl = top left; cm = center middle; ml = middle left
  addBoxId(name="M", color="black", position = "tl") {
      var textsize = Math.max(Math.floor((this.width)/8), 17);
      var txt = new Text(name, textsize, color);

      // default for top left tl
      var textX = this.getX()+ 7;
      var textY = this.getY() + textsize;

      if (position == "cm") {
        txt.setAlignment("middle");
        textX = this.middleX();
        textY = this.middleY();
      } 
      else if (position === "ml") {
	textY = textY + 22;
      }

      txt.setPosition(textX, textY)

      this.name = txt;
  }

  draw () {
    var svgText;
    if (this.border == 'none') {
      //svgText = `<rect x = "${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" fill="${this.fill}" />`
      var border = (this.fill.includes("dottedPattern")? "orange" : this.fill)
      svgText = `<rect x ="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" stroke="${border}" stroke-width="${2}" fill="${this.fill} " />`
      }
    else {
      svgText = `<rect x ="${this.x}" y="${this.y}" width="${this.width}" height="${this.height}" stroke="${this.border}" stroke-width="${this.borderWidth}" fill="${this.fill} " />`
    }

    if (this.name) svgText = svgText + "\n" + this.name.draw() + "\n"
    return svgText
  }
}


function placeRight(shape1, shape2, border = 3) {
  shape2.setPosition(shape1.rightX() + border, shape1.getY());
}

function placeBelow(shape1, shape2, border = 3) {
  shape2.setPosition(shape1.getX(), shape1.bottomY() + border)
}

function placeMiddle(shape1, shape2, border = 3) {
  shape2.setPosition(shape1.middleX()+ border, shape1.middleY() + border)
}



module.exports = {Rectangle, Text, VerticalLine, placeRight, placeBelow, placeMiddle, Circle,Arrow}
