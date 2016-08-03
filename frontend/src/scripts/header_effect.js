(function () {
  'use strict';

  /**
   * Effect's WebGL implementation by Pekka Väänänen
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

  function start(gl, canvas, textures) {
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
        "const float speed = 2.0;",
        "const float size = 23.0;",
        "float t = time;",
        "vec3 r = vec3(rand(vec2(number*2.0,0.0)), rand(vec2(0.0, number)), rand(vec2(number, 0.0)));",
        "float scaling = (0.1 + 0.3 * r.z) * size;",
        "float theta=t*(r.g-0.5);",
        "float cos_t=cos(theta);",
        "float sin_t=sin(theta);",
        "mat3 xz_rotation=mat3(cos_t, sin_t, 0.0, -cos_t*sin_t, cos_t*cos_t, sin_t, sin_t*sin_t, -cos_t*sin_t, cos_t);",
        "",
        "vec2 ofs = vec2(",
          "r.x * screen.x, ",
          "abs(sin(r.z)) * screen.y * 2.0 - t*(10.0 + r.y * speed)",
        ");",
        "",
        "ofs.y = mod(ofs.y, screen.y + scaling*4.0) - scaling*2.0;",
        "ofs.x = mod(ofs.x, screen.x) + sin(ofs.y*(0.01*r.z))*(80.0*r.y);",
        "",
        "vAlpha = (1.0 - ofs.y / screen.y) * (0.1 + rand(vec2(number*3.0, 0.0)));",
        "vAlpha *= 0.7;",
        "",
        "vec2 pos = (xz_rotation*vec3(position, 0.0)).xy * scaling + ofs;",
        "gl_Position = projection * vec4(pos, 0.0, 1);",
        "vTextureCoord = 0.5*(vec2(1.0) + position);",
      "}"].join('\n');

    var fragmentSource = [
      "precision mediump float;",
      "varying mediump vec2 vTextureCoord;",
      "varying mediump float vAlpha;",
      "uniform sampler2D uSampler;",
      "void main() { ",
        "vec4 color = texture2D(uSampler, vTextureCoord.st);",
        "gl_FragColor = vec4(color.rgb, color.a*vAlpha);",
      "}"].join('\n');


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
      var height = Math.floor(window.innerHeight / 2.5);
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

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures["flake"]);
    gl.uniform1i(gl.getUniformLocation(program, "uSampler"), 0);

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

  function loadTexture(path, doneCallback) {
    var texture = gl.createTexture();
    var image = new Image();
    image.onload = function() {
      handleTextureLoaded(image, texture); 
      doneCallback(texture);
    }
    image.src = path;
  }

  function handleTextureLoaded(image, texture) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  function initEffect() {
    var canvas = document.getElementById('demo-canvas');
    if (!canvas) return;

    var gl = initGL(canvas);
    if (!gl) return;

    // A 32x32 transparent white unicode snowflake
    var textureData="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTI5MjZGMjA1OUFFMTFFNjhBNkVDMTRCNkIzNjc1RUQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTI5MjZGMjE1OUFFMTFFNjhBNkVDMTRCNkIzNjc1RUQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMjkyNkYxRTU5QUUxMUU2OEE2RUMxNEI2QjM2NzVFRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMjkyNkYxRjU5QUUxMUU2OEE2RUMxNEI2QjM2NzVFRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhRYAtcAAASFSURBVHjaYrzz4L4CA37wXFle4ScDkWDugvm6Vy5fmZWTlxtJjHoWIL4AxPx41PgA8VZiDFu4ZLHY3NlzFiQkJeoAufeJ0HKACUhcJaBIkRjLL1y5LDh75sz5L54/17O0smIjMsAqQQ64Rg0HtLW0Tjl65KhXaHg4MxcXFzFadgKj9gTIAZcpdUBSSsqE1StXRoHYzi7OjET6vh5EgBxwBZ+q8+fOWUZFR89fsXq1Fjb54tKSmvlz5+aC2CGhIQzKKirEWL4R6PuTMAfgjQJ2dnaB5cuWJZSVlBwBJq4ps+bMEYfJFRQVxQMTXTXUHAYnZxdiM0sjjMH4//9/hrsPH7wDsgWxqXz96hWDpZk5nK+nr/fCwtJysZ6+/tXqisq+jx8/CoHjSVGRYe3GDQx8fHyELF8P9H0QcjZkgEaDLTbVQsLCDDIyMv+fPHkCjttLFy9JAHGpppbWf6Dl8PgODAkmxvL/QFyDLMAEpXFGAzMzM4OKqsoXdPHr164xAqMHznd0dCQm6FcBfX+NJAeAAB8//3eMkBESYnBzd4fIA32+ZvVqhps3buIz5i8QN6ALMiFFAU4gLCzyG8YG5ghQOmCYOWc2w+nTp8Binz59Ylg4fwGDt4cHQ3dnF8PDBw+wGbME6PsbuByANwTExcVg6hhU1dQY1m3cyCAhKcnAyopZ4M2cPp3BxdGJYfLESQzPnz1H9n0LNrPBBgNd9gJIvcPlAEFBIXgOERERAdO8vLzg0GBmYcZQLyAoAE5v379/gwktANpxB1dlBAOgEtEeXcHZM2cYOtraOEDs7NwcBktrK4ZXwKzp7ODI8P3bNxS1llaWDAGBgQwOTk7AaBOGCYOirwlfbQgDV9EdcOf2bYbcrGyG9+/fM4iJiTGcOX2G4djRY6DiFsXy6NhYBncPdwZTMzNgtLCi2zEP6PtHxDgAJR08f/aMoaSoGOxbEADRICwmLs6wcsVKsFh6Zia4+FVUUsJl/g9ccY8rBMDg44ePDKXFJQxXLmPWU69evoTEs4AAQ2JyEjxN4AAzgb5/gk8BE7oDfvz4wdDS3Mxw4vhxRDkAzOeCgqgldWRUJCHLQb7vJFQywR0AdOnrv3//vu3t7mFYv3YtWExFTZWhuq6OYcv2bQyBwUEoGu2BCY0AmAw08zkxTTI4ALZoGIBVK4OLqytDYFAQg629HQOscQEsjODqrG1sGAwNDPGZ+xWIu4htE4JBfmHBwvfvP/xev2kjg46uLgMjI2q7QlgEnq0YvHy8seZ/JDAF6Ps3RDtg45bNGgqKiivzCvxBZesUbApFoCEASg/2Dg74zPxITNyjOMDfxxdURt8AtgvscSkUgoZASFgog4SEBD4zJwB9/55YBzCh8XG2D2Ep3snZmZDvJzCQAFAcAHQ5qD54ibVGBFa/ZhYWDMYmJvjM6wCa8YFsB+CrGdk5OBiKiouwFbUw8BZX+iHVATjbBjo6uvjM6gb6/gs1HICzbcDByYFLClSdT2IgA5DkADygE+j779RywBUSzQAVtzMZyATgfsFAAoAAAwB83FGgRaej7wAAAABJRU5ErkJggg==";

    loadTexture(textureData, function (flakeTexture) {
      start(gl, canvas, {"flake" : flakeTexture});
    });

  }

  initEffect();
})();
