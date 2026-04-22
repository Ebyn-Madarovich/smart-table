import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение 
import {initPagination} from "./components/pagination.js"   //Шаг № 2
import {initSorting} from "./components/sorting.js"         //Шаг № 3
import {initFiltering} from "./components/filtering.js"     //Шаг № 4
import {initSearching} from "./components/searching.js"     //Шаг № 5


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
**/
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));  // например {rowsPerPage: "10", searchBySeller: "Alice", page: "1"}
        console.log("mains.js collectState() state:", state)

    const rowsPerPage = parseInt(state.rowsPerPage);     // приведём количество страниц к числу, например rowsPerPage: "10"
        console.log("mains.js collectState() rowsPerPage:", rowsPerPage) 

    const page = parseInt(state.page ?? 1);              // номер страницы по умолчанию 1 и тоже число, например page: "1"
        console.log("mains.js collectState() page:", page)

    return {                                             // расширьте существующий return вот так
        ...state,  // это объект с текущими значениями всех полей формы таблицы (select, input, radio) из div class="pagination-controls" и class="pagination-settings"
        rowsPerPage,  // rowsPerPage — сколько строк на странице из select name="rowsPerPage"
        page,   // page — текущая страница из input type="radio"
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    // debugger;
    let state = collectState(); // состояние полей из таблицы представляет собой объект return {...state, rowsPerPage, page}
        console.log("mains.js state = collectState():", state)

    let result = [...data]; // копируем для последующего изменения

    // @todo: использование
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);   // ([...data], {...state, rowsPerPage, page}, e.submitter-"кнопка, которая была нажата (Date, Total))
    result = applySorting(result, state, action);     // ([...data], {...state, rowsPerPage, page}, e.submitter-"кнопка, которая была нажата (Date, Total))
    result = applyPagination(result, state, action);  // ([...data], {...state, rowsPerPage, page}, e.submitter-"кнопка, которая была нажата (prev, next, first, last))

    sampleTable.render(result) //отрисовывает всю таблицу form name="table" class="table" по отфильтрованному датасету result
}

const sampleTable = initTable({   // sampleTable отрисованная таблица с методами управления
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination'],
}, render);



// @todo: инициализация  Шаг № 2.2
const applyPagination = initPagination(
    
    // ниже обращаемся к объекту root который вернулся от initTable в значение перемен. sampleTable, 
    // затем к его свойству pagination в котором лежит реузьтат отрисовки шаблона after: ['pagination']
    // elements это все элементы firstPage, fromRow, lastPage, nextPage, pages, previousPage, rowsPerPage, toRow, totalRows по атрибуту data-name в div class="pagination-container" 
    sampleTable.pagination.elements,    // root['pagination'] = cloneTemplate('pagination') передаём сюда элементы пагинации, найденные в шаблоне


    (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
            // console.log("mains.js initPagination колбэк input", input)
        const label = el.querySelector('span');
            // console.log("mains.js initPagination колбэк label", label)
        input.value = page;
            // console.log("mains.js initPagination колбэк input.value ", input.value)
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);
console.log("mains.js sampleTable",sampleTable)
console.log("mains.js sampleTable.pagination",sampleTable.pagination)
console.log("mains.js sampleTable.pagination.elements",sampleTable.pagination.elements)


const applySorting = initSorting([        // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);
console.log("mains.js sampleTable.header.elements.sortByDate:", sampleTable.header.elements.sortByDate)
console.log("mains.js sampleTable.header.elements.sortByTotal:", sampleTable.header.elements.sortByTotal)


const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра, это все элементы формы фильтра, найденные по data-name внутри шаблона filter
    searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов, объект, где ключи соответствуют именам полей фильтра (searchBySeller), а значения — данные для этих полей (например, массив продавцов indexes.sellers)
});
console.log("mains.js sampleTable.filter.elements:", sampleTable.filter.elements)
console.log("mains.js {searchBySeller: indexes.sellers}:", {searchBySeller: indexes.sellers})


const applySearching =  initSearching(sampleTable.search.elements, "searchField")
console.log("mains.js sampleTable.search.elements:", sampleTable.search.elements)



const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
