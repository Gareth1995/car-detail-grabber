// saving elements to variable
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const generateButton = document.getElementById("generate-data");
const infoContainer = document.getElementsByClassName("info-container")[0];

// add event listners
fileInput.addEventListener("change", uploadImage);
generateButton.addEventListener("click", generateData);

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
    const files = e.dataTransfer.files; // get dropped file
    fileInput.files = files; // assign dropped file to file input
    
    if (files.length > 0 && files[0].type.startsWith("image/")) {
        uploadImage();
    }
});

// function to upload image to dropzone
function uploadImage() {
    const fileObj = fileInput.files[0]; // get the file object
    let imgUrl = URL.createObjectURL(fileObj); // get the image url
    dropZone.style.backgroundImage = `url(${imgUrl})`; // set the image url as background image 
}

async function generateData() {
    console.log(fileInput.files[0]);
    infoContainer.style.display = 'block';

    const url = 'http://localhost:3000/invoke-llm';  // sever url for data gen

    // The data you want to send in the POST request
    const data = {
        input: 'your input data here' // Replace with actual input
    };

    // Making a POST request using axios
    axios.post(url, data)
    .then(response => {
        console.log('Success:', response.data); // Handle the response from the server
    })
    .catch((error) => {
        console.error('Error:', error); // Handle any errors
    });
        console.log('Data submitted');
}

function hideModal(){
    infoContainer.style.display = 'none';
}

function submitData(){
    
}