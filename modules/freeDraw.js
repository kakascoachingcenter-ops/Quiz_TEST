/**
 * modules/freeDraw.js
 * Reusable Free-Draw Canvas Component for KCI KG Worksheets
 * 
 * Requirements:
 * - Pointer events (touch + mouse), touch-action: none
 * - 8 colours, 3 brush sizes, eraser, "Clear" (confirm), undo (last stroke)
 * - Canvas ~ 4:3, scales to screen width, devicePixelRatio aware
 * - Memory-only dataURL (never uploaded)
 * - Cap export image to 800px wide
 */

(function(window) {
    'use strict';

    const PALETTE = [
        { name: 'Navy', hex: '#1e3a5f' },
        { name: 'Gold', hex: '#f0b429' },
        { name: 'Coral', hex: '#e8765f' },
        { name: 'Green', hex: '#3f9b6a' },
        { name: 'Sky Blue', hex: '#3f8fd1' },
        { name: 'Purple', hex: '#8b5cf6' },
        { name: 'Brown', hex: '#8d6e63' },
        { name: 'Graphite', hex: '#2d3748' }
    ];

    const BRUSH_SIZES = [
        { name: 'Small', size: 4, iconSize: 8 },
        { name: 'Medium', size: 8, iconSize: 14 },
        { name: 'Large', size: 16, iconSize: 22 }
    ];

    class FreeDrawCanvas {
        constructor(containerEl, options = {}) {
            this.container = typeof containerEl === 'string' ? document.querySelector(containerEl) : containerEl;
            this.promptText = options.prompt || 'Draw your favourite animal.';
            this.voiceKey = options.voiceKey || 'en-draw';
            this.onDrawChange = options.onDrawChange || null;
            this.onSkip = options.onSkip || null;

            this.currentColor = PALETTE[0].hex;
            this.currentSize = BRUSH_SIZES[1].size; // Medium default
            this.isEraser = false;
            this.strokes = []; // Array of stroke: { color, size, isEraser, points: [{x,y}] }
            this.currentStroke = null;
            this.isDrawing = false;
            this.isSkipped = false;

            this.initUI();
            this.setupCanvas();
            this.bindEvents();
        }

        initUI() {
            this.container.innerHTML = `
                <div class="kci-draw-widget max-w-2xl mx-auto flex flex-col gap-4 p-4 sm:p-6 bg-white rounded-2xl border-2 border-paper-edge shadow-sm">
                    <!-- Header with Prompt & Voice Replay -->
                    <div class="flex items-center justify-between gap-3 bg-lightBlue/60 px-4 py-3 rounded-xl border border-ruled-blue">
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-speak-draw p-2 rounded-full hover:bg-white/80 transition-colors text-navy" aria-label="Listen to drawing instruction">
                                <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                </svg>
                            </button>
                            <span class="text-xl sm:text-2xl font-heading font-bold text-navy select-none">${this.promptText}</span>
                        </div>
                        <button type="button" class="btn-skip-draw btn btn-ghost text-sm font-heading font-bold text-gray-500 hover:text-navy px-3 py-2 rounded-lg border border-gray-300 hover:border-navy bg-white transition-all min-h-[44px]">
                            Skip
                        </button>
                    </div>

                    <!-- Toolbar: Colours & Tools -->
                    <div class="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <!-- Swatches (8 colours) -->
                        <div class="palette-swatches flex flex-wrap items-center gap-2">
                            ${PALETTE.map((c, i) => `
                                <button type="button" class="swatch-btn w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-transform shadow-sm ${i === 0 ? 'scale-110 border-navy ring-2 ring-gold' : 'border-white'}" 
                                    style="background-color: ${c.hex};" 
                                    data-hex="${c.hex}" 
                                    title="${c.name}" 
                                    aria-label="Colour ${c.name}"></button>
                            `).join('')}
                        </div>

                        <!-- Brush sizes & Eraser -->
                        <div class="brush-tools flex items-center gap-2">
                            ${BRUSH_SIZES.map((b, i) => `
                                <button type="button" class="brush-size-btn w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${i === 1 ? 'border-navy bg-gold/20' : 'border-gray-200 bg-gray-50'}"
                                    data-size="${b.size}" 
                                    title="${b.name} brush" 
                                    aria-label="${b.name} brush size">
                                    <span class="rounded-full bg-navy inline-block" style="width: ${b.iconSize}px; height: ${b.iconSize}px;"></span>
                                </button>
                            `).join('')}

                            <!-- Eraser -->
                            <button type="button" class="btn-eraser w-10 h-10 rounded-xl border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-graphite hover:text-navy transition-all"
                                title="Eraser" aria-label="Use eraser">
                                <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path>
                                    <path d="M22 21H7"></path>
                                    <path d="m5 11 9 9"></path>
                                </svg>
                            </button>
                        </div>

                        <!-- Action Buttons: Undo & Clear -->
                        <div class="action-tools flex items-center gap-2">
                            <button type="button" class="btn-undo px-3 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 text-navy font-heading font-bold text-sm flex items-center gap-1 hover:border-navy transition-all min-h-[44px]"
                                title="Undo last stroke" aria-label="Undo last stroke">
                                <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 7v6h6"></path>
                                    <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
                                </svg>
                                <span>Undo</span>
                            </button>

                            <button type="button" class="btn-clear px-3 py-2 rounded-xl border-2 border-gray-200 bg-gray-50 text-coral font-heading font-bold text-sm flex items-center gap-1 hover:border-coral hover:bg-coral-light transition-all min-h-[44px]"
                                title="Clear drawing" aria-label="Clear canvas">
                                <svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                                <span>Clear</span>
                            </button>
                        </div>
                    </div>

                    <!-- Canvas Container (Responsive 4:3) -->
                    <div class="canvas-wrap relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-dashed border-navy/30 bg-[#fdfcfa] shadow-inner" style="touch-action: none;">
                        <canvas class="kci-paint-canvas w-full h-full block cursor-crosshair" style="touch-action: none;"></canvas>
                        
                        <!-- Skipped Overlay (if skipped) -->
                        <div class="skip-overlay absolute inset-0 bg-white/90 backdrop-blur-sm hidden flex-col items-center justify-center gap-3">
                            <span class="text-lg font-heading font-bold text-graphite">Drawing skipped</span>
                            <button type="button" class="btn-resume-draw btn btn-gold text-base py-2 px-5 rounded-xl font-heading font-bold shadow-sm">
                                Draw something!
                            </button>
                        </div>
                    </div>
                </div>
            `;

            this.canvas = this.container.querySelector('.kci-paint-canvas');
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
            this.skipOverlay = this.container.querySelector('.skip-overlay');
        }

        setupCanvas() {
            const rect = this.canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            const w = rect.width || 600;
            const h = rect.height || 450;

            this.canvas.width = Math.round(w * dpr);
            this.canvas.height = Math.round(h * dpr);
            this.ctx.scale(dpr, dpr);
            this.dpr = dpr;
            this.logicalWidth = w;
            this.logicalHeight = h;

            this.redraw();
        }

        bindEvents() {
            // Resize observer to maintain crisp resolution and aspect ratio
            const ro = new ResizeObserver(() => {
                const rect = this.canvas.getBoundingClientRect();
                if (rect.width > 0 && Math.abs(rect.width - this.logicalWidth) > 5) {
                    this.setupCanvas();
                }
            });
            ro.observe(this.canvas);

            // Pointer events on canvas
            const getPos = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                return {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
            };

            const startStroke = (e) => {
                e.preventDefault();
                this.isDrawing = true;
                this.isSkipped = false;
                if (this.skipOverlay) this.skipOverlay.classList.add('hidden');
                this.canvas.setPointerCapture(e.pointerId);

                const pt = getPos(e);
                this.currentStroke = {
                    color: this.currentColor,
                    size: this.currentSize,
                    isEraser: this.isEraser,
                    points: [pt]
                };
                this.strokes.push(this.currentStroke);
                this.drawPoint(pt, this.currentStroke);
            };

            const moveStroke = (e) => {
                if (!this.isDrawing || !this.currentStroke) return;
                e.preventDefault();
                const pt = getPos(e);
                this.currentStroke.points.push(pt);
                this.drawLineSegment(
                    this.currentStroke.points[this.currentStroke.points.length - 2],
                    pt,
                    this.currentStroke
                );
            };

            const endStroke = (e) => {
                if (!this.isDrawing) return;
                e.preventDefault();
                this.isDrawing = false;
                this.currentStroke = null;
                try {
                    this.canvas.releasePointerCapture(e.pointerId);
                } catch (err) {}
                if (this.onDrawChange) this.onDrawChange(this.hasDrawing());
            };

            this.canvas.addEventListener('pointerdown', startStroke);
            this.canvas.addEventListener('pointermove', moveStroke);
            this.canvas.addEventListener('pointerup', endStroke);
            this.canvas.addEventListener('pointercancel', endStroke);

            // Swatches
            this.container.querySelectorAll('.swatch-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.isEraser = false;
                    this.currentColor = btn.dataset.hex;
                    this.container.querySelectorAll('.swatch-btn').forEach(b => {
                        b.classList.remove('scale-110', 'border-navy', 'ring-2', 'ring-gold');
                        b.classList.add('border-white');
                    });
                    btn.classList.add('scale-110', 'border-navy', 'ring-2', 'ring-gold');
                    btn.classList.remove('border-white');

                    const eraserBtn = this.container.querySelector('.btn-eraser');
                    if (eraserBtn) {
                        eraserBtn.classList.remove('border-navy', 'bg-gold/20');
                        eraserBtn.classList.add('border-gray-200', 'bg-gray-50');
                    }
                });
            });

            // Brush sizes
            this.container.querySelectorAll('.brush-size-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.currentSize = parseInt(btn.dataset.size, 10);
                    this.container.querySelectorAll('.brush-size-btn').forEach(b => {
                        b.classList.remove('border-navy', 'bg-gold/20');
                        b.classList.add('border-gray-200', 'bg-gray-50');
                    });
                    btn.classList.add('border-navy', 'bg-gold/20');
                    btn.classList.remove('border-gray-200', 'bg-gray-50');
                });
            });

            // Eraser
            const eraserBtn = this.container.querySelector('.btn-eraser');
            if (eraserBtn) {
                eraserBtn.addEventListener('click', () => {
                    this.isEraser = true;
                    eraserBtn.classList.add('border-navy', 'bg-gold/20');
                    eraserBtn.classList.remove('border-gray-200', 'bg-gray-50');
                    this.container.querySelectorAll('.swatch-btn').forEach(b => {
                        b.classList.remove('scale-110', 'border-navy', 'ring-2', 'ring-gold');
                        b.classList.add('border-white');
                    });
                });
            }

            // Undo
            const undoBtn = this.container.querySelector('.btn-undo');
            if (undoBtn) {
                undoBtn.addEventListener('click', () => {
                    if (this.strokes.length > 0) {
                        this.strokes.pop();
                        this.redraw();
                        if (this.onDrawChange) this.onDrawChange(this.hasDrawing());
                    }
                });
            }

            // Clear
            const clearBtn = this.container.querySelector('.btn-clear');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    if (this.strokes.length === 0) return;
                    if (window.confirm("Do you want to clear your drawing?")) {
                        this.strokes = [];
                        this.redraw();
                        if (this.onDrawChange) this.onDrawChange(false);
                    }
                });
            }

            // Skip
            const skipBtn = this.container.querySelector('.btn-skip-draw');
            if (skipBtn) {
                skipBtn.addEventListener('click', () => {
                    this.isSkipped = true;
                    if (this.skipOverlay) this.skipOverlay.classList.remove('hidden');
                    if (this.onSkip) this.onSkip();
                    if (this.onDrawChange) this.onDrawChange(false);
                });
            }

            // Resume from skip
            const resumeBtn = this.container.querySelector('.btn-resume-draw');
            if (resumeBtn) {
                resumeBtn.addEventListener('click', () => {
                    this.isSkipped = false;
                    if (this.skipOverlay) this.skipOverlay.classList.add('hidden');
                });
            }

            // Voice replay
            const speakBtn = this.container.querySelector('.btn-speak-draw');
            if (speakBtn) {
                speakBtn.addEventListener('click', () => {
                    if (window.KCIVoice) {
                        window.KCIVoice.say(this.voiceKey);
                    }
                });
            }
        }

        drawPoint(pt, stroke) {
            this.ctx.save();
            if (stroke.isEraser) {
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.fillStyle = 'rgba(0,0,0,1)';
            } else {
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.fillStyle = stroke.color;
            }
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, stroke.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        drawLineSegment(p1, p2, stroke) {
            this.ctx.save();
            if (stroke.isEraser) {
                this.ctx.globalCompositeOperation = 'destination-out';
                this.ctx.strokeStyle = 'rgba(0,0,0,1)';
            } else {
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.strokeStyle = stroke.color;
            }
            this.ctx.lineWidth = stroke.size;
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
            this.ctx.restore();
        }

        redraw() {
            this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
            this.strokes.forEach(stroke => {
                if (stroke.points.length === 1) {
                    this.drawPoint(stroke.points[0], stroke);
                } else {
                    for (let i = 1; i < stroke.points.length; i++) {
                        this.drawLineSegment(stroke.points[i - 1], stroke.points[i], stroke);
                    }
                }
            });
        }

        hasDrawing() {
            return !this.isSkipped && this.strokes.length > 0;
        }

        /**
         * Export drawing as dataURL, capped to 800px wide for compact PDF/PNG exports.
         * Returns null if empty or skipped.
         */
        getDataURL() {
            if (!this.hasDrawing()) {
                return null;
            }

            const exportWidth = Math.min(800, this.logicalWidth * 2);
            const exportHeight = Math.round((exportWidth * this.logicalHeight) / this.logicalWidth);

            const offCanvas = document.createElement('canvas');
            offCanvas.width = exportWidth;
            offCanvas.height = exportHeight;
            const offCtx = offCanvas.getContext('2d');

            // Friendly white paper background
            offCtx.fillStyle = '#ffffff';
            offCtx.fillRect(0, 0, exportWidth, exportHeight);

            // Draw current canvas scaled
            offCtx.drawImage(this.canvas, 0, 0, exportWidth, exportHeight);

            return offCanvas.toDataURL('image/png');
        }
    }

    window.FreeDrawCanvas = FreeDrawCanvas;

})(window);
