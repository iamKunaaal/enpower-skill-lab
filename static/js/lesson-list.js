/**
 * ========================================
 * LESSON LIST PAGE FUNCTIONALITY
 * ========================================
 */

$(document).ready(function() {
    // Initialize DataTable
    const table = $('#llLessonsTable').DataTable({
        paging: true,
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        order: [[1, 'asc']], // Sort by Lesson Title
        autoWidth: false,
        columnDefs: [
            { orderable: false, targets: [0, 8] }, // Disable sorting on Checkbox and Actions columns
            { width: '50px', targets: 0 },    // Checkbox
            { width: '250px', targets: 1 },   // Lesson Title
            { width: '120px', targets: 2 },   // Type
            { width: '150px', targets: 3 },   // Competency
            { width: '100px', targets: 4 },   // Level
            { width: '120px', targets: 5 },   // Status
            { width: '120px', targets: 6 },   // Created
            { width: '120px', targets: 7 },   // Updated
            { width: '120px', targets: 8 }    // Actions
        ],
        language: {
            search: 'Search lessons:',
            lengthMenu: 'Show _MENU_ entries',
            info: 'Showing _START_ to _END_ of _TOTAL_ lessons',
            infoEmpty: 'No lessons to show',
            infoFiltered: '(_MAX_ total)',
            zeroRecords: 'No matching lessons found',
            paginate: {
                next: 'Next',
                previous: 'Previous'
            }
        },
        dom: '<"ll-datatable-header d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 p-3 border-bottom"l<"w-100"f>><"ll-table-scroll-wrapper"t><"ll-datatable-footer d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3 p-3 border-top"ip>'
    });

    // Function to update delete button visibility and count
    function updateDeleteButton() {
        const checkedCheckboxes = $('.ll-row-checkbox:checked').length;
        const deleteBtn = $('#llBulkDeleteBtn');
        const countSpan = $('#llSelectedCount');

        if (checkedCheckboxes > 0) {
            deleteBtn.removeClass('d-none');
            countSpan.text(checkedCheckboxes);
        } else {
            deleteBtn.addClass('d-none');
            countSpan.text(0);
        }
    }

    // Select All functionality
    $('#llSelectAll').on('click', function() {
        const isChecked = $(this).prop('checked');
        $('.ll-row-checkbox').prop('checked', isChecked);
        updateDeleteButton();
    });

    // Individual checkbox click (using event delegation for DataTables)
    $('#llLessonsTable tbody').on('click', '.ll-row-checkbox', function() {
        const totalCheckboxes = $('.ll-row-checkbox').length;
        const checkedCheckboxes = $('.ll-row-checkbox:checked').length;
        $('#llSelectAll').prop('checked', totalCheckboxes === checkedCheckboxes);
        updateDeleteButton();
    });

    // Bulk Delete functionality
    $('#llBulkDeleteBtn').on('click', function() {
        const checkedCheckboxes = $('.ll-row-checkbox:checked');
        const count = checkedCheckboxes.length;

        if (count === 0) {
            alert('Please select at least one lesson to delete.');
            return;
        }

        // Confirm deletion
        if (confirm(`Are you sure you want to delete ${count} lesson${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
            // Collect lesson IDs for deletion
            const lessonIds = [];
            checkedCheckboxes.each(function() {
                const lessonId = $(this).data('lesson-id');
                if (lessonId) {
                    lessonIds.push(lessonId);
                }
            });

            // If we have lesson IDs, submit for deletion
            if (lessonIds.length > 0) {
                // Create a form and submit
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = window.location.pathname;
                
                // Add CSRF token
                const csrfInput = document.createElement('input');
                csrfInput.type = 'hidden';
                csrfInput.name = 'csrfmiddlewaretoken';
                csrfInput.value = $('input[name="csrfmiddlewaretoken"]').val();
                form.appendChild(csrfInput);
                
                // Add action type
                const actionInput = document.createElement('input');
                actionInput.type = 'hidden';
                actionInput.name = 'action';
                actionInput.value = 'bulk_delete';
                form.appendChild(actionInput);
                
                // Add lesson IDs
                lessonIds.forEach(id => {
                    const idInput = document.createElement('input');
                    idInput.type = 'hidden';
                    idInput.name = 'lesson_ids';
                    idInput.value = id;
                    form.appendChild(idInput);
                });
                
                document.body.appendChild(form);
                form.submit();
            } else {
                // Fallback: remove rows from table visually
                checkedCheckboxes.each(function() {
                    const row = $(this).closest('tr');
                    table.row(row).remove();
                });
                table.draw();
                $('#llSelectAll').prop('checked', false);
                updateDeleteButton();
                alert(`Successfully deleted ${count} lesson${count > 1 ? 's' : ''}.`);
            }
        }
    });

    // Single delete confirmation
    $(document).on('click', '.ll-delete-btn', function(e) {
        if (!confirm('Are you sure you want to delete this lesson?')) {
            e.preventDefault();
        }
    });
});
