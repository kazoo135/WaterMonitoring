$(function(){
    setDateRange();
    loadChart();
    $(function(){
        $('#analysis-list').change(function() {
            changeDates();
            loadChart();
        });
    });
    $('.formInput').change(function() {
        loadChart();
    });
    $.getScript( "js/functions.js" );
});

function plotMaxTemp(tmpData)
{
    var td = new Array(); //an array of temperature data comtaining: date as string, daily high, daily low
    for(var i = 0; i < tmpData.length; i++){
        if(!realitycheck(tmpData[i][1]))continue;
        var d = new Date(tmpData[i][0]);
        var sd = d.toDateString();
        var fd = findDate(td, sd);
        if(fd > -999)
            td[fd] = [sd, compareTemp(td[fd][1], tmpData[i][1], 0), compareTemp(td[fd][2], tmpData[i][1], 1)];
        else
            td.push([sd, tmpData[i][1], tmpData[i][1]]);
    }

    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'Daily Tmax');
    data.addColumn('number', 'Daily Tmin');

    for(var i = 0; i < td.length; i++){
        td[i][0] = new Date(td[i][0]);
        data.addRow(td[i]);
    }

    draw(data, td.length, 'Choate Pond Temperature Sensor Daily Max/Min Temp');
}

function plotAvg(tmpData)
{
    var td = new Array(); //an array of temperature data comtaining: date as string, total temp sum, number of temps summed
    for(var i=0; i<tmpData.length; i++){
        if(!realitycheck(tmpData[i][1]))continue;
        var d = new Date(tmpData[i][0]);
        var sd = d.toDateString();
        var fd = findDate(td, sd);
        if(fd > -999) {
            td[fd][1] += tmpData[i][1];
            td[fd][2]++;
        }
        else
            td.push([sd, tmpData[i][1], 1]);
    }
    //console.log(td);
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'Daily Avg');

    for(var i = 0; i < td.length; i++){ //calculate averages and convert dates
        td[i][0] = new Date(td[i][0]);
        td[i][1] = td[i][1] / td[i][2];
        data.addRow([td[i][0], td[i][1]]);
    }

    draw(data, td.length, 'Choate Pond Temperature Sensor Daily Average Temp');
}

function plotDTR(tmpData)
{
    var td = new Array(); //an array of temperature data comtaining: date as string, daily high, daily low
    for(var i = 0; i < tmpData.length; i++){
        if(!realitycheck(tmpData[i][1]))continue;
        var d = new Date(tmpData[i][0]);
        var sd = d.toDateString();
        var fd = findDate(td, sd);
        if(fd > -999)
            td[fd] = [sd, compareTemp(td[fd][1], tmpData[i][1], 0), compareTemp(td[fd][2], tmpData[i][1], 1)];
        else
            td.push([sd, tmpData[i][1], tmpData[i][1]]);
    }
    //console.log(td);
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'DTR');

    for(var i = 0; i < td.length; i++){
        td[i][0] = new Date(td[i][0]);
        data.addRow([td[i][0], td[i][1]-td[i][2]]);
    }

    draw(data, td.length, 'Choate Pond Temperature Sensor Daily Temperature Range');
}

function plotLive(tmpData)
{
    var count = tmpData.length;
    //console.log(count);
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'Temperature');

    for(var i = 0; i < tmpData.length; i++)
        data.addRow([new Date(tmpData[i][0]), tmpData[i][1]]);
    draw(data, tmpData.length, 'Choate Pond Temperature Sensor');
}

//function to plot the given data
function draw(data, count, title)
{
    var options = {
        hAxis: {title: 'Day'},
        vAxis: {title: "Temperature (°Fahrenheit)"},
        backgroundColor: '#F9F9F7',
        is3D: true,
        title: title,
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

function changeDates(){
    var analysis = document.getElementById('analysis-list').options[document.getElementById('analysis-list').selectedIndex].value;
    var t1 = new Date(), t2 = new Date();
    var today = new Date();
    switch(analysis) {
        case "live":
            t1.setDate(today.getDate() -7);
            break;
        default:
            t1.setDate(1);
            t1.setMonth(0);
            t1.setFullYear('2016');
            t2.setDate(31);
            t2.setMonth(11);
            t2.setFullYear('2016');
    }
    document.getElementById("date1").value = t1.getMonth()+1 + "/" + t1.getDate() + "/" + t1.getFullYear();
    document.getElementById("date2").value = t2.getMonth()+1 + "/" + t2.getDate() + "/" + t2.getFullYear();
}