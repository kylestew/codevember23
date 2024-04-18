const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
  animate: false,
};

function selectMeridianPalette() {
  const colors =
    "ee8067f3df7600a9c0db736bf3b5514aad8beebb20f7f5d04e9eb8e95145f8b917f0afb7f6bc121477bbffc000ffdca4004996ffae43228345524e9cebb43b5d9d88ff7044ffce3966aeaafc9a1a705f84eb4d37d2deb1567baeeb8078f7c6a395b394ff947bead3a25284abe2b9bd0e7e394a93a2ecbfaf0e273353a7e0e84420f391c73dc1a2f4cd0060bafff46c921263a7f0acb3ee636878af64fdb511688cc8f15644".match(
      /.{6}/g
    );

  const palettes =
    "0,1,2:1,2%3,4,5:4,5%6,7,8:6,8%9,10%11,12,13:11,13%14,15,16:14,16%17,18,19:17,19:18,19%20,21%22,23,24:23,24:22,24%25,26%27,17,19:27,19%28,16,29:28,16%30,31,32:31,32%33,34,35:33,34:34,35%36,37,38:36,37%39,40,41:40,41%42,43%44,45%46,47,48:47,48%49,50,51:50,51%52,53,54:52,53"
      .split`%`.map((t) => t.split`:`.map((t) => t.split`,`.map((t) => `#${colors[parseInt(t)]}`)));

  // merge arrays
  let palette = palettes[Math.floor(Math.random() * palettes.length)];
  return palette.reduce((acc, val) => acc.concat(val), []);
}

// console.log(selectMeridianPalette());

function subdivideRect(width, height, minSize) {
  // Base case: if the width or height of the rectangle is less than minSize,
  // do not split further.
  if (width < minSize || height < minSize) {
    console.log("BASE CASE", width, height);
    return [[0, 0, width, height]];
  }

  let rects = [];
  // if (width > height) {
  if (Math.random() < 0.5) {
    // Split horizontally
    let split = Math.floor(Math.random() * (width - minSize * 2.0)) + minSize;
    console.log("Horiz", split);

    rects = rects.concat(splitRect(0, 0, split, height));
    rects = rects.concat(splitRect(split, 0, width - split, height));
  } else {
    // Split vertically
    let split = Math.floor(Math.random() * (height - minSize * 2.0)) + minSize;
    console.log("Vert", split);

    rects = rects.concat(splitRect(0, 0, width, split));
    rects = rects.concat(splitRect(0, split, width, height - split));
  }

  return rects;

  function splitRect(x, y, w, h) {
    // Recursive call to split the rectangle further
    let childRects = subdivideRect(w, h, minSize);
    // Child rectangles get positions on way back up the recursive call stack
    return childRects.map((rect) => [rect[0] + x, rect[1] + y, rect[2], rect[3]]);
  }
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, width, height);

    let palette = selectMeridianPalette();

    let createAndDrawGrid = (x, y, w, h, depth) => {
      let rects = subdivideRect(w, h, w * depth);
      console.log(rects);

      // move to position
      context.save();
      context.translate(x, y);

      // context.fillStyle = "#ff0000";
      context.strokeStyle = "#000";
      context.lineWidth = 6;

      rects.forEach((rect) => {
        context.save();

        // select a random color from the palette
        let color = palette[Math.floor(Math.random() * palette.length)];
        context.fillStyle = color;

        context.translate(rect[0], rect[1]);
        context.fillRect(0, 0, rect[2], rect[3]);
        context.strokeRect(0, 0, rect[2], rect[3]);

        context.restore();
      });

      context.restore();
    };

    // function to inset rect by padding
    function insetRect(rect, padding) {
      return [rect[0] + padding, rect[1] + padding, rect[2] - padding * 2, rect[3] - padding * 2];
    }

    // split canvas area into 4 sections
    const p = 40;
    const ip = 40;
    let w = width / 2.0 - p;
    let h = height / 2.0 - p;
    let rect0 = insetRect([0, 0, w, h], ip);
    let rect1 = insetRect([w, 0, w, h], ip);
    let rect2 = insetRect([0, h, w, h], ip);
    let rect3 = insetRect([w, h, w, h], ip);

    context.translate(p, p);

    // one centered
    // createAndDrawGrid(0, 0, width - p * 2, height - p * 2, 0.1);

    createAndDrawGrid(rect0[0], rect0[1], rect0[2], rect0[3], 0.7);
    createAndDrawGrid(rect1[0], rect1[1], rect1[2], rect1[3], 0.5);
    createAndDrawGrid(rect2[0], rect2[1], rect2[2], rect2[3], 0.3);
    createAndDrawGrid(rect3[0], rect3[1], rect3[2], rect3[3], 0.1);

    // TODO: colors;
    // also try a random split
  };
};

canvasSketch(sketch, settings);
