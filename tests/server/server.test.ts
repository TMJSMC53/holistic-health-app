import { describe, it, expect } from "vitest";
import { givenAMongoDBInstance, givenAServer, givenDistIndexHtml, givenNoMongoDBToConnectTo } from "./helpers.js";


describe("given the DB is available", () => {
	givenAMongoDBInstance()
	givenDistIndexHtml();
	const getBaseURL = givenAServer();

	it("should respond with the homepage for client-side routing to handle", async () => {
		// WHEN the user makes a request to a random page
		const response = await fetch(getBaseURL() + '/random-page');

		// THEN the status code is 200
		expect(response.status).toBe(200);

		// THEN the content is `Hello, World!` - the content of the dist/index.html file
		const body = await response.text();
		expect(body).toBe('Hello, World!')
	});
});

describe('given the DB is unavailable', () => {
	givenNoMongoDBToConnectTo();
	givenDistIndexHtml()
	const getBaseURL = givenAServer();

	it("should respond that the DB cannot be connected to when making an API request ", async () => {
		// WHEN the user makes a request to a random page
		const response = await fetch(getBaseURL() + '/api/connect-to-db');

		// THEN the status code is 500
		expect(response.status).toBe(500);

		const body = await response.text();
		// THEN the content is an HTML page with a title of error
		expect(body).includes('<title>Error</title>')
		// THEN the content is an HTML page with the error stack trace
		expect(body).includes('MongooseServerSelectionError: connect ECONNREFUSED')
	});

	it("should respond with the file content when requesting static content", async () => {
		// WHEN the user makes a request to the homepage
		const response = await fetch(getBaseURL());

		// THEN the status code is 200
		expect(response.status).toBe(200);

		const body = await response.text();
		// THEN the content is `Hello, World!` - the content of the dist/index.html file
		expect(body).toBe('Hello, World!')
	});
})