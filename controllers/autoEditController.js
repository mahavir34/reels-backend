const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

exports.autoProcessReel = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'वीडियो फाइल अपलोड करें' });

    const template = req.body.template || 'phone_frame';
    const filename = `reel_${Date.now()}.mp4`;
    const outputDir = path.join(__dirname, '../edited');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, filename);
    let ffmpegCommand = ffmpeg(req.file.path);

    if (template === 'phone_frame' || template === 'beat_sync') {
        // 🚀 Dynamic Motion & Pulsing Zoom Engine
        ffmpegCommand.complexFilter([
            // 1. Motion Background Blur
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:10,eq=contrast=1.1[bg]',
            // 2. Dynamic Zooming Foreground (Beat Pulse Simulation)
            "[0:v]scale=800:1420:force_original_aspect_ratio=increase,crop=800:1420,zoompan=z='min(zoom+0.003,1.15)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=800x1420[fg_zoom]",
            // 3. Curved Phone Frame / Rounded Border Overlay
            '[fg_zoom]pad=840:1460:20:20:color=white@0.85[phone_card]',
            // 4. Final Overlay
            '[bg][phone_card]overlay=(W-w)/2:(H-h)/2[outv]'
        ]).map('[outv]');
    } else {
        ffmpegCommand.complexFilter([
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:10[bg]',
            '[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,eq=contrast=1.1:saturation=1.25[fg]',
            '[bg][fg]overlay=(W-w)/2:(H-h)/2[outv]'
        ]).map('[outv]');
    }

    ffmpegCommand
        .videoCodec('libx264')
        .audioCodec('aac')
        .output(outputPath)
        .on('end', () => {
            res.json({
                success: true,
                message: '3D मोशन रील तैयार है! 🚀',
                reelUrl: `/edited/${filename}`
            });
        })
        .on('error', (err) => {
            console.error('FFmpeg Error:', err);
            res.status(500).json({ error: err.message });
        })
        .run();
};
