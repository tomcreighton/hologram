(function () {
  var DEFAULT_SPEED = 0.25;
  var DEFAULT_OPACITY = 0.6;
  var DEFAULT_BLEND = 'overlay';

  var entries = [];
  var scrollY = 0;

  function buildGradient(fromAngle) {
    return 'conic-gradient(from ' + fromAngle + 'deg at 50% 150%, ' +
      '#ff0000, #ff8800, #ffff00, #00ff00, #00ccff, #4400ff, #aa00ff, ' +
      '#ff0000, #ff8800, #ffff00, #00ff00, #00ccff, #4400ff, #aa00ff, #ff0000)';
  }

  function shouldMask(img, maskAttr) {
    if (maskAttr === 'true') return true;
    if (maskAttr === 'false') return false;
    var src = img.src.toLowerCase();
    return src.indexOf('.png') !== -1 || src.indexOf('.svg') !== -1 ||
      src.indexOf('data:image/svg') !== -1 || src.indexOf('data:image/png') !== -1;
  }

  function getMaskUrl(img) {
    try {
      var c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      return 'url("' + c.toDataURL() + '")';
    } catch (e) {
      return null;
    }
  }

  function wrapElement(img, config) {
    var wrapper = document.createElement('div');
    wrapper.className = 'holo-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.style.overflow = 'hidden';

    img.parentNode.insertBefore(wrapper, img);
    wrapper.appendChild(img);

    img.style.display = 'block';

    var overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = buildGradient(0);
    overlay.style.mixBlendMode = config.blend;
    overlay.style.opacity = config.opacity;
    overlay.style.pointerEvents = 'none';

    if (shouldMask(img, config.mask)) {
      var maskUrl = getMaskUrl(img);
      if (maskUrl) {
        overlay.style.maskImage = maskUrl;
        overlay.style.webkitMaskImage = maskUrl;
        overlay.style.maskSize = '100% 100%';
        overlay.style.webkitMaskSize = '100% 100%';
        overlay.style.maskRepeat = 'no-repeat';
        overlay.style.webkitMaskRepeat = 'no-repeat';
        overlay.style.maskMode = 'alpha';
        overlay.style.webkitMaskMode = 'alpha';
      }
    }

    wrapper.appendChild(overlay);
    return overlay;
  }

  function collectElements() {
    var els = document.querySelectorAll('img.holo');
    var seen = new Map();
    for (var i = 0; i < entries.length; i++) {
      seen.set(entries[i].el, entries[i]);
    }

    var next = [];
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      if (seen.has(el)) {
        next.push(seen.get(el));
      } else {
        var speed = parseFloat(el.dataset.holoSpeed) || DEFAULT_SPEED;
        var opacity = parseFloat(el.dataset.holoOpacity) || DEFAULT_OPACITY;
        var mask = el.dataset.holoMask || 'auto';
        var overlay = wrapElement(el, { speed: speed, opacity: opacity, blend: DEFAULT_BLEND, mask: mask });
        next.push({ el: el, overlay: overlay, speed: speed });
      }
    }
    entries = next;
  }

  function tick() {
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var angle = scrollY * e.speed;
      e.overlay.style.background = buildGradient(angle);
    }
    requestAnimationFrame(tick);
  }

  function init() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    collectElements();
    requestAnimationFrame(tick);

    window.addEventListener('scroll', function () {
      scrollY = window.pageYOffset || document.documentElement.scrollTop;
    });

    var observer = new MutationObserver(collectElements);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
