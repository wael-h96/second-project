function startLive() {
    $("#bar-container-2").css("display", 'flex')
    if (currencySavingList.length === 0) {
        $("#bar-container-2").css("display", 'none')
        $("#chartContainer").html("<h2 style='text-align:center;'>You haven't saved any currency!</h2>")

    } else {

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            exportEnabled: true,
            title: {
                text: "Currencies in USD"
            },
            axisY: {
                title: "Value in USD"
            },
            axisX: {
                valueFormatString: "mm:ss"
            },
            toolTip: {
                shared: true
            },
            legend: {
                cursor: "pointer",
            },
            data: []
        });

        currencySavingList.forEach(function (element) {
            const dataSeries = {
                type: "spline",
                name: element,
                showInLegend: true,
                dataPoints: []
            };
            chart.options.data.push(dataSeries)
        });

        var intervalId = setInterval(getCurrencyValue, 2000)
        localStorage.setItem('intervalId', intervalId)//in order to stop the interval so i saved it in the local storage 
        // so i can reached it from everywhere

        function getCurrencyValue() {
            $("#bar-container-2").css("display", "none")
            for (let i = 0; i < currencySavingList.length; i++) {
                let url = `https://api.coingecko.com/api/v3/coins/${currencySavingList[i]}`
                getDataFromAPI(url, i)
            }

        }
        function getDataFromAPI(url, i) {//getting the values of the currencies from the API
            $.ajax({
                type: 'GET',
                url: url,
                success: function (res) {
                    let dataPoint = {
                        x: new Date(),
                        y: res.market_data.current_price.usd,
                    };
                    chart.options.data[i].dataPoints.push(dataPoint)
                    chart.render()
                },
                error: err => {
                    console.log('ERROR:-', err)
                },
            });
        }

    }
}




