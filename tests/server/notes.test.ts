import { describe, it, expect } from "vitest";
import { APIUser, givenAMongoDBInstance, givenAServer, givenAUser, givenTheCurrentDateIs } from "./helpers.js";


describe("when creating a note", () => {
	givenAMongoDBInstance()
	const getBaseURL = givenAServer();

	// GIVEN the below current date
	let date: Date
	beforeEach(() => {
		date = givenTheCurrentDateIs(new Date(2024, 0, 2, 12 + 5, 30, 15));
	})

	// Given a newly registered user
	let user: APIUser
	let Cookie: string
	beforeEach(async () => {
		({ user, Cookie } = await givenAUser(getBaseURL()));
	})

	/**
	 * Make an API Request to create a note
	 */
	async function createNote(title: string, color: string, note: string, tag: string) {
		return await fetch(getBaseURL() + '/api/notes', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie
			},
			body: JSON.stringify({
				title, color, note, tag
			})
		})
	}

	it('should return the created note', async () => {
		// WHEN the user calls the create note endpoint
		const noteResponse = await createNote('New Note', 'primary-400', 'I like red', 'colors')

		// THEN the status code is 201
		expect(noteResponse.status).toBe(201)
		// THEN the note returned has the values that were provided
		const note = await noteResponse.json()
		expect(note).toMatchObject({
			title: 'New Note',
			color: 'primary-400',
			note: 'I like red',
			tag: 'colors',
		})
		// THEN the note has the current user ID
		expect(note).toMatchObject({
			user_id: user._id
		})
		// THEN the note has the current date
		expect(note).toMatchObject({
			date
		})
	});

	it('should store the created note in the DB', async () => {
		// GIVEN the user has created a note
		const noteResponse = await createNote('New Note', 'primary-400', 'I like red', 'colors')
		const note = await noteResponse.json()

		// WHEN the user calls the get notes endpoint
		const notesResponse = await fetch(getBaseURL() + '/api/notes', {
			headers: {
				Cookie
			}
		});

		// THEN the status code is 200
		expect(notesResponse.status).toBe(200)
		// THEN the one created note is returned in an array
		const notes = await notesResponse.json()
		expect(notes).toStrictEqual([note])
	})
});