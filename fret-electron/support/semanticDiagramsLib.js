const {Rectangle,Text, placeRight, placeBelow, placeMiddle, createMode,VerticalLine,Circle,Arrow} = require('./svgUtilities')
const fs = require('fs');
const M = {width:135, height: 65, x: 200, bw: 4}
const condShiftSimple = 30;
const condShiftExtended = 160;
const durationBoxLength = 60;
const DottedPattern = `
      <pattern id="dottedPattern"
       x="10" y="9" width="10" height="10" patternUnits="userSpaceOnUse" >
       <!-- start pattern-->
       <circle cx="6" cy="6" r="3" style="stroke: none; fill: orange" />
       <!-- end pattern -->
       </pattern>`

function fillDottedPattern() {
  return "url(#dottedPattern)"
}

//for each of the timings: [0] -> color if scope is not an only scope, [1] -> color if scope is an only scope
//[2] -> length of the box (true = short box, false = long box)
const timings = new Map([
  ["always",["green",fillDottedPattern(),false]],
  ["eventually",["orange","red",false]],
  ["never",["red","orange",false]],
  ["for",["green",fillDottedPattern(),true]],
  ["within",["orange","red",true]],
  ["before",["orange","red",false]],
  ["until",["green",fillDottedPattern(),false]],
  ["null",["orange","red",false]],
  ["immediately",["green","red",false]],
  ["next",["green","red",false]],
  ["after",["red","orange",true]]]);

function setTimeline(startx, endx, y, lineWidth=3) {return(`
  <path d="M ${startx} ${y} h ${endx}" stroke="#000" stroke-width="${lineWidth}" fill="none"/>`
  + "\n" + // arrow
  `<path d="M ${endx} ${y} l -14.26 4.64v -9.28z" stroke="#000" stroke-width="0"/>`)}


class Canvas {
  // class methods
  constructor(w=500, h=160) {this.width = w; this.height = h; this.timeLineLength = 300;
    this.timeLineWidth = 3; this.topLayer = []; this.standardLayer = []}
  getTimelineYPos() {return (this.height-30)}
  getTimelineStartX() {return 10}
  getTimelineEndX() {return (this.width)}
  getTimelineWidth(){return (this.timeLineWidth)};
  defineTimeline() {return setTimeline(this.getTimelineStartX(), this.getTimelineEndX(),
                        this.getTimelineYPos(), this.timeLineWidth)}

  addDiagram(diagram, top=false) {
    if (top)
      this.topLayer.push(diagram);
    else {
      this.standardLayer.push(diagram);
    }
  }

  save(name) {
    var headerText = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${this.width}px" height="${this.height}px">`
    

    // defines the dotted pattern
    headerText = headerText + DottedPattern + "\n\n"


    // first standard layer
    for (var d of this.standardLayer) {
      headerText = headerText + d.draw() + '\n'
    }

    // then top layer
    for (var d of this.topLayer) {
      headerText = headerText + d.draw() + '\n'
    }

    // now timeline
    headerText = headerText + this.defineTimeline() + '\n';

    // now close
    headerText = headerText + '\n' + '</svg>'
    fs.writeFileSync(name, headerText, function(err) {
      if(err) {
        return console.log(err);
      }
    })

  }
}

class semanticDiagram{
  constructor(scope,condition,timing,response="satisfaction"){
    this.scope = scope;
    this.condition = condition;
    this.timing = timing;
    this.response = response;
    this.mode = {};
    this.scopes = [];
    this.canvas = new Canvas();
    this.verticalLineTopY = this.canvas.getTimelineYPos()-M.height - 25;
    this.verticalLineBottomY = this.canvas.getTimelineYPos()+25;
  }
  //add mode box if needed
  addMode(width, height, x, bw) {
    var rect = new Rectangle(width, height, 'none','black',bw);
    rect.setPosition(x, this.canvas.getTimelineYPos()-height)
    rect.addBoxId();
    this.canvas.addDiagram(rect, true);
    this.mode = rect;
  }
  /**
  * adds a scope box between two points
  * @param  {string}  point1     explain what it is
  * @return nothing
  */
  addScopeBetween(point1, point2, color = '#D5DBDB', height = M.height) {
    var width = point2 - point1;
    var sc = new Rectangle(width, height, color);
    sc.setPosition(point1, this.canvas.getTimelineYPos() - height);
    this.canvas.addDiagram(sc);
    this.scopes.push({scope:sc, trigger:null, stopCond: null});
  }

  timingRect(color,scopeObj,isShort=false){
    var conditionLine = scopeObj.trigger;
    var stopCondition = scopeObj.stopCond;
    var scope = scopeObj.scope;
    var start = (conditionLine)? conditionLine.getX() : scope.getX();
    var end = (stopCondition)? stopCondition.getX() : scope.rightX();
    var rectW = (isShort)? durationBoxLength : end-start;
    var rectH = scope.getH()/3;
    var rectYPos = scope.bottomY()-rectH;
    var rect = new Rectangle(rectW,rectH,color,'none',0,start,rectYPos);
    if(isShort) rect.addBoxId("n","black","cm");
    return(rect);
  }

  makeTimingArrow(x,y,color,circleCount=0){
    var arrow = new Arrow(x, y, color, circleCount);
    this.canvas.addDiagram(arrow,true);
  }

