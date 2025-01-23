class ViewController {
  constructor() {
  }

  //create dynamic view contents for ejs temaple
  async createSearchResultTable(data) {
    if (data) {
      let html = '';

      data.forEach(booking => {
        html += `<tr>
                    <td>${booking.booking_id}</td>
                    <td>${booking.first_name} ${booking.last_name}</td>
                    <td>${booking.email}</td>
                    <td>${booking.phone}</td>
                    <td>${booking.number_of_guests}</td>
                    <td>${booking.date.toLocaleDateString()}</td>
                    <td>${booking.time}</td>
                    <td>${booking.table_type}</td>
                    <td>${booking.special_requests}</td>
                    <td>${booking.status}</td>
                </tr>`;
      });

      return html;

    } else {
      let html = `<tr>
                    <td colspan='10' style='color:blue; font-weight:800;'>No reservations found matching your search criteria.</td>
                    </tr>`;
      return html;
    }
  }

}
module.exports = new ViewController();
