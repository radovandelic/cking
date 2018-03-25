import header from './header'
import home from './home'
import dashboard from './dashboard'
import register from './register'
import registerKitchen from './registerKitchen'
import popup from './popup'
import uploadImage from './uploadImage'
import equipment from './equipment'
import staff from './staff'
import type from './type'
import faq from './faq'
import errors from './errors'

export {
    equipment, staff, type, faq, home, header, dashboard, uploadImage, register, registerKitchen, popup, errors
}

const translations = {
    equipment, staff, type, header, dashboard, uploadImage, register, registerKitchen, popup, errors
}

console.log(JSON.stringify(translations));
export default translations;