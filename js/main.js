let data, barchart, linechart;

d3.csv('data/Agrofood_co2_emission.csv').then(_data => {
    data = _data;

    data = data.filter(dataPoint =>{
        return Object.values(dataPoint).every(value => value !== 'NA');
    });
     

   // console.log(data)

    barchart = new BarChart({ parentElement: ".bar-chart" }, data);
    linechart = new LineChart({ parentElement: ".line-chart" }, data);

})


.catch(error => console.error(error));
// Todo