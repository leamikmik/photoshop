let canva = document.getElementById("img");
let ctx = canva.getContext("2d");

let imgData;
let data;
let changedData;

img = new Image();
img.src = "img.jpg";
img.onload = ()=>{
    ctx.drawImage(img, 0, 0, 300, 300);
    imgData = ctx.getImageData(0, 0, 300, 300);
    data = imgData.data;
    changedData = imgData.data;
}

function grayscale(){
    let temp = ctx.createImageData(imgData);
    temp.data.set(changedData);
    let box = document.getElementById("grayscale");
    if(box.checked){
        for(let i = 0; i < temp.data.length; i += 4) {
            let lightness = parseInt((temp.data[i] + temp.data[i + 1] + temp.data[i + 2]) / 3);
            temp.data[i] = lightness;
            temp.data[i + 1] = lightness;
            temp.data[i + 2] = lightness;
        }
        changedData.set(temp.data);
        ctx.putImageData(temp, 0, 0);
    }
}

function changeR(){
    let temp = ctx.createImageData(imgData);
    temp.data.set(changedData);
    let mult = document.getElementById("sliderR").value;
    for(let i = 0; i < temp.data.length; i += 4) temp.data[i] = data[i]*mult;
    changedData.set(temp.data);
    ctx.putImageData(temp, 0, 0);
}

function changeG(){
    let temp = ctx.createImageData(imgData);
    temp.data.set(changedData);
    let mult = document.getElementById("sliderG").value;
    for(let i = 0; i < temp.data.length; i += 4) temp.data[i+1] = data[i+1]*mult;
    changedData.set(temp.data);
    ctx.putImageData(temp, 0, 0);
}

function changeB(){
    let temp = ctx.createImageData(imgData);
    temp.data.set(changedData);
    let mult = document.getElementById("sliderB").value;
    for(let i = 0; i < temp.data.length; i += 4) temp.data[i+2] = data[i+2]*mult;
    changedData.set(temp.data);
    ctx.putImageData(temp, 0, 0);
}

function changeA(){
    let temp = ctx.createImageData(imgData);
    temp.data.set(changedData);
    let value = document.getElementById("sliderA").value;
    for(let i = 0; i < temp.data.length; i += 4) temp.data[i+3] = value;
    changedData.set(temp.data);
    ctx.putImageData(temp, 0, 0);
}