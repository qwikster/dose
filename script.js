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
                <input type="number" name="qty" class="candy-qty" placeholder="qty" min="1" required>
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
            </div>`
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
            const qty = parseInt(entry.querySelector('.candy-qty').value, 10)
            const rating = parseInt(entry.querySelector('.rating-slider').dataset.rating || '0', 10);
            if (!name || isNaN(qty) || qty < 1 || rating === 0) {
                valid = false;
                return;
            }
            candies.push({ name, qty, rating });
        });
        if (!valid) {
            alert('Fill all fields!');
            return;
        }
        const startDateStr = document.getElementById('date').value;
        const startDate = new Date(startDateStr);
        const isBalanced = document.getElementById('mode-toggle').checked;
        let allItems = [];
        candies.forEach(c => {
            for (let i = 0; i < c.qty; i++) {
                allItems.push({ name: c.name, rating: c.rating });
            }
        });
        if (isBalanced) {
            allItems.sort((a, b) => b.rating - a.rating);
            const result = [];
            let left = 0, right = allItems.length - 1;
            while (left <= right) {
                if (left === right) {
                    result.push(allItems[left]);
                    break;
                }
                result.push(allItems[left]);
                left++;
                result.push(allItems[right]);
                right--;
            }
            allItems = result;
        } else { // isBalanced == false
            for (let i = allItems.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
            }
        }
        calendar.innerHTML = '';
        allItems.forEach((item, index) => {
            const dayDate = new Date(startDate);
            dayDate.setDate(startDate.getDate() + index);
            const dateStr = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const div = document.createElement('div');
            div.className = 'calendar-day';
            div.dataset.candy = item.name;
            div.textContent = `${dateStr}:\n${item.name}`
            calendar.appendChild(div);
        });
        inputSection.classList.add('hidden');
        calendarSection.classList.remove('hidden');
    });

    resetBtn.addEventListener('click', () => {
        calendarSection.classList.add('hidden');
        inputSection.classList.remove('hidden');
    });
});