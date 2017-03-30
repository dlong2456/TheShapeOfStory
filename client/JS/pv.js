var pv = (function(){

 function pt (x,y)
{
  this.x = x || 0;
  this.y = y || 0;
  
 };
pt.prototype.setTo = function(x,y){
               this.x = x;
               this.y = y;
               return this;
  }
  pt.prototype.setTo = function(P)
  {
    this.x = P.x;
    this.y = P.y;
     return this;
  }

  pt.prototype.setToMouse = function()
  {
    this.x = mouseX;
    this.y = mouseY;
     return this;
  }
  pt.prototype.add = function(u,v){
    this.x +=u;
    this.y +=v;
     return this;
    }
    //here p can be a point or a vector. No need to define seperately as javascript doesn't define types
    //this.add = function(v) would have been add but result is same so no need but keep difference in  mind
    //SOME ERROR. NEEDS TO BE RESOLVED
    pt.prototype.add = function(s,P){
      if(s!==0)
      {
        this.x +=s*P.x;
        this.y +=s*P.y;
       return this;
      }
      else
      {
        this.x +=P.x;
      this.y += P.y;
      //console.log(this.x);
      //console.log(this.y);
      return this;
      }
      
    }
   
    pt.prototype.translatTowards = function(s,P){
      this.x+=s*(P.x-this.x);
      this.y+=s*(P.y-this.y);
      return this;
    }

    pt.prototype.scale = function(u,v, C){
      if(C!=={})
      {
        this.x*=C.x+u*(C.x-this.x);
      this.y*=C.y+v*(C.y-this.y);
      return this;
      }
      else
      {
        this.x*=u;
      this.y*=v;
      return this;
      }
      
    }
   
    pt.prototype.rotate = function(a , P){
      if(P!={})
      {
        var dx= this.x-P.x;
      var dy = this.y-P.y;
      }
      else
      {
        dx = this.x;
        dy = this.y;
      }
      var c = Math.cos(a);
      var s = Math.cos(a);
      this.x = c*dx+s*dy;
      this.y = -s*dx+c*dy;
      return this;
    }
    pt.prototype.rotateSinCos = function(s,t,P)
    {
      var dx = this.x-P.x;
      var dy = this.y-P.y;
      dx -=dy*t;
      dy+=dx*s;
      dx-=dy*t;
      this.x = P.x+dx;
      this.y = P.y+dy;
      return this;
    }
    pt.prototype.moveWithMouse = function()
    {
      this.x+=mouseX-pmouseX;
      this.y+=mouseY-pmouseY;
      return this;
    }

    pt.prototype.write = function(){
      console.log("("+this.x+" "+this.y+")");
      return this;
    }
    pt.prototype.v = function()
    {
      vertex(this.x,this.y);
      return this;
    }
    pt.prototype.show = function(r){
      if(r!=0)
      {
        ellipse(this.x,this.y,2*r,2*r);
      return this;
      }
      else
      {
        ellipse(this.x,this.y,6,6);
      return this;
      }
    }
   

    pt.prototype.label = function(s,u,v){
      fill(0);
      text(s,this.x+u,this.y+v);
      noFill();
      return this;
    }
    pt.prototype.labelByVector = function(s,V){
      fill(0);
      text(s,this.x+V.x,this.y+V.y);
      noFill();
      return this;
    }
    pt.prototype.labelDefault = function(s){
      fill(0);
      text(s,this.x+5,this.y+4);
      noFill();
      return this;
    }


 function vec (x,y){
  this.x = x || 0;
  this.y = y || 0;
}


// MODIFY
  vec.prototype.setTo  = function(px,py) {this.x = px; this.y = py; return this;}; 
  vec.prototype.setToByV = function(V) {this.x = V.x; this.y = V.y; return this;}; 
  vec.prototype.zero  = function(){this.x=0; this.y=0; return this;}
  vec.prototype.scaleBy = function(u,  v) {this.x*=u; this.y*=v; return this;};
  //vec.prototype.scaleBy = function(f) {this.x*=f; this.y*=f; return this;};
  vec.prototype.reverse = function() {this.x=-this.x; this.y=-this.y; return this;};
  vec.prototype.divideBy = function(f) {this.x/=f; this.y/=f; return this;};
  vec.prototype.normalize = function() { var n=Math.sqrt((this.x*this.x)+(this.y*this.y)); if (n>0.000001) {this.x/=n; this.y/=n;}; return this;};
  vec.prototype.add  = function( u,  v){this.x += u; this.y += v; return this;};
  vec.prototype.addVector = function( V) {this.x += V.x; this.y += V.y; return this;};   
  vec.prototype.addScaledVector  = function( s,  V){this.x += s*V.x; this.y += s*V.y; return this;};   
  vec.prototype.rotateBy  = function( a){var xx=this.x; var yy=this.y; this.x=xx*Math.cos(a)-yy*Math.sin(a); this.y=xx*Math.sin(a)+yy*Math.cos(a); return this;};
  vec.prototype.left = function(){ var m=this.x; this.x=-this.y; this.y=m; return this;};
 
  // OUTPUT VEC
  vec.prototype.clone = function() {return(new vec(this.x,this.y));}; 

  // OUTPUT TEST MEASURE
  vec.prototype.norm = function() {return(Math.sqrt((this.x*this.x)+(this.y*this.y)));}
  vec.prototype.isNull = function() {return((Math.abs(this.x)+Math.abs(this.y)<0.000001));}
  vec.prototype.angle = function(){return(Math.atan2(this.y,this.x)); }

  // DRAW, PRINT
  vec.prototype.write = function() {console.log("<"+this.x+","+this.y+">");};
  vec.prototype.showAt   = function(P){line(P.x,P.y,P.x+this.x,P.y+this.y); }; 
  
  vec.prototype.showArrowAt= function ( P) 
      {
      line(P.x,P.y,P.this.x+x,P.this.y+y); 
      var n=min(this.norm()/10.,height/50.); 
      var Q=P(P,this); 
      var U = S(-n,U(this));
      var W = S(.3,R(U)); 
      beginShape(); Q.add(U).add(W).v(); Q.v(); Q.add(U).add(M(W)).v(); endShape(CLOSE); 
      };
      
  vec.prototype.label = function( s,  P) {P(P).add(0.5,this).add(3,R(U(this))).label(s); };


//POINT FUNCTIONS
var P = Function.create(xTyped , [types(Number , Number), function(x,y){return new pt(x,y);} , types(pt),function(P){return new pt(P.x,P.y);},types(pt,pt),function( P,  V) {return P(P.x + V.x, P.y + V.y); }  ,types(pt,Number,pt),function( P,  s,  V) {return P(P,W(s,V)); } ]);
var Mouse = function() {return P(mouseX,mouseY);}; 
var Pmouse = function(){return P(pmouseX,pmouseY);};  
var ScreenCenter=function() {return P(width/2,height/2);} 
var d=function( P,  Q) {return Math.sqrt(d2(P,Q));  };    
var d2=function( P,  Q) {return sq((Q.x-P.x))+sq((Q.y-P.y)); }; 
var isSame=Function.create(false,[function( A,  B) {return (A.x==B.x)&&(A.y==B.y) ;} ,function( A,  B,  e) {return d2(A,B)<Math.pow(e,2);}   ]);
var R=Function.create(false,[function( Q,  a) {var dx=Q.x, dy=Q.y, c=Math.cos(a), s=Math.sin(a); return new pt(c*dx+s*dy,-s*dx+c*dy); }, function( Q,  a,  C) {var dx=Q.x-C.x, dy=Q.y-C.y, c=Math.cos(a), s=Math.sin(a); return P(C.x+c*dx-s*dy, C.y+s*dx+c*dy); }]);  // Q rotated by angle a around the origin
var MoveByDistanceTowards=function( P,  d,  Q) { return P(P,d,U(V(P,Q))); }; 

// average 
var A=Function.create(false , [function( A,  B) {return P((A.x+B.x)/2.0,(A.y+B.y)/2.0); },function( A,  B,  C) {return P((A.x+B.x+C.x)/3.0,(A.y+B.y+C.y)/3.0); }, function( A,  B,  C, D) {return A(A(A,B),A(C,D)); }]);                                          // (A+B)/2 (average)
var W=Function.create(false , [function( a,  A) {return P(a*A.x,a*A.y);} ,function( a,  A,  b,  B) {return P(a*A.x+b*B.x,a*A.y+b*B.y);}, function( a,  A,  b,  B,  c,  C) {return P(a*A.x+b*B.x+c*C.x,a*A.y+b*B.y+c*C.y);},function( a,  A,  b,  B,  c,  C,  d,  D){return P(a*A.x+b*B.x+c*C.x+d*D.x,a*A.y+b*B.y+c*C.y+d*D.y);}]); 


// display 
var show=Function.create(xTyped,[types(pt , Number),function( P,  r) {ellipse(P.x, P.y, 2*r, 2*r);},types(pt ),function( P) {ellipse(P.x, P.y, 6,6);},types(pt , pt , pt),function( A,  B,  C)  {beginShape();  A.v(); B.v(); C.v(); endShape(CLOSE);} ,types(pt , pt , pt, pt),function( A,  B,  C,  D)  {beginShape();  A.v(); B.v(); C.v(); D.v(); endShape(CLOSE);}, types(pt , vec),function( P,  V) {line(P.x,P.y,P.x+V.x,P.y+V.y); },types(pt , Number , vec),function( P,  s,  V) {show(P,S(s,V));} ]);                                           // draws circle of center r around P
                                         // show V as line-segment from P 

var label=Function.create(false,[function( P,  S) {text(S, P.x-4,P.y+6.5); },function( P,  V,  S) {text(S, P.x-3.5+V.x,P.y+7+V.y); } ]);                                                // writes string S next to P on the screen ( for example label(P[i],str(i));)
var showId=function( P,  S) {fill(white); show(P,13); fill(black); label(P,S);}                       // sows disk with S written inside
var edge=function( P,  Q) {line(P.x,P.y,Q.x,Q.y); };   
var v=function( P) {vertex(P.x,P.y);};                                                                      // vertex for drawing polygons between beginShape() and endShape()
                                              // draws arrow from P to Q


//************************************************************************
//**** VECTOR FUNCTIONS
//************************************************************************

// create 
var V=Function.create(xTyped,[types(vec),function(V) {return new vec(V.x,V.y); },types(pt),function(V) {return new vec(V.x,V.y); }, types(Number,Number),function( x,  y) {return new vec(x,y); }, types(pt,pt),function( P,  Q) {return new vec(Q.x-P.x,Q.y-P.y);}]);                                                           // make copy of vector V

var U=Function.create(false,[function( V) {var n = n(V); if (n==0) return new vec(0,0); else return new vec(V.x/n,V.y/n);},function( P,  Q) {return U(V(P,Q));}])      // V/||V|| (Unit vector : normalized version of V)
var MouseDrag=function() {return new vec(mouseX-pmouseX,mouseY-pmouseY);};                                      // vector representing recent mouse displacement

// measure 
var dot=function( U,  V) {return U.x*V.x+U.y*V.y; }                                                     // dot(U,V): U*V (dot product U*V)
var det=function( U,  V) {return dot(R(U),V); }                                                         // det | U V | = scalar cross UxV 
var n=function( V) {return Math.sqrt(dot(V,V));};                                                               // n(V): ||V|| (norm: length of V)
var n2=function( V) {return sq(V.x)+sq(V.y);};                                                             // n2(V): V*V (norm squared)
var parallel =function( U,  V) {return dot(U,R(V))==0; }; 

var angle =Function.create(false,[function( U,  V) {return Math.atan2(det(U,V),dot(U,V)); },function( V) {return(Math.atan2(V.y,V.x)); },function( A,  B,  C) {return  angle(V(B,A),V(B,C)); }]);                                 // angle <U,V> (between -PI and PI)
var turnAngle=function( A,  B,  C) {return  angle(V(A,B),V(B,C)); }                                   // angle <AB,BC> (positive when right turn as seen on screen)
var toDeg=function( a) {return Number(a*180/Math.PI);}                                                           // convert radians to degrees
var toRad=function( a) {return(a*Math.PI*2/180);}                                                             // convert degrees to radians 
var positive=function( a) { if(a<0) return a+Math.PI*2; else return a;}                                   // adds 2PI to make angle positive

// weighted sum 
var Wvec=Function.create(xTyped, [types(Number , vec),function( s, V) {return V(s*V.x,s*V.y);} ,types(vec , vec),function( U,  V) {return V(U.x+V.x,U.y+V.y);} ,types(vec , Number , vec),function( U, s, V) {return W(U,S(s,V));},types( Number , vec ,  Number , vec),function( u,  U,  v,  V) {return W(S(u,U),S(v,V));}   ]);                                                     // sV


// transformed 
var S=function( s, V) {return new vec(s*V.x,s*V.y);};                                                  // sV
var M=function( V) { return V(-V.x,-V.y); } 

var RVec=Function.create(false,[function( V) {return new vec(-V.y,V.x);},function( V,  a) { return W(Math.cos(a),V,Math.sin(a),R(V)); } ,function( V ,  s ,  t )
  {
    var dx=V.x, dy=V.y; 
    dx-=dy*t; 
    dy+=dx*s; 
    dx-=dy*t; 
    return new vec( V.x+dx,V.y+dy);
   
  }
]);                                                             // V turned right 90 degrees (as seen on screen)


var Reflection=function( V,  N) { return W(V,-2.*dot(V,N),N);};                                          // reflection OF V wrt unit normal vector N

// Interpolation 
var LinearInterpolateVec=function( U,  V,  s) {return new vec(U.x+s*(V.x-U.x),U.y+s*(V.y-U.y));};                      // (1-s)U+sV (Linear interpolation between vectors)

var SteadyInterpolate=function( U,  V,  s) // steady interpolation from U to V
  {
  var a = angle(U,V); 
  var W = R(U,s*a); 
  var u = n(U), v=n(V); 
  return W(Math.pow(v/u,s),W); 
  } 

// display 
                                                    // show sV as line-segment from P 
     // show V as arrow from P and print string S on its side
var arrow=Function.create(xTyped,[types(pt ,vec),function( P,  V) 
  {
  show(P,V);  
  var n=n(V); 
  if(n<0.01) return;  // too short a vector
  // otherwise continue
     var s=Math.max(Math.min(0.2,20./n),6./n);       // show V as arrow from P 
     var Q=P(P,V); 
     var U = S(-s,V); 
     var W = R(S(.3,U)); 
     beginShape(); 
       v(P(P(Q,U),W)); 
       v(Q); 
       v(P(P(Q,U),-1,W)); 
     endShape(CLOSE);
  } ,types(pt , Number , vec), function( P,  s,  V) {arrow(P,S(s,V));} , types(pt , vec , Number),  function( P,  V,  S) {arrow(P,V); P(P(P,0.70,V),15,R(U(V))).label(S,V(-5,4));},types(pt , pt), function( P,  Q) {arrow(P,V(P,Q)); }     ]); 
           
// projection on line
var projectsBetween=function( P,  A,  B) {return dot(V(A,P),V(A,B))>0 && dot(V(B,P),V(B,A))>0 ; };
var disToLine=function( P,  A,  B) {return Math.abs(det(U(A,B),V(A,P))); };
var projectionOnLine=function( P, A,  B) {return P(A,dot(V(A,B),V(A,P))/dot(V(A,B),V(A,B)),V(A,B));}


//************************************************************************
//**** TWO POINTS, EDGES
//************************************************************************
// display 



//************************************************************************
//**** TRIANGLES
//************************************************************************
// display 

// measure 
var triangleArea=function( A,  B,  C) 
  {
  return dot(R(V(A,B)),V(A,C)) / 2; 
  }

var triangleMoment=function( A,  B,  C) 
  {
  var b = d(A,B); 
  var T=U(A,B); 
  var N = R(T);
  var AC=V(A,C); 
  var h = dot(AC,N);
  var a = dot(AC,T);
  return ( b*b*b*h - a*b*b*h + a*a*b*h + b*h*h*h )/36.; 
  }
  
//************************************************************************
//**** QUADS
//************************************************************************
// display 


//************************************************************************
//**** INTERPOLATING PAREMETRIC MOTION
//************************************************************************
// Linear
var L=function( A,  B,  t) {var point = P(A.x+t*(B.x-A.x),A.y+t*(B.y-A.y));return point;}


//************************************************************************
//**** CIRCLES
//************************************************************************
// create 
var CircumCenter=function ( A,  B,  C) // CircumCenter(A,B,C): center of circumscribing circle, where medians meet)
  {
  var AB = V(A,B); var AC = R(V(A,C)); 
  return P(A,1./2/dot(AB,AC),W(-n2(AC),R(AB),n2(AB),AC)); 
  }
  
var circumRadius=function( A,  B,  C)     // radiusCircum(A,B,C): radius of circumcenter 
  {
  var a=d(B,C), b=d(C,A), c=d(A,B),s=(a+b+c)/2, d=Math.sqrt(s*(s-a)*(s-b)*(s-c)); 
  return a*b*c/4/d;
  } 

// display 
var drawCircle=function( n) 
  {  
  var x=1, y=0; var a=Math.PI*2/n, t=Math.tan(a/2), s=Math.sin(a); 
  beginShape(); 
    for (var i=0; i<n; i++) 
      {
      x-=y*t; y+=x*s; x-=y*t; 
      vertex(x,y);
      } 
  endShape(CLOSE);
  }


var showArcThrough =function( A,  B,  C) 
  {
  if (Math.abs(dot(V(A,B),R(V(A,C))))<0.01*d2(A,C)) {edge(A,C); return;}
  var O = CircumCenter ( A,  B,  C); 
  var r=d(O,A);
  var OA=V(O,A), OB=V(O,B), OC=V(O,C);
  var b = angle(OA,OB), c = angle(OA,OC); 
  if(0<c && c<b || b<0 && 0<c)  c-=Math.PI*2; 
  else if(b<c && c<0 || c<0 && 0<b)  c+=Math.PI*2; 
  beginShape(); 
    v(A); 
    for (var t=0; t<1; t+=0.01) v(R(A,t*c,O)); 
    v(C); 
  endShape();
  }

var pointOnArcThrough=function ( A,  B,  C,  t) 
   { 
   if (Math.abs(dot(V(A,B),R(V(A,C))))<0.001*d2(A,C)) {edge(A,C); return L(A,C,t);}
   var O = CircumCenter ( A,  B,  C); 
   var r=(d(O,A) + d(O,B)+ d(O,C))/3;
   var OA=V(O,A), OB=V(O,B), OC=V(O,C);
   var b = angle(OA,OB), c = angle(OA,OC); 
   if(0<b && b<c) {}
   else if(0<c && c<b) {b=b-Math.PI*2; c=c-Math.PI*2;}
   else if(b<0 && 0<c) {c=c-Math.PI*2;}
   else if(b<c && c<0) {b=Math.PI*2+b; c=Math.PI*2+c;}
   else if(c<0 && 0<b) {c=Math.PI*2+c;}
   else if(c<b && b<0) {}
   return R(A,t*c,O);
   }
   
var curvature=function( A,  B,  C) // computes 1 / radius of circumcircle to (A,B,C)
  {
  var a=d(B,C), b=d(C,A), c=d(A,B); // edge lengths
  var s=(a+b+c)/2; // half perimeter
  var d=s*(a+b-s)*(b+c-s)*(c+a-s);
  if(d<0.000001) return 0;
  var k = Math.sqrt(d)*4/(a*b*c); // curvature
  return k;
  } // radius of circumcenter
var drawSpiral1 = function(G)
{
   var b = 150;
   var t = 0;
   var r1 = b*sqrt(t);
   var r2 = b*sqrt(t);
   var Pt = [];
   var Qt = [];
   for(t = 0 ; t < 50 ; t+=0.05)
   {
    Pt.push(pv.P(G.x+r1*cos(t),G.y+r1*sin(t)));
    Qt.push(pv.P(G.x+r2*cos(t),G.y+r2*sin(t)))
    r1 = b*sqrt(t);
    r2 = -b*sqrt(t);
   }

  for(var i = 1 ; i < Pt.length ; i++)
  {
    stroke(150);
    line(Pt[i-1].x,Pt[i-1].y,Pt[i].x,Pt[i].y);
    stroke(0);
  }
    
   return Pt;

}

var drawSpiral2 = function(G)
{
   var b = 150;
   var t = 0;
   var r1 = b*sqrt(t);
   var r2 = b*sqrt(t);
   var Pt = [];
   var Qt = [];
   for(t = 0 ; t < 50 ; t+=0.05)
   {
    Pt.push(pv.P(G.x+r1*cos(t),G.y+r1*sin(t)));
    Qt.push(pv.P(G.x+r2*cos(t),G.y+r2*sin(t)))
    r1 = b*sqrt(t);
    r2 = -b*sqrt(t);
   }
     for(var i = 1 ; i < Qt.length ; i++)
    line(Qt[i-1].x,Qt[i-1].y,Qt[i].x,Qt[i].y);
  return Qt;

}
var spiral = function(G,t)
{
   
   var b = 100
   var r1 = b*sqrt(t);
   return P(G.x+r1*cos(t),G.y+r1*sin(t));
}
var spiral1 = function(G,b,t1)
{
      var t = 0;
      var r = b*sqrt(t);
      var scribble = new Scribble();
      for(t = 0 ; t < t1 ; t+=0.1)
  {
    
   beginShape();

     scribble.scribbleLine(P(G.y-r*sin(t),G.x+r*cos(t)-28).x,P(G.y-r*sin(t),G.x+r*cos(t)-28).y,P(G.y-r*sin(t+0.05),G.x+r*cos(t+0.05)-28).x,P(G.y-r*sin(t+0.05),G.x+r*cos(t+0.05)-28).y);
     // show(P(G.y-r*sin(t),G.x+r*cos(t)-28),1);
     endShape();
 r = b*pow(t,1/2.3);
}

}
var spiral2 = function(G,b,t2)
{
      var t = 0;
      var r = b*sqrt(t);
       var scribble = new Scribble();
      for(t = 0 ; t < t2 ; t+=0.05)
       
  {
    
   beginShape();
 
  scribble.scribbleLine(P(G.y-r*sin(t),G.x+r*cos(t)).x,P(G.y-r*sin(t),G.x+r*cos(t)).y,P(G.y-r*sin(t+0.05),G.x+r*cos(t+0.05)).x,P(G.y-r*sin(t+0.05),G.x+r*cos(t+0.05)).y);
   //   show(P(G.y-r*sin(t),G.x+r*cos(t)),1);
     endShape();
 r = b*pow(t,1/2.3);
}

}

var questionMark = function(G)
{
  //v.questionMark(G,20,12,12.5,16);
  push();
scale(0.8);
   spiral1(G,5,12.5);
   spiral2(G,3.2,16);
   pop();

  
}
var questionMarkInverted = function(G)
{
   push();
scale(0.8);
   spiral2(G,5,16);
   spiral1(G,4,12.5);
pop();
 }

var circleHeadGear = function(G,V)
{
  fill(0);
   ellipse(G.x,G.y,3,3);
   ellipse(G.x+4*V.x,G.y+4*V.y,3,3);
   ellipse(G.x+8*V.x,G.y+8*V.y,3,3);
noFill();
}
var emotionCircle = function(G,dia)
{
  noFill();
  arc(G.x,G.y,dia,dia, PI, PI+QUARTER_PI);

  arc(G.x,G.y,dia,dia, 3*PI/2, 3*PI/2+QUARTER_PI);
  arc(G.x,G.y,dia,dia, 0, QUARTER_PI);
  arc(G.x,G.y,dia,dia, PI/2, PI/2+QUARTER_PI);
  fill(255,0,0);
  triangle(G.x-5,G.y-dia/2,G.x-11,G.y-5-dia/2,G.x-1,G.y-5-dia/2);
  fill(0,255,0);
  triangle(G.x-5,G.y+dia/2,G.x-11,G.y+5+dia/2,G.x-1,G.y+5+dia/2);
  fill(0,0,255);
  triangle(G.x+dia/2,G.y-5,G.x+5+dia/2,G.y-11,G.x+5+dia/2,G.y-1);
  fill(0,0,255);
  triangle(G.x-dia/2,G.y-5,G.x-5-dia/2,G.y-11,G.x-5-dia/2,G.y-1);
  noFill()
}
var circleSpaceBetweenTwoArcs = function(G)
{
var Pt = drawSpiral1(G);
var Qt = drawSpiral2(G);
var circlePoints = [];
var circlePoints2 = [];
var i = 1;
var j = 5;
var size =100;
//console.log(Qt[length/2]);
//console.log(closest(Pt[200],Qt));



//for(i = 0 ; i < Pt.length-1 ; i+=2){
  while(i<Pt.length){
    //show(P(P.G[i],0.3,V(P.closest(Q.G[i]),P.G[i])));
   // show(L(P.G[i],Q.closest(P.G[i]),0.5));
   noFill();
   circlePoints.push({"pt":P(L(Pt[i],closest(Pt[i],Qt),0.5).x,L(Pt[i],closest(Pt[i],Qt),0.5).y),"length":d(Pt[i],closest(Pt[i],Q))/2});
   //circlePoints.push({"pt":P(L(Qt[i],closest(Qt[i],Pt),0.5).x,L(Qt[i],closest(Qt[i],Pt),0.5).y),"length":d(Pt[i],closest(Pt[i],Q))/2});
   

   // ellipse(L(Pt[i],closest(Pt[i],Qt),0.5).x,L(Pt[i],closest(Pt[i],Qt),0.5).y,d(Pt[i],closest(Pt[i],Q)),d(Pt[i],closest(Pt[i],Q)));
   

   // ellipse(L(Qt[i],closest(Qt[i],Pt),0.5).x,L(Qt[i],closest(Qt[i],Pt),0.5).y,d(Pt[i],closest(Pt[i],Q)),d(Pt[i],closest(Pt[i],Q)));
 

  if(i<Pt.length*.15)
   i+=8;
  if(i<Pt.length*0.3)
  i+=3;
    else
      i+=2;
 
  }
while(j<Qt.length)
{

if(j<Qt.length*0.05)
size = 0.5*size;

j+=8;
}

  return circlePoints;
  
}

var closest = function(M,PS)
{
 // var j = floor(PS.length/2);
  
//  console.log(j);
//  console.log(PS[j]);
  var v = 0;
   for(var j = 0 ; j < PS.length ; j++)
      if(d(PS[j],M)<d(PS[v],M)) v = floor(j);
 
  return PS[v];
}

    return {
      pt : pt,
      vec : vec,
     
      P : P,
      Mouse : Mouse,
      Pmouse : Pmouse,
      ScreenCenter : ScreenCenter,
      d : d,
      d2 : d2,
      isSame : isSame,
      R : R,
      MoveByDistanceTowards : MoveByDistanceTowards,
      A : A,
      W : W,
      show : show,
      label : label,
      showId : showId,
      edge : edge,
      v : v,
      arrow : arrow,
      V :V,
      MouseDrag : MouseDrag,
      dot : dot,
      det : det,
      n : n,
      n2 : n2 ,
      parallel : parallel,
      angle : angle,
      turnAngle : turnAngle , 
      toDeg : toDeg,
      toRad : toRad,
      positive : positive,
      Wvec : Wvec,
      S :S,
      M : M,
      RVec : RVec,
      Reflection : Reflection,
      LinearInterpolateVec : LinearInterpolateVec,
      SteadyInterpolate : SteadyInterpolate,
    
      projectsBetween : projectsBetween,
      disToLine : disToLine,
      projectionOnLine : projectionOnLine,
      triangleArea : triangleArea,
      triangleMoment : triangleMoment,
      L : L,
      CircumCenter : CircumCenter,
      circumRadius : circumRadius,
      drawCircle : drawCircle,
      showArcThrough : showArcThrough,
      pointOnArcThrough : pointOnArcThrough,
      curvature : curvature,
      drawSpiral2:drawSpiral2,
      spiral:spiral,
      drawSpiral1:drawSpiral1,
      circleSpaceBetweenTwoArcs:circleSpaceBetweenTwoArcs,
      spiral1 : spiral1,
      spiral2:spiral2,
      questionMark:questionMark,
      questionMarkInverted:questionMarkInverted,
      circleHeadGear:circleHeadGear,
      emotionCircle:emotionCircle,

 






    



    }

})();







