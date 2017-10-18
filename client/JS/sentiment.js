var Sentiment = (function() {
  var N = 50;
  var cellSize = 16;
  var U = new Array();
  var V = new Array();
  for (var i = 0; i < N; i++) {
    U[i] = new Array();
    for (var j = 0; j < N; j++) {
      U[i][j] = 0;
    }
  }

  for (var i = 0; i < N; i++) {
    V[i] = new Array();
    for (var j = 0; j < N; j++) {
      V[i][j] = 0;
    }
  }



  var dU = new Array();
  var dV = new Array();

  for (var i = 0; i < N; i++) {
    dU[i] = new Array();
    for (var j = 0; j < N; j++) {
      dU[i][j] = 0;
    }
  }
  for (var i = 0; i < N; i++) {
    dV[i] = new Array();
    for (var j = 0; j < N; j++) {
      dV[i][j] = 0;
    }
  }


  var toroidal = new Array();
  for (var i = 0; i < N; i++) {
    toroidal[i] = new Array();
    for (var j = 0; j < 2; j++) {
      toroidal[i][j] = 0;
    }
  }
  var ru = 0.082;
  var rv = 0.041;

  var dt = 0.5;
  //var K = 0.06;
  //var F = 0.035;
  var K = 0.0475;
  var F = 0.0118;
  var kmin = 0.03;
  var kmax = 0.07;

  var fmin = 0.0;
  var fmax = 0.08;




  function initialise() {
    for (var i = 1; i < N - 1; i++) {
      toroidal[i][0] = i - 1;
      toroidal[i][1] = i + 1;
    }
    toroidal[0][0] = N - 1;
    toroidal[0][1] = 1;

    toroidal[N - 1][0] = N - 2;
    toroidal[N - 1][1] = 0;




    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        U[i][j] = 1;
        V[i][j] = 0;
      }
    }
    for (var i = Math.floor(N / 3); i < 2 * Math.floor(N / 3); i++) {
      for (var j = Math.floor(N / 3); j < 2 * Math.floor(N / 3); j++) {
        U[i][j] = 0.5 * (1 + random(-1, 1));
        V[i][j] = 0.25 * (1 + random(-1, 1));
      }
    }
  }

  function reactionDiffusion() {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        var l = toroidal[i][0];
        var r = toroidal[i][1];
        var u = toroidal[j][0];
        var d = toroidal[j][1];

        var Lu = U[l][j] + U[r][j] + U[i][u] + U[i][d] - 4 * U[i][j];
        var Lv = V[l][j] + V[r][j] + V[i][u] + V[i][d] - 4 * V[i][j];

        var uv = U[i][j] * V[i][j] * V[i][j];
        /*
        if(spatialVary)
        {
          K = kmin + i*((kmax-kmin)/N);
          F = fmin + j*((fmax-fmin)/N);
          
        }
        */
        dU[i][j] = dt * (ru * Lu - uv + F * (1 - U[i][j]));
        dV[i][j] = dt * (rv * Lv + uv - (K + F) * V[i][j]);
      }
    }
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        U[i][j] += dU[i][j];
        V[i][j] += dV[i][j];
      }
    }

  }

  function drawCells() {
    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        //    
        noStroke();



        //fill(255-abs(U[i][j]*255),abs(U[i][j]*255),255-abs(U[i][j]*255));
        // stroke(255-abs(U[i][j]*255),abs(U[i][j]*255),255-abs(U[i][j]*255));
        if (abs(U[i][j] * 255) != 255) {
          fill(abs(U[i][j] * 255));
          rect(i * cellSize, j * cellSize, cellSize, cellSize);
          // point(i*cellSize,j*cellSize)
          // stroke(0);
          noFill();
        }
      }
    }
  }

  return {
    reactionDiffusion: reactionDiffusion,
    drawCells: drawCells,
    initialise: initialise,
  };

})();