import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    // debugger;
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate); //вся таблица с содержимым внутри form name="table" class="table"
    console.log("root:", root)

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    console.log(before)
    before.reverse().forEach(subName => {                            // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.prepend(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
    });
    after.forEach(subName => {                            // перебираем нужный массив идентификаторов
        root[subName] = cloneTemplate(subName);            // клонируем и получаем объект, сохраняем в таблице
        root.container.append(root[subName].container);    // добавляем к таблице после (append) или до (prepend)
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()

    root.container.addEventListener("change", onAction)   // ПЕРВЫЙ
    root.container.addEventListener("reset", () => setTimeout(onAction, 0));   // ВТОРОЙ
    root.container.addEventListener("submit", (e) => {   // ТРЕТИЙ
        e.preventDefault()
        onAction(e.submitter)
    })
    // 1.3.1. ТРЕТИЙ обработчик ловит submit на всей таблице (root.container).
    // 1.3.2. submit это кнопки prev, next, first, last из шаблона <div class="pagination-controls"
    // 1.3.3. e.submitter → это кнопка, которая была нажата например из блока пагинации(prev, next, first, last) или из хедера
    // 1.3.4. onAction(e.submitter) → вызывает функцию render и передаёт эту кнопку как аргумент action.



    const render = (data) => {
        // console.log("render = (data) ПАРАМЕТР:", data)
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate)
            // console.log(row)
            // console.log(item)
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    if(row.elements[key].tagName === "INPUT" || row.elements[key].tagName === "SELECT"){
                       row.elements[key].value = item[key] 
                    } else {
                        row.elements[key].textContent = item[key]
                    }
                    
                }
            })
            return row.container       
        })
        root.elements.rows.replaceChildren(...nextRows);  //фактическая отрисовка всех строк таблицы на странице template id="row"
    }

    return {...root, render};
}