document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('candy-form');
    const addBtn = document.getElementById('add-candy');
    const inputSection = document.getElementById('input-section');
    const calendarSection = document.getElementById('calendar-section');
    const calendar = document.getElementById('calendar');
    const resetBtn = document.getElementById('reset');

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
            if (!name || isNaN(qty) || qty < 1 || rating === 0 || qty > 999) {
                valid = false;
                return;
            }
            candies.push({ name, qty, rating });
        });
        if (!valid) {
            alert('error processing! are all fields filled? max of a candy is 999, by the way');
            return;
        }
        const startDateStr = document.getElementById('date').value;
        const startDate = new Date(startDateStr);
        const startDay = startDate.getDate();
        const year = startDate.getFullYear();
        const month = startDate.getMonth();
        const numDays = new Date(year, month + 1, 0).getDate() - startDay + 1;
        const isBalanced = document.getElementById('mode-toggle').checked;
        let allItems = [];
        candies.forEach(c => {
            for (let i = 0; i < c.qty; i++) {
                allItems.push({ name: c.name, rating: c.rating });
            }
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
        } else { // isBalanced == false
            for (let i = allItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
            }
            allItems.forEach((item, index) => {
                daysArray[index % numDays].push(item);
            });
        }
        calendar.innerHTML = '';
        for (let i = 0; i < numDays; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dateStr = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const div = document.createElement('div');
            div.className = 'calendar-day';
            div.textContent = dateStr;
            const dayItems = daysArray[i];
            if (dayItems.length > 0) {
                if (dayItems.length > 1) {
                    dayItems.sort((a, b) => a.rating - b.rating);
                }
                div.dataset.candy = dayItems.map(item => item.name).join(', ');
                dayItems.forEach((item, idx) => {
                    if (idx > 0) {
                        const br = document.createElement('br');
                        div.appendChild(br);
                    }
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
    panel = document.getElementById('input-section');
    panel.classList = 'panel hidden';
    document.getElementById('header').innerText = 'get jupscared idoit';
    document.getElementById('subtitle').innerText = 'i couldnt think of a better idea';
}