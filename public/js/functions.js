// function to get data from db
function getData(_callback) {
    /*var e = document.getElementById("db-list");
    var db = e.options[e.selectedIndex].value;*/
    var analysis = document.getElementById('analysis-list').options[document.getElementById('analysis-list').selectedIndex].value;
    var db = "simulationdb";

    if(analysis == "cdd") {
        var dateInput = document.getElementById('year-list').options[document.getElementById('year-list').selectedIndex].value;
        var fromDate = new Date("01/01/2000").setFullYear(dateInput);
        var toDate = new Date("12/31/2000").setFullYear(dateInput);
    }
    else {
        var dateInput1 = document.getElementById('date1').value;
        var dateInput2 = document.getElementById('date2').value;
        var fromDate = new Date(dateInput1).getTime();
        var toDate = new Date(dateInput2).getTime();
    }
    

    /*var sensor1 = document.getElementById("sen1").checked;
    var sensor2 = document.getElementById("sen2").checked;
    var sensor3 = document.getElementById("sen3").checked;*/
    var sensor1=false;
    var sensor2=true;
    var sensor3=false;

    $.post( "/get-data", {db: db, from: fromDate, to: toDate, sensor1: sensor1, sensor2: sensor2, sensor3: sensor3}, function(data, status) {
        return _callback(data);
    });
}

function loadChart() {
    $('#errMsg').html('');
    var analysis = document.getElementById('analysis-list').options[document.getElementById('analysis-list').selectedIndex].value;
    getData(function(tmpData) {
        if (tmpData['msg'] == ""){
            //console.log(tmpData);
            google.charts.load('current', {packages: ['line']});
            google.charts.load('current', {'packages':['table']});
            //google.charts.setOnLoadCallback(function(){drawChart(tmpData['data']);});
            google.charts.setOnLoadCallback(function() {
                switch(analysis) {
                    case "maxmin":
                        plotMaxTemp(tmpData['data']);
                        break;
                    case "avg":
                        plotAvg(tmpData['data']);
                        break;
                    case "dtr":
                        plotDTR(tmpData['data']);
                        break;
                    case "cdd":
                        plotCDD(tmpData['data']);
                        break;
                    default:
                        plotLive(tmpData['data']);
                }
            });
        }else {
            $('#errMsg').html(tmpData['msg']);
            $('#rcrdRtrnd').html('');
            $('#chart').html('');
        }

    });
}

function exportData() {
    getData(function(tmpData) {
        if (tmpData['msg'] == ""){
            let csvContent = "data:text/csv;charset=utf-8,";
            csvContent += "datetime,water_tmp" + "\r\n";
            tmpData['data'].forEach(function(rowArray){
                let row = rowArray.join(",");
                csvContent += row + "\r\n";
            });
            var encodedUri = encodeURI(csvContent);
            //window.open(encodedUri);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "tempData.csv");
            document.body.appendChild(link);
            link.click();
        }else {
            $('#errMsg').html(tmpData['msg']);
            $('#rcrdRtrnd').html('');
            $('#chart').html('');
        }
    });
}

//function to convert date from utc to mm/dd/yyyy format
function formatDate(date) {
    var y, m, d;
    y = date.getFullYear();
    m = date.getMonth();
    d = date.getDate();
    return m+'/'+d+'/'+y;
}

// function to set date picker range to last week
function setDateRange(){
    $('.datepicker').datepicker({})
    /*$('#date1').datepicker("setDate", new Date(new Date() - (7 * 24 * 60 * 60 * 1000)));
    $('#date2').datepicker("setDate", new Date());*/
    $('#date1').datepicker("setDate", new Date("12/1/2017"));
    $('#date2').datepicker("setDate", new Date("12/8/2017"));
}

//function to make sure a temperature makes sense
function realitycheck(t)
{
    if(t < -100 || t > 150)
        return false;
    return true;
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

//function to convert Fahrenheit to Celsius
function celsuis(Ftemp)
{
    Ctemp = (Ftemp-32) * (5/9);
    return Ctemp;
}

function waitMsg() {
    //while chart is generating, display please wait.
    document.getElementById("rcrdRtrnd").innerHTML = "";
    document.getElementById('chart').innerHTML = "<p>Please wait while the vizualization is generated.</p>";
}

function displayAnalysisDescription() {
    var analysis = document.getElementById('analysis-list').options[document.getElementById('analysis-list').selectedIndex].value;
    var spot = document.getElementById('analysis_desc');
    var para = "";
    switch(analysis) {
        case "maxmin":
            para = "<p>Daily Tmax/Tmin: High and Low temperatures for each day in the Date Range plotted as two lines.</p>";
            break;
        case "avg":
            para = "<p>Daily Average: The mean average of all recorded temperatures for each day in the Date Range plotted as a line.</p>";
            break;
        case "dtr":
            para = "<p>Daily Temperature Range (DTR): The difference between the daily high and low temperatures for each day in the Date Range plotted as a line.<br />" +
            "DTR = T<sub>MAX</sub>-T<sub>MIN</sub></p>";
            break;
        case "cdd":
            para = "<p>Cumulative Degree Days (CDD): Shows cumulative growing degree days for each month in the year chosen in the Date Range plotted as a point on a line graph. This analysis is a visualization of how many days in a given year were warm enough for some species to grow and develop. The base temperature is the lowest temperature at which those species can grow and develop.<br />" +
                "Use Select Date Range to choose which year you want to see CDD for. Use Select DD Base (°C) to choose a base temp.<br />" +
                "CDD = &Sigma;(T<sub>MAX</sub>-T<sub>MIN</sub>)/2 - T<sub>0</sub><br />" +
                "T<sub>MAX</sub> = daily maximum temp;<br />" +
                "T<sub>MIN</sub> = daily minimum temp;<br />" +
                "T<sub>0</sub> = Base temp</p>";
            break;
        default:
        para = "<p>Raw Data: Each recorded temperature in the Date Range plotted as a point on a line graph.</p>"; 
    }
    spot.innerHTML = "<p><strong>Analysis Description</strong></p>" + para;
}