document.addEventListener('DOMContentLoaded', () => {
    function initSlider(slider) {
        const filled = slider.querySelector('.filled');
        const empty = slider.querySelector('.empty');
        let starW, gap, totalW, dragging = false, startTime = 0
        
        function init() {
            const first = empty.children[0];
            starW = first.getBoundingClientRect().width;
            gap   = parseFloat(getComputedStyle(empty).gap) || 0;
            totalW = empty.getBoundingClientRect().width;
        }

        function widthFor(n) { return n * starW + (n - 1) * gap; }

        function ratingFromX(x) {
            const r = empty.getBoundingClientRect();
            x = Math.max(0, Math.min(r.width, x - r.left));
            return (x / r.width) * 5;
        }

        function getStarFromPos(x) {
            const r = empty.getBoundingClientRect();
            x = Math.max(0, Math.min(r.width, x - r.left));
            let pos = 0;
            for (let i = 1; i <= 5; i++) {
                const right = pos + starW + (i < 5 ? gap : 0)
                if (x < right) return i;
                pos = right;
            }
            return 5;
        }

        function setFill(w) { filled.style.width = w + 'px'; }

        function snap(clientX, quickClick = false) {
            const star = getStarFromPos(clientX);
            slider.dataset.rating = star;
            const snappedW = widthFor(star);
            const cursorW = (ratingFromX(clientX) / 5) * totalW;

            if (quickClick) {
                const currentW = parseFloat(getComputedStyle(filled).width);
                if (Math.abs(currentW - cursorW) < 1) {
                    filled.style.transition = 'width 0.22s cubic-bezier(0.2, 0.8, 0.4, 1)';
                    setFill(snappedW);
                } else {
                    filled.addEventListener('transitionend', () => {
                        filled.style.transition = 'width 0.22s cubic-bezier(0.2, 0.8, 0.4, 1)';
                        setFill(snappedW);
                    }, {once: true});
                }
            } else {
                filled.style.transition = 'width 0.35s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
                setFill(snappedW);
            }
        }

        function onStart(e) {
            e.preventDefault(); 
            dragging = true;
            startTime = Date.now();
            filled.style.transition = 'width 0.2s ease-in-out';
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            setFill((ratingFromX(x) / 5) * totalW);
        }

        function onMove(e) {
            if (!dragging) return;
            filled.style.transition = 'none'
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            setFill((ratingFromX(x) / 5) * totalW);
        }

        function onEnd(e) {
            if (!dragging) return;
            dragging = false;
            const touch = e.changedTouches ? e.changedTouches[0] : e;
            const quick = (Date.now() - startTime) < 200;
            snap(touch.clientX, quick);
        }

        init();
        slider.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);
        slider.addEventListener('touchstart', onStart, {passive:false});
        document.addEventListener('touchmove', onMove, {passive:false});
        document.addEventListener('touchend', onEnd);
    }

    const sliders = document.querySelectorAll('.rating-slider');
    sliders.forEach(initSlider);

    const observer = new MutationObserver(mutations => {
        mutations.fofEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return
                const newSliders = node.matches('.rating-slider') ? [node] : node.querySelectorAll('rating-slider');
                newSliders.forEach(initSlider);
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
});