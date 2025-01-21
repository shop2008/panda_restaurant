function validateSearchInput() {
  const searchContent = document.getElementById('guestName').value.trim();
  if (searchContent === '') {
    alert('Please type your keywords to search!');
    return false;
  }
  return true;
}

function validateBookingForm() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const numberOfGuests = document.getElementById('numberOfGuests').value.trim();
  const date = document.getElementById('date').value.trim();
  const time = document.getElementById('time').value.trim();
  const tableType = document.getElementById('tableType').value.trim();

  // Check if required fields are empty
  if (
    !firstName ||
    !lastName ||
    !email ||
    !numberOfGuests ||
    !date ||
    !time ||
    !tableType
  ) {
    alert('Please fill out all required fields.');
    return false;
  }

  // Validate number of guests based on table type
  const guests = parseInt(numberOfGuests, 10);
  switch (tableType) {
    case '0': // Two-seater
      if (guests > 2) {
        alert('Two-seater table can only accommodate up to 2 guests');
        return false;
      }
      break;
    case '1': // Four-seater
      if (guests > 4) {
        alert('Four-seater table can only accommodate up to 4 guests');
        return false;
      }
      break;
    case '2': // Six-seater
      if (guests > 6) {
        alert('Six-seater table can only accommodate up to 6 guests');
        return false;
      }
      break;
    case '3': // Large group
      if (guests > 12) {
        alert('Large group tables can accommodate up to 12 guests');
        return false;
      }
      break;
  }

  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  // Validate time format (HH:MM)
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    alert('Please enter a valid time in HH:MM format.');
    return false;
  }

  // If all validations pass
  return true;
}
