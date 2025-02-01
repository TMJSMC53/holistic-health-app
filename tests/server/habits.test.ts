import { describe, it, expect } from 'vitest';
import {
  APIUser,
  givenAMongoDBInstance,
  givenAServer,
  givenAUser,
  givenTheCurrentDateIs,
} from './helpers.js';

describe('when creating a habit', () => {
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

  it('should store the created habit in the DB', async () => {
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
