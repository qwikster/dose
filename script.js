document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('candy-form');
    const addBtn = document.getElementById('add-candy');
    const inputSection = document.getElementById('input-section');
    const calendarSection = document.getElementById('calendar-section');
    const calendar = document.getElementById('calendar');
    const resetBtn = document.getElementById('reset');

    function parseLocalDateFromInput(value) {
        if (!value || typeof value !== 'string') return null;
        const parts = value.split('-').map(p => parseInt(p, 10));
        if (parts.length !== 3 || parts.some(isNaN)) return null;
        const [y, m, d] = parts;
        return new Date(y, m - 1, d);
    }

    function startOfTodayLocal() {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    }

    const FALLBACK_END_DATE = new Date(2026, 9, 31);

    addBtn.addEventListener('click', () => {
        const div = document.createElement('div');
        div.className = 'candy-entry';
        div.innerHTML = `
            <input type="text" name="name" class="candy-name" placeholder="candy" required>
            <div class="candy-entry-low">
                <input type="number" name="qty" class="candy-qty" placeholder="qty" min="1" max="999" required>
                <div class="rating-slider" data-rating="0">
                    <div class="stars empty">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <div class="stars filled">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <div class="stars hover">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                </div>
            </div>`;
        const buttons = document.getElementById('candy-buttons');
        form.insertBefore(div, buttons);
        form.insertBefore(document.createElement('hr'), buttons);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const entries = document.querySelectorAll('.candy-entry');
        const candies = [];
        let valid = true;
        entries.forEach(entry => {
            const name = entry.querySelector('.candy-name').value.trim();
            const qty = parseInt(entry.querySelector('.candy-qty').value, 10);
            const rating = parseInt(entry.querySelector('.rating-slider').dataset.rating || '0', 10);
            if (!name || isNaN(qty) || qty < 1 || rating === 0 || qty > 999) valid = false;
            else candies.push({ name, qty, rating });
        });
        if (!valid) {
            alert('error processing! are all fields filled? max of a candy is 999, by the way');
            return;
        }

        const startDate = startOfTodayLocal();
        let endDate;
        const endDateStr = document.getElementById('date')?.value;
        const parsed = parseLocalDateFromInput(endDateStr);
        if (!parsed || parsed < startDate) endDate = new Date(FALLBACK_END_DATE.getTime());
        else endDate = parsed;

        const msPerDay = 24 * 60 * 60 * 1000;
        const utcStart = Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const utcEnd = Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        const numDays = Math.floor((utcEnd - utcStart) / msPerDay) + 1;
        if (numDays <= 0) {
            alert('end date must be today or later');
            return;
        }

        const isBalanced = !document.getElementById('mode-toggle').checked;
        let allItems = [];
        candies.forEach(c => {
            for (let i = 0; i < c.qty; i++) allItems.push({ name: c.name, rating: c.rating });
        });
        const daysArray = Array.from({ length: numDays }, () => []);

        if (isBalanced) {
            allItems.sort((a, b) => b.rating - a.rating);
            const dayScores = Array(numDays).fill(0);
            const dayIndices = Array.from({ length: numDays }, (_, i) => i);
            allItems.forEach(item => {
                dayIndices.sort((a, b) => dayScores[a] - dayScores[b]);
                const day = dayIndices[0];
                daysArray[day].push(item);
                dayScores[day] += item.rating;
            });
            daysArray.forEach(day => day.sort((a, b) => b.rating - a.rating));
        } else {
            for (let i = allItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
            }

            const baseCount = Math.floor(allItems.length / numDays);
            let remainder = allItems.length % numDays;
            let index = 0;

            const daysWithExtra = new Set();
            while (daysWithExtra.size < remainder) {
                daysWithExtra.add(Math.floor(Math.random() * numDays));
            }

            for (let d = 0; d < numDays; d++) {
                const count = baseCount + (daysWithExtra.has(d) ? 1 : 0);
                for (let i = 0; i < count && index < allItems.length; i++) {
                    daysArray[d].push(allItems[index++]);
                }
            }
        }

        console.log(`Planning ${allItems.length} candies across ${numDays} days`);

        calendar.innerHTML = '';
        for (let i = 0; i < numDays; i++) {
            const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
            const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const div = document.createElement('div');
            div.className = 'calendar-day';
            const dateLabel = document.createElement('div');
            dateLabel.className = 'calendar-date';
            dateLabel.textContent = dateStr;
            div.appendChild(dateLabel);
            const dayItems = daysArray[i];
            if (dayItems.length > 0) {
                dayItems.sort((a, b) => b.rating - a.rating);
                div.dataset.candy = dayItems.map(item => item.name).join(', ');
                dayItems.forEach((item, idx) => {
                    const candySpan = document.createElement('span');
                    candySpan.textContent = item.name;
                    div.appendChild(candySpan);
                });
            }
            calendar.appendChild(div);
        }

        inputSection.classList.add('hidden');
        calendarSection.classList.remove('hidden');
    });

    resetBtn.addEventListener('click', () => {
        calendarSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    });
});

function jumpscare() {
    document.body.style.backgroundImage = "url('job.png')";
    const panel = document.getElementById('input-section');
    panel.classList = 'panel hidden';
    document.getElementById('header').innerText = 'get jupscared idoit';
    document.getElementById('subtitle').innerText = 'i couldnt think of a better idea';
}
