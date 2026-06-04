import decorateVideoBanner from '../video-banner/video-banner.js';

/**
 * Backward-compatible alias for authored block names that slugged with accents.
 * @param {HTMLElement} block
 * @returns {void}
 */
export default function decorate(block) {
  decorateVideoBanner(block);
}
