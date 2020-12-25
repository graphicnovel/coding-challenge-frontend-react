import React, { useState } from 'react';
import { useResultState, useResultDispatch, getList } from '../ResultContext';
import styled from 'styled-components';

const Header = styled.div`
    padding-left: 55px;
    width:80%;
    border-bottom: 1px solid #adb5bd;  
`;

const ResetFilterButton = styled.div`
    display: inline-block;
    cursor: pointer;
`;



function SearchForm(props) {
    const [page, setPage] = useState(1);

    const [keyword, setKeyword] = useState({
        desc: '',
        from: '',
        to: ''
    });

    const { desc, from, to } = keyword; //keyword 비구조화 할당

    const onChangeInput = e => {
        const { name, value } = e.target;
        setKeyword({
            ...keyword,
            [name]: value
        });
    }

    const ResetFilter = () => {
        setKeyword({
            desc: '',
            from: '',
            to: ''
        })
    }

    const state = useResultState();
    const dispatch = useResultDispatch();

    const fetchData = e => {
        e.preventDefault();
        let date1, date2;
        from ? date1 = Math.round(new Date(from).getTime() / 1000.0) : date1 = '';
        to ? date2 = Math.round(new Date(to).getTime() / 1000.0) : date2 = '';
        console.log(desc, from, to);
        getList(dispatch, page, desc, date1, date2);
    }

    return (
        <Header>
            <input type='text' name='desc' placeholder='Search case title' value={desc} onChange={onChangeInput} />
            <label>From<input type="date" name="from" value={from} onChange={onChangeInput} /></label>
            <label>To<input type="date" name="to" value={to} onChange={onChangeInput} /></label>
            <input type="submit" value="Find Cases" onClick={fetchData} />
            <ResetFilterButton onClick={ResetFilter}>Reset filter</ResetFilterButton>
        </Header>
    );

};

export default SearchForm;