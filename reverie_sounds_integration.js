/**
 * REVERIE Sound System Integration
 * Add this script to your game to enable the sounds.
 */

const REVERIE_SOUNDS = {
    bgm: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/GfXFBIxfUzhEXqnG.mp3",
    click: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/wZRvtQdggXUqzbVa.mp3",
    match: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/cTHWPpSKHBtsDFnp.mp3",
    error: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/slYSlpxjllEbxLNc.mp3",
    victory: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663172862422/ZLDNwNWOXRzfpHTy.mp3"
};

class SoundManager {
    constructor() {
        this.sounds = {};
        this.bgm = null;
        this.isMuted = false;
        this.init();
    }

    init() {
        // Preload sound effects
        for (const [key, url] of Object.entries(REVERIE_SOUNDS)) {
            if (key === 'bgm') {
                this.bgm = new Audio(url);
                this.bgm.loop = true;
                this.bgm.volume = 0.4;
            } else {
                this.sounds[key] = new Audio(url);
            }
        }
    }

    play(key) {
        if (this.isMuted) return;
        if (this.sounds[key]) {
            // Reset sound to start if it's already playing
            this.sounds[key].currentTime = 0;
            this.sounds[key].play().catch(e => console.log("Audio play blocked by browser. Interaction required."));
        }
    }

    startBGM() {
        if (this.bgm && !this.isMuted) {
            this.bgm.play().catch(e => console.log("BGM play blocked. Click anywhere to start."));
        }
    }

    stopBGM() {
        if (this.bgm) {
            this.bgm.pause();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.isMuted;
    }
}

// Global instance
const reverieAudio = new SoundManager();

// Example usage:
// document.addEventListener('click', () => reverieAudio.startBGM(), { once: true });
// reverieAudio.play('click');
// reverieAudio.play('match');
