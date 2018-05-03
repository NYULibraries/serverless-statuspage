# serverless-statuspage

A serverless Lambda API for NYU Libraries [statuspage.io](http://nyulibraries.statuspage.io/) updates

# Reasoning

First, what is the point of a serverless API that repeats information available on the native statuspage.io API?

This services has been implemented due to statuspage.io's rate limiting on it's API (~1 request/second). Because library.nyu.edu would blow past this rate requirement, this serverless Lambda function performs two primary functions:

1. Remaps and simplifies API incidents coming from statuspage.io utilizing the [status-jockey](https://github.com/NYULibraries/statusjockey) npm module.

2. Utilizing AWS Lamda's integration with API Gateway, API responses are cached for a set amount of time, allowing for faster average response-times while also reducing the calls to the statuspage.io API.

# Features

* Deployment via [serverless](https://serverless.com/) framework.
* Response-caching in API Gateway on a per-query basis.

## Testing
locally:
```bash
yarn test
```

docker:

```bash
docker-compose run test
```

## Deploy

Required environment variables:
* `LAMBDA_ROLE` (e.g. arn:aws:iam::123456789:role/AWSLambdaBasicExecutionRole)
* `STAGE` (dev/prod)

If not using serverless deployment profiles:
* AWS_ACCESS_KEY_ID
* AWS_SECRET_ACCESS_KEY

locally:

```bash
yarn deploy
```
docker:
```bash
docker-compose run deploy
```

## Usage
### Query parameters
  * `page_id` (required): Queries the incidents of the corresponding statuspage.io page id.
  * `type` (optional): Queries `all` incidents (default), `scheduled` incidents, or `unresolved` incidents
  * `limit` (optional): Limits to the X most recent incidents in response.

e.g. To get the two most recent incidents (any) from page with id `abcd1234`: `/status?page_id=abcd1234&limit=2`

### Example responses:
`/status?page_id=kyyfz4489y7m&limit=2`
```json
[
  {
    "status": "resolved",
    "created_at": "2018-04-30T16:54:12.954Z",
    "id": "yk38z6cwh8l1",
    "title": "Outage: All NYU-NET-Dependent Services",
    "incident_link": "http://stspg.io/47dab52e5",
    "most_recent_message": "The NYU's network (NYU-NET) outage issue has been resolved by NYU IT and systems are operational.",
    "status_color": "green",
    "hashtags": [

    ]
  },
  {
    "status": "resolved",
    "created_at": "2018-03-31T15:01:05.972Z",
    "id": "pd25qx024wzg",
    "title": "Interlibrary Loan Outage",
    "incident_link": "http://stspg.io/7bb5d3364",
    "most_recent_message": "The systems have been restarted and service are fully restored.",
    "status_color": "green",
    "hashtags": [

    ]
  }
]
```
`/status?page_id=kyyfz4489y7m&type=unresolved`

```json
[
  {
    "status": "investigating",
    "created_at": "2018-04-30T16:54:12.954Z",
    "id": "yk38z6cwh8l1",
    "title": "Outage: All NYU-NET-Dependent Services",
    "incident_link": "http://stspg.io/47dab52e5",
    "most_recent_message": "Please be advised that all services on NYU's network (NYU-NET) are currently unavailable due to a network outage. NYU IT is investigating this issue and will post updates to the IT Service Status page (https://www.nyu.edu/life/information-technology/help-and-service-status/it-service-status.html) and the appropriate notification lists as they become available.\r\n\r\n#majoroutage",
    "status_color": "red",
    "hashtags": ["majoroutage"]
  }
]
```
