// function to get data from db
function getData(_callback) {
    /*var e = document.getElementById("db-list");
    var db = e.options[e.selectedIndex].value;*/
    var db = "envdata2";

    var dateInput1 = document.getElementById('date1').value;
    var dateInput2 = document.getElementById('date2').value;
    var fromDate = new Date(dateInput1).getTime();
    var toDate = new Date(dateInput2).getTime();

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
    var analysis = document.getElementById('analysis-list').value;
    getData(function(tmpData) {
        if (tmpData['msg'] == ""){
            //console.log(tmpData);
            google.charts.load('current', {packages: ['line']});
            //google.charts.load('current', {'packages':['table']});
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

//function to make sure a temperature makes sense
function realitycheck(t)
{
    if(t < -100 || t > 150)
        return false;
    return true;
}