function selectTemplate(templateKey, cardElement) {
    document.querySelectorAll('.template-card').forEach(card => card.classList.remove('active'));
    cardElement.classList.add('active');
    document.getElementById('selectedTemplate').value = templateKey;
}

async function processAutoReel() {
    const fileInput = document.getElementById('videoFile');
    const template = document.getElementById('selectedTemplate').value;
    const statusDiv = document.getElementById('status');
    const resultDiv = document.getElementById('videoResult');

    if (!fileInput.files[0]) {
        alert("कृपया पहले कोई वीडियो फाइल चुनें!");
        return;
    }

    statusDiv.style.color = "#ffb400";
    statusDiv.innerHTML = "⏳ 3D वीडियो रेंडर हो रही है... कृपया 30-40 सेकंड इंतज़ार करें।";
    resultDiv.innerHTML = "";

    const formData = new FormData();
    formData.append('video', fileInput.files[0]);
    formData.append('template', template);

    // Timeout को रोकने के लिए Controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 मिनट का टाइमआउट

    try {
        const res = await fetch('/api/auto-edit', { 
            method: 'POST', 
            body: formData,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();

        if (data.success) {
            statusDiv.style.color = "#00ff7f";
            statusDiv.innerHTML = "✅ आपकी वायरल रील तैयार है!";
            resultDiv.innerHTML = `<video class="video-preview" controls autoplay src="${data.reelUrl}"></video>`;
        } else {
            statusDiv.style.color = "#ff4d4d";
            statusDiv.innerHTML = "❌ एरर: " + (data.error || "एडिटिंग फेल हुई");
        }
    } catch (err) {
        if (err.name === 'AbortError') {
            statusDiv.style.color = "#ffb400";
            statusDiv.innerHTML = "⏳ रेंडरिंग में थोड़ा ज़्यादा समय लग रहा है, कृपया 10 सेकंड बाद पेज रिफ्रेश करें।";
        } else {
            statusDiv.style.color = "#ff4d4d";
            statusDiv.innerHTML = "❌ सर्वर कनेक्शन एरर! कृपया 1 मिनट बाद दोबारा ट्राई करें।";
        }
    }
}
