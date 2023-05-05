import CONFIGFUNCTIONS from './configFunctions.js'

export default {
    INVITE_TEMPLATE_FILE: 'https://localhost:3000/template.html',
    ENABLE_PHONE_ACCESS: true,
    PHONE_NUMBERS_API_URL: 'https://webconf.numerique.gouv.fr/voxapi/api/v1/conn/jitsi/phoneNumbers',
    PHONE_PIN_CODE_API_URL: 'https://webconf.numerique.gouv.fr/voxapi/api/v1/conn/jitsi/conference/code',
    ROOT_JITSI_DOMAIN: 'webconf.numerique.gouv.fr',
    JITSI_ROOM_NAME_FORMAT: CONFIGFUNCTIONS.generateRoomName(),
    PHONE_NUMBER_FORMAT: `%phone_number%`
}