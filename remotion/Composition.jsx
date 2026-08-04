import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const My3DReel = ({ videoUrl }) => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    // 3D Rotation & Scale Animation
    const scale = spring({ frame, fps, config: { damping: 12 } });
    const rotationY = interpolate(frame, [0, 30, 60], [-15, 0, 15], {
        extrapolateRight: 'clamp',
    });

    return (
        <AbsoluteFill style={{ backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            {/* Blurred Background */}
            <video src={videoUrl} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(20px) brightness(0.6)' }} />
            
            {/* 3D Phone Mockup Container */}
            <div style={{
                width: '800px',
                height: '1420px',
                borderRadius: '40px',
                overflow: 'hidden',
                border: '8px solid rgba(255,255,255,0.9)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                transform: `scale(${scale}) rotateY(${rotationY}deg)`,
                transformStyle: 'preserve-3d',
            }}>
                <video src={videoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        </AbsoluteFill>
    );
};
