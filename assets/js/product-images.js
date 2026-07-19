// BHARTI GREEN TECH - Premium Uniform Product Image System
(function() {
  // 1. DYNAMICALLY INJECT PREMIUM CSS STYLING
  const styleBlock = document.createElement('style');
  styleBlock.textContent = `
    /* Premium Uniform Product Image System */
    .product-img-box, .featured-img-box, .detail-img-box {
      height: 260px !important;
      background: linear-gradient(135deg, #f7f9f6 0%, #eef2eb 100%) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 24px !important;
      overflow: hidden !important;
      position: relative !important;
      border-bottom: 1px solid var(--border-light) !important;
      box-shadow: inset 0 0 25px rgba(0, 0, 0, 0.01) !important;
      transition: background 0.4s ease !important;
    }

    /* Detail page main image container */
    .detail-img-box {
      height: 380px !important;
      border-radius: var(--radius-md) !important;
      border: 1px solid var(--border-light) !important;
      background: linear-gradient(135deg, #fbfcfb 0%, #f4f6f1 100%) !important;
      margin-bottom: 0px !important;
      padding: 30px !important;
    }

    /* Base product image styling */
    .product-img-box img, .featured-img-box img, .detail-img-box img {
      max-height: 85% !important;
      max-width: 85% !important;
      object-fit: contain !important;
      object-position: center !important;
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s ease !important;
      /* Shapes drop-shadow around the product geometry itself */
      filter: drop-shadow(0 8px 16px rgba(27, 67, 50, 0.08)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.04)) !important;
      will-change: transform, filter !important;
    }

    /* Hover effect: Scale and subtle lift */
    .product-card:hover .product-img-box img,
    .featured-card:hover .featured-img-box img {
      transform: scale(1.05) translateY(-4px) !important;
      filter: drop-shadow(0 15px 22px rgba(27, 67, 50, 0.15)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.06)) !important;
    }

    .product-card:hover .product-img-box,
    .featured-card:hover .featured-img-box {
      background: linear-gradient(135deg, #f3f6f1 0%, #e6ebdf 100%) !important;
    }

    /* Placeholder style tweaks */
    .image-placeholder-card {
      width: 100% !important;
      height: 100% !important;
      background: none !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      color: var(--muted-text) !important;
      gap: 10px !important;
    }

    /* Responsive adjustments */
    @media (max-width: 992px) {
      .product-img-box, .featured-img-box {
        height: 240px !important;
        padding: 20px !important;
      }
    }
    @media (max-width: 768px) {
      .product-img-box, .featured-img-box {
        height: 210px !important;
        padding: 16px !important;
      }
      .detail-img-box {
        height: 300px !important;
      }
    }
    @media (max-width: 480px) {
      .product-img-box, .featured-img-box {
        height: 185px !important;
        padding: 12px !important;
      }
    }
  `;
  document.head.appendChild(styleBlock);

  // 2. CLIENT-SIDE CANVAS IMAGE PROCESSOR
  function processSingleImage(img) {
    if (img.getAttribute('data-processed') === 'true') return;
    if (img.src.includes('data:image/')) return;
    if (img.src.includes('image-coming-soon') || img.src.includes('coming-soon')) return;

    // Apply lazy loading attributes
    img.setAttribute('loading', 'lazy');

    const tempImg = new Image();
    tempImg.crossOrigin = "anonymous";
    tempImg.src = img.src;

    tempImg.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = tempImg.naturalWidth;
        const h = tempImg.naturalHeight;
        if (w === 0 || h === 0) return;

        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(tempImg, 0, 0);

        // Get pixel data to sample background color
        const imgData = ctx.getImageData(0, 0, w, h);
        const pixels = imgData.data;

        // Sample corners to detect background type
        const cornerIdxs = [
          0,
          (w - 1) * 4,
          (h - 1) * w * 4,
          ((h - 1) * w + (w - 1)) * 4
        ];

        let bgR = 0, bgG = 0, bgB = 0;
        cornerIdxs.forEach(idx => {
          bgR += pixels[idx];
          bgG += pixels[idx + 1];
          bgB += pixels[idx + 2];
        });
        bgR = Math.round(bgR / 4);
        bgG = Math.round(bgG / 4);
        bgB = Math.round(bgB / 4);

        const isWhiteBg = bgR > 215 && bgG > 215 && bgB > 215;
        const isBlackBg = bgR < 40 && bgG < 40 && bgB < 40;
        const isSolidBg = isWhiteBg || isBlackBg;

        // Find bounding box containing the actual product content
        let minX = w, maxX = 0, minY = h, maxY = 0;
        let foundContent = false;
        const threshold = 35; // Tolerance threshold

        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 4;
            const r = pixels[idx];
            const g = pixels[idx + 1];
            const b = pixels[idx + 2];
            const a = pixels[idx + 3];

            let isBg = false;
            if (a < 15) {
              isBg = true;
            } else if (isSolidBg) {
              const diff = Math.sqrt(
                Math.pow(r - bgR, 2) +
                Math.pow(g - bgG, 2) +
                Math.pow(b - bgB, 2)
              );
              if (diff < threshold) {
                isBg = true;
              }
            }

            if (!isBg) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              foundContent = true;
            }
          }
        }

        // Apply transparency values to solid backgrounds
        if (isSolidBg) {
          for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            const diff = Math.sqrt(
              Math.pow(r - bgR, 2) +
              Math.pow(g - bgG, 2) +
              Math.pow(b - bgB, 2)
            );
            if (diff < threshold) {
              pixels[i + 3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        // Bounding box cropping coordinates
        let cropX = 0, cropY = 0, cropW = w, cropH = h;
        if (foundContent) {
          cropX = minX;
          cropY = minY;
          cropW = maxX - minX + 1;
          cropH = maxY - minY + 1;
        }

        // Create uniform target output canvas (square 400x400)
        const targetSize = 400;
        const targetCanvas = document.createElement('canvas');
        targetCanvas.width = targetSize;
        targetCanvas.height = targetSize;
        const targetCtx = targetCanvas.getContext('2d');

        // Apply premium enhancements: boost contrast and brightness
        targetCtx.filter = "contrast(1.05) brightness(1.03) saturate(1.02)";

        // Uniform scaling: bottles (small) scale up, buckets scale down to occupy 80% maximum dimensions
        const maxContentSize = targetSize * 0.80; // 320px bounding box
        const scale = Math.min(maxContentSize / cropW, maxContentSize / cropH);

        const destW = cropW * scale;
        const destH = cropH * scale;
        const destX = (targetSize - destW) / 2;
        const destY = (targetSize - destH) / 2;

        // Draw cropped product to target canvas center
        targetCtx.drawImage(canvas, cropX, cropY, cropW, cropH, destX, destY, destW, destH);

        // Convert output to base64 PNG data-url
        const dataUrl = targetCanvas.toDataURL('image/png');
        img.src = dataUrl;
        img.setAttribute('data-processed', 'true');

      } catch (err) {
        // Fallback: If CORS/file:// blocks getImageData, let the CSS styles handle containment
        img.setAttribute('data-processed', 'true');
      }
    };
  };

  // 3. OBSERVER ENGINE FOR FILTERED GRID RE-RENDERS
  function initializeEngine() {
    const scanAndProcess = () => {
      const selectors = [
        '.product-img-box img',
        '.featured-img-box img',
        '.detail-img-box img',
        '#productDetailImgBox img',
        '#productDetailImg'
      ];
      const imgs = document.querySelectorAll(selectors.join(','));
      imgs.forEach(img => {
        if (img.complete) {
          processSingleImage(img);
        } else {
          img.addEventListener('load', function handler() {
            processSingleImage(img);
            img.removeEventListener('load', handler);
          });
        }
      });
    };

    // Run initial scan
    scanAndProcess();

    // Setup mutation observer to handle tab filtering and dynamic grids
    const observer = new MutationObserver(() => {
      scanAndProcess();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Boot the image systems
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEngine);
  } else {
    initializeEngine();
  }
})();
