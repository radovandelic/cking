import home from './home'
import equipment from './equipment'
import staff from './staff'
import type from './type'
import faq from './faq'

const translations = {
    equipment, staff, type, faq, home
}

export {
    equipment, staff, type, faq, home
}
console.log(JSON.stringify({ equipment, staff, type, faq }))
export default translations;