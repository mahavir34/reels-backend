async function processAutoReel() {
    const fileInput = document.getElementById('videoFile');
    const template = document.getElementById('templateSelect').value;
    const statusDiv = document.getElementById('status');
    const resultDiv = document.getElementById('videoResult');

    if (!fileInput.files[0]) {
        alert("कृपया पहले कोई वीडियो फाइल चुनें!");
        return;
    }

    statusDiv.style.color = "#ffb400";
    statusDiv.innerHTML = "⏳ ऑटो-एडिटिंग और 3D रेंडरिंग चल रही है...";
    resultDiv.innerHTML = "";

    const formData = new FormData();
    formData.append('video', fileInput.files[0]);
    formData.append('template', template);

    try {
        const res = await fetch('/api/auto-edit', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
            statusDiv.style.color = "#00ff7f";
            statusDiv.innerHTML = "✅ आपकी रील तैयार है!";
            resultDiv.innerHTML = `<video class="video-preview" controls autoplay src="${data.reelUrl}"></video>`;
        } else {
            statusDiv.style.color = "#ff4d4d";
            statusDiv.innerHTML = "❌ एरर: " + (data.error || "एडिटिंग फेल हुई");
        }
    } catch (err) {
        statusDiv.style.color = "#ff4d4d";
        statusDiv.innerHTML = "❌ सर्वर कनेक्शन एरर!";
    }
}
