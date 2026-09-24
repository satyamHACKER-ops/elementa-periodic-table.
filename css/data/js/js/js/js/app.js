(function () {
    "use strict";

    var state = {
        searchQuery: "",
        filter: "all"
    };

    var tableContainer;
    var lanthanidesContainer;
    var actinidesContainer;
    var elementCount;

    function init() {
        tableContainer = document.getElementById("periodicTable");
        lanthanidesContainer = document.getElementById("lanthanides");
        actinidesContainer = document.getElementById("actinides");
        elementCount = document.getElementById("elementCount");

        if (!window.ELEMENTS || !tableContainer) {
            return;
        }

        ElementaTheme.init();

        ElementaSearch.init(function (query) {
            state.searchQuery = query;
            render();
        });

        ElementaFilters.init(function (filter) {
            state.filter = filter;
            render();
        });

        ElementaDetails.init();

        var randomButton = document.getElementById("randomElement");

        if (randomButton) {
            randomButton.addEventListener("click", randomElement);
        }

        render();
    }

    function render() {
        renderMainTable();
        renderSeries(
            lanthanidesContainer,
            "lanthanide"
        );
        renderSeries(
            actinidesContainer,
            "actinide"
        );

        updateCount();
    }

    function renderMainTable() {
        tableContainer.innerHTML = "";

        for (var period = 1; period <= 7; period++) {
            for (var group = 1; group <= 18; group++) {

                var element = findElement(period, group);

                if (!element) {
                    continue;
                }

                var card = createElementCard(element);

                tableContainer.appendChild(card);
            }
        }
    }

    function renderSeries(container, category) {
        if (!container) {
            return;
        }

        container.innerHTML = "";

        window.ELEMENTS.forEach(function (element) {
            if (element.category !== category) {
                return;
            }

            var card = createElementCard(element);

            container.appendChild(card);
        });
    }

    function createElementCard(element) {
        var card = document.createElement("button");

        card.type = "button";
        card.className =
            "element-card category-" + element.category;

        card.style.gridColumn = element.group || "auto";
        card.style.gridRow = element.period;

        if (!matchesCurrentState(element)) {
            card.classList.add("filtered-out");
        }

        card.setAttribute(
            "aria-label",
            element.name + ", atomic number " + element.atomicNumber
        );

        card.innerHTML =
            '<span class="element-number">' +
                element.atomicNumber +
            "</span>" +

            '<span class="element-symbol">' +
                element.symbol +
            "</span>" +

            '<span class="element-name">' +
                element.name +
            "</span>";

        card.addEventListener("click", function () {
            ElementaDetails.open(element);
        });

        return card;
    }

    function findElement(period, group) {
        for (var i = 0; i < window.ELEMENTS.length; i++) {
            var element = window.ELEMENTS[i];

            if (
                element.period === period &&
                element.group === group
            ) {
                return element;
            }
        }

        return null;
    }

    function matchesCurrentState(element) {
        var matchesFilter =
            state.filter === "all" ||
            element.category === state.filter;

        if (!matchesFilter) {
            return false;
        }

        var query = state.searchQuery.toLowerCase();

        if (!query) {
            return true;
        }

        return (
            element.name.toLowerCase().indexOf(query) !== -1 ||
            element.symbol.toLowerCase().indexOf(query) !== -1 ||
            String(element.atomicNumber).indexOf(query) !== -1
        );
    }

    function updateCount() {
        if (!elementCount) {
            return;
        }

        var visibleCount = 0;

        window.ELEMENTS.forEach(function (element) {
            if (matchesCurrentState(element)) {
                visibleCount++;
            }
        });

        elementCount.textContent =
            visibleCount + " element" +
            (visibleCount === 1 ? "" : "s");
    }

    function randomElement() {
        var available = window.ELEMENTS.filter(function (element) {
            return matchesCurrentState(element);
        });

        if (available.length === 0) {
            return;
        }

        var randomIndex =
            Math.floor(Math.random() * available.length);

        ElementaDetails.open(available[randomIndex]);
    }

    document.addEventListener("DOMContentLoaded", init);

})();