  createTiming(timing, sc){
    if(timing == "before" || timing == "until"){this.addCondition("stopCond","all")}

    var searchScope = this.scope;
    var isOnlyScope = searchScope.startsWith("only");
    var color = (isOnlyScope)? timings.get(timing)[1] : timings.get(timing)[0];
    var arrowColor = (isOnlyScope)? "red" : "green";
    var isShort = timings.get(timing)[2];
    var arrow = undefined;
    var arrowXPos = (this.condition == "regular")? sc.trigger.getX() : sc.scope.getX();
    var arrowYPos = this.canvas.getTimelineYPos();
    var rectangle = this.timingRect(color,sc,isShort);

    switch(timing){
      case "immediately":
          arrow = this.makeTimingArrow(arrowXPos,arrowYPos,arrowColor,1);
        break;
      case "next":
          arrow = this.makeTimingArrow(arrowXPos,arrowYPos,arrowColor,2);
        break;
      case "after":
          arrowYPos = (isOnlyScope == true)? arrowYPos-rectangle.getH() : arrowYPos;
          arrowXPos = rectangle.rightX();
          arrow = this.makeTimingArrow(arrowXPos,arrowYPos,arrowColor,2);
          //or text:
          var orText = new Text("OR","13","black","sans-serif","normal",arrowXPos-13,arrowYPos-10);
          orText.setAlignment("middle");
          //we only want the "or" text if the scope is an only scope
          if(isOnlyScope){this.canvas.addDiagram(orText,true)}
          this.canvas.addDiagram(rectangle);
        break;
      default: this.canvas.addDiagram(rectangle);
    }
    return (arrow);
}

  //whereInScope values can be:   1. first     2. last     3. all
  addCondition(type,whereInScope="first") {
    var line = null;
    var name = (type == "trigger")? "TC" : "SC";
    switch(whereInScope){
      case "first":
        line = new VerticalLine(this.scopes[0].scope.getX()+this.condShift(type),
                                         this.verticalLineTopY,this.verticalLineBottomY,name);
        this.canvas.addDiagram(line,true);
        this.scopes[0][type] = line;
      break;
      case "last":
        line = new VerticalLine(this.scopes.scope[this.scopes.length-1]+this.condShift(type),
                                        this.verticalLineTopY, this.verticalLineBottomY,name);
        this.canvas.addDiagram(line, true);
        this.scopes[0][type] = line;
      break;
      case "all":
      for(var sc of this.scopes){
        line = new VerticalLine(sc.scope.getX()+this.condShift(type),
                                         this.verticalLineTopY,this.verticalLineBottomY,name);
        this.canvas.addDiagram(line,true);
        sc[type] = line;
      }
      break;
      default: console.log("Unexpected Trigger Position");
  }
}

  condShift(type){
    var condDist = condShiftSimple;
    if(this.scope == "null"){
      condDist = condShiftExtended;
    }
    if(type=="stopCond"){
      condDist += 70;
    }
    return(condDist);
  }

  addTiming(){
      for (var sc of this.scopes){
        /*we do not want to add the timing rectangle
        if there is no trigger AND there is regular condition*/
        if(!(this.condition == "regular" && sc.trigger==null)){
            this.createTiming(this.timing,sc);
        }
      }
  }

  addScope(){
    //scopes == in, before, after, notin, onlyIn, onlyBefore, onlyAfter,null
    if(this.scope != 'null'){
      this.addMode(M.width, M.height, M.x, M.bw);
    }
    switch(this.scope){
      case "in":
      this.addScopeBetween(this.mode.getX(),this.mode.rightX());
      break;
      case "before":
      this.addScopeBetween(this.canvas.getTimelineStartX(),this.mode.getX());
      break;
      case "after": // we shift to indicate strictly after
      this.addScopeBetween(this.mode.rightX()+ M.bw/2 + 1, this.canvas.getTimelineEndX());
      break;
      case "notin":
      case "onlyIn":
      this.addScopeBetween(this.canvas.getTimelineStartX(),this.mode.getX());
      // we shift to indicate strictly after
      this.addScopeBetween(this.mode.rightX()+ M.bw/2 + 1, this.canvas.getTimelineEndX());
      break;
      case "onlyBefore":
      this.addScopeBetween(this.mode.getX(),this.canvas.getTimelineEndX());
      break;
      case "onlyAfter":
      this.addScopeBetween(this.canvas.getTimelineStartX(),this.mode.rightX());
      break;
      case "null":
      var begTimeX = this.canvas.getTimelineStartX()+70;
      var begTime = new VerticalLine(begTimeX,this.verticalLineTopY,this.verticalLineBottomY,"Beginning of Time",
      "blue","blue");
      this.canvas.addDiagram(begTime,true);
      this.addScopeBetween(this.canvas.getTimelineStartX()+70,this.canvas.getTimelineEndX());
      break;
      default: console.log("Unexpected Scope Value");
    }
  }


  draw(filename){
    this.addScope();
    if(this.condition == "regular"){
      this.addCondition("trigger","first");
    }
    this.addTiming();

    this.canvas.save(filename);
  }
}

module.exports = {Canvas,semanticDiagram}
