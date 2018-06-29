module.exports = {
    maps: {
      title: "name",
      incident_link: "shortlink",
      message: ({ incident_updates }) => incident_updates[0].body,
      hashtags: ({ incident_updates }) => {
        const body = incident_updates[0].body;
        return body && body.match(/#\w+/g) ?
          body.match(/#\w+/g).map(v => v.replace('#', ''))
          : [];
      }
    },
    keys: ["id", "message", "incident_link", "title", "created_at", "status", "hashtags"],
};
