////////////////////////////
// PAGE 1 - VIEW BY YEAR //
///////////////////////////
function buildCharts(year) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var samples_url =  `/year/${year}`;
  d3.json(samples_url).then(function(data){

    // var item = data.item;
    var total_salary = data.total_salary;
    var department = data.department;
    

    // // Bubble Chart using the data
    // var trace1 = {
    //   x: department,
    //   y: total_salary,
    //   text: department,
    //   mode: 'markers',
    //   marker: {
    //   size: total_salary,
    //   color: department
    //   }
    // };
    
    // var data_bubble = [trace1];
    
    // var layout = {
    //   xaxis: { title: 'Departments'}
    // };
    
    // bubble = document.getElementById("bubble");
    // Plotly.newPlot(bubble, data_bubble, layout);

    /// build Bubble chart
    var dict = [];
    for (var c = 0; c < data.department.length; c++) {
      dict.push({
          "department": data.department[c],
          "total_salary": data.total_salary[c]
      });
    }
    dict.sort(function(a, b) {
      return parseFloat(b.total_salary) - parseFloat(a.total_salary);
    });
    // dict = dict.slice(0, 10);

    var data_pie = [{
      type: "pie",
      // values: dict.map(row => row.total_salary),
      // labels: dict.map(row => row.department),
      values: total_salary,
      labels: department,
      textinfo: "label+percent",
      textposition: "inside",
      automargin: true,
      sort: false
    }]
    
    var layout_pie = {
      autosize: true,
      // height: 800,
      // width: 1080,
      title: {
        text:'OC Department Salary',
        font: {
          family: 'Courier New, monospace',
          size: 24
        },
      automargin: true,
      showlegend: true
      }
    };

    pie = document.getElementById("pie");
    Plotly.newPlot(pie, data_pie, layout_pie, { responsive: true });

  //////////// to show department table
    var dept_values = [department,total_salary]
    var dept_table = [{
    type: 'table',
    header: {
      values: [["<b>Department</b>"], ["<b>Total Salary</b>"]],
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
    table = document.getElementById("table");
    Plotly.newPlot(table, dept_table);

  });

};

function init() {
    // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");
  
    // Use the list of sample names to populate the select options
    d3.json("/year").then((listYear) => {
      listYear.forEach((year) => {
        selector
          .append("option")
          .text(year)
          .property("value", year);
      });

    // Use the first sample from the list to build the initial plots
      const firstData = listYear[0];
      // buildMetadata(firstData);
      buildCharts(firstData);
      buildCanvas(firstData);
      top10pie(firstData);
    });
  } 

var myChart;

function buildCanvas(year) {

        // @TODO: Use `d3.json` to fetch the sample data for the plots
  var samples_url =  `/year/${year}`;
  d3.json(samples_url).then(function(data){
    
    // var item = data.item;
    var total_salary = data.total_salary;
    var department = data.department;
          /////////////  test canvas chart
    var chart_config =
      {
        type: 'bar',
        data: {
            labels: department,
            datasets: [{
                label: 'Department Total Salary',
                data: total_salary,
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
    var ctx = document.getElementById("bubble");
    myChart = new Chart(ctx, chart_config)
        
      });
};

function clearBubble()
{
  myChart.destroy()
  document.getElementById("bubble").innerHTML = "";
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  clearBubble()
  buildCharts(newSample);
  buildCanvas(newSample);
  top10pie(newSample);
  // buildMetadata(newSample);
}

// Initialize the dashboard
init();

function top10pie(year) {
  var samples_url =  `/year/${year}`;
  d3.json(samples_url).then(function(data){

    var dict = [];
    for (var c = 0; c < data.department.length; c++) {
      dict.push({
          "department": data.department[c],
          "total_salary": data.total_salary[c]
      });
    }
    dict.sort(function(a, b) {
      return parseFloat(b.total_salary) - parseFloat(a.total_salary);
    });
    dict = dict.slice(0, 10);

    var data_pie = [{
      type: "pie",
      values: dict.map(row => row.total_salary),
      labels: dict.map(row => row.department),
      textinfo: "label+percent",
      textposition: "inside",
      automargin: true
    }]

    var layout_pie = {
      autosize: true,
      // height: 800,
      // width: 1080,
      title: {
        text:'Top 10 Department and Salary',
        font: {
          family: 'Courier New, monospace',
          size: 24
        },
      margin: {"t": 0, "b": 0, "l": 0, "r": 0},
      showlegend: true
      }
    };

    pie = document.getElementById("pieTop10");
    Plotly.newPlot(pie, data_pie, layout_pie, { responsive: true });

})
}