import md5 from 'md5';

export const generateMarvelHash = (timestamp: string, publicKey: string, privateKey: string): string => {
    try {
        const preHash = timestamp + privateKey + publicKey;
        return md5(preHash);
    } catch (error) {
        console.error('Error generating Marvel hash:', error);
        throw new Error('Failed to generate authentication hash');
    }
};

export const generateTimestamp = (): string => {
    return Date.now().toString();
};