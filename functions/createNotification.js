const Notification = require("../models/notificationModel");

module.exports = async function createNotification(content, userId,type) {
  await Notification.create({
    user: userId,
    type,
    content,
  });
}