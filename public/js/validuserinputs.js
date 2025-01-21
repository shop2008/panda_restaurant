function validateSearchInput() {
  const searchContent = document.getElementById('guestName').value.trim();
  if (searchContent === '') {
    alert("Please type your keywords to search!");
    return false;
  }
  return true;
}


function validateBookingForm() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('email').value.trim();
  const numberOfChildren = document.getElementById('numberOfChildren').value.trim();
  const numberOfAdults = document.getElementById('numberOfAdults').value.trim();
  const arrivalTime = document.getElementById('arrivalTime').value.trim();
  const roomType = document.getElementById('roomType').value.trim();
  const totalchildren = document.getElementById('numberOfChildren').value.trim();
  const totaladults = document.getElementById('numberOfAdults').value.trim();

  // Check if any of the required fields are empty
  if (!firstName || !lastName || !email || !numberOfChildren || !numberOfAdults || !arrivalTime) {
    alert('Please fill out all required fields.');
    return false;
  }

  // check the number of people in each room
  if (totalchildren !== null && totaladults !== null) {
    const totalPeople = parseInt(totaladults, 10) + parseInt(totalchildren, 10);
    switch (parseInt(roomType, 10)) {
      case 0:
        if (totalPeople > 2) {
          alert(`Maximum capacity for Standard Room is 2. You have ${totalPeople} people.`);
          return false;
        } else {
          return true;
        }

      case 1:
        if (totalPeople > 4) {
          alert(`Maximum capacity for Family Room is 4. You have ${totalPeople} people.`);
          return false;
        } else {
          return true;
        }
      case 2:
        if (totalPeople > 3) {
          alert(`Maximum capacity for Private Room is 3. You have ${totalPeople} people.`);
          return false;
        } else {
          return true;
        }
      case 3:
        if (totalPeople > 6) {
          alert(`Maximum capacity for Mix Dorm Room is 6. You have ${totalPeople} people.`);
          return false;
        } else {
          return true;
        }
      case 4:
        if (totalPeople > 6) {
          alert(`Maximum capacity for Female Dorm Room is 6. You have ${totalPeople} people.`);
          return false;
        } else {
          return true;
        }
      case 5:
        if (totalPeople > 6) {
          alert(`Maximum capacity for Male Dorm Room is 6. You have ${totalPeople} people.`);
          return false;
        } else {
          return true;
        }
      default:
        return false;
    }
  }

  // Check if numbers of children and adults are valid integers
  if (!Number.isInteger(+numberOfChildren) || !Number.isInteger(+numberOfAdults)) {
    alert('Number of children and adults must be a valid number.');
    return false;
  }

  // Validate email format
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    alert('Please enter a valid email address.');
    return false;
  }

  // Validate time format (HH:MM)
  if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(arrivalTime)) {
    alert('Please enter a valid time in HH:MM format.');
    return false;
  }

  // If all validations pass
  return true;
}
