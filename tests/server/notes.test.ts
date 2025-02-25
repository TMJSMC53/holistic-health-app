import { describe, it, expect } from 'vitest';
import {
  APIUser,
  givenAMongoDBInstance,
  givenAServer,
  givenAUser,
  givenTheCurrentDateIs,
} from './helpers.js';

describe('notes controller', () => {
  givenAMongoDBInstance();
  const getBaseURL = givenAServer();

  // GIVEN the below current date
  let date: Date;
  beforeEach(() => {
    date = givenTheCurrentDateIs(new Date(2024, 0, 2, 12 + 5, 30, 15));
  });

  // Given a newly registered user
  let user: APIUser;
  let Cookie: string;
  beforeEach(async () => {
    ({ user, Cookie } = await givenAUser(getBaseURL()));
  });

  /**
   * Make an API Request to create a note
   */
  async function createNote(
    title: string,
    color: string,
    note: string,
    tag: string
  ) {
    return await fetch(getBaseURL() + '/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie,
      },
      body: JSON.stringify({
        title,
        color,
        note,
        tag,
      }),
    });
  }

  describe('createNote', () => {
    it('should return the created note', async () => {
      // WHEN the user calls the create note endpoint
      const noteResponse = await createNote(
        'New Note',
        'primary-400',
        'I like red',
        'colors'
      );

      // THEN the status code is 201
      expect(noteResponse.status).toBe(201);
      // THEN the note returned has the values that were provided
      const note = await noteResponse.json();
      expect(note).toMatchObject({
        title: 'New Note',
        color: 'primary-400',
        note: 'I like red',
        tag: 'colors',
      });
      // THEN the note has the current user ID
      expect(note).toMatchObject({
        user_id: user._id,
      });
      // THEN the note has the current date
      expect(note).toMatchObject({
        date,
      });
    });

    it('should handle server error when creating a note', async () => {
      // WHEN the information is not provided
      const response = await fetch(getBaseURL() + '/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie,
        },
        body: JSON.stringify({
          title: '',
          color: '',
          note: '',
          tag: '',
        }),
      });

      // THEN the response status should be 500
      expect(response.status).toBe(500);
    });
  });
  describe('getNotes', () => {
    it('should store the created note in the DB', async () => {
      // GIVEN the user has created a note
      const noteResponse = await createNote(
        'New Note',
        'primary-400',
        'I like red',
        'colors'
      );
      const note = await noteResponse.json();

      // WHEN the user calls the get notes endpoint
      const notesResponse = await fetch(getBaseURL() + '/api/notes', {
        headers: {
          Cookie,
        },
      });

      // THEN the status code is 200
      expect(notesResponse.status).toBe(200);
      // THEN the one created note is returned in an array
      const notes = await notesResponse.json();
      expect(notes).toStrictEqual([note]);
    });

    it('should return an error message if the user is NOT logged in', async () => {
      // WHEN the user is NOT logged in
      const notesResponse = await fetch(getBaseURL() + '/api/notes', {
        headers: {
          // Cookie,
        },
      });

      // THEN the status code is 500
      expect(notesResponse.status).toBe(500);

      // THEN the error message should appear
      const error = await notesResponse.json();
      expect(error.message).toBe('User not logged in');
    });
  });

  describe('updateNote', () => {
    it('should update the current note', async () => {
      // GIVEN there is a note
      const noteResponse = await createNote(
        'Test title',
        'primary-400',
        'I like blue',
        'colors'
      );
      expect(noteResponse.status).toBe(201);
      const note = await noteResponse.json();
      const noteId = note._id;

      // WHEN the PUT api request is made
      const updatedNoteResponse = await fetch(
        getBaseURL() + `/api/notes/${noteId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Cookie,
          },
          body: JSON.stringify({
            title: 'New Title',
            note: 'I like blue',
            color: 'primary-400',
            tag: 'colors',
          }),
        }
      );

      // THEN an item in the note is updated
      expect(updatedNoteResponse.status).toBe(200);
      const updatedNoteTitle = await updatedNoteResponse.json();
      expect(updatedNoteTitle.title).toBe('New Title');
    });
    it('should return a 404 error message if the note you are trying to update does not exist', async () => {
      const nonExistentNoteId = '507f1f77bcf86cd799439011';

      // WHEN the note you're trying to update does not exist
      const updatedNoteResponse = await fetch(
        getBaseURL() + `/api/notes/${nonExistentNoteId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Cookie,
          },
          body: JSON.stringify({
            title: 'New Title',
          }),
        }
      );

      // THEN return a 404 error message if the note you're trying to update does not exist
      expect(updatedNoteResponse.status).toBe(404);

      // THEN return the Note not found error message
      const error = await updatedNoteResponse.json();
      expect(error.message).toBe('Note not found');
    });
    it('should return 500 if the id does not match the MONGODB pattern', async () => {
      const nonExistentNoteId = '12345';

      // WHEN the note id you're trying to update is not MONGODB pattern
      const updateNoteResponse = await fetch(
        getBaseURL() + `/api/notes/${nonExistentNoteId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Cookie,
          },
          body: JSON.stringify({
            title: 'New Title',
          }),
        }
      );

      // THEN return the status of 500
      expect(updateNoteResponse.status).toBe(500);
    });
  });
  describe('deleteNote', () => {
    it('should handle DELETE note api request', async () => {
      const noteResponse = await createNote(
        'New Note',
        'primary-400',
        'I like red',
        'colors'
      );

      const note = await noteResponse.json();
      const noteId = note._id;

      // WHEN the DELETE api request is made
      const response = await fetch(getBaseURL() + `/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          Cookie,
        },
      });

      // THEN the response status should be 204
      expect(response.status).toBe(204);
    });

    it('should return 404 when deleting non-existent note', async () => {
      // WHEN trying to delete an non-existent note
      const nonexistentNoteId = '507f1f77bcf86cd799439011';

      const response = await fetch(
        getBaseURL() + `/api/notes/${nonexistentNoteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Cookie,
          },
        }
      );

      // THEN the response status should be 404
      expect(response.status).toBe(404);

      // AND THEN the error message should match
      const error = await response.json();
      expect(error.message).toBe(
        `Entry with id: ${nonexistentNoteId} not found`
      );
    });

    it('should return 500 when the note id does NOT match MONGODB pattern', async () => {
      // WHEN the note id does NOT match MONGODB pattern
      const nonexistentNoteId = '12345';

      const response = await fetch(
        getBaseURL() + `/api/notes/${nonexistentNoteId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Cookie,
          },
        }
      );

      // THEN the response status should be 500
      expect(response.status).toBe(500);
    });
  });
});
