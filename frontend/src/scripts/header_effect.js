(function () {
  'use strict';

    // http://dvolvr.davidwaterston.com/2012/06/24/javascript-accurate-timing-is-almost-here/
    var getNow = (function() {
      // Returns the number of milliseconds elapsed since either the browser navigationStart event or
      // the UNIX epoch, depending on availability.
      // Where the browser supports 'performance' we use that as it is more accurate (microsoeconds
      // will be returned in the fractional part) and more reliable as it does not rely on the system time.
      // Where 'performance' is not available, we will fall back to Date().getTime().

      var performance = window.performance || {};

      performance.now = (function() {
      return performance.now    ||
      performance.webkitNow     ||
      performance.msNow         ||
      performance.oNow          ||
      performance.mozNow        ||
      function() { return new Date().getTime(); };
      })();

      return performance.now();

    });

    function getWebGLContext(canvas) {
      var gl = canvas.getContext("experimental-webgl");

      return gl;
    }

    function initGL(canvas) {
      try {
        window.gl = getWebGLContext(canvas);
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        //gl.viewport(0, 0, gl.gl.viewportWidth, gl.viewportHeight);
      } catch(e) {
      }
      if (!gl) {
        alert("Could not initialise WebGL, sorry :DD");
      }

      return gl;
    }

    /*
    //check support
    if (!supportsWebGL()) {
      $('log').innerHTML = 'Your browser doesn\'t seem to support WebGL.';
      return;
    }
    */

    var assets = {};

    var preload = [];
    var images = {};
    var promises = [];
    for (var i = 0; i < preload.length; i++) {
      (function(url, promise) {
        images[url] = new Image();
        images[url].onload = function() {
          promise.resolve();
        };
        images[url].src = url;
      })(preload[i], promises[i] = $.Deferred());
    }
    $.when.apply($, promises).done(function() {
      loadAssets(images);
    });

    function loadAssets(images) {
      $.when(
          $.get('/static/assembly/scripts/vertex.shader'),
          $.get('/static/assembly/scripts/fragment.shader')
        ).then(
        function(vs, fs) {

          //console.log(vs, fs);

          assets.vs = vs[0];
          assets.fs = fs[0];
          assets.images = images;

          start(assets);
        }
      );
    }

    // from gl-matrix
    function makeOrtho(out, left, right, bottom, top, near, far) {
      var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
      out[0] = -2 * lr;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = -2 * bt;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 2 * nf;
      out[11] = 0;
      out[12] = (left + right) * lr;
      out[13] = (top + bottom) * bt;
      out[14] = (far + near) * nf;
      out[15] = 1;
      return out;
    };


    function start(assets) {
      var canvas = document.getElementById('demo-canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight / 4;
      var gl = initGL(canvas);

      var quad_vertices = [
        -1.0, 1.0,
        -1.0, -1.0,
         1.0, -1.0,
         1.0, -1.0,
         1.0, 1.0,
        -1.0, 1.0
      ];

      var vertices = [];
      var point_numbers = [];
      var MAX_QUADS = 1000;

      // Create huge vertex position and quad number buffers.
      for (var int = 0; i < MAX_QUADS ; i++) {
        vertices = vertices.concat(quad_vertices);
        // Each vertex has a quad index stored as an attribute.
        point_numbers = point_numbers.concat([i, i, i, i, i, i]);
      }

      var vertexPosBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

      var pointNumberBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, pointNumberBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(point_numbers), gl.STATIC_DRAW);

      var program = createProgram(assets.vs, assets.fs);
      gl.useProgram(program);

      gl.clearColor(0,0, 0.0, 0.0, 0.0);

      var setupViewport = function() {
        gl.viewport(0, 0, canvas.width, canvas.height);
        // out, left, right, bottom, top, near, far
        var projectionMatrix = makeOrtho(new Array(16), 0.0, canvas.width, 0.0, canvas.height, 0.0, 1.0);
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "projection"), false, projectionMatrix);
        gl.uniform2f(gl.getUniformLocation(program, "screen"), canvas.width, canvas.height);
      };

      setupViewport();

      program.vertexPosAttrib = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(program.vertexPosAttrib);
      program.pointNumberAttrib = gl.getAttribLocation(program, 'number');
      gl.enableVertexAttribArray(program.pointNumberAttrib);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive blending since the sprites are white anyway.
      gl.disable(gl.DEPTH_TEST);

      var resize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight / 4;
      };

      window.addEventListener('resize', resize);

      var startTime = getNow();

      var draw = function() {
        gl.clear(gl.COLOR_BUFFER_BIT);
        var time = 100.0 + (getNow() - startTime) / 1000.0;
        gl.uniform1f(gl.getUniformLocation(program, "time"), time);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
        gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, pointNumberBuffer);
        gl.vertexAttribPointer(program.pointNumberAttrib, 1, gl.UNSIGNED_SHORT, false, 2, 0);

        var particleCount = Math.floor(Math.min(MAX_QUADS, canvas.width/3));
        gl.drawArrays(gl.TRIANGLES, 0, 6*particleCount);

        window.requestAnimationFrame(draw);
      }
      window.requestAnimationFrame(draw);
    }

})();