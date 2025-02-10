import { describe, it, expect } from 'vitest';
import {
  APIUser,
  givenAMongoDBInstance,
  givenAServer,
  givenAUser,
  givenTheCurrentDateIs,
} from './helpers.js';

describe('habits controller', () => {
  givenAMongoDBInstance();
  const getBaseURL = givenAServer();

  // GIVEN the below current date
  let date: Date;

  beforeEach(() => {
    date = givenTheCurrentDateIs(new Date(2025, 0, 2, 12 + 5, 30, 15));
  });

  // GIVEN a newly registered user
  let user: APIUser;
  let Cookie: string;
  beforeEach(async () => {
    ({ user, Cookie } = await givenAUser(getBaseURL()));
  });
  /**
   * Make an API Request to create a note
   */
  async function createHabit(title: string, enactments: string[]) {
    return await fetch(getBaseURL() + '/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie,
      },
      body: JSON.stringify({
        title,
        enactments,
      }),
    });
  }

  describe('createHabit', () => {
    it('should return a created habit', async () => {
      // GIVEN an array with 1 enactment date
      const enactmentDates = ['2025-01-02T17:30:15'];
      // WHEN the user calls the create habit endpoint
      const habitResponse = await createHabit('New Habit', enactmentDates);

      // THEN the status code is 201
      expect(habitResponse.status).toBe(201);

      // THEN the habit returned has the values that were provided
      const habit = await habitResponse.json();

      // Convert received enactments to local time strings for comparison
      const receivedEnactments = habit.enactments.map((date: string) =>
        new Date(date).toISOString()
      );

      expect(receivedEnactments).toEqual(['2025-01-02T23:30:15.000Z']); // Expected in UTC format
      expect(habit).toMatchObject({
        title: 'New Habit',
        enactments: receivedEnactments,
      });

      // THEN the habit has the current user ID
      expect(habit).toMatchObject({
        user_id: user._id,
      });

      // THEN the habit has the current date
      expect(new Date(habit.enactments)).toEqual(date);
    });
    it('should return a 409 status if a habit already exits', async () => {
      // GIVEN the user has created a habit
      const enactmentDate = ['2025-01-02T17:30:15'];
      await createHabit('Exercise', enactmentDate);

      // WHEN the user calls the get habits endpoint
      const duplicateResponse = await fetch(getBaseURL() + '/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie,
        },
        body: JSON.stringify({
          title: 'Exercise',
          enactmentDate,
        }),
      });

      // THEN the status code is 409
      expect(duplicateResponse.status).toBe(409);

      // THEN the error message should appear
      const error = await duplicateResponse.json();
      expect(error.message).toBe('Habit already exists');
    });
    it('should handle server error when creating a habit', async () => {
      // WHEN the information is not provided
      const response = await fetch(getBaseURL() + '/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie,
        },
        body: JSON.stringify({
          title: '',
          enactmentDate: null,
        }),
      });

      // THEN the response status should be 500
      expect(response.status).toBe(500);

      // AND the error message should match
      const error = await response.json();
      expect(error.message).toBe('Error creating habit');
    });
  });

  describe('getHabits', () => {
    it('should get created habit stored in the DB', async () => {
      // GIVEN the user has created a habit
      const enactmentDate = ['2025-01-02T17:30:15'];
      const habitResponse = await createHabit('New Habit', enactmentDate);
      const habit = await habitResponse.json();

      // WHEN the user calls the get habits endpoint
      const habitsResponse = await fetch(getBaseURL() + '/api/habits', {
        headers: {
          Cookie,
        },
      });

      // THEN the status code is 200
      expect(habitsResponse.status).toBe(200);

      // THEN the one created habit is returned in an array
      const habits = await habitsResponse.json();
      expect(habits).toStrictEqual([habit]);
    });

    it('should return an error message if the user is NOT logged in', async () => {
      // WHEN the user is NOT logged in
      const habitsResponse = await fetch(getBaseURL() + '/api/habits', {
        headers: {
          // Cookie,
        },
      });

      // THEN the status code is 500
      expect(habitsResponse.status).toBe(500);

      // THEN the error message should appear
      const error = await habitsResponse.json();
      expect(error.message).toBe('User not logged in');
    });
  });

  describe('updateHabit', () => {
    it('should update a current habit', async () => {
      // GIVEN there is a habit
      const habitResponse = await createHabit('Test title', [
        '2025-02-08T09:24:08',
      ]);
      const habit = await habitResponse.json();
      const habitId = habit._id;
      // WHEN the PUT api request is made and give it a new title
      const updatedHabitTitleResponse = await fetch(
        getBaseURL() + `/api/habits/${habitId}`,
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
      // THEN the title is updated
      expect(updatedHabitTitleResponse.status).toBe(200);
      const updatedHabitTitle = await updatedHabitTitleResponse.json();
      expect(updatedHabitTitle.title).toBe('New Title');
    });

    it('should return a 404 error message habit you are trying to update does not exist', async () => {
      const nonExistentHabitId = '507f1f77bcf86cd799439011';
      // WHEN the habit you're trying to update does not exist
      const updatedHabitTitleResponse = await fetch(
        getBaseURL() + `/api/habits/${nonExistentHabitId}`,
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

      // THEN return a 404 error message if the habit you're trying to update does not exist
      expect(updatedHabitTitleResponse.status).toBe(404);
      // THEN return the Habit title not found error message
      const error = await updatedHabitTitleResponse.json();
      expect(error.message).toBe('Habit title not found');
    });

    it('should return 500 if the id does not match the MONGODB pattern', async () => {
      const nonExistentHabitId = '12345';
      // WHEN the habit id you're trying to update is not MONGODB pattern
      const updatedHabitTitleResponse = await fetch(
        getBaseURL() + `/api/habits/${nonExistentHabitId}`,
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
      expect(updatedHabitTitleResponse.status).toBe(500);
    });
  });

  describe('deleteHabit', () => {
    it('should handle DELETE habit api request ', async () => {
      const habitResponse = await createHabit('Test Habit', [
        '2025-01-02T17:30:15',
      ]);
      const habit = await habitResponse.json();
      const habitId = habit._id;
      // WHEN the DELETE api request is made
      const response = await fetch(getBaseURL() + `/api/habits/${habitId}`, {
        method: 'DELETE',
        headers: {
          Cookie,
        },
      });

      // THEN the response status should be 204
      expect(response.status).toBe(204);
    });
    it('should return 404 when deleting non-existent habit', async () => {
      // WHEN trying to delete a non-existent habit
      const nonexistentId = '507f1f77bcf86cd799439011';
      const response = await fetch(
        getBaseURL() + `/api/habits/${nonexistentId}`,
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

      // AND the error message should match
      const error = await response.json();
      expect(error.message).toBe(`Entry with id: ${nonexistentId} not found`);
    });
  });

  it('should return 500 when the habit id does not match MONGODB pattern', async () => {
    // WHEN the habit id does not match MONGODB pattern
    const nonExistentId = '123456';

    const response = await fetch(
      getBaseURL() + `/api/habits/${nonExistentId}`,
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
