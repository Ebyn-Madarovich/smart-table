import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // {pages, fromRow, toRow, totalRows}, деструктуризация только нужных элементов
    
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);    // в качестве шаблона берём первый элемент из контейнера со страницами
    console.log("pagination.js pageTemplate", pageTemplate) // label class="pagination-button" с внутренностями
    
    pages.firstElementChild.remove();                                // и удаляем его (предполагаем, что там больше ничего, как вариант, можно и всё удалить из pages)


    return (data, state, action) => {
        
        
        // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
        const rowsPerPage = state.rowsPerPage;                        // будем часто обращаться, чтобы короче записывать
        // rowsPerPage — сколько строк на странице из select, например rowsPerPage: "10"
        console.log("pagination.js rowsPerPage:", rowsPerPage)
        
        const pageCount = Math.ceil(data.length / rowsPerPage);        // число страниц округляем в большую сторону
        // делим количество строк из датасета на количество строк на странице из select name="rowsPerPage"
        console.log("pagination.js pageCount:", pageCount)
        
        let page = state.page;                                        // страница переменной, потому что она может меняться при обработке действий позже
        // page — текущая страница из input type="radio", например page: "1"
        console.log("pagination.js page:", page)
        
        // @todo: #2.6 — обработать действия
        if (action) switch(action.name) {  // action.name → берёт атрибут name этой кнопки (prev, next, first, last)
            case 'prev': page = Math.max(1, page - 1); break;            // переход на предыдущую страницу
            case 'next': page = Math.min(pageCount, page + 1); break;    // переход на следующую страницу
            case 'first': page = 1; break;                                // переход на первую страницу
            case 'last': page = pageCount; break;                        // переход на последнюю страницу
        }
        // код выше обновляет внутреннее значение переменной let page , которое дальше используется для:
        // вычисления среза данных (slice)
        // генерации кнопок страниц и отметки текущей страницы (input.checked = isCurrent)
        

        
        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);                // Получим массив страниц, которые нужно показать, выводим только 5 страниц
        pages.replaceChildren(...visiblePages.map(pageNumber => {        // перебираем их и создаём для них кнопку
            const el = pageTemplate.cloneNode(true);    // клонируем шаблон, который запомнили ранее вот тут const pageTemplate = pages.firstElementChild.cloneNode(true);
            // console.log("el", el)                    
            return createPage(el, pageNumber, pageNumber === page);        // вызываем колбэк из настроек, чтобы заполнить кнопку данными
        }))

        
        // @todo: #2.5 — обновить статус пагинации
        fromRow.textContent = (page - 1) * rowsPerPage + 1;                    // С какой строки выводим
        console.log("fromRow.textContent", fromRow.textContent)

        toRow.textContent = Math.min((page * rowsPerPage), data.length);    // До какой строки выводим, если это последняя страница, то отображаем оставшееся количество
        totalRows.textContent = data.length;                                // Сколько всего строк выводим на всех страницах вместе (после фильтрации будет меньше)
        
        
        // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
        const skip = (page - 1) * rowsPerPage;            // сколько строк нужно пропустить
        console.log(skip)
        return data.slice(skip, skip + rowsPerPage);    // получаем нужную часть строк (заменяем имеющийся return)
    }
}