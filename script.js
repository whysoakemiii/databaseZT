let tableData = [];


fetch('getData.php')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            document.body.insertAdjacentHTML('beforeend', `<p>Error: ${data.error}</p>`);
            return;
        }

        // Extract data for the chart
        const years = data.years;
        const p_values = data.p_values;
        const pe_values = data.pe_values;
        const r_values = data.r_values;
        const rLong_values = data.rLong_values;
        const cpi_values = data.cpi_values;

        console.log("Years:", years);
        console.log("P Values:", p_values);
        console.log("P/E Values:", pe_values);
        console.log("R Values:", r_values);
        console.log("RLONG Values:", rLong_values);
        console.log("CPI Values:", cpi_values);


        tableData = data.years.map((year, index) => ({
            year: year,
            p: parseFloat(data.p_values[index]),
            pe: parseFloat(data.pe_values[index]),
            r: parseFloat(data.r_values[index]),
            rLong: parseFloat(data.rLong_values[index]),
            cpi: parseFloat(data.cpi_values[index])
        }));

        populateYearDropdown(years);
        populateYearRangeDropdown(years);
        initializeEventListeners();
        displayTableData(tableData);

        // Set initial chart display if years exist
        if (years.length > 0) {
            updateYears(years[0]);
            updateChart(years[0], years[years.length - 1]); // Initialize chart with the first and last year
        }
        const PChart = document.getElementById('PChart').getContext('2d');
        new Chart(PChart, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'P Values',
                    data: p_values,
                    borderColor: '#866DD2',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Year' } },
                    y: { title: { display: true, text: 'Values' } }
                }
            }
        });

        const CPIChart = document.getElementById('cpiChart').getContext('2d');
        new Chart(CPIChart, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'CPI Values',
                    data: cpi_values,
                    borderColor: '#D784AB',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Year' } },
                    y: { title: { display: true, text: 'Values' } }
                }
            }
        });

        // Create PEChart
        const PEChart = document.getElementById('p_eChart').getContext('2d');
        new Chart(PEChart, {
            type: 'line',
            data: {
                labels: years,
                datasets: [{
                    label: 'P/E Values',
                    data: pe_values,
                    borderColor: '#57A3D5',
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Year' } },
                    y: { title: { display: true, text: 'Values' } }
                }
            }
        });

        

        // Event listeners for year range selection
        document.getElementById('startYearSelector').addEventListener('change', (event) => {
            const startYear = event.target.value;
            const endYear = document.getElementById('endYearSelector').value;
            updateChart(startYear, endYear);
        });

        document.getElementById('endYearSelector').addEventListener('change', (event) => {
            const endYear = event.target.value;
            const startYear = document.getElementById('startYearSelector').value;
            updateChart(startYear, endYear);
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.body.insertAdjacentHTML('beforeend', `<p>Error fetching data: ${error.message}</p>`);
    });

function populateYearDropdown(years) {
    const yearSelect = document.getElementById('yearSelect');
    yearSelect.innerHTML = ''; // Clear any previous options

    // Add options to the dropdown
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Add event listener for year selection
    yearSelect.addEventListener('change', (event) => {
        updateYears(event.target.value);
    });
}

function displayTableData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Clear existing rows

    // Populate the table rows
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.year}</td>
            <td>${item.p}</td>
            <td>${item.pe}</td>
            <td>${item.r}</td>
            <td>${item.rLong}</td>
            <td>${item.cpi}</td>
        `;
        tableBody.appendChild(row);
    });
}

function sortTableData(key, ascending) {
    tableData.sort((a, b) => {
        if (ascending) {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });

    // **Updated: Display only top 20 rows**
    const top20Data = tableData.slice(0, 20); // Get the top 20 rows
    displayTableData(top20Data); // Pass the top 20 data to display
}

function initializeEventListeners() {
    const currentSort = { key: null, ascending: true };

    document.querySelectorAll('.sort-btn').forEach(button => {
        button.addEventListener('click', function () {
            const sortKey = this.getAttribute('data-sort');

            // Toggle sorting direction or reset to ascending if a new column is clicked
            if (currentSort.key === sortKey) {
                currentSort.ascending = !currentSort.ascending;
            } else {
                currentSort.key = sortKey;
                currentSort.ascending = true;
            }

            // Perform sorting
            sortTableData(sortKey, currentSort.ascending);
        });
    });

    const searchInput = document.getElementById('searchYearInput');
    searchInput.addEventListener('input', () => {
        const searchValue = searchInput.value.trim();
        filterTableByYear(searchValue);
    });
}

function updateYears(selectedYear) {
    const years = tableData.map(item => item.year);
    const index = years.indexOf(selectedYear);
    if (index === -1) {
        console.error('Year not found:', selectedYear);
        return;
    }

    // Get selected data for the chosen year
    const selectedData = tableData[index];

    // Update the display text in the cards
    document.getElementById('PData').textContent = ` ${selectedData.p}`;
    document.getElementById('RData').textContent = `${selectedData.r}`;
    document.getElementById('CPIData').textContent = `${selectedData.cpi}`;
    document.getElementById('PEData').textContent = `${selectedData.pe}`;
}

function filterTableByYear(searchYear) {
    if (searchYear === '') {
        // If the input is empty, display the full data set
        displayTableData(tableData);
    } else {
        // Filter the table data by the entered year
        const filteredData = tableData.filter(item => item.year.toString().includes(searchYear));
        displayTableData(filteredData);
    }
}
// Populate year dropdowns
function populateYearRangeDropdown(years) {
    const startYearSelect = document.getElementById('startYearSelector');
    const endYearSelect = document.getElementById('endYearSelector');

    years.forEach(year => {
        const startOption = document.createElement('option');
        startOption.value = year;
        startOption.textContent = year;
        startYearSelect.appendChild(startOption);

        const endOption = document.createElement('option');
        endOption.value = year;
        endOption.textContent = year;
        endYearSelect.appendChild(endOption);
    });
}


function updateChart(startYear, endYear) {
    // Filter the data based on the selected years
    const startIndex = tableData.findIndex(item => item.year === startYear);
    const endIndex = tableData.findIndex(item => item.year === endYear);

    // Ensure valid indices
    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        console.error('Invalid year selection:', startYear, endYear);
        return;
    }

    const filteredYears = tableData.slice(startIndex, endIndex + 1).map(item => item.year);
    const filteredRValues = tableData.slice(startIndex, endIndex + 1).map(item => item.r);
    const filteredRLongValues = tableData.slice(startIndex, endIndex + 1).map(item => item.rLong);

    // Create or update RChart
    const RChart = document.getElementById('RChart').getContext('2d');
    const chartData = {
        labels: filteredYears,
        datasets: [{
            label: 'R Values',
            data: filteredRValues,
            borderColor: '#FF8874',
            tension: 0.1
        }, {
            label: 'R Long Values',
            data: filteredRLongValues,
            borderColor: '#08CDA7',
            tension: 0.1
        }]
    };

    // Clear existing chart if it exists
    if (window.RChartInstance) {
        window.RChartInstance.destroy();
    }

    // Create new chart instance
    window.RChartInstance = new Chart(RChart, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                x: { title: { display: true, text: 'Year' } },
                y: { title: { display: true, text: 'Values' } }
            }
        }
    });
}