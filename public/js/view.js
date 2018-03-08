$(function(){
    setDateRange();
    loadChart();
    $('.formInput').change(function() {
        loadChart();
    });
    $.getScript( "js/functions.js" );
});

var fun = require("functions.js");

// funtion to draw the chart of live data
function drawChart(tmpData) {
    console.log(tmpData);
    var count = tmpData.length;

    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'Outside Temp');

    if(document.getElementById("sen1").checked)
        data.addColumn('number', 'Sensor 1');
    if(document.getElementById("sen2").checked)
        data.addColumn('number', 'Sensor 2');
    if(document.getElementById("sen3").checked)
        data.addColumn('number', 'Sensor 3');

    for(var i = 0; i < tmpData.length; i++){
        tmp = new Array();
        tmp.push(new Date(tmpData[i][0]));
        for(var j = 1; j < tmpData[i].length; j++){
            tmp.push(tmpData[i][j]);
        }
        data.addRow(tmp);
    }
    // data.addRows(tmpData);

    var options = {
        hAxis: {title: 'Day'},
        vAxis: {title: "Temperature (°Fahrenheit)"},
        backgroundColor: '#F9F9F7',
        is3D: true,
        title: 'Choate Pond Temperature Sensor',
        legend: { position: 'bottom', alignment: 'center' },
        chartArea: {'right': '20', 'width': '90%'},
        height: '500',
    };

    var graphType = $("input[name='graph']:checked").val();
    if(graphType == 'line')var chart = new google.visualization.LineChart(document.getElementById('chart'));
    else if(graphType == 'hist')var chart = new google.visualization.Histogram(document.getElementById('chart'));
    else if(graphType == 'bar')var chart = new google.visualization.BarChart(document.getElementById('chart'));
    else if(graphType == 'dot')var chart = new google.visualization.ScatterChart(document.getElementById('chart'));
    else if(graphType == 'area')var chart = new google.visualization.AreaChart(document.getElementById('chart'));
    else return;

    chart.draw(data, options);
    $('#rcrdRtrnd').html(count);
}