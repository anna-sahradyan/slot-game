import '../src/assets/styles/main.scss';
import { createHeader } from './modules/header.js';
import { mainContainer} from './modules/mainContainer.js';
import { createFooter } from './modules/footer.js';

document.getElementById('header').append(createHeader());
document.getElementById('main').append(mainContainer());
document.getElementById('footer').append(createFooter());


