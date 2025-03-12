// saving elements to variable
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const generateButton = document.getElementById("generate-data");

// add event listners
fileInput.addEventListener("change", uploadImage);

dropZone.addEventListener("click", () => fileInput.click());

dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = "#e0e0e0";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.backgroundColor = "#fafafa";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.backgroundColor = "#fafafa";
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
        uploadedImage = files[0];
        let imgUrl = URL.createObjectURL(uploadedImage); // get the image url
        dropZone.style.backgroundImage = `url(${imgUrl})`; // set the image url as background image
    }
});

function uploadImage() {
    const fileObj = fileInput.files[0]; // get the file object
    let imgUrl = URL.createObjectURL(fileObj); // get the image url
    dropZone.style.backgroundImage = `url(${imgUrl})`; // set the image url as background image
    
}