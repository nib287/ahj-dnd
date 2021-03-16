export default class XHR {
    constructor() {
        this.host = 'https://ahj-dnd.herokuapp.com/';
    }

    uploadImg(data) {
        return new Promise((resolve, reject) => {
            const formData = new FormData()
            formData.append('method', 'upload');
            formData.append('id', null);
            formData.append('file', data);
        
            const xhr = new XMLHttpRequest();   
            xhr.open('POST', this.host);
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response) 
                } else {
                    reject('Network Error');
                }
            });

            xhr.send(formData);              
        });
    }

    getAllImg() {
        return new Promise((resolve, reject) => {   
            const xhr = new XMLHttpRequest();   
            xhr.open('GET', `${this.host}?method=allImg`);
            
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response); 
                } else {
                    reject('Network Error');
                }
            });

            xhr.send();  
        });                 
    }

    getAllTickets() {
        return new Promise((resolve, reject) => {   
            const xhr = new XMLHttpRequest();   
            xhr.open('GET', `${this.host}?method=allImg`);
            
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response); 
                } else {
                    reject('Network Error');
                }
            });

            xhr.send();  
        });                 
    }

    sendDeleteRequest(imgID) {
        const data = new FormData();
        data.append('method', 'deleteImg');
        data.append('id', imgID);
        
        const xhr = new XMLHttpRequest();   
        xhr.open('POST', this.host);
        xhr.send(data);  
    }
}

