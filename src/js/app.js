import '../style.css';
import DnD from './dnd'
import XHR from './xhr'

const xhr = new XHR();
const dnd = new DnD(xhr);
dnd.init();