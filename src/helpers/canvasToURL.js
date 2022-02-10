import DataURIToBlob from "./dataURIToBlob";

function postCanvasToFile(ctx) {
  // Convert canvas image to Base64
  const img = ctx.toDataURL();
  // Convert Base64 image to binary
  return DataURIToBlob(img);
}

export default postCanvasToFile;
  