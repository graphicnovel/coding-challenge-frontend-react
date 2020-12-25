import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useResultState, useResultDispatch, getList } from '../ResultContext';

const PageButtonContainer = styled.div`
    text-align: center;
`;
const PageButton = styled.div`
    display:inline-block;
    padding:10px;
    color:#495057;
`;

const PrevNextButton = styled.button`
    padding:10px;
    color:#495057;
    background:#38d9a9;
    border:none;
    outline:none;
    cursor:pointer;
`;

const ItemContainer = styled.div`
    width:80%;
    padding: 15px;
    display:flex;
    align-items: start;
    justify-content: flex-start;
    list-style:none;
`;

const ItemImg = styled.img`
    width:200px;
`;

const ItemDesc = styled.div`
    padding:0 20px;
`;
const ItemH2 = styled.h2`
    font-size:20px;
    margin-top:0px;
`;

function ResultList() {
    const [page, setPage] = useState(1);
    const [id, setId] = useState(null);

    const pageArr = [];

    const state = useResultState();
    const dispatch = useResultDispatch();

    const { loading, data: list, error, totalPage, desc, date1, date2 } = state.list;


    //리스트 불러오기
    useEffect(() => {
        getList(dispatch, page, desc, date1, date2);
    }, [page]);

    //페이지 수 불러오기
    for (let i = 0; i < totalPage; i++) {
        pageArr.push(i + 1);
    }

    //이전, 다음 버튼
    const onPrevPage = () => {
        if (page > 1) {
            let prev = page - 1;
            setPage(prev);
        }
    }
    const onNextPage = () => {
        if (page < pageArr.length) {
            let next = page + 1;
            setPage(next);
        }
    }

    console.log(list);

    // 상태에 따라 메세지 출력
    if (loading) return <div>로딩중...</div>;
    if (error) return <div>에러가 발생했습니다</div>;
    if (!list) return <div>결과가 없습니다.</div>;

    return (
        <>
            <ul>
                {list.map(item => (
                    <ItemContainer key={item.id} onClick={() => setId(item.id)}
                        style={{ cursor: 'pointer' }}>
                        <ItemImg src={item.media.image_url_thumb} />
                        <ItemDesc>
                            <ItemH2>{item.title}</ItemH2>
                            <p>{item.description}</p>
                            <p>{item.address}</p>
                        </ItemDesc>
                    </ItemContainer>
                ))}
            </ul>
            <PageButtonContainer>
                <PrevNextButton onClick={onPrevPage}>&lt;&lt;</PrevNextButton>
                {pageArr ? pageArr.map(num => (
                    <PageButton key={num} onClick={() => setPage(num)} style={{ cursor: 'pointer' }}>{num}</PageButton>
                )) : <span>1</span>}
                <PrevNextButton onClick={onNextPage}>&gt;&gt;</PrevNextButton>
            </PageButtonContainer>
        </>
    );
};

export default ResultList;