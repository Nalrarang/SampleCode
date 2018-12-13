
import React, { Component } from 'react';
import { Layout, Modal, Tooltip, Tag, notification } from 'antd';
import { Link } from 'react-router-dom';
import DatePick from './DatePick/DatePick';
import SearchBar from './SearchBar/SearchBar';
import SelectType from './SelectType/SelectType';
import SearchButton from './SearchButton/SearchButton';
import ContentTable from './ContentTable/ContentTable';
import ContentTableAction from './ContentTableAction/ContentTableAction';
import DeleteItem from './DeleteItem/DeleteItem';

import './Board.css';

const { Content } = Layout;

/* Push Filter Type  */
const type = {
    all: '전체',
    ordinary: '일반 푸시',
    moaweek: '상품 개인화',
    search_personalized: '검색 개인화'
}

class PushBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            selectIdxList: [],
            deleteConfirm: false
        };
    }

    /* DeleteModal Open/Close */
    openDeleteModal = (visible ,deleteConfirm, idx) => {
        this.setState({
            visible,
            deleteConfirm,
            selectIdxList: [idx]
        });
    }

    /* Table Column Select => Multi Select에서 Single Select으로 변경  */
    setSelectList = (list) => {
        // SendCreate에서 재사용을 위한 분기 
        if(this.props.send) {
            this.props.setPushSelect(list) 
        } else {
            this.setState({
                selectIdxList: list
            });
        }
    }
    
    /* Delete시 RandomCode가 제대로 입력되었는지 확인 */
    codeConfirm = (isConfirm) => {
        this.setState({
            deleteConfirm: isConfirm
        });
    }

    /* 선택한 Table Column을 삭제한다. */
    deleteItem = () => {
        const { deleteConfirm, selectIdxList } = this.state;
        if(deleteConfirm) {
            this.openDeleteModal(false, false)
            this.props.deletePushItems(selectIdxList);
        } else {
            notification.error({
                message: '보안코드를 제대로 입력해주세요.',
                description: '화면에 보이는 네자리 코드가 맞지 않습니다. \n 확인 후에 다시 시도해주세요.'
            });
        }
    }

    render() {
        const columns = [{
            title: 'idx',
            dataIndex: 'idx',
            render: (text, data) => {
                return (<Tooltip
                    title={`타이틀: ${data.title}\n메세지: ${data.message}\n이동경로: ${data.url}`}>{text}</Tooltip>)
            }
        }, {
            title: '수정일',
            dataIndex: 'update_date',
        }, {
            title: '유형',
            dataIndex: 'push_type',
            render: (text) => {
                return type[text]
            }
        }, {
            title: '태그',
            dataIndex: 'tag',
        }, {
            title: '편집',
            dataIndex: 'edit',
            render: (text, data) => {
                return (
                    <div>
                        <Link to={{ pathname: `/push/edit/${data.idx}`, idx: data.idx }}>
                            <Tag color="purple">변경</Tag>                    
                        </Link>
                        <Tag color="volcano" onClick={() => { this.openDeleteModal(true, false, data.idx) }}>삭제</Tag>                    
                    </div>
                )
            }
        }];


        return (
            <Content>
                {
                    this.props.send === undefined ? (<section><h1 className="title">푸시 생성</h1><p>푸시정보를 세팅하고 생성합니다.</p></section>) : ''
                }
                <section>
                    <DatePick startDate={this.props.startDate} endDate={this.props.endDate} setDate={this.props.setDate} />
                    <SearchBar tag={this.props.tag} setTag={this.props.setTag} />
                    <SelectType placeholder={"유형"} type={type} setType={this.props.setType} />
                    <SearchButton searchPushList={this.props.searchPushList} />
                </section>
                <section>
                    {
                        this.props.send === undefined ? <ContentTableAction deleteOpenModal={this.openDeleteModal} link={`/push/create`} /> : (<div className="blank"></div>)                      
                    }                    
                    <ContentTable send={this.props.send} columns={columns} dataList={this.props.pushList} setSelectList={this.setSelectList} />                
                </section>
                <Modal
                    visible={this.state.visible}
                    onOk={this.deleteItem}
                    onCancel={this.openDeleteModal.bind(this, false, false)}
                    destroyOnClose={true}
                >
                    <DeleteItem codeConfirm={this.codeConfirm} />
                </Modal>
            </Content>
        )
    }
}


export default PushBoard;