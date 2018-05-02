module.exports = {
  abcd1234: {
    // only return incidents with the following statuses. Otherwise, return all.
    filterByStatus: ["investigating", "completed"],
    // only return incidents from the following components. Otherwise, return all.
    filterByComponents: ["EZProxy"],
    // only returns the following keys
    keys: ["id", "message", "incident_link", "created_at", "status", "hashtags"],
    // map Statuspage.io response key values to custom key values. Non-mapped values in keys are given the default key.
    maps: {
      // can map each entry to new key based on string identifying the mapped key
      title: "name",
      incident_link: "shortlink",
      // or based on a function which takes the incident item object
      message: ({ incident_updates }) => incident_updates[0].body,
      status: ({ status }) => {
        switch (status) {
          case "investigating":
            return "red";
          case "identified":
            return "orange";
          case "monitoring":
            return "green";
          default:
            return "red";
        }
      },
      hashtags: ({ incident_updates }) => {
        const body = incident_updates[0].body;
        return body && body.match(/#\w+/g) ? body.match(/#\w+/g).map(v => v.replace('#', '')) : [];
      }
    }
  }
};
