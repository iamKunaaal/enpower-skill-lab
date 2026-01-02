/**
 * ========================================
 * CLASS LIST PAGE FUNCTIONALITY
 * ========================================
 */

$(document).ready(function() {
    /**
     * ========================================
     * UTILITY FUNCTION: Extract Plain Text from HTML
     * ========================================
     */
    function extractPlainText(html) {
        if (!html) return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        return tempDiv.textContent.trim().replace(/\s+/g, ' ');
    }

    /**
     * ========================================
     * CUSTOM FILTER FUNCTION FOR DATATABLES
     * ========================================
     */
    $.fn.dataTable.ext.search.push(
        function(settings, data, dataIndex) {
            if (settings.nTable.id !== 'classTable') {
                return true;
            }

            const locationFilter = $('#locationFilter').val();
            const schoolFilter = $('#schoolFilter').val();
            const yearFilter = $('#yearFilter').val();
            const statusFilter = $('#statusFilter').val();

            const schoolNameText = extractPlainText(data[0]);
            const yearText = extractPlainText(data[2]);
            const statusText = extractPlainText(data[5]);

            if (locationFilter && schoolNameText.indexOf(locationFilter) === -1) {
                return false;
            }

            if (schoolFilter && schoolNameText.indexOf(schoolFilter) === -1) {
                return false;
            }

            if (yearFilter && yearText.indexOf(yearFilter) === -1) {
                return false;
            }

            if (statusFilter && statusText.indexOf(statusFilter) === -1) {
                return false;
            }

            return true;
        }
    );

    /**
     * ========================================
     * DATATABLE INITIALIZATION
     * ========================================
     */
    let table;

    const updatePaginationInfo = function() {
        if (!table) return;
        const info = table.page.info();
        $('#startEntry').text(info.start + 1);
        $('#endEntry').text(info.end);
        $('#totalEntries').text(info.recordsDisplay);
        generatePaginationButtons(info);
    }

    const generatePaginationButtons = function(info) {
        if (!table) return;
        const container = $('#paginationButtons');
        container.empty();

        const totalPages = info.pages;
        const currentPage = info.page;

        // Previous button
        const prevBtn = $('<button class="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>');
        if (currentPage === 0 || totalPages === 0) prevBtn.attr('disabled', true);
        prevBtn.on('click', function() {
            table.page('previous').draw('page');
        });
        container.append(prevBtn);

        // Page number buttons
        if (totalPages > 0) {
            for (let i = 0; i < totalPages; i++) {
                if (i === 0 || i === totalPages - 1 || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    const pageBtn = $('<button class="page-btn">' + (i + 1) + '</button>');
                    if (i === currentPage) pageBtn.addClass('active');
                    pageBtn.on('click', function() {
                        table.page(i).draw('page');
                    });
                    container.append(pageBtn);
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    container.append('<span class="page-ellipsis">...</span>');
                }
            }
        }

        // Next button
        const nextBtn = $('<button class="page-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>');
        if (currentPage === totalPages - 1 || totalPages === 0) nextBtn.attr('disabled', true);
        nextBtn.on('click', function() {
            table.page('next').draw('page');
        });
        container.append(nextBtn);
    }

    // Initialize DataTable
    table = $('#classTable').DataTable({
        pageLength: 10,
        order: [[0, 'asc'], [1, 'asc']],
        autoWidth: false,
        columnDefs: [
            { orderable: false, targets: [6], className: 'text-center' },
            { className: 'text-center', targets: [4, 6] }
        ],
        drawCallback: function() {
            updatePaginationInfo();
        }
    });

    /**
     * ========================================
     * FILTER EVENT HANDLERS
     * ========================================
     */

    $('#globalSearch').on('keyup', function() {
        table.search(this.value).draw();
    });

    $('#locationFilter').on('change', function() {
        table.draw();
    });

    $('#schoolFilter').on('change', function() {
        table.draw();
    });

    $('#yearFilter').on('change', function() {
        table.draw();
    });

    $('#statusFilter').on('change', function() {
        table.draw();
    });

    $('#resetFiltersBtn').on('click', function(e) {
        e.preventDefault();
        $('#locationFilter').val('');
        $('#schoolFilter').val('');
        $('#yearFilter').val('');
        $('#statusFilter').val('');
        $('#globalSearch').val('');
        table.search('').draw();
    });

    $('#rowsPerPage').on('change', function() {
        table.page.len(parseInt($(this).val())).draw();
    });

    updatePaginationInfo();
});

/**
 * ========================================
 * EDIT DRAWER FUNCTIONALITY
 * ========================================
 */

function openEditDrawer() {
    $('#drawerOverlay').addClass('active');
    $('#editDrawer').addClass('active');
    $('body').css('overflow', 'hidden');
}

function closeEditDrawer() {
    $('#drawerOverlay').removeClass('active');
    $('#editDrawer').removeClass('active');
    $('body').css('overflow', '');
}

$(document).ready(function() {
    $('#drawerOverlay').on('click', function() {
        closeEditDrawer();
    });

    $('#closeDrawerBtn').on('click', function() {
        closeEditDrawer();
    });

    $('#cancelDrawerBtn').on('click', function() {
        closeEditDrawer();
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $('#editDrawer').hasClass('active')) {
            closeEditDrawer();
        }
    });

    $('.drawer-toggle-switch').on('click', function() {
        $(this).toggleClass('active');
    });

    // Edit button click handler
    $(document).on('click', '.edit-class-btn', function() {
        const classId = $(this).data('class-id');
        const row = $(this).closest('tr');
        
        // Populate drawer with row data
        // This would typically fetch data from the server
        openEditDrawer();
    });

    $('#updateClassBtn').on('click', function() {
        // Collect and submit form data
        closeEditDrawer();
    });
});
