let data, barchart, linechart,multiLineChart;
const parseTime = d3.timeParse("%Y-%m-%d");

document.addEventListener('DOMContentLoaded', function() {
    d3.csv('data/Agrofood_co2_emission.csv').then(_data => {
        // Parse and process data
        _data.forEach(d => {
            d["Savanna fires"] = +d["Savanna fires"];
            d["Crop Residues"] = +d["Crop Residues"];
            d["Forest fires"] = +d["Forest fires"];
            d["Rice Cultivation"] = +d["Rice Cultivation"];
            d["Pesticides Manufacturing"] = +d["Pesticides Manufacturing"];
            //d.Year = parseFloat(d.Year);
            d.Year = new Date(d.Year, 0);  // Convert year to date object for the x-axis
        });

        // Filter data to include only specific countries
        const specifiedCountries = ['Brazil', 'China', 'Egypt', 'Germany', 'India', 'United States of America'];
        const filteredData = _data.filter(d => specifiedCountries.includes(d.Area));
        console.log(filteredData);

        // Populate dropdown with specified countries
        const dropdown = document.getElementById('country-selector');
        specifiedCountries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            dropdown.appendChild(option);
        });
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Initialize chart

        const chart = new MultiLineChart({
            parentElement: '#lineChart',
            containerWidth: 900,
            containerHeight: 560
        }, filteredData);

        barchart = new BarChart({ 
            parentElement: ".bar-chart" 
        }, _data);

        scatterplot = new ScatterPlot({
            parentElement: '.scatterplot'
        }, _data, colorScale);

        scatterplot.updateVis();

        // Update the chart when a new country is selected
        dropdown.addEventListener('change', function() {
            chart.filterDataByCountry(this.value);
        });

        // Display the chart for the first country in the dropdown
        dropdown.dispatchEvent(new Event('change'));
    }).catch(error => {
        console.error('Error loading the CSV data: ', error);
    });
});