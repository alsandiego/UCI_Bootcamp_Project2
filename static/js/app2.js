////////////////////////////
// PAGE 2 - VIEW BY DEPT //
///////////////////////////
function buildCharts2(department) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var scatterURL =  `/bubble2/${department}`;
  d3.json(scatterURL).then(function(data){
    // our data dict
    var position = data.position
    var salary2014 = data["2014"]
    var salary2015 = data["2015"]
    var salary2016 = data["2016"]
    var salary2017 = data["2017"]
    var salary2018 = data["2018"]

    /////// show group bar chart
    var trace1 = {
      x: position,
      y: salary2014,
      // mode: 'markers',
      type: 'bar',
      name: "2014"
    };
    
    var trace2 = {
      x: position,
      y: salary2015,
      // mode: 'markers',
      type: 'bar',
      name: "2015"
    };

    var trace3 = {
      x: position,
      y: salary2016,
      // mode: 'markers',
      type: 'bar',
      name: "2016"
    };
    
    var trace4 = {
      x: position,
      y: salary2017,
      // mode: 'markers',
      type: 'bar',
      name: "2017"
    };

    var trace5 = {
      x: position,
      y: salary2018,
      // mode: 'markers',
      type: 'bar',
      name: "2018"
    };
    
    var data = [trace1, trace2, trace3, trace4, trace5];
    var layout = {barmode: 'group',
                    margin: {l: 50,
                              r: 50,
                              b: 100,
                              t: 50,
                              pad: 4}}
    scatter = document.getElementById("scatter");
    Plotly.newPlot("scatter", data, layout, {responsive: true})


    //////////// to show department table
    var dept_values = [position,salary2014,salary2015,salary2016,salary2017,salary2018]
    var dept_table = [{
    type: 'table',
    header: {
      values: [["<b>Position</b>"], ["<b>2014</b>"],["<b>2015</b>"],["<b>2016</b>"],["<b>2017</b>"],["<b>2018</b>"]],
      align: "center",
      line: {width: 1, color: 'black'},
      fill: {color: "grey"},
      font: {family: "Arial", size: 12, color: "white"}
    },
    cells: {
      values: dept_values,
      align: "center",
      line: {color: "black", width: 1},
      font: {family: "Arial", size: 11, color: ["black"]}
    }
    }]
    table = document.getElementById("table2");
    Plotly.newPlot(table, dept_table);

  }); 
};

function init2() {
  // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset2");
  // Use the list of sample names to populate the select options
    d3.json("/department").then((listDepartment) => {
      listDepartment.forEach((department) => {
        selector
          .append("option")
          .text(department)
          .property("value", department);
      });

  // Use the first sample from the list to build the initial plots
      const firstData2 = listDepartment[0];
      buildCharts2(firstData2);
      pieTotalSalary(firstData2);
      top10position(firstData2);
      buildCanvas2(firstData2)
    });
  }

// Initialize the dashboard
init2();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  clearBubble2()
  buildCharts2(newSample);
  pieTotalSalary(newSample);
  top10position(newSample);
  buildCanvas2(newSample);
  // buildMetadata(newSample);
}

///// show Total Salary Pie Chart
function pieTotalSalary(department) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var scatterURL =  `/bubble2/${department}`;
  d3.json(scatterURL).then(function(data){
    // our data dict
    var dict = [];
    for (var c = 0; c < data.position.length; c++) {
      dict.push({
          "position": data.position[c],
          "total_salary": data["2014"][c]+data["2015"][c]+data["2016"][c]+data["2017"][c]+data["2018"][c]
      });
    }


    var data_pie = [{
      type: "pie",
      values: dict.map(row => row.total_salary),
      labels: dict.map(row => row.position),
      textinfo: "label+percent",
      textposition: "inside",
      showlegend: false
    }]

    var layout_pie = {
      autosize: true,
      // height: 800,
      // width: 1080,
      title: {
        text:'Total Salary per Position',
        font: {
          family: 'Courier New, monospace',
          size: 24
        },
      margin: {"t": 0, "b": 0, "l": 0, "r": 0}
      }
    };

    pie = document.getElementById("pieTotalSalary");
    Plotly.newPlot(pie, data_pie, layout_pie, { responsive: true });
})
}

/////// show Top 10 Position 
function top10position(department) {
  var scatterURL =  `/bubble2/${department}`;
  d3.json(scatterURL).then(function(data){
    // our data dict
    var dict = [];
    for (var c = 0; c < data.position.length; c++) {
      dict.push({
          "position": data.position[c],
          "total_salary": data["2014"][c]+data["2015"][c]+data["2016"][c]+data["2017"][c]+data["2018"][c]
      });
    }
    dict.sort(function(a, b) {
      return parseFloat(b.total_salary) - parseFloat(a.total_salary);
    });
    dict = dict.slice(0, 10);

    var data_pie = [{
      type: "pie",
      values: dict.map(row => row.total_salary),
      labels: dict.map(row => row.position),
      textinfo: "label+percent",
      textposition: "inside",
      showlegend: false
    }]

    var layout_pie = {
      autosize: true,
      // height: 800,
      // width: 1080,
      title: {
        text:'Top 10 Positions',
        font: {
          family: 'Courier New, monospace',
          size: 24
        },
      margin: {"t": 0, "b": 0, "l": 0, "r": 0}
      }
    };

    pie = document.getElementById("deptTop10");
    Plotly.newPlot(pie, data_pie, layout_pie, { responsive: true });

})
}

var myChart;

function buildCanvas2(department) {

        // @TODO: Use `d3.json` to fetch the sample data for the plots
    var scatterURL =  `/bubble2/${department}`;
    d3.json(scatterURL).then(function(data){
    // our data dict
    var dict = [];
    for (var c = 0; c < data.position.length; c++) {
      dict.push({
          "position": data.position[c],
          "total_salary": data["2014"][c]+data["2015"][c]+data["2016"][c]+data["2017"][c]+data["2018"][c]
      });
    }
    dict.sort(function(a, b) {
      return parseFloat(b.total_salary) - parseFloat(a.total_salary);
    });
          /////////////  test canvas chart
    var chart_config =
      {
        type: 'bar',
        data: {
            labels: dict.map(row => row.position),
            datasets: [{
                label: 'Department Positions Total Salary',
                data: dict.map(row => row.total_salary),
                // backgroundColor: [
                //     'rgba(255, 99, 132, 0.2)',
                //     'rgba(54, 162, 235, 0.2)',
                //     'rgba(255, 206, 86, 0.2)',
                //     'rgba(75, 192, 192, 0.2)',
                //     'rgba(153, 102, 255, 0.2)',
                //     'rgba(255, 159, 64, 0.2)'
                // ],
                // borderColor: [
                //     'rgba(255, 99, 132, 1)',
                //     'rgba(54, 162, 235, 1)',
                //     'rgba(255, 206, 86, 1)',
                //     'rgba(75, 192, 192, 1)',
                //     'rgba(153, 102, 255, 1)',
                //     'rgba(255, 159, 64, 1)'
                // ],
                borderWidth: 1
            }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
    }}
    var ctx = document.getElementById("tableCanvas");
    myChart = new Chart(ctx, chart_config)

      });
};

function clearBubble2()
{
  myChart.destroy()
  document.getElementById("tableCanvas").innerHTML = "";
} 