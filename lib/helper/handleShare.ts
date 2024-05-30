export const handleShare = async (title: string, text: string, url: string) => {
  if (typeof window !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  } else {
    console.log('Share not supported on this platform');
  }
};
