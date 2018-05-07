// to be used with unresolved queries
module.exports = {
    // map Statuspage.io response key values to custom key values. Non-mapped values in keys are given the default key.
    maps: {
      // can map each entry to new key based on string identifying the mapped key
      title: "name",
      incident_link: "shortlink",
      // or based on a function which takes the incident item object
      message: ({ incident_updates }) => incident_updates[0].body,
      status_color: ({ status }) => {
        switch (status) {
          case "investigating":
            return "red";
          case "identified":
            return "orange";
          case "monitoring":
            return "green";
          case "resolved":
            return "green";
          default:
            return "green";
        }
      },
      hashtags: ({ incident_updates }) => {
        const body = incident_updates[0].body;
        return body && body.match(/#\w+/g) ?
          body.match(/#\w+/g).map(v => v.replace('#', ''))
          : [];
      }
    },
    keys: ["id", "message", "incident_link", "title", "created_at", "status", "status_color", "hashtags"],
};
