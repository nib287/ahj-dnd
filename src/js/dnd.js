export default class Dnd {
    constructor(xhr) {
        this.xhr = xhr;
        this.form = document.getElementsByClassName('form').item(0);
        this.file = document.getElementsByClassName('dnd__overlaped').item(0);
        this.overlap = document.getElementsByClassName('dnd__overlap').item(0);
        this.previews = document.getElementsByClassName('preview').item(0);
    }

    init() {
        this.dispatchEvent();
        this.dropPreview();
        this.createPreview();
        this.redrawPreviews()
    }

    dispatchEvent() {
        this.overlap.addEventListener('click', () => {
            this.file.dispatchEvent(new MouseEvent('click')); 
        });
    }

    request(data) {
        const promise =  new Promise((resolve,reject) => { 
            const reader = new FileReader();
            reader.addEventListener('load',(evt) => { 
                resolve(evt.target.result);
            });
            reader.addEventListener('error',(evt) => { 
                reject(evt.target.error);
            });
            reader.readAsDataURL(data);
        });         

        // Получили DataURl, отправили на сервер, в ответ от сервера получили
        // id картинки, отобразили preview с id в data атрибуте.
        promise.then((result) => {
            const previewId = this.xhr.uploadImg(result);
            previewId.then((id) => {
                this.createEl(result, id);
            })
        });            
    }

    dropPreview() {
        this.overlap.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.overlap.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.files[0];
            this.request(data);
            // очищаем данные, что была возвомжость прикреплять одинаковые файлы
            this.file.value = null;
        });
    }

    createPreview() {
        this.file.addEventListener('change', (e) => {
            const data = e.target.files[0];
            this.request(data);
            
            // очищаем данные, что была возвомжость прикреплять одинаковые файлы
            this.file.value = null;
        });
    }

    createEl(path, id) {
        const preview = document.createElement('div');
        preview.classList.add('preview__box');
        preview.setAttribute('data-id', id); 
        preview.innerHTML = `
            <img src="${path}" alt="" class="preview__img"> 
            <span class="preview__remove hidden button-style">&#10006;</span>
            <a  href="${path}"rel="noopener" download="<name>" class="preview__download hidden button-style">&#11015;</a>
        `
        this.previews.append(preview);
        this.listeners(preview);
    }

    listeners(preview) {
        const remove = preview.getElementsByClassName('preview__remove').item(0);
        const download = preview.getElementsByClassName('preview__download').item(0);
        const img = preview.getElementsByClassName('preview__img').item(0);
        
        // показать\убрать  кноки
        this.previews.lastElementChild.addEventListener('mousemove', () => {
            remove.classList.remove('hidden');
            download.classList.remove('hidden');
        });
        
        this.previews.lastElementChild.addEventListener('mouseleave', () => {
            remove.classList.add('hidden');
            download.classList.add('hidden');
        });
        
        // удалить preview
        remove.addEventListener('click', (e) => {
            const parent = e.target.closest('.preview__box');
            const imgID = parent.dataset.id
            parent.remove();
            this.xhr.sendDeleteRequest(imgID);
        });
        
        this.imageController(img)
    }

    getToggleBackground() {
        document.body.classList.toggle('background');
    }

    imageController(img) {
        img.addEventListener('click', () => {
            // просмотр картинки
            const clone = img.cloneNode();
            clone.classList.add('clone-preview');
            document.body.append(clone)
            clone.style.left = `50%`
            const left = clone.getBoundingClientRect().left
            clone.style.left = `${left - clone.offsetWidth / 2}px`

            // заглушка
            this.getToggleBackground();
            
            //закрыть картинку
            clone.addEventListener('click', () => {
                clone.remove();
                this.getToggleBackground();
            });
        });   
    }

    redrawPreviews() {
        this.xhr.getAllImg().then(previews => {
            if(previews.length) {
                JSON.parse(previews).forEach(preview => {
                    this.createEl(preview.file, preview.id)
                });
            }  
        });
    }
}   

