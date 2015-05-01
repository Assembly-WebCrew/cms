(function () {
  'use strict';

  /**
   * Effect's WebGL implementation by Pekka (cce) Väänänen
   */

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

  function initGL(canvas) {
    try {
      window.gl = canvas.getContext("experimental-webgl");
    } catch(e) {
    }
    if (!gl) {
      console.error("Could not initialise WebGL.");
    }

    return gl;
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
  }

  function start() {
    var vertexSource = [
      "precision mediump float;",
      "attribute vec2 position;",
      "attribute float number;",
      "varying mediump vec2 vTextureCoord;",
      "varying mediump float vAlpha;",
      "uniform mat4 projection;",
      "uniform vec2 screen;",
      "uniform float time;",
      "highp float rand(vec2 co)",
      "{",
        "highp float a = 12.9898;",
        "highp float b = 78.233;",
        "highp float c = 43758.5453;",
        "highp float dt= dot(co.xy ,vec2(a,b));",
        "highp float sn= mod(dt,3.14);",
        "return fract(sin(sn) * c);",
      "}",
      "void main() { ",
        "const float speed = 40.0;",
        "const float size = 18.0;",
        "float t = time;",
        "vec3 r = vec3(rand(vec2(number*2.0,0.0)), rand(vec2(0.0, number)), rand(vec2(number, 0.0)));",
        "float scaling = (0.1 + 0.3 * r.z) * size;",
        "",
        "vec2 ofs = vec2(",
          "r.x * screen.x, ",
          "abs(sin(r.z)) * screen.y * 2.0 + t*(10.0 + r.y * speed)",
        ");",
        "",
        "ofs.y = mod(ofs.y, screen.y + scaling*4.0) - scaling*2.0;",
        "ofs.x = mod(ofs.x, screen.x);",
        "",
        "vAlpha = (1.0 - ofs.y / screen.y) * (0.1 + rand(vec2(number*3.0, 0.0)));",
        "vAlpha *= 0.7;",
        "",
        "vec2 pos = position*scaling + ofs;",
        "gl_Position = projection * vec4(pos, 0, 1);",
        "vTextureCoord = position;",
      "}"].join('\n');

    var fragmentSource = [
      "precision mediump float;",
      "varying mediump vec2 vTextureCoord;",
      "varying mediump float vAlpha;",
      "void main() { ",
        "vec2 coord = vTextureCoord.st;",
        "float circle = 1.0 - length(vTextureCoord.st) / 0.707107; // sqrt(2.0) * 0.5",
        "circle = min(1.0, circle*4.0);",
        "vec3 col = vec3(circle);",
        "gl_FragColor = vec4(vec3(1.0), vAlpha * clamp(circle, 0.0, 1.0));",
      "}"].join('\n');

    var canvas = document.getElementById('demo-canvas');
    var gl = initGL(canvas);

    if (!gl) {
      return;
    }

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
    var MAX_QUADS = 2000;
    var particleCount, time;

    // Create huge vertex position and quad number buffers.
    for (var i = 0; i < MAX_QUADS ; i++) {
      //vertices = vertices.concat(quad_vertices);
      vertices.push.apply(vertices, quad_vertices);
      // Each vertex has a quad index stored as an attribute.
      point_numbers.push(i, i, i, i, i, i);
    }

    var vertexPosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var pointNumberBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointNumberBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(point_numbers), gl.STATIC_DRAW);

    var program = createProgram(vertexSource, fragmentSource);
    gl.useProgram(program);

    gl.clearColor(0,0, 0.0, 0.0, 0.0);

    var debounce = function (func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    var setupViewport = function() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      // out, left, right, bottom, top, near, far
      var projectionMatrix = makeOrtho(new Array(16), 0.0, canvas.width, 0.0, canvas.height, 0.0, 1.0);
      gl.uniformMatrix4fv(gl.getUniformLocation(program, "projection"), false, projectionMatrix);
      gl.uniform2f(gl.getUniformLocation(program, "screen"), canvas.width, canvas.height);
    };

    var resize = function() {
      var width = window.innerWidth;
      var height = window.innerHeight / 2.5;
      canvas.width = width;
      canvas.height = height;
      setupViewport();
      particleCount = Math.floor(Math.min(MAX_QUADS, canvas.width / 3));
    };

    resize();
    window.addEventListener('resize', debounce(resize, 500));

    program.vertexPosAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(program.vertexPosAttrib);
    program.pointNumberAttrib = gl.getAttribLocation(program, 'number');
    gl.enableVertexAttribArray(program.pointNumberAttrib);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive blending since the sprites are white anyway.
    gl.disable(gl.DEPTH_TEST);

    var startTime = getNow();

    function draw() {
      time = 100.0 + (getNow() - startTime) / 1000.0;
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(gl.getUniformLocation(program, "time"), time);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
      gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, pointNumberBuffer);
      gl.vertexAttribPointer(program.pointNumberAttrib, 1, gl.UNSIGNED_SHORT, false, 2, 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6 * particleCount);

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  start();

})();