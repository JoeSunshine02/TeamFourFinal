let data, barchart, parallelCoordinates;

d3.csv('Agrofood_co2_emissions.csv').then(_data => {
    data = _data;
    const keys = ['culmen_length_mm', 'culmen_depth_mm', 'flipper_length_mm', 'body_mass_g'];

    
    barchart = new BarChart({ parentElement: ".bar-chart" }, data);
    linechart = new LineChart({ parentElement: ".line-chart" }, data);

})


.catch(error => console.error(error));
// Todo