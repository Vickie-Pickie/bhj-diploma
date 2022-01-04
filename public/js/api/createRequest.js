/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let url = options.url;
    let fetchOptions = {
        method: options.method
    };

    if (options.method === "GET") {
       if (options.data) {
           const searchParams = new URLSearchParams();
           Object.keys(options.data).forEach(key => searchParams.append(key, options.data[key]));
           url += '?' + searchParams.toString();
       }
    } else {
        if (options.data) {
            let formData = new FormData;
            Object.keys(options.data).forEach(key => formData.append(key, options.data[key]));
            fetchOptions.body = formData;
        }
    }

    return fetch(url, fetchOptions);
};
