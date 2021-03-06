const LambdaTester = require('lambda-tester');
const { status } = require('../handler.js');
const nock = require('nock');

describe('all incidents', () => {
  const BASE_API_URL = "https://api.statuspage.io/v1/pages/";
  const MOCK_API_KEY = "922bfbc1-d6ad-417c-940b-50c07e8db080";
  const page_id = "kyyfz4489y7m";
  const data = require('./fixtures/statuspage-all.fixture.json');
  const expectedResult = [
    {
      created_at: '2018-04-30T16:54:12.954Z',
      id: 'yk38z6cwh8l1',
      status: 'investigating',
      title: 'Outage: All NYU-NET-Dependent Services',
      incident_link: 'http://stspg.io/47dab52e5',
      message: 'Please be advised that all services on NYU\'s network (NYU-NET) are currently unavailable due to a network outage. NYU IT is investigating this issue and will post updates to the IT Service Status page (https://www.nyu.edu/life/information-technology/help-and-service-status/it-service-status.html) and the appropriate notification lists as they become available.\r\n\r\n#majoroutage',
      hashtags: [
        'majoroutage'
      ]
    }
  ];

  beforeEach(() => {
    process.env.STATUSPAGE_API_KEY = MOCK_API_KEY;
  });

  describe('on success', () => {
    let allIncidentsRequest;
    beforeEach(() => {
      allIncidentsRequest =
      nock(BASE_API_URL)
      .get(`/${page_id}/incidents.json`)
      .matchHeader('Authorization', `OAuth ${MOCK_API_KEY}`)
      .reply(200, data);
    });

    it('should filter data', (done) => {
      LambdaTester(status)
        .event({
          queryStringParameters: {
            page_id: "kyyfz4489y7m",
            type: 'all',
            limit: 1
          }
        })
        .expectResult(result => {
          expect(allIncidentsRequest.isDone()).toBe(true);
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toEqual(expectedResult);
        })
        .verify(done);
    });

    describe('on dev', () => {
      beforeEach(() => {
        process.env.STAGE = 'dev';
      });

      it('should have required access-control headers', (done) => {
        LambdaTester(status)
        .event({
          queryStringParameters: {
            page_id: "kyyfz4489y7m",
            type: 'all',
            limit: 1
          }
        })
        .expectResult(result => {
          expect(allIncidentsRequest.isDone()).toBe(true);
          expect(result.statusCode).toEqual(200);
          expect(result.headers).toEqual({
            ["Access-Control-Allow-Origin"]: "*",
            ["Access-Control-Allow-Headers"]: "Content-Type"
          });
        })
        .verify(done);
      });
    });

    describe('on prod', () => {
      beforeEach(() => {
        process.env.STAGE = 'prod';
      });

      it('should have required access-control headers', (done) => {

        LambdaTester(status)
        .event({
          queryStringParameters: {
            page_id: "kyyfz4489y7m",
            type: 'all',
            limit: 1
          }
        })
        .expectResult(result => {
          expect(allIncidentsRequest.isDone()).toBe(true);
          expect(result.statusCode).toEqual(200);
          expect(result.headers).toEqual({
            ["Access-Control-Allow-Origin"]: "https://library.nyu.edu",
            ["Access-Control-Allow-Headers"]: "Content-Type"
          });
        })
        .verify(done);
      });
    });
  });

  describe('on error', () => {

    let failedRequest;
    beforeEach(() => {
      spyOn(console, 'error');

      failedRequest =
        nock(BASE_API_URL)
          .get(`/${page_id}/incidents.json`)
          .matchHeader('Authorization', `OAuth ${MOCK_API_KEY}`)
          .reply(400);
    });

    it('should return empty array on error', (done) => {
      LambdaTester(status)
        .event({
          queryStringParameters: {
            page_id,
            type: 'all',
            limit: 1
          }
        })
        .expectResult(result => {
          expect(failedRequest.isDone()).toBe(true);
          expect(result.statusCode).toEqual(200);
          expect(JSON.parse(result.body)).toEqual([]);
        })
        .verify(done);
    });

    it('should log error in Lambda console', (done) => {
      LambdaTester(status)
        .event({
          queryStringParameters: {
            page_id,
            type: 'all',
            limit: 1
          }
        })
        .expectResult(() => {
          expect(failedRequest.isDone()).toBe(true);
          expect(console.error).toHaveBeenCalled();
        })
        .verify(done);
    });
  });

  afterEach(() => {
    delete process.env.STAGE;
    nock.cleanAll();
  });

});
