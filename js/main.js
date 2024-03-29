async function fetchData() {
    let url = 'https://streaming-availability.p.rapidapi.com/countries';
    let options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fa21e581f8msh4ff057268f5d087p130881jsn8888476d4458',
		    'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };

    try {
        //let response = await fetch(url, options);
        //let result = await response.text();

        const jsonData = JSON.parse("{\"result\":{\"ca\":{\"countryCode\":\"ca\",\"name\":\"Canada\"},\"cl\":{\"countryCode\":\"cl\",\"name\":\"Chile\"},\"us\":{\"countryCode\":\"us\",\"name\":\"United States\"}}}");

        //const jsonData = JSON.parse(result);

        let keys = (Object.keys(jsonData["result"]));

        let selectPaises = document.getElementById("paises");

        for (let i = 0; i < keys.length; i++) {
            let countryCode = jsonData["result"][keys[i]]["countryCode"];
            let name = jsonData["result"][keys[i]]["name"];

            selectPaises.innerHTML += "<option value=" + countryCode + ">" + name + "</option>";
        }

    } catch (error) {
        console.error(error);
    }
}
fetchData();

async function consultaShow() {
    //obtenemos el elemento HTML segun el ID de estos y la guardamos en variables.
    let resultDiv = document.getElementById("resultDiv");
    let nombreShowInput = document.getElementById("name");
    let selectPaises = document.getElementById("paises");

    //Llamamos al valor de las variables (que contienen los elementos HTML) y creamos nuevas variables con dicho valor
    let nombreShow = nombreShowInput.value;
    let codigoPais = selectPaises.value;

    //const url = 'https://streaming-availability.p.rapidapi.com/search/title?title=%3CREQUIRED%3E&country=%3CREQUIRED%3E&show_type=all&output_language=en';
    const url = 'https://streaming-availability.p.rapidapi.com/search/title?title=' + nombreShow +'&country='+ codigoPais +'&show_type=all&output_language=en';

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'fa21e581f8msh4ff057268f5d087p130881jsn8888476d4458',
		    'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };

    //Hacemos la llamada a la API con la URL que declaramos/modificamos y con las opciones en este de GET
    try {
        const response = await fetch(url, options);
        const result = await response.text();

        const jsonData = JSON.parse(result);
        let arrayKeys = (Object.keys(jsonData["result"]));
        
        
           
            jsonData.result.forEach(movie => {
                let innerHTMLString = "";
                let originalTitle = movie.originalTitle;
                let imdbId = movie.imdbId;
                
                if(movie.streamingInfo && movie.streamingInfo[codigoPais] && Array.isArray(movie.streamingInfo[codigoPais])) {
                   
                    innerHTMLString += "<div class='result-item'>" +
                "<div class='movie-image'></div>" +
                "<h3 class='movie-title'>" + originalTitle + "</h3>" +
                "<p> Codigo imdb: <a href='https://www.imdb.com/title/" + imdbId + "/'>" + imdbId + "</a> </p>" +
                "<ul class='streaming-services'>";

                    movie.streamingInfo[codigoPais].forEach(streaming => {
                        const service = streaming.service;
                        const link = streaming.link;
                        const type = streaming.streamingType;
                        innerHTMLString += "<li>"+ type + "<a href='" + link +"'>" + service + "</a></li>";
                    });
                        innerHTMLString += "</ul>" + "</div>";
                    
                }
                resultDiv.innerHTML += innerHTMLString;
            });

            
       


    } catch (error) {
        console.error(error);
        resultDiv.innerHTML = error;
    }
}
