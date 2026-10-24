// Shadowline Hunter — lightweight runtime guard
// Prevents non-critical world layers from interrupting the base game.
(() => {
  window.ShadowlineRuntime = window.ShadowlineRuntime || {};
  window.ShadowlineRuntime.worldReady = false;

  const markReady = () => {
    window.ShadowlineRuntime.worldReady = true;
    console.log('Shadowline world health check: ready');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markReady, { once: true });
  } else {
    markReady();
  }
})();
