import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';

//기본 상태
const initialState = {
    list: {
        loading: false,
        data: null,
        error: null,
        totalPage: null,
        desc: null,
        date1: null,
        date2: null
    },
    item: {
        loading: false,
        data: null,
        error: null,
        title: null,
        description: null,
        image_url_thumb: null
    }
};

//로딩상태
const loadinigState = {
    loading: true,
    data: null,
    error: null,
    totalPage: null,
    desc: null,
    date1: null,
    date2: null
};

//성공했을 때 상태 만들어주는 함수
const success = (data, totalPage, desc, date1, date2) => ({
    loading: false,
    data,
    error: null,
    totalPage,
    desc,
    date1,
    date2
});

const error = error => ({
    loading: false,
    data: null,
    error: error
});

function resultReducer(state, action) {
    switch (action.type) {
        case 'GET_LIST':
            return {
                ...state,
                list: loadinigState
            }
        case 'GET_LIST_SUCCESS':
            return {
                ...state,
                list: success(action.data, action.totalPage, action.desc, action.date1, action.date2),
            }
        case 'GET_LIST_ERROR':
            return {
                ...state,
                list: error(action.error)
            }
        case 'GET_ITEM':
            return {
                ...state,
                item: loadinigState
            }
        case 'GET_ITEM_SUCCESS':
            return {
                ...state,
                item: success(action.data)
            }
        case 'GET_ITEM_ERROR':
            return {
                ...state,
                item: error(action.error)
            }
        default:
            throw new Error(`Unhanded action type: ${action.type}`);
    }
}

//State용 Context, dispatch용 Context 따로 만들어주기

const ResultStateContext = createContext(null);
const ResultDispatchContext = createContext(null);

export function ResultProvider({ children }) {
    const [state, dispatch] = useReducer(resultReducer, initialState);
    return (
        <ResultStateContext.Provider value={state}>
            <ResultDispatchContext.Provider value={dispatch}>
                {children}
            </ResultDispatchContext.Provider>
        </ResultStateContext.Provider>
    );
}

//context를 쉽게 조회할 수 있게 해주는 커스텀 Hook
export function useResultState() {
    const state = useContext(ResultStateContext);
    if (!state) {
        throw new Error('Cannot find UsersProvider');
    }
    return state;
}

export function useResultDispatch() {
    const dispatch = useContext(ResultDispatchContext);
    if (!dispatch) {
        throw new Error('Cannot find UsersProvider');
    }
    return dispatch;
}

//API DATA 받아오는 함수
export async function getList(dispatch, page, desc, date1, date2) {
    dispatch({ type: 'GET_LIST' });
    try {
        console.log(desc, date1, date2);

        //기본 url
        let url = `/api/v2/incidents?page=${page}&per_page=10&proximity=Berlin`;
        let lengthUrl = `/api/v2/incidents?&per_page=100&proximity=Berlin`;

        //desc, date1, date2 유무 판단

        if (desc && date1 && date2) {
            url += `&query=${desc}&occurred_after=${date1}&occurred_before=${date2}`;
            lengthUrl += `&query=${desc}&occurred_after=${date1}&occurred_before=${date2}`;
            console.log(url);
        } else if (desc && date1) {
            url += `&query=${desc}&occurred_after=${date1}`;
            lengthUrl += `&query=${desc}&occurred_after=${date1}`;
            console.log(url);
        } else if (desc && date2) {
            url += `&query=${desc}&occurred_before=${date2}`;
            lengthUrl += `&query=${desc}&occurred_before=${date2}`;
            console.log(url);
        } else if (date1 && date2) {
            url += `&occurred_after=${date1}&occurred_before=${date2}`;
            lengthUrl += `&occurred_after=${date1}&occurred_before=${date2}`;
            console.log(url);
        } else if (desc) {
            url += `&query=${desc}`;
            lengthUrl += `&query=${desc}`;
            console.log(url);
        } else if (date1) {
            url += `&occurred_after=${date1}`;
            lengthUrl += `&occurred_after=${date1}`;
            console.log(url);
        } else if (date2) {
            url += `&occurred_before=${date2}`;
            lengthUrl += `&occurred_before=${date2}`;
            console.log(url);
        }

        const response = await axios.get(url);
        const lengthCheck = await axios.get(lengthUrl);
        const totalPage = Math.ceil(lengthCheck.data.incidents.length / 10);

        dispatch({ type: 'GET_LIST_SUCCESS', data: response.data.incidents, totalPage, desc: desc, date1: date1, date2: date2 });
    } catch (e) {
        dispatch({ type: 'GET_LIST_ERROR', error: e });
    }
}

export async function getTitleDate(dispatch, page, query) {
    dispatch({ type: 'GET_LIST' });
    try {
        if (query) {
            const response = await axios.get(`/api/v2/incidents?page=${page}&per_page=10&proximity=Berlin&query=${query}`);
            const lengthCheck = await axios.get(`/api/v2/incidents?&per_page=100&proximity=Berlin&query=${query}`);
            const totalPage = Math.ceil(lengthCheck.data.incidents.length / 10);
            dispatch({ type: 'GET_LIST_SUCCESS', data: response.data.incidents, totalPage });
        }
    } catch (e) {
        dispatch({ type: 'GET_LIST_ERROR', error: e });
    }
}

//ID값에 맞는 사건 가져오는 함수
export async function getItem(dispatch, id) {
    dispatch({ type: 'GET_ITEM' });
    try {
        const response = await axios.get(`/api/v2/incidents/${id}`);
        dispatch({ type: 'GET_ITEM_SUCCESS', data: response.data.incidents });
    } catch (e) {
        dispatch({ type: 'GET_ITEM_ERROR', error: e });
    }
}