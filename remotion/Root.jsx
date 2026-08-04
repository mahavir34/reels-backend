import { Composition } from 'remotion';
import { My3DReel } from './Composition';

export const RemotionRoot = () => {
    return (
        <>
            <Composition
                id="3DReel"
                component={My3DReel}
                durationInFrames={300}
                fps={30}
                width={1080}
                height={1920}
                defaultProps={{ videoUrl: '' }}
            />
        </>
    );
};
