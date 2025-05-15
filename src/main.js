import '../src/assets/styles/main.scss';
import { createHeader } from './modules/header.js';
import { mainContainer} from './modules/mainContainer.js';
import { createFooter } from './modules/footer.js';

document.getElementById('header').append(createHeader());
document.getElementById('main').append(mainContainer());
document.getElementById('footer').append(createFooter());

// const items = [
//     "/src/assets/images/slot_1.svg",
//     "/src/assets/images/slot_2.svg",
//     "/src/assets/images/slot_3.svg",
//     "/src/assets/images/slot_4.svg",
//     "/src/assets/images/slot_5.svg",
//     "/src/assets/images/slot_6.svg",
//     "/src/assets/images/slot_7.svg",
//     "/src/assets/images/slot_8.svg",
//     "/src/assets/images/slot_9.svg"
// ];
