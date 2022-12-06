import { createContext, useEffect, useReducer } from "react";

export const ProfileContext = createContext();

const initialState = {
	currentProfile: null,
	isLoading: false,
	error: null,
};

const ProfileReducer = (state, action) => {
	switch (action.type) {
		case "GET_PROFILE_REQUEST":
			return {
				currentProfile: null,
				isLoading: true,
				error: null,
			};
		case "GET_PROFILE_SUCCESS":
			return {
				currentProfile: action.payload,
				isLoading: false,
				error: null,
			};
		case "GET_PROFILE_FAILURE":
			return {
				currentProfile: null,
				isLoading: false,
				error: action.payload,
			};
		case "UPDATE_PROFILE_REQUEST":
			return {
				...state,
				isLoading: true,
				error: null,
			};
		case "UPDATE_PROFILE_SUCCESS":
			return {
				...state,
				currentProfile: action.payload,
				isLoading: false,
				error: null,
			};
		case "UPDATE_PROFILE_FAILURE":
			return {
				...state,
				isLoading: false,
				error: action.payload,
			};

		default:
			return state;
	}
};

export const ProfileContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(ProfileReducer, initialState);

	return (
		<ProfileContext.Provider
			value={{
				currentProfile: state.currentProfile,
				isLoading: state.isLoading,
				error: state.error,
				dispatch,
			}}
		>
			{children}
		</ProfileContext.Provider>
	);
};
