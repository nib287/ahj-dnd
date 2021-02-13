export default class Dnd {
    constructor() {
        this.file = document.getElementsByClassName('dnd__overlaped').item(0);
        this.overlap = document.getElementsByClassName('dnd__overlap').item(0);
        this.previews = document.getElementsByClassName('preview').item(0);
    }

    init() {
        this.dispatchEvent();
        this.dropPreview();
        this.createPreview();
    }

    dispatchEvent() {
        this.overlap.addEventListener('click', () => {
            this.file.dispatchEvent(new MouseEvent('click')); 
        });
    }

    dropPreview() {
        this.overlap.addEventListener('dragover', e => {
            e.preventDefault();
        });

        this.overlap.addEventListener('drop', e => {
            e.preventDefault();
            const data = e.dataTransfer.files[0];
            const path = URL.createObjectURL(data);
            this.createEl(path);
            // очищаем данные, что была возвомжость прикреплять одинаковые файлы
            this.file.value = null;
        });
    }

    createPreview() {
        this.file.addEventListener('change', e => {
            const data = e.target.files[0];
            const path = URL.createObjectURL(data)
            this.createEl(path);
             // очищаем данные, что была возвомжость прикреплять одинаковые файлы
             this.file.value = null;
        });
    }

    createEl(path) {
        const preview = document.createElement('div');
        preview.classList.add('preview__box');
        preview.innerHTML = `
            <img src="${path}" alt="" class="preview__img"> 
            <span class="preview__remove hidden button-style">&#10006;</span>
            <a  href="${path}"rel="noopener" download="<name>" class="preview__download hidden button-style">&#11015;</a>
        `
    
        this.previews.append(preview);
        this.listeners(preview, path);
    }

    listeners(preview, path) {
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
        remove.addEventListener('click', e => e.target.closest('.preview__box').remove());
        
        // почистить память
        download.addEventListener('click', () => {
            setTimeout(() => URL.revokeObjectURL(path));
        });

       this.imageController(img)
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
            const background = document.createElement('div');
            background.classList.add('background');
            document.body.append(background)
            
            //закрыть картинку
            clone.addEventListener('click', () => {
                clone.remove();
                background.remove();
            });
        });   
    }
}   

