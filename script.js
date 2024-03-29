const canvas = document.getElementById('signatureCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

// Mouse event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

// Touch event listeners
canvas.addEventListener('touchstart', startDrawingTouch);
canvas.addEventListener('touchmove', drawTouch);
canvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

function draw(e) {
    if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
}

function stopDrawing() {
    isDrawing = false;
}

function startDrawingTouch(e) {
    isDrawing = true;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const offsetX = touch.clientX - rect.left;
    const offsetY = touch.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
}

function drawTouch(e) {
    if (isDrawing) {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const offsetX = touch.clientX - rect.left;
        const offsetY = touch.clientY - rect.top;
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
    }
}

function saveSignature() {
    const signatureData = canvas.toDataURL();
    const username = document.getElementById('username').value.trim();

    // Check if username is empty
    if (!username) {
        alert("Please enter a username.");
        return;
    }

    // Check if username already exists
    if (localStorage.getItem(username)) {
        alert("Username already exists. Please choose a different username.");
        return;
    }

    // Save data to local storage
    localStorage.setItem(username, signatureData);

    // Update user list
    updateUserList();

    alert("Signature saved successfully!");
}

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';

    // Get all usernames from local storage
    const usernames = Object.keys(localStorage);

    // Add each username to the user list
    usernames.forEach(username => {
        const li = document.createElement('li');
        const usernameSpan = document.createElement('span');
        usernameSpan.textContent = username;
        usernameSpan.addEventListener('click', () => {
            displaySignature(username);
        });
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = "&#10006;"; // Unicode for cross symbol
        deleteButton.className = "cross-symbol";
        deleteButton.title = "Delete Signature";
        deleteButton.addEventListener('click', () => {
            deleteSignature(username);
        });
        li.appendChild(usernameSpan);
        li.appendChild(deleteButton);
        userList.appendChild(li);
    });
}

function displaySignature(username) {
    const signatureData = localStorage.getItem(username);

    if (signatureData) {
        // Display signature corresponding to the username
        const signatureDisplay = document.getElementById('signatureDisplay');
        signatureDisplay.innerHTML = `
            <h3 style="text-align: center;">${username}'s Signature</h3>
            <img src="${signatureData}" alt="Signature" width="400" style="display: block; margin: 0 auto 10px;">
            <button class="download-btn" onclick="downloadSignature('${username}')">Download Signature</button>
        `;
    } else {
        alert(`No signature found for ${username}`);
    }
}

function deleteSignature(username) {
    if (confirm(`Are you sure you want to delete the signature for ${username}?`)) {
        localStorage.removeItem(username);
        updateUserList();
        alert(`Signature for ${username} deleted successfully.`);
    }
}

function downloadSignature(username) {
    const signatureData = localStorage.getItem(username);

    if (signatureData) {
        const downloadLink = document.createElement('a');
        downloadLink.href = signatureData;
        downloadLink.download = `${username}_signature.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    } else {
        alert(`No signature found for ${username}`);
    }
}

// Initial update of user list on page load
updateUserList();
