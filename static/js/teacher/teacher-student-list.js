// Teacher Student List JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize DataTable
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('#studentTable').DataTable({
            paging: true,
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50],
            order: [[1, 'asc']],
            columnDefs: [
                { orderable: false, targets: 4 }
            ],
            language: {
                search: 'Search students:',
                lengthMenu: 'Show _MENU_ entries',
                info: 'Showing _START_ to _END_ of _TOTAL_ students',
                infoEmpty: 'No students to show',
                infoFiltered: '(_MAX_ total)',
                zeroRecords: 'No matching students found',
                paginate: {
                    next: 'Next',
                    previous: 'Previous'
                }
            },
            dom: '<"tsl-datatable-header d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 p-3 border-bottom"l<"w-100"f>><"tsl-table-scroll-wrapper"t><"tsl-datatable-footer d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 p-3 border-top"ip>'
        });

        // Action Button Handlers - View Student
        // Links work natively via href, no JS handler needed
    }

    // Set active menu item
    const navStudentList = document.getElementById('nav-student-list');
    if (navStudentList) {
        navStudentList.classList.add('active');
        // Open parent dropdown
        const parentDropdown = navStudentList.closest('.sidebar-dropdown');
        if (parentDropdown) {
            parentDropdown.classList.add('active');
        }
    }
});
