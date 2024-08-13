/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'antd';
import { Collapse, Form, Flex, Row, Col, Space } from 'antd';
import { Input, Button, Table, message, DatePicker, Typography } from 'antd';
import { SearchOutlined, ClearOutlined, FileAddOutlined } from '@ant-design/icons'; 
import { accessColumn } from "./checking.model";
import CheckingService from '../../service/Checking.service';


const checkingService = CheckingService(); 
const mngConfig = {title:"", textOk:null, textCancel:null, action:"create", code:null};
const { RangePicker } = DatePicker;
const CheckingAccess = () => {
    const navigate = useNavigate();
    
    const [form] = Form.useForm();

    const [accessData, setAccessData] = useState([]);
    const [activeSearch, setActiveSearch] = useState([]);
 
    let loading = false;
    
    const CollapseItemSearch = (
        <>  
        <Row gutter={[8,8]}> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='ชื่อคอร์ส' name='courses_name'>
                    <Input placeholder='กรอกชื่อคอร์ส' />
                </Form.Item>                            
            </Col>
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='วิชาคอร์สเรียน' name='subject'>
                    <Input placeholder='กรอกชื่อวิชา' />
                </Form.Item>
            </Col> 
            <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                <Form.Item label='เวลาเรียน' name='courses_time'>
                    <RangePicker 
                        placeholder={['เวลาตั้งแต่', 'เวลาถึง']} 
                        style={{width:'100%', height:40}}  
                        picker="time"
                        format="HH:mm"
                        showTime={{
                          format: 'HH:mm',
                        }}
                    />
                </Form.Item>
            </Col> 
        </Row>
        <Row gutter={[8,8]}>
          <Col xs={24} sm={8} md={12} lg={12} xl={12}>
              {/* Ignore */}
          </Col>
          <Col xs={24} sm={8} md={12} lg={12} xl={12}>
              <Flex justify='flex-end' gap={8}>
                  <Button type="primary" size='small' className='bn-action' icon={<SearchOutlined />} onClick={() => handleSearch()}>
                      Search
                  </Button>
                  <Button type="primary" size='small' className='bn-action' danger icon={<ClearOutlined />} onClick={() => handleClear()}>
                      Clear
                  </Button>
              </Flex>
          </Col>
        </Row> 
        </>
    )

    const FormSearch = (
        <Collapse 
        size="small"                    
        onChange={(e) => { setActiveSearch(e) }}
        activeKey={activeSearch} 
        items={[
        { 
            key: '1', 
            label: <><SearchOutlined /><span> Search</span></>,  
            children: <>{CollapseItemSearch}</>,
            showArrow: false, 
        } 
        ]}
        // bordered={false}
        />         
    );

    const handleSearch = (load = false) => {
        loading = load;
        form.validateFields().then( v => {
            const data = {...v}; 
            if (data.courses_time && data.courses_time.length === 2) {
                const time_from = data.courses_time[0].format('HH:mm');
                const time_to = data.courses_time[1].format('HH:mm');
                Object.assign(data, {time_from, time_to});
            }
            console.log(data);
            setTimeout( () => getData(data), 80);
        }).catch( err => {
            console.warn(err);
        })
    }

    const handleClear = () => {
        form.resetFields();
        
        handleSearch()
    }

    const handleCheck = (data) => {
        debugger
         navigate("manage/check", { state: { config: {...mngConfig, title:"เช็คชื่อการเข้าเรียน", action:"check", code:data?.course_id} }, replace:true } );
    }; 

    const handleDelete = (data) => { 
        // startLoading();
        checkingService.deleted(data?.quotcode).then( _ => {
            const tmp = accessData.filter( d => d.course_id !== data?.course_id );

            setAccessData([...tmp]); 
        })
        .catch(err => {
            console.log(err);
            message.error("Request error!"); 
        });
    }; 
    
    const column = accessColumn( {handleCheck, handleDelete});

    const getData = (data) => {
        checkingService.search(data, { ignoreLoading: loading}).then( res => {
            const {data} = res.data;

            setAccessData(data);
        }).catch( err => {
            console.log(err);
            message.error("Request error!");
        });
    }

    const init = async () => {
        getData({});
    }
            
    useEffect( () => {
        init();

          

        return  async () => { 
            //console.clear();
        }
    }, []);
    const TitleTable = (
        <Flex className='width-100' align='center'>
            <Col span={12} className='p-0'>
                <Flex gap={4} justify='start' align='center'>
                  <Typography.Title className='m-0 !text-zinc-800' level={3}>รายชื่อคอร์สเรียน</Typography.Title>
                </Flex>
            </Col> 
        </Flex>
    );    
    return (
    <div className='checking-access' id="area">
        <Space direction="vertical" size="middle" style={{ display: 'flex', position: 'relative' }} >
        <Card className="card-search">
            <Form form={form} layout="vertical" autoComplete="off" >
                {FormSearch}
            </Form> 
        </Card>
            <Card>
                <Row gutter={[8,8]} className='m-0'>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Table 
                        title={()=>TitleTable} 
                        size='small' 
                        rowKey="course_id" 
                        columns={column} 
                        dataSource={accessData} 
                        scroll={{ x: 'max-content' }} 
                        />
                    </Col>
                </Row>         
            </Card>
        </Space>
    </div>
    );
}

export default CheckingAccess;