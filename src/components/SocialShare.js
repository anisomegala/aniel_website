import React, { useState } from 'react'; //
import { FacebookShareButton, FacebookIcon } from 'next-share';
import { InstagramIcon } from './icons';

const SocialShare = ({ t }) => {
  const [isSharing, setIsSharing] = useState(false); // Track if a share is in progress
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleNativeShare = async () => {
    // If a share is already active, exit to prevent InvalidStateError
    if (isSharing || !navigator.share) {
      if (!navigator.share) {
        navigator.clipboard.writeText(currentUrl);
        alert(t?.common?.linkCopied || "Link copied!");
      }
      return;
    }

    setIsSharing(true); // Lock the share function

    try {
      await navigator.share({
        title: document.title,
        url: currentUrl,
      });
    } catch (err) {
      // Ignore AbortError (when user cancels the share menu)
      if (err.name !== 'AbortError') {
        console.error("Error sharing:", err);
      }
    } finally {
      setIsSharing(false); // Unlock after completion or cancel
    }
  };

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium dark:text-light/70 text-dark/70">
        {t?.common?.share || "Share"}:
      </span>
      
      <FacebookShareButton
        url={currentUrl}
        quote={'Check this out!'}
      >
        <FacebookIcon size={32} round />
      </FacebookShareButton>

      <button 
        onClick={handleNativeShare}
        disabled={isSharing} // Disable button while sharing
        className={`w-8 h-8 transition-transform flex items-center justify-center rounded-full p-1.5 
          ${isSharing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]'}`}
        title="Share"
      >
        <InstagramIcon className="fill-light w-full h-full" />
      </button>
    </div>
  );
};

export default SocialShare;