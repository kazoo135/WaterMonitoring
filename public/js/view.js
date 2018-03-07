$(function(){
    setDateRange();
    loadChart();
    $('.formInput').change(function() {
        loadChart();
    });
});

// $(window).resize(function(){
//     loadChart();
// });

// function to get data from db
function getData(_callback) {
    /*var e = document.getElementById("db-list");
    var db = e.options[e.selectedIndex].value;*/
    var db = "envdata2";

    var dateInput1 = document.getElementById('date1').value;
    var dateInput2 = document.getElementById('date2').value;
    var fromDate = new Date(dateInput1).getTime();
    var toDate = new Date(dateInput2).getTime();

    var sensor1 = document.getElementById("sen1").checked;
    var sensor2 = document.getElementById("sen2").checked;
    var sensor3 = document.getElementById("sen3").checked;

    $.post( "/get-data", {db: db, from: fromDate, to: toDate, sensor1: sensor1, sensor2: sensor2, sensor3: sensor3}, function(data, status) {
        return _callback(data);
    });
}

// funtion to draw the chart
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

function plotMaxTemp(tmpData)
{
    var td = new Array();
    for(var i = 0; i < tmpData.length; i++){
        if(!realitycheck(tmpData[i][2]))continue;
        var d = new Date(tmpData[i][0]);
        var sd = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
        var fd = findDate(td, sd);
        if(fd > -999)
            td[fd] = [sd, compareTemp(td[fd][1], tmpData[i][2])];
        else
            td.push([sd, tmpData[i][2]])
    }
    console.log(td);
    var count = td.length;
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'Sensor 2');

    for(var i = 0; i < td.length; i++){
        tmp = new Array();
        tmp.push(new Date(td[i][0]));
        tmp.push(td[i][1]);
        data.addRow(tmp);
    }

    var options = {
        hAxis: {title: 'Day'},
        vAxis: {title: "Temperature (°Fahrenheit)"},
        backgroundColor: '#F9F9F7',
        is3D: true,
        title: 'Choate Pond Temperature Sensor Daily Max Temp',
        legend: { position: 'bottom', alignment: 'center' },
        chartArea: {'right': '20', 'width': '90%'},
        height: '500',
    };
    //var table = new google.visualization.Table(document.getElementById('table'));
    var chart = new google.charts.Line(document.getElementById('chart'));

    //table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
    chart.draw(data, google.charts.Line.convertOptions(options));
    $('#rcrdRtrnd').html(count);
}

function loadChart() {
    $('#errMsg').html('');
    getData(function(tmpData) {
        if (tmpData['msg'] == ""){
            //console.log(tmpData);
            google.charts.load('current', {packages: ['line']});
            google.charts.load('current', {'packages':['table']});
            //google.charts.setOnLoadCallback(function(){drawChart(tmpData['data']);});
            google.charts.setOnLoadCallback(function(){plotMaxTemp(tmpData['data']);});
        }else {
            $('#errMsg').html(tmpData['msg']);
        }

    });
}

// function to set date picker range to last week
function setDateRange(){
    $('.datepicker').datepicker({})
    $('#date1').datepicker("setDate", new Date(new Date() - (7 * 24 * 60 * 60 * 1000)));
    $('#date2').datepicker("setDate", new Date());
}

function findDate(array, item) {
    for(var m=0; m < array.length; m++)
        if(array[m][0] == item)
            return m;
    return -999;
}

function compareTemp(t1, t2) {
    if(t1 > t2)
        return t1;
    return t2;
}

function realitycheck(t)
{
    if(t < -100 || t > 150)
        return false;
    return true;
}