const form = document.getElementById('candy-form');
const addCandyBtn = document.getElementById('add-candy');
const inputSection = document.getElementById('input-section');
const calendarSection = document.getElementById('calendar-section');
const calendarEl = document.getElementById('calendar');
const resetBtn = document.getElementById('reset');
const dateInput = document.getElementById('date');

form.addEventListener('submit', e => {
    e.preventDefault();
    const endDate = getEndDate();
    showCalendar(endDate);
});

resetBtn.addEventListener('click', () => {
    calendarEl.innerHTML = '';
    inputSection.classList.remove('hidden');
    calendarSection.classList.add('hidden');
});

function getEndDate() {
    const today = new Date();
    const defaultDate = new Date('2026-10-31');
    let inputDate;

    try {
        if (dateInput && dateInput.value) {
            inputDate = new Date(dateInput.value);
            if (isNaN(inputDate.getTime()) || inputDate < today) {
                return defaultDate;
            }
            return inputDate
        }
    } catch {  } //default
    return defaultDate;
}

addCandyBtn.addEventListener('click', () => {
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
    buttons = document.getElementById('candy-buttons');
    form.insertBefore(div, buttons);
    const br = document.createElement('hr');
    form.insertBefore(br, buttons);
});

function showCalendar(endDate) {
    const today = new Date();
    inputSection.classList.add('hidden');
    calendarSection.classList.remove('hidden');
    calendarEl.innerHTML = '';

    const days = []
    for (let d = new Date(today); d <= endDate;
    d.setDate(d.getDate() + 1)) {
        days.push(new Date(d));
    }

    days.forEach(date => {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        div.textContent = formatDate(date);
        calendarEl.appendChild(div);
    });
}

function formatDate(date) {
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`
}