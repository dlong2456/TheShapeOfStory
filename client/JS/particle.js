function Particle(x,y) {
  this.center = createVector(x,y);
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 4;
  this.h = 0;
  var scribble = new Scribble();
  this.prevPos = this.pos.copy();

  this.update = function() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  this.follow = function(vectors) {
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }

  this.applyForce = function(force) {
    this.acc.add(force);
  }

  this.show = function(strWt,r,g,b) {
    //stroke(this.h, 255, 255, 25);
    stroke(r, g, b,25);
    this.h = this.h + 1;
    if (this.h > 255) {
      this.h = 0;
    }
    strokeWeight(strWt);
   //scribble.bowing = 150;
  // scribble.maxOffset = 100;
    scribble.roughness = 50;
    scribble.scribbleLine(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }

  this.updatePrev = function() {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }

  this.edges = function(radius) {
   /* for(var i = 0 ; i < P.length ; i++)
    {
      var vec1 = new pv.vec(P[i],P[(i+1)%P.length]);
      var vec2 = new pv.vec(P[i],pv.P(this.pos.x,this.pos.y))
      if(pv.dot(vec1,vec2)>0)
        console.log("some success");
    }*/
    if(this.pos.x > this.center.x+radius)
    {
      this.pos.x = this.center.x;
      this.updatePrev();
    }
    if(this.pos.x < this.center.x-radius)
    {
      this.pos.x = this.center.x;
      this.updatePrev();
    }
     if(this.pos.y < this.center.y-radius)
    {
      this.pos.y = this.center.y;
      this.updatePrev();
    }
    if(this.pos.y > this.center.y+radius)
    {
      this.pos.y = this.center.y;
      this.updatePrev();
    }
    /*if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }*/

  }

}