const p5 = require("p5");

const Sketch = p => {
  let originPoints, points, colors, num, radius;
  let w = window.innerWidth,
    h = window.innerHeight;

  p.setup = () => {
    // put setup code here
    p.createCanvas(w, h);
    p.frameRate(60);
    p.background(255);
    points = [];
    originPoints = [];
    colors = [];
    p.noStroke();
    p.colorMode(p.HSB, 360, 100, 100, 100);
    num = 800;
    radius = 120;

    let count = 0;
    for (var j = 0; j < 6; j++) {
      for (var i = 0; i < num; i++) {
        count++;
        let deltaRadius1 = p.random(-3, 3);
        let deltaRadius2 = p.random(-3, 3);
        var posX =
          w / 2 +
          p.sin((p.TWO_PI / num) * i) * (radius + deltaRadius2 * j) +
          j * deltaRadius1 * 5;
        var posY =
          h / 2 +
          p.cos((p.TWO_PI / num) * i) * (radius + deltaRadius1 * j) +
          j * deltaRadius2 * 5;
        var position = p.createVector(posX, posY);
        var originPos = p.createVector(posX, posY);
        originPoints.push(originPos);
        points.push(position);
        // //calculate color
        var c = p.sin((p.TWO_PI / num) * count);
        if (count >= 0 && count < num) hue = p.map(c, -1, 1, 327, 280);
        else if (count >= num && count < num * 2)
          hue = p.map(c, -1, 1, 320, 270);
        else if (count >= num * 2 && count < num * 3)
          hue = p.map(c, -1, 1, 300, 250);
        else if (count >= num * 3 && count < num * 4)
          hue = p.map(c, -1, 1, 274, 222);
        else if (count >= num * 4 && count < num * 5)
          hue = p.map(c, -1, 1, 242, 198);
        else if (count >= num * 5 && count < num * 6)
          hue = p.map(c, -1, 1, 222, 190);
        else hue = p.map(c, -1, 1, 200, 184);
        colors.push(hue);
      }
    }

    index1 = p.random(0, 1);
    index2 = p.random(0, 1);
  };

  p.draw = () => {
    // put drawing code here
    p.background(0, 0, 0, 10);
    // let fps = p.frameRate();
    // p.fill(255);
    // p.text("FPS: " + fps.toFixed(2), 10, 10);
    index1 += 0.001;
    index2 += 0.0008;
    // var deltaX = (noise(index1)-0.5)/5;
    // var deltaY = (noise(index2)-0.5)/5;
    var breath = p.sin(p.frameCount * 0.01);

    for (var i = 0; i < points.length; i++) {
      points[i].x =
        originPoints[i].x +
        p.sin(p.frameCount * 0.1 + points[i].y * 0.04 + (p.TWO_PI / num) * i) *
          radius *
          0.1;
      points[i].y =
        originPoints[i].y +
        p.cos(p.frameCount * 0.1 + points[i].x * 0.04 + (p.TWO_PI / num) * i) *
          radius *
          0.1;
      // points[i].x = originPoints[i].x + cos(frameCount*0.02+3*TWO_PI/num*i+points[i].y*0.02)*cos(frameCount*0.02+TWO_PI/num*i)*radius*deltaX;
      // points[i].y = originPoints[i].y + sin(frameCount*0.02+3*TWO_PI/num*i+points[i].x*0.02)*cos(frameCount*0.02+TWO_PI/num*i)*radius*deltaY;
      //gradient strokeWeight
      var circleStroke = p.sin(p.frameCount * 0.02 + (p.TWO_PI / num) * i);
      var weightMin = 0.5;
      var weightMax = 2;
      var circleWeight = p.map(circleStroke, -1, 1, weightMin, weightMax);
      //gradient color
      var color = p.sin(p.frameCount * 0.02 + (p.TWO_PI / num) * i);
      let hue = p.map(color, -1, 1, 184, 327);
      let sat = p.map(circleWeight, weightMin, weightMax, 80, 100);
      let bright = p.map(circleWeight, weightMin, weightMax, 90, 100);
      p.fill(hue, sat, bright, 100);
      p.circle(points[i].x, points[i].y, circleWeight);
    }
  };
  p.mousePressed = () => {};
};

let myp5 = new p5(Sketch);
