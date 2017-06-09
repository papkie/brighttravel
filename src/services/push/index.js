import * as apn from 'apn'
import config from '../../config'

const provider = new apn.Provider({
  pfx: config.apnCert,
  production: false
})

export function sendPush (target) {
  const notification = new apn.Notification()
  notification.alert = 'Nowa osoba potrzebuje twojej pomocy!'
  notification.badge = 1
  notification.topic = config.apnTopic
  provider.send(notification, [target]).then((response) => {
    // console.log(response)
    // response.sent: Array of device tokens to which the notification was sent succesfully
    // response.failed: Array of objects containing the device token (`device`) and either an `error`, or a `status` and `response` from the API
  })
  .catch(console.error)
}
