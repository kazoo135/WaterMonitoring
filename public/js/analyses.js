$(function(){
    waitMsg();
    setDateRange();
    loadChart();
    displayAnalysisDescription();
    $(function(){
        $('#analysis-list').change(function() {
            waitMsg();
            showBase();
            loadChart();
            displayAnalysisDescription();
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

    draw(data, td.length, 'Choate Pond Temperature Sensor Daily Max/Min Temp','Day');
}

function plotAvg(tmpData)
{
    var td = new Array(); //an array of temperature data containing: date as string, total temp sum, number of temps summed
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

    draw(data, td.length, 'Choate Pond Temperature Sensor Daily Average Temp','Day');
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

    draw(data, td.length, 'Choate Pond Temperature Sensor Daily Temperature Range','Day');
}

function plotCDD(tmpData)
{
    var T0 = document.getElementById("T0").value;
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
    for(var i = 0; i < td.length; i++) {
        td[i][0] = new Date(td[i][0]);
        td[i][1] = (td[i][1]+td[i][2])/2 - T0;
        if(td[i][1]<0)
            td[i][1] = 0;
    }
    var monthlySum = [0,0,0,0,0,0,0,0,0,0,0,0];
    for(var i = 0; i < td.length; i++) { //for every month in our year, calculate cumulative degree days
        var m = td[i][0].getMonth();
        
        monthlySum[m] = monthlySum[m]+td[i][1];
    }
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Month');
    data.addColumn('number', 'CDD');

    for(var i=0; i<monthlySum.length; i++)
        data.addRow([i+1, monthlySum[i]]);

    draw(data, monthlySum.length, 'Choate Pond Temperature Sensor Cumulative Degree Days', 'Month');
}

function plotLive(tmpData)
{
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'Temperature');

    for(var i = 0; i < tmpData.length; i++)
        data.addRow([new Date(tmpData[i][0]), tmpData[i][1]]);
    draw(data, tmpData.length, 'Choate Pond Temperature Sensor');
}

//function to plot the given data
function draw(data, count, title, xaxis)
{
    var options = {
        hAxis: {title: xaxis},
        vAxis: {title: "Temperature (°Celsius)"},
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

function showBase(){
    var analysis = document.getElementById('analysis-list').options[document.getElementById('analysis-list').selectedIndex].value;
    var baseInput = document.getElementById('selectT0');
    var dateInput = document.getElementById('dateRange');
    var yearInput = document.getElementById('yearRange');
    switch(analysis) {
        case "cdd":
            yearInput.className = "peer";
            dateInput.className = "peer hidden";
            baseInput.className = "layers bd bgc-white p-20";
            break;
        default:
            baseInput.className = "layers bd bgc-white p-20 hidden";
            dateInput.className = "peer";
            yearInput.className = "peer hidden";
    }
}