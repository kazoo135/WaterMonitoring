$(function(){
    setDateRange();
    loadChart();
    $('.formInput').change(function() {
        loadChart();
    });
    $.getScript( "js/functions.js" );
});

function plotMaxTemp(tmpData)
{
    var td = new Array();
    for(var i = 0; i < tmpData.length; i++){
        if(!realitycheck(tmpData[i][1]))continue;
        var d = new Date(tmpData[i][0]);
        var sd = d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear();
        var fd = findDate(td, sd);
        if(fd > -999)
            td[fd] = [sd, compareTemp(td[fd][1], tmpData[i][1], 0), compareTemp(td[fd][2], tmpData[i][1], 1)];
        else
            td.push([sd, tmpData[i][1], tmpData[i][1]]);
    }
    //console.log(td);
    var count = td.length;
    var data = new google.visualization.DataTable();
    data.addColumn('datetime', 'DateTime');
    data.addColumn('number', 'Daily Tmax');
    data.addColumn('number', 'Daily Tmin');

    for(var i = 0; i < td.length; i++){
        td[i][0] = new Date(td[i][0]);
        data.addRow(td[i]);
    }

    var options = {
        hAxis: {title: 'Day'},
        vAxis: {title: "Temperature (°Fahrenheit)"},
        backgroundColor: '#F9F9F7',
        is3D: true,
        title: 'Choate Pond Temperature Sensor Daily Max/Min Temp',
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

//function to find if a date exists in an array and return its index.
function findDate(array, item) {
    for(var m=0; m < array.length; m++)
        if(array[m][0] == item)
            return m;
    return -999;
}

//function to return the largest of 2 temps
function compareTemp(t1, t2, w) {
    if(w == 0) { //find high temp
        if(t1 > t2)
            return t1;
        return t2;
    }//else find low temp
    if(t1 < t2)
        return t1;
    return t2;
}