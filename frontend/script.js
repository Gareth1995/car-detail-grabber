
// car object to store car details globally
const car = {
    make: 'make',
    colour: 'colour',
    license_plate: 'license plate',
    parking_bay: 'parking bay,'
}

// saving elements to variable
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const generateButton = document.getElementById("generate-data");
const infoContainer = document.getElementsByClassName("info-container")[0];
const parkingBayInput = document.getElementById("parking-bay");
const carMakeInput = document.getElementById("car-make");
const carColInput = document.getElementById("car-colour");
const carLicensePlateInput = document.getElementById("car-number-plate");

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

// function to call the backend that calls the gpt model using lang chain
async function callBackendLLM(inputImage, url) {    
    try {
        const response = await axios.post(url, { Image: inputImage });
        return response.data; // Ensure this is returned
    } catch (error) {
        console.error("Error calling backend:", error);
        return error; // Return null or handle error properly
    }
}

async function generateData() {

    file = fileInput.files[0];

    if(file){

        // disable generate data button while backend process
        generateButton.disabled = true;
        generateButton.textContent = 'Loading...';
        
        const reader = new FileReader();
        reader.onloadend = async function () {
            const base64String = reader.result.split(',')[1]; // Get Base64 part of image input

            const url = 'http://localhost:3000/invoke-llm';  // server url for data gen
            // const url = 'https://cardetailapi.onrender.com/invoke-llm';
            const llmResponse = await callBackendLLM(base64String, url);

            // assign car attributes
            car.make = llmResponse.make;
            car.colour = llmResponse.colour;
            car.license_plate = llmResponse.license_plate;
            car.parking_bay = '';

            console.log(car);
            console.log('GPT response:', llmResponse);
            
            // set info for popup
            parkingBayInput.innerText = car.parking_bay;
            carMakeInput.value = car.make;
            carColInput.value = car.colour;
            carLicensePlateInput.value = car.license_plate;
            infoContainer.style.display = 'block';
            
            // enable generate data button again
            generateButton.disabled = false;
            generateButton.textContent = 'Generate Data';
        }

        reader.readAsDataURL(file); // Read the image file as Base64
    }
}

// function to hide modal popup
function hideModal(){
    infoContainer.style.display = 'none';
}

// function that adds llm generated data to frontend table
function submitData(){

    // get values from the car detail popup
    const parkingBay = parkingBayInput.value;
    const make = carMakeInput.value;
    const colour = carColInput.value;
    const licensePlate = carLicensePlateInput.value;

    if (!make || !colour || !licensePlate || !parkingBay) {
        alert("Please fill in all fields before submitting.");
        return;
    }

    // Get table body
    const tableBody = document.getElementById("car-data-table").querySelector("tbody");

    // Create new row
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td>${parkingBay}</td>
        <td>${make}</td>
        <td>${colour}</td>
        <td>${licensePlate}</td>
    `;

    // Append row to table
    tableBody.appendChild(newRow);

    // Hide modal and clear fields
    parkingBayInput.value = ''; // erase parking bay value of previous insert
    hideModal();
}

// make info container moveable
let offsetX = 0, offsetY = 0, isDragging = false;

infoContainer.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - infoContainer.offsetLeft;
    offsetY = e.clientY - infoContainer.offsetTop;
    infoContainer.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    infoContainer.style.left = `${e.clientX - offsetX}px`;
    infoContainer.style.top = `${e.clientY - offsetY}px`;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
    infoContainer.style.cursor = "grab";
});

