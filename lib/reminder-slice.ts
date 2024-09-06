import { createSlice, PayloadAction } from '@reduxjs/toolkit'


export interface Reminder {
    id: string
    date: string
    text: string
}

interface ReminderState {
    reminders: Reminder[]
}

const initialState: ReminderState = {
    reminders: [],
}

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

export const selectReminders = (state: ReminderState): Reminder[] => state.reminders

export default reminderSlice.reducer