import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '@/lib/store';

export interface Reminder {
    id: string
    date: string
    text: string
    time: string
    creationTime?: string
}

interface ReminderState {
    reminders: Reminder[]
}

const initialState: ReminderState = {
    reminders: [],
}

/**
 * Reminder Slice
 * 
 * This file contains the definition of the reminder slice, which is a part of the Redux store.
 * The reminder slice handles the state and actions related to reminders.
 */

/**
 * @typedef {Object} Reminder - Represents a reminder object.
 * @property {string} id - The unique identifier of the reminder.
 * @property {string} message - The message of the reminder.
 * @property {Date} date - The date of the reminder.
 */

/**
 * @typedef {Object} ReminderState - Represents the state of the reminder slice.
 * @property {Reminder[]} reminders - The array of reminders.
 */

/**
 * @function addReminder
 * @description Adds a new reminder to the state.
 * @param {ReminderState} state - The current state of the reminder slice.
 * @param {PayloadAction<Reminder>} action - The payload action containing the reminder to be added.
 */

/**
 * @function removeReminder
 * @description Removes a reminder from the state.
 * @param {ReminderState} state - The current state of the reminder slice.
 * @param {PayloadAction<string>} action - The payload action containing the ID of the reminder to be removed.
 */

/**
 * @constant reminderSlice
 * @description The reminder slice, which is created using the createSlice function from Redux Toolkit.
 * @type {Slice<ReminderState>}
 */
export const reminderSlice = createSlice({
    name: 'reminder',
    initialState,
    reducers: {
        addReminder: (state, action: PayloadAction<Reminder>) => {
            state.reminders.push(action.payload)
        },
        removeReminder: (state, action: PayloadAction<string>) => {
            state.reminders = state.reminders.filter((reminder) => reminder.id !== action.payload)
        },
    },
})

export const { addReminder, removeReminder } = reminderSlice.actions

export const selectReminders = (state: RootState): Reminder[] => state.reminders.reminders;


export default reminderSlice.reducer