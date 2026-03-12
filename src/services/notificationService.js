export const requestNotificationPermission = () => {

  if (Notification.permission !== "granted") {
    Notification.requestPermission()
  }

}

export const sendNotification = (mantra) => {

  new Notification("Jaap Reminder 🙏", {
    body: mantra + " bolo"
  })

}