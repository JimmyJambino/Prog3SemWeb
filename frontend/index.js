
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
    renderText, adjustForMissingHash, loadTemplate, renderTemplate, setActiveLink,
} from "./utils.js"

import {
    addKandidat,
    deleteKandidat,
    editKandidat,
    fetchAndSortKandidatByParti,
    fetchOne
} from "./javascript/kandidatJS.js"

import {fetchPartierAndSort, fetchPartierToOptions} from "./javascript/parti.js";

window.addEventListener("load", async () => {
    const templateHome = await loadTemplate("./templates/home.html")
    const templatePartier = await loadTemplate("./templates/partier.html")
    const templateKandidater = await loadTemplate("./templates/kandidater.html")
    const templateAddOne = await loadTemplate("./templates/addOne.html")
    const templateEdit = await loadTemplate("./templates/edit.html")
    const router = new Navigo("/", { hash: true });
    adjustForMissingHash()
    router
        .hooks({
            before(done, match) { // why dafuq is this unused??
                setActiveLink("topnav", match.url)
                done()
            }
        })
        .on({
            "/": () => {
                renderTemplate(templateHome, "content")
                //fetchKandidater();
            },
            "/partier": () => {
                renderTemplate(templatePartier, "content")
                fetchPartierAndSort()
            },
            "/kandidater": () => {
                renderTemplate(templateKandidater, "content")
                fetchAndSortKandidatByParti()
                document.getElementById("kandidatDiv").onclick = function (evt) {
                    let id = evt.target.id;
                    console.log("ID: " + id)
                    if(id.includes("slet")) {
                        deleteKandidat(id)
                        window.location.reload()
                    }
                    if(id.includes("opdater")) {
                        renderTemplate(templateEdit, "content")
                        fetchPartierToOptions()
                        fetchOne(id)
                        document.getElementById("btn-save").onclick = (evt) => {
                            evt.preventDefault()
                            editKandidat(id)
                            window.location.reload()
                        }
                    }
                }
            },
            "/addOne": () => {
                renderTemplate(templateAddOne, "content")
                fetchPartierToOptions()
                document.getElementById("btn-save").onclick = (evt) => {
                    evt.preventDefault()
                    addKandidat()
                }
            },
            "/edit": () => { // In case they want to edit it from this menu instead.. TODO: REMOVE?
                renderTemplate(templateEdit, "content")
                fetchPartierToOptions()
            }
        })
        .notFound(() => renderText("No page for this route found", "content"))
        .resolve()
});
