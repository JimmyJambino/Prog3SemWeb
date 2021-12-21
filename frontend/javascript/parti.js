const URL = "http://localhost:9000/parti/"

function order(a, b) {
    return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0)
}

export function fetchPartierToOptions() {

    fetch(URL).then(res => res.json())
        .then(match => match.map(parti => `<option id="${parti.id}" value="${parti.id}">${parti.name}</option>`).join(""))
        .then(string => document.getElementById("partier").innerHTML = string)
}

export function fetchPartierAndSort() {
    let total = 0;
    fetch(URL).then(res => res.json())
        .then(data => {
            data.map(count => {
                count.kandidatSet.forEach(a => total += a.antalStemmer)
            })
            return data;
        })
        .then(party => party.sort(order)) // sort before we display
        .then(data => data.map(parti => {
            let partiCount = 0;
            parti.kandidatSet.forEach(a => partiCount += a.antalStemmer)
            let percent = (partiCount/total)*100;
            let percentShort = String(percent);
            percentShort = percentShort.substr(0,4)
            return `<tr>
            <td>${parti.name}</td>
            <td>${partiCount}</td>
            <td>${percentShort}</td></tr>`})
            .join(""))
        .then(string => document.getElementById("tbody").innerHTML = string)
}