export const saveJwt = (token) => {
    localStorage.setItem('userToken', token);
}

export const loadJwt = () => {
    return localStorage.getItem('userToken');
}

export const deleteJwt = () => {
    localStorage.removeItem('userToken');
}

export const parseJwt = () => {
    let base64Url = loadJwt().split('.')[1];
    let base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(base64);
};