import { useState, useEffect } from "react";
import { HabitData } from "../../habits";

export type SortBy = 'HABIT_CREATION' | 'LATEST_ENACTMENT';
export type SortDirection = 'ASC' | 'DESC'
export type SortingByWithDirection = ReturnType<typeof useSortingByWithDirection>[0]
export type SetSortingByWithDirection = ReturnType<typeof useSortingByWithDirection>[1]

export const useSortingByWithDirection = () => {
	const [sortingByWithDirection, setSortingByWithDirection] = useState<{
		by: SortBy,
		direction: SortDirection
	}>(() => {
		const defaultValue = { by: 'HABIT_CREATION', direction: 'ASC' };
		const rawValue = localStorage.getItem('habits-sorting-by-and-direction')
		if (rawValue === null) return defaultValue
		try {
			return JSON.parse(rawValue)
		} catch (error) {
			console.warn(error)
			return defaultValue
		}
	})

	useEffect(() => {
		localStorage.setItem('habits-sorting-by-and-direction', JSON.stringify(sortingByWithDirection))
	}, [sortingByWithDirection])

	return [sortingByWithDirection, setSortingByWithDirection] as const
}

/**
 * Return a copy of {@link habits} sorted by {@link SortBy} and {@link SortDirection}
 */
export const getSortedHabits = (habits: HabitData[], by: SortBy, direction: SortDirection) => [...habits].sort((a, b) => {
	const enactmentIndex = by === 'HABIT_CREATION' ? 0 : -1

	const aDate = a.enactments.at(enactmentIndex)!;
	const bDate = b.enactments.at(enactmentIndex)!;

	if (direction === 'ASC') {
		return aDate.localeCompare(bDate)
	} else {
		return bDate.localeCompare(aDate)
	}
})
