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

    if (template === '3d_card_slide') {
        // 🎴 3D Card Slide & Motion Blur
        ffmpegCommand.complexFilter([
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:15[bg]',
            "[0:v]scale=800:1400:force_original_aspect_ratio=increase,crop=800:1400,zoompan=z='1.05':x='iw/2-(iw/zoom/2)+sin(in/10)*20':y='ih/2-(ih/zoom/2)':d=1:s=800x1400[fg_slide]",
            '[fg_slide]pad=840:1440:20:20:color=white@0.9[card]',
            '[bg][card]overlay=(W-w)/2:(H-h)/2[outv]'
        ]).map('[outv]');
    } else if (template === 'beat_sync') {
        // ⚡ Beat Sync Pulse
        ffmpegCommand.complexFilter([
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=contrast=1.2:saturation=1.3[bg]',
            "[0:v]scale=850:1500:force_original_aspect_ratio=increase,crop=850:1500,zoompan=z='min(zoom+0.005,1.15)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=850x1500[fg_beat]",
            '[fg_beat]pad=870:1520:10:10:color=white@0.8[fg_card]',
            '[bg][fg_card]overlay=(W-w)/2:(H-h)/2[outv]'
        ]).map('[outv]');
    } else {
        // 📱 3D Phone Frame
        ffmpegCommand.complexFilter([
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=25:10[bg]',
            "[0:v]scale=780:1400:force_original_aspect_ratio=increase,crop=780:1400,zoompan=z='min(zoom+0.003,1.1)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=780x1400[fg_phone]",
            '[fg_phone]pad=820:1440:20:20:color=white@0.9[phone_card]',
            '[bg][phone_card]overlay=(W-w)/2:(H-h)/2[outv]'
        ]).map('[outv]');
    }

    ffmpegCommand
        .videoCodec('libx264')
        .audioCodec('aac')
        .output(outputPath)
        .on('end', () => {
            res.json({
                success: true,
                message: 'वायरल रील तैयार है!',
                reelUrl: `/edited/${filename}`
            });
        })
        .on('error', (err) => {
            console.error('FFmpeg Error:', err);
            res.status(500).json({ error: err.message });
        })
        .run();
};
