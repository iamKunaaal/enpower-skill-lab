$(function () {
  $('#schoolTable').DataTable({
    paging: true,
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50],
    order: [[1, 'asc']],
    columnDefs: [
      { orderable: false, targets: 6 }
    ],
    language: {
      search: 'Search schools:',
      lengthMenu: 'Show _MENU_ entries',
      info: 'Showing _START_ to _END_ of _TOTAL_ schools',
      infoEmpty: 'No schools to show',
      infoFiltered: '(_MAX_ total)',
      zeroRecords: 'No matching schools found',
      paginate: {
        next: 'Next',
        previous: 'Previous'
      }
    },
    dom: '<"datatable-header d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 p-3 border-bottom"l<"w-100"f>><"table-scroll-wrapper"t><"datatable-footer d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 p-3 border-top"ip>'
  });

  // Action Button Handlers
  $('#schoolTable').on('click', 'button', function (e) {
    const $btn = $(this);
    const $row = $btn.closest('tr');
    const $cells = $row.find('td');

    // Extract row data
    const rowData = {
      id: $cells.eq(0).text().trim(),
      name: $cells.eq(1).find('span').last().text().trim(),
      location: $cells.eq(2).text().trim(),
      contact: $cells.eq(3).text().trim(),
      students: $cells.eq(4).text().trim(),
      status: $cells.eq(5).text().trim()
    };

    // Determine which button was clicked
    const btnIcon = $btn.find('.material-symbols-outlined').text();

    if (btnIcon === 'visibility') {
      handleView(rowData);
    }
  });

  function handleView(data) {
    const params = new URLSearchParams({
      id: data.id,
      name: data.name,
      location: data.location,
      contact: data.contact,
      students: data.students,
      status: data.status
    });
    window.location.href = `view-school.html?${params.toString()}`;
  }
});
