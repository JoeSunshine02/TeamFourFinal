let data, barchart, linechart,multiLineChart;
const parseTime = d3.timeParse("%Y-%m-%d");
/*
d3.csv('data/Agrofood_co2_emission.csv').then(_data => {
    data = _data;

    data = data.filter(dataPoint =>{
        return Object.values(dataPoint).every(value => value !== 'NA');
    });
    data.forEach(d => {
        d["Savanna fires"] = parseFloat(d["Savanna fires"]);
        d["Crop Residues"] = parseFloat(d["Crop Residues"]);
        d["Fertilizers Manufacturing"] = parseFloat(d["Fertilizers Manufacturing"]);
        d["Forest fires"] = parseFloat(d["Pesticides Manufacturing"]);
        d["Rice Cultivation"] = parseFloat(d["Rice Cultivation"]);
        d.Year = parseFloat(d.Year);
        d.rent = +d['Rural population'];
        d.insurance = +d['Urban population'];
    });

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // initialize color scale based on city name

   // console.log(data)
   

    barchart = new BarChart({ parentElement: ".bar-chart" }, data);
    multiLineChart = new MultiLineChart({ parentElement: '.line-chart' }, data);

    multiLineChart.updateVis(["Pesticides Manufacturing","Crop Residues","Fertilizers Manufacturing",
                            "Savanna fires","Rice Cultivation"]);

    scatterplot = new ScatterPlot({parentElement: '#scatterplot'}, data, colorScale);
    scatterplot.updateVis();
    //linechart = new LineChart({ parentElement: ".line-chart" }, data);
})


.catch(error => console.error(error));
// Todo
*/
document.addEventListener('DOMContentLoaded', function() {
    d3.csv('data/Agrofood_co2_emission.csv').then(_data => {
        // Parse and process data
        _data.forEach(d => {
            d["Savanna fires"] = +d["Savanna fires"];
            d["Crop Residues"] = +d["Crop Residues"];
            d["Forest fires"] = +d["Forest fires"];
            d["Rice Cultivation"] = +d["Rice Cultivation"];
            d["Pesticides Manufacturing"] = +d["Pesticides Manufacturing"];
            d.Year = new Date(d.Year, 0);  // Convert year to date object for the x-axis
        });

        // Filter data to include only specific countries
        const specifiedCountries = ['Brazil', 'China', 'Egypt', 'Germany', 'India', 'United States of America'];
        const filteredData = _data.filter(d => specifiedCountries.includes(d.Area));

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
            containerHeight: 500
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