window.dropHandler = ev => {
  ev.preventDefault();
  // track.stop();
  // console.log(track);
  //   if (video) video.pause();
  //   console.log("stop", track);
  //   if (track) {
  //     console.log("stop", track);
  //     track.getTracks().map(function(val) {
  //       val.stop();
  //     });
  //   }
  // console.log('File(s) dropped');
  // console.log(ev.dataTransfer.items);
  // Prevent default behavior (Prevent file from being opened)
  //   ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // If dropped items aren't files, reject them
      if (ev.dataTransfer.items[i].kind === "file") {
        var file = ev.dataTransfer.items[i].getAsFile();
        // console.log('... file[' + i + '].name = ' + file.name);
        // console.log('... file[' + i + '] = ' + ev.dataTransfer.files[i]);
        var name = file.name.split(".");
        // console.log(name,name.length);
        name.splice(name.length - 1, 1);
        imageName = name.join("_") + "-3D.png";
        // console.log('base64', getBase64(ev.dataTransfer.files[i]))
        getBase64(ev.dataTransfer.files[i]);
      }
    }
  } else {
    // Use DataTransfer interface to access the file(s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      // console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      console.log("... file[" + i + "] = " + ev.dataTransfer.files[i]);
    }
  }

  // Pass event to removeDragData for cleanup
  removeDragData(ev);
};
window.dragOverHandler = ev => {
  console.log("File(s) in drop zone");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
};

function removeDragData(ev) {
  console.log("Removing drag data");

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to remove the drag data
    ev.dataTransfer.items.clear();
  } else {
    // Use DataTransfer interface to remove the drag data
    ev.dataTransfer.clearData();
  }
}
let img = new Image();
function getBase64(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
    // console.log('reader.onload ', file);
    // console.log('reader.onload ', snapshotResize(reader.result,360,360));

    loadImage(reader.result);
    // snapshotResize(reader.result, 360, 360).then(r => {
    //   // console.log('result',r);
    //   img.src = r;
    // });
    // console.log(img);
  };
  reader.onerror = function(error) {
    console.log("Error: ", error);
  };
}

function snapshotResize(srcData, width, height) {
  // console.log('snapshotResize',snapshotResize);
  return new Promise((resolve, reject) => {
    var imageObj = new Image(),
      canvas = document.createElement("canvas"),
      ctx = canvas.getContext("2d"),
      xStart = 0,
      yStart = 0,
      aspectRadio,
      newWidth,
      newHeight;

    imageObj.src = srcData;
    canvas.width = width;
    canvas.height = height;
    imageObj.onload = function() {
      aspectRadio = imageObj.height / imageObj.width;

      if (imageObj.height < imageObj.width) {
        //horizontal
        aspectRadio = imageObj.width / imageObj.height;
        (newHeight = height), (newWidth = aspectRadio * height);
        xStart = -(newWidth - width) / 2;
      } else {
        //vertical
        (newWidth = width), (newHeight = aspectRadio * width);
        yStart = -(newHeight - height) / 2;
      }

      ctx.drawImage(imageObj, xStart, yStart, newWidth, newHeight);
      var canvasBase64 = canvas.toDataURL("image/jpeg", 0.75);
      loadImage(canvasBase64);
      console.log("canvasBase64");
      resolve(canvasBase64);
    };
  });
}
