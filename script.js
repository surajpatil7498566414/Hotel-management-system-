let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
let editingIndex = null;

function saveBookingsToLocalStorage() {
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

document.getElementById('booking-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const guestName = document.getElementById('guest-name').value;
    const guestContact = document.getElementById('guest-contact').value;
    const roomType = document.getElementById('room-type').value;
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const payment = document.getElementById('payment').value;

    const bookingData = {
        guestName,
        guestContact,
        roomType,
        checkIn,
        checkOut,
        payment
    };

    if (editingIndex !== null) {
        bookings[editingIndex] = bookingData;
        editingIndex = null;
        document.getElementById('submit-btn').textContent = 'Book Room';
    } else {
        bookings.push(bookingData);
    }

    saveBookingsToLocalStorage();
    displayBookings();
    updateSummary();
    document.getElementById('booking-form').reset();
});

function displayBookings(filteredBookings = bookings) {
    const bookingsList = document.getElementById('bookings-list');
    bookingsList.innerHTML = filteredBookings.map((booking, index) => `
        <tr>
            <td>${booking.guestName}</td>
            <td>${booking.guestContact}</td>
            <td>${booking.roomType}</td>
            <td>${booking.checkIn}</td>
            <td>${booking.checkOut}</td>
            <td>₹${booking.payment}</td>
            <td>
                <button onclick="editBooking(${index})">Update</button>
                <button onclick="removeBooking(${index})">Cancel</button>
            </td>
        </tr>
    `).join('');
}

function calculatePayment() {
    const roomPrices = {
        "Single": 3000,
        "Standard": 5000,
        "Family Suite": 7000,
        "Premium": 8000,
        "Presidential Suite": 15000,
        "Penthouse Suite": 20000
    };
    const roomType = document.getElementById('room-type').value;
    const checkIn = new Date(document.getElementById('check-in').value);
    const checkOut = new Date(document.getElementById('check-out').value);
    const days = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    if (roomType && days > 0) {
        document.getElementById('payment').value = days * roomPrices[roomType];
    }
}

document.getElementById('room-type').addEventListener('change', calculatePayment);
document.getElementById('check-in').addEventListener('change', calculatePayment);
document.getElementById('check-out').addEventListener('change', calculatePayment);

function editBooking(index) {
    const booking = bookings[index];
    document.getElementById('guest-name').value = booking.guestName;
    document.getElementById('guest-contact').value = booking.guestContact;
    document.getElementById('room-type').value = booking.roomType;
    document.getElementById('check-in').value = booking.checkIn;
    document.getElementById('check-out').value = booking.checkOut;
    document.getElementById('payment').value = booking.payment;
    editingIndex = index;
    document.getElementById('submit-btn').textContent = 'Update Booking';
}

function removeBooking(index) {
    bookings.splice(index, 1);
    saveBookingsToLocalStorage();
    displayBookings();
    updateSummary();
}

function searchCurrentBookings() {
    const searchValue = document.getElementById('current-booking-search').value.toLowerCase();
    const filteredBookings = bookings.filter(booking =>
        booking.guestName.toLowerCase().includes(searchValue)
    );
    displayBookings(filteredBookings);
}

// Booking Summary Calculation
function updateSummary() {
    const totalBookings = bookings.length;
    const totalPayment = bookings.reduce((sum, booking) => sum + Number(booking.payment), 0);

    document.getElementById('summary-total').textContent = `Total Bookings: ${totalBookings}`;
    document.getElementById('summary-payment').textContent = `Total Payment Collected: ₹${totalPayment}`;
}

// Initial display of bookings and summary on page load
displayBookings();
updateSummary();