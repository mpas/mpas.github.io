window.addEventListener("DOMContentLoaded", () => {

    "use strict";
    let index, parse, query;

    const form = document.getElementById("search");
    const input = document.getElementById("search-input");

    form.addEventListener(
        "submit",
        function(event) {
            event.preventDefault();

            const keywords = input.value.trim();
            if (!keywords) return;

            query = keywords;
            buildSearchIndex();
        },
        false,
    );

    function handleEvent(e) {
        console.log(e.type);
    }

    async function buildSearchIndex() {
        const request = new XMLHttpRequest();
        request.open("GET", "/index.json");
        request.responseType = "json";
        request.addEventListener(
            "load",
            function() {
                parse = {};
                index = lunr(function() {

                    const documents = request.response;

                    this.ref("href");
                    this.field("title", {
                        boost: 20,
                        usePipeline: true,
                        wildcard: lunr.Query.wildcard.TRAILING,
                        presence: lunr.Query.presence.REQUIRED,
                    });
                    this.field("content", {
                        boost: 15,
                    });
                    this.field("categories", {
                        boost: 5,
                    });
                    this.field("tags", {
                        boost: 5,
                    });

                    documents.forEach(function(doc) {
                        this.add(doc);
                        parse[doc.href] = {
                            href: doc.href,
                            title: doc.title,
                            summary: doc.summary,
                            content: doc.content,
                            tags: doc.tags,
                            categories: doc.categories,
                            date: doc.date,
                        };
                    }, this);
                });
                search(query);
            },
            false,
        );
        request.addEventListener("error", handleEvent);
        request.send(null);
    }

    function createDiv(document, target, arr, taxonomy) {
        arr.forEach(function(item, index) {
            var a = document.createElement("a")
            a.classList = "is-link"
            a.href = "/${taxonomy}/${item}/"
            target.appendChild(a)
        });
    }

    function search(keywords) {
        const results = index.search(keywords);

        // find the class '.is-search-result' placeholder in the current document
        const target = document.querySelector(".is-search-result");

        // remove all children below the placeholder
        while (target.firstChild) target.removeChild(target.firstChild);

        // create search results count
        const searchResultsCount = document.createElement("div");
        searchResultsCount.id = "search-results-count";
        searchResultsCount.classList = "box content mt-5 has-background-white";

        if (results.length == 0)
            searchResultsCount.textContent = `Apologies, we found No results for "${keywords}"`;
        else if (results.length == 1)
            searchResultsCount.textContent = `Found one result for "${keywords}"`;
        else
            searchResultsCount.textContent = `Found ${results.length} results for "${keywords}"`;

        // add the results count as child of the placeholder
        target.appendChild(searchResultsCount);

        if (results.length > 0) {
            // create search results
            const searchResults = document.createElement("div");
            searchResults.id = "search-results";
            searchResults.classList = "box content block";

            // add the search results as child of the placeholder
            target.appendChild(searchResults);

            const template = document.getElementById("is-search-template");

            results.forEach(function(result) {
                const doc = parse[result.ref];
                const element = template.content.cloneNode(true);

                element.querySelector(".is-read-more").href = doc.href;
                element.querySelector(".is-read-more").textContent = doc.title;
                element.querySelector(".summary").textContent = doc.summary;

                doc.tags.forEach(function(item, index, array) {
                    var a = document.createElement("a")
                    a.classList = "is-link"
                    a.href = `/tags/${item}/`
                    a.textContent = item
                    element.querySelector(".tags").appendChild(a)

                    if (index != array.length - 1) {
                        a.insertAdjacentText('afterend', ", ")
                    }
                });

                element.querySelector(".date")
                    .textContent = doc.date;
                searchResults.appendChild(element);
            }, this);
        }
    }
},
    false,
);
