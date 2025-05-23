var INTERNAL_DOMAINS = ['mediacurrent.com', 'rhythmagency.com', 'codeandtheory.com',];
var THRESHOLD = 4;
var MINUTES = 10;

function checkRecentEvents() {
  var now = new Date();
  var lookAhead = new Date(now.getTime() + MINUTES * 60 * 1000);
  var calendar = CalendarApp.getDefaultCalendar();
  var events = calendar.getEvents(now, lookAhead);
  var props = PropertiesService.getScriptProperties();

  for (var i = 0; i < events.length; i++) {
    var event = events[i];
    var eventId = event.getId();

    // Skip when the email has already been warned.
    if (props.getProperty(eventId)) {
      continue;
    }

    // Skip if you aren't the owner.
    var creators = event.getCreators();
    if (creators.length > 0 && creators[0] !== Session.getActiveUser().getEmail()) {
      props.setProperty(eventId, 'skipped');
      continue;
    }
    var attendees = event.getGuestList();
    var internalGuests = attendees.filter(function (guest) {
      var email = guest.getEmail();
      return INTERNAL_DOMAINS.some(function (domain) {
        return email.endsWith('@' + domain);
      });
    });

    if (internalGuests.length > THRESHOLD) {
      var organizer = event.getCreators()[0];

      MailApp.sendEmail({
        to: organizer,
        subject: "⚠️ Too Many Internal Guests in Your Meeting",
        htmlBody:
          "<p>Your event <b>" + event.getTitle() + "</b> has <b>" +
          internalGuests.length +
          "</b> people from internal domains (" + INTERNAL_DOMAINS.join(', ') + "). Consider reducing the guest list or using a different format.</p>"
      });

      props.setProperty(eventId, 'warned');
    }
  }
}

function clearEventWarnings() {
  PropertiesService.getScriptProperties().deleteAllProperties();
}
