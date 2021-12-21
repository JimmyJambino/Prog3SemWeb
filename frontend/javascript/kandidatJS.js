
const URL = "http://localhost:9000/kandidat/"

function order(a, b) {
    return a.partiNavn < b.partiNavn ? -1 : (a.partiNavn > b.partiNavn ? 1 : 0)
}
export function fetchAndSortKandidatByParti() {
    let total = 0;
    fetch(URL).then(res => res.json())
        .then(data => {
            data.map(count => {
                total += count.antalStemmer
            })
            return data;
        })
        .then(party => party.sort(order))
        .then(data => data.map(kandidat => {
            let percent = (kandidat.antalStemmer/total)*100;
            let percentShort = String(percent);
            percentShort = percentShort.substr(0,4)
            return `<tr>
            <td>${kandidat.fornavn}</td>
            <td>${kandidat.efternavn}</td>
            <td>${kandidat.partiNavn}</td>
            <td>${kandidat.antalStemmer}</td>
            <td>${percentShort}</td>
            <td><button id="slet-${kandidat.id}">Slet</button>
            <button id="opdater-${kandidat.id}"</button>Opdater</td></tr>`})
            .join(""))
        .then(string => document.getElementById("tbody").innerHTML = string) // string is now data.map() value
}

export function fetchOne(btnID) {
    let id = btnID.substr(8, btnID.length);
    fetch(URL+id)
        .then(res => res.json())
        .then(kandidat => {
            console.log(kandidat)
            document.getElementById("fnavn").value = kandidat.fornavn;
            document.getElementById("enavn").value = kandidat.efternavn;
            document.getElementById("stemmer").value = kandidat.antalStemmer;
            document.getElementById("partier").value = kandidat.partiId;
        })
}
function getInfomation() {
    let fornavn = document.getElementById("fnavn").value;
    let efternavn = document.getElementById("enavn").value;
    let antalStemmer = document.getElementById("stemmer").value;
    let partiId = document.getElementById("partier").value; // Drop down menu
    let parti = document.getElementById(partiId).innerText;

    let object = {
        "fornavn": fornavn,
        "efternavn": efternavn,
        "antalStemmer": antalStemmer,
        "partiId" : partiId,
        "parti": {
            "id" : partiId,
            "name": parti
        }
    }
    return object;
}

export function addKandidat() {
    let options = makeOptions("POST", getInfomation())
    fetch(URL, options)
        .then(data => {}) // just to remove the ignore comment in fetch
}

export function editKandidat(btnID) {
    let id = btnID.substr(8, btnID.length);
    let options = makeOptions("PUT", getInfomation())
    fetch(URL+id, options)
}

export function deleteKandidat(btnID) {
    let id = btnID.substr(5,btnID.length);
    console.log("Sub: " + id)
    let options = makeOptions("DELETE", null)
    fetch(URL+id, options);
}

function makeOptions(method, body) {
    const options = {
        method: method,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
    if(body) {
        options.body = JSON.stringify(body)
    }
    return options;
}