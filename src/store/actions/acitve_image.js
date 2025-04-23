export const ACTIVE_IMAGE = 'ACTIVE_IMAGE';

export function setActiveImage(active_image) {
    return {
        type: ACTIVE_IMAGE,
        payload: {
            active_image,
        },
    };
}
