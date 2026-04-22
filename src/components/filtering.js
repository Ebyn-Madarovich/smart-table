import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    console.log("filtering.js Object.keys(indexes):", Object.keys(indexes))
    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                    .map(name => {                        // используйте name как значение и текстовое содержимое
                    // @todo: создать и вернуть тег опции
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option
                    })
        )
     })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля

        state.total = [state.totalFrom, state.totalTo];
        console.log("filtering.js state:", state)
        
        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}