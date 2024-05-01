let image = document.getElementById("image");
let ctx = image.getContext("2d");

let oldImg = [];
let oldIndex = 0;

Chart.defaults.color = "#AAA";
Chart.defaults.borderColor = "#AAA";

let label = [];
for (let i = 0; i < 256; i++) {
  label[i] = i.toString();
}

let graph = new Chart("chart", {
  type: "line",
  data: {
    labels: label,
    datasets: [
      {
        label: "red",
        backgroundColor: "red",
        borderColor: "red",
      },
      {
        label: "green",
        backgroundColor: "green",
        borderColor: "green",
      },
      {
        label: "blue",
        backgroundColor: "blue",
        borderColor: "blue",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  },
});

let imgInput = document.getElementById("image-input");
let imgPanel = document.getElementById("img-pane");

imgInput.addEventListener("input", (e) => {
  let reader = new FileReader();
  reader.onload = function (event) {
    let img = new Image();
    img.onload = () => {
      image.width = img.width;
      image.height = img.height;

      ctx.drawImage(img, 0, 0, image.width, image.height);
      let imgg = ctx.getImageData(0, 0, image.width, image.height);
      oldIndex = 0;
      oldImg = [[...imgg.data]];
      updateGraph(imgg, graph);
      document.getElementById("dnd-helper").style.display = "none";
      image.style.display = "block";
      enableInputs();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("export-image").addEventListener("click", () => {
  let img = image.toDataURL("image/png");

  let date = new Date();
  let dName =
    date.getFullYear().toString() +
    date.getMonth().toString() +
    date.getDate().toString() +
    date.getHours().toString() +
    date.getMinutes().toString() +
    date.getSeconds().toString() +
    date.getMilliseconds().toString();

  let link = document.createElement("a");
  link.href = img;
  link.download = "edited-" + dName + ".png";
  link.click();
});
document.getElementById("gauss-blur").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  gauss(img.data, image.width, image.height);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("laplace").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  laplaceFilter(img.data, image.width, image.height);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("sharpen").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  sharpen(img.data, image.width, image.height);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("unsharp-mask").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  unsharp(img.data, image.width, image.height);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("sobel").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  sobel(img.data, image.width, image.height);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("grayscale").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  grayscale(img.data);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("box-blur").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  box(img.data, img.width, img.height);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("threshold").addEventListener("click", () => {
  let img = ctx.getImageData(0, 0, image.width, image.height);
  threshold(img.data, document.getElementById("threshold_val").value);
  oldImg.splice(oldIndex + 1);
  oldImg.push([...img.data]);
  handleUndoRedo(oldIndex + 1);
  updateGraph(img, graph);
  ctx.putImageData(img, 0, 0);
});
document.getElementById("threshold_val").addEventListener("input", function () {
  document.getElementById("threshold_val_disp").innerText = this.value;
});
document.getElementById("emphasize_val").addEventListener("input", function () {
  document.getElementById("emphasize_val_disp").innerText = this.value;
});

let brighbtns = document.getElementsByClassName("brightness");
for (let i of brighbtns) {
  i.addEventListener("click", function () {
    let img = ctx.getImageData(0, 0, image.width, image.height);
    brightness(img.data, Number(this.getAttribute("data")));
    oldImg.splice(oldIndex + 1);
    oldImg.push([...img.data]);
    handleUndoRedo(oldIndex + 1);
    updateGraph(img, graph);
    ctx.putImageData(img, 0, 0);
  });
}
let removebtns = document.getElementsByClassName("remove");
for (let i of removebtns) {
  i.addEventListener("click", function () {
    let img = ctx.getImageData(0, 0, image.width, image.height);
    removeChannel(img.data, Number(this.getAttribute("data")));
    oldImg.splice(oldIndex + 1);
    oldImg.push([...img.data]);
    handleUndoRedo(oldIndex + 1);
    updateGraph(img, graph);
    ctx.putImageData(img, 0, 0);
  });
}
let emphasizebtns = document.getElementsByClassName("emphasize");
for (let i of emphasizebtns) {
  i.addEventListener("click", function () {
    let img = ctx.getImageData(0, 0, image.width, image.height);
    emphasizeChannel(
      img.data,
      Number(this.getAttribute("data")),
      Number(document.getElementById("emphasize_val").value)
    );
    oldImg.splice(oldIndex + 1);
    oldImg.push([...img.data]);
    handleUndoRedo(oldIndex + 1);
    updateGraph(img, graph);
    ctx.putImageData(img, 0, 0);
  });
}

document.getElementById("redo").addEventListener("click", () => {
  handleUndoRedo(oldIndex + 1);

  ctx.putImageData(
    new ImageData(
      new Uint8ClampedArray(oldImg[oldIndex]),
      image.width,
      image.height
    ),
    0,
    0
  );
  updateGraph(ctx.getImageData(0, 0, image.width, image.height), graph);
});
document.getElementById("undo").addEventListener("click", () => {
  handleUndoRedo(oldIndex - 1);

  ctx.putImageData(
    new ImageData(
      new Uint8ClampedArray(oldImg[oldIndex]),
      image.width,
      image.height
    ),
    0,
    0
  );
  updateGraph(ctx.getImageData(0, 0, image.width, image.height), graph);
});
document.getElementById("browse-image").addEventListener("click", () => {
  imgInput.click();
});
document.addEventListener("keyup", (e) => {
  e.preventDefault();
  if (e.ctrlKey && !e.shiftKey && e.key === "z")
    document.getElementById("undo").click();
  if (e.ctrlKey && e.shiftKey && e.key === "Z")
    document.getElementById("redo").click();
});

let gpu = new GPU.GPU();

let convolution = gpu
  .createKernel(
    function (data, width, height, matrix, kernelRadius) {
      let weight = 1 / (9 * 9 * 9 * 9);

      let r = 0;
      let g = 0;
      let b = 0;

      let i = -kernelRadius;
      while (i <= kernelRadius) {
        let x = this.thread.x + i;
        if (x < 0 || x >= width) {
          i++;
          continue;
        }

        let j = -kernelRadius;
        while (j <= kernelRadius) {
          let y = this.thread.y + j;
          if (y < 0 || y >= height) {
            j++;
            continue;
          }
          r += data[4 * (y * width + x)] * weight;
          g += data[4 * (y * width + x) + 1] * weight;
          b += data[4 * (y * width + x) + 2] * weight;
          j++;
        }
        i++;
      }
      this.color(r, g, b, 255);
    },
    {
      mode: "gpu",
    }
  )
  .setGraphical(true);
convolution.dynamicOutput = true;
imgPanel.addEventListener("dragover", (e) => {
  e.preventDefault();
});

imgPanel.addEventListener("drop", (e) => {
  e.preventDefault();
  let dt = new DataTransfer();
  dt.items.add(e.dataTransfer.files[0]);
  imgInput.files = dt.files;
  imgInput.dispatchEvent(new Event("input"));
});

let test = gpu
  .createKernel(function (src, width, height, kernel, kernelRadius) {
    let kSize = 2 * kernelRadius + 1;
    let r = 0,
      g = 0,
      b = 0;

    let i = -kernelRadius;
    while (i <= kernelRadius) {
      let x = this.thread.x + i;
      if (x < 0 || x >= width) {
        i++;
        continue;
      }

      let j = -kernelRadius;
      while (j <= kernelRadius) {
        let y = this.thread.y + j;
        if (y < 0 || y >= height) {
          j++;
          continue;
        }

        let kernelOffset = (j + kernelRadius) * kSize + i + kernelRadius;
        let weights = kernel[kernelOffset];
        let pixel = src[y][x];
        r += pixel.r * weights;
        g += pixel.g * weights;
        b += pixel.b * weights;
        j++;
      }
      i++;
    }
    this.color(r, g, b);
  })
  .setOutput([512, 512])
  .setGraphical(true);

window.test = test;

function handleUndoRedo(index) {
  oldIndex = index;
  if (index === 0) {
    document.getElementById("undo").disabled = true;
    document.getElementById("redo").disabled = false;
  } else if (index === oldImg.length - 1) {
    document.getElementById("redo").disabled = true;
    document.getElementById("undo").disabled = false;
  } else {
    document.getElementById("redo").disabled = false;
    document.getElementById("undo").disabled = false;
  }
}
function getPixelData(imageData, x, y, width, height) {
  if (x < 0) return getPixelData(imageData, 0, y, width, height);
  else if (y < 0) return getPixelData(imageData, x, 0, width, height);
  else if (x > width) return getPixelData(imageData, width, y, width, height);
  else if (y > height) return getPixelData(imageData, x, height, width, height);

  let start = x * 4 + y * width * 4;
  let pixel = {
    start,
    data: [],
  };
  for (let i = 0; i < 4; i++) {
    pixel.data.push(imageData[start + i]);
  }
  return pixel;
}
function clamp(min, val, max) {
  return Math.min(Math.max(val, min), max);
}
function grayscale(data) {
  for (let i = 0; i < data.length; i += 4) {
    data[i + 2] =
      data[i + 1] =
      data[i] =
      parseInt((data[i] + data[i + 1] + data[i + 2]) / 3);
  }
}

function removeChannel(data, channel) {
  for (let i = 0; i < data.length; i += 4) {
    data[i + channel] = 0;
  }
}

function emphasizeChannel(data, channel, factor) {
  for (let i = 0; i < data.length; i += 4) {
    data[i + channel] = clamp(0, data[i + channel] * factor, 255);
  }
}

function box(data, c, r) {
  let k = [
    [0.1111111111111111, 0.1111111111111111, 0.1111111111111111],
    [0.1111111111111111, 0.1111111111111111, 0.1111111111111111],
    [0.1111111111111111, 0.1111111111111111, 0.1111111111111111],
  ];
  apply(data, c, r, k);
}
function threshold(data, thr) {
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) data[i + j] = data[i + j] > thr ? 255 : 0;
  }
}
function brightness(data, brightness) {
  for (let i = 0; i < data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      data[i + j] = clamp(0, data[i + j] + brightness, 255);
    }
  }
}
function apply(data, width, height, matrix) {
  let copy = [...data];
  let halfMatrx = parseInt(matrix[0].length / 2);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let temp = [];
      let sum = [0, 0, 0];
      for (let k = -halfMatrx; k < halfMatrx + 1; k++) {
        temp[k + halfMatrx] = [];
        for (let l = -halfMatrx; l < halfMatrx + 1; l++) {
          temp[halfMatrx + k][halfMatrx + l] = getPixelData(
            copy,
            i + k,
            j + l,
            width,
            height
          );
          for (let z = 0; z < 3; z++) {
            temp[halfMatrx + k][halfMatrx + l].data[z] *=
              matrix[halfMatrx + k][halfMatrx + l];
            sum[z] += temp[halfMatrx + k][halfMatrx + l].data[z];
          }
        }
      }
      let pixel = getPixelData(copy, i, j, width, height);

      for (let z = 0; z < 3; z++) {
        data[pixel.start + z] = clamp(0, sum[z], 255);
      }
    }
  }
}
function gauss(data, width, height) {
  apply(
    data,
    width,
    height,
    matrixFromArray([
      [1, 4, 6, 4, 1],
      [4, 16, 24, 16, 4],
      [6, 24, 36, 24, 6],
      [4, 16, 24, 16, 4],
      [1, 4, 6, 4, 1],
    ])
  );
}
function laplaceFilter(data, width, height) {
  apply(data, width, height, [
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ]);
}
function sharpen(data, width, height) {
  apply(
    data,
    width,
    height,
    matrixFromArray([
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ])
  );
}
function unsharp(data, width, height) {
  apply(
    data,
    width,
    height,
    matrixFromArray([
      [1, 4, 6, 4, 1],
      [4, 16, 24, 16, 4],
      [6, 24, -476, 24, 6],
      [4, 16, 24, 16, 4],
      [1, 4, 6, 4, 1],
    ])
  );
}
function sobel(data, width, height) {
  apply(data, width, height, [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1],
  ]);
}
function updateGraph(img, graph) {
  let data = [[], [], []];

  for (let i = 0; i < img.data.length; i += 4) {
    for (let j = 0; j < 3; j++) {
      if (typeof data[j][img.data[j + i]] === "undefined") {
        data[j][img.data[j + i]] = 1;
      } else data[j][img.data[j + i]]++;
    }
  }
  for (let j = 0; j < 3; j++) {
    for (let i = 0; i < 256; i++) {
      if (typeof data[j][i] === "undefined") data[j][i] = 0;
    }
  }
  for (let i = 0; i < 3; i++) {
    graph.data.datasets[i].data = data[i];
  }
  graph.update();
}

function flattenArray(array) {
  let res = [];
  for (let i = 0; i < array.length; i++) {
    let curr = array[i];
    if (curr.length ?? false) {
      res.push(...flattenArray(curr));
    } else res.push(curr);
  }
  return res;
}
function matrixFromArray(array) {
  let sum = 0;
  let x = array[0].length;
  for (let i = 0; i < x; i++) {
    for (let j = 0; j < x; j++) {
      sum += array[i][j];
    }
  }
  let kernel = [];
  for (let i = 0; i < x; i++) {
    kernel[i] = [];
    for (let j = 0; j < x; j++) {
      kernel[i][j] = array[i][j] / sum;
    }
  }
  return kernel;
}
function enableInputs() {
  let inputs = document.querySelectorAll("input, button:not(#redo,#undo)");
  for (let i of inputs) {
    i.disabled = false;
  }
}
