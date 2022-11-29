import { createContext, useEffect, useReducer } from "react";

export const AuthContext = createContext();

const initialState = {
	currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
	isLoading: false,
	error: null,
};

const AuthReducer = (state, action) => {
	switch (action.type) {
		case "REGISTER_REQUEST":
		case "LOGIN_REQUEST":
			return {
				currentUser: null,
				isLoading: true,
				error: null,
			};
		case "REGISTER_SUCCESS":
		case "LOGIN_SUCCESS":
			return {
				currentUser: action.payload,
				isLoading: false,
				error: null,
			};
		case "REGISTER_FAILURE":
		case "LOGIN_FAILURE":
			return {
				currentUser: null,
				isLoading: false,
				error: action.payload,
			};

		case "LOGOUT":
			return {
				initialState,
			};
		case "DELETE_USER":
			return {
				initialState,
			};
		default:
			return state;
	}
};

export const AuthContextProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AuthReducer, initialState);

	useEffect(() => {
		localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
	}, [state.currentUser]);

	return (
		<AuthContext.Provider
			value={{
				currentUser: state.currentUser,
				isLoading: state.isLoading,
				error: state.error,
				dispatch,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
