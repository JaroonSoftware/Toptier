/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Table,
  Typography,
  message,
  Select,
  Badge,
  Switch,
} from "antd";
import dayjs from 'dayjs';
import { Card, Col, Divider, Flex, Row, Space } from "antd";

import OptionService from "../../service/Options.service";
import CheckingService from "../../service/Checking.service";
import { SaveFilled } from "@ant-design/icons";
import {
  studentColumn,
} from "./checking.model";

import { delay } from "../../utils/util";
import { ButtonBack } from "../../components/button";
import { useLocation, useNavigate } from "react-router-dom";

import { RiDeleteBin5Line } from "react-icons/ri";
import { BiMessageSquareAdd } from "react-icons/bi";
const { confirm } = Modal;
const opservice = OptionService();
const checkingservice = CheckingService();

const gotoFrom = "/checking";

function CheckingManage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { config } = location.state || { config: null };
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const [optionTeacher, setOptionTeacher] = useState([]);

  /** Detail Data State */
  const [listStudent, setListStudent] = useState([]);

  const [listTeacher, setListTeacher] = useState([]);
 
  const [formDetail, setFormDetail] = useState([]);

  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const cardStyle = {
    backgroundColor: "#f0f0f0",
    height: "calc(100% - (25.4px + 1rem))",
  };

  useEffect(() => {
    const initial = async () => {
      if (config?.action === "check") {
        const res = await checkingservice
          .get(config?.code)
          .catch((error) => message.error("get Course data fail."));
        const {
          data: { courses, teacher, student },
        } = res.data;
        setFormDetail(courses);
        setListTeacher(teacher);
        const studentWithAttendance = student.map((students) => ({
          ...students,
          attendance: true,
          reason: null,
        }));
        setListStudent(studentWithAttendance);
        form.setFieldsValue({ ...courses });
        form.setFieldsValue({
          courses_time: [dayjs(courses.time_from, 'HH:mm'), dayjs(courses.time_to, 'HH:mm')],
        });
      }
    };

    initial();
    return () => {};
  }, []);

  const handleConfirm = () => {
    form
      .validateFields()
      .then((v) => {
        const formattedDate = v.session_date 
          ? dayjs(v.session_date).format('YYYY-MM-DD') 
          : null;
        const courses = { ...formDetail, ...v, session_date: formattedDate }
        const student = {...listStudent};

        const parm = { courses, student  };
        const actions = checkingservice.checking;
        actions(parm)
          .then((r) => {
            handleClose().then((r) => {
              message.success("บันทึกข้อมูลสำเร็จ.");
            });
          })
          .catch((err) => {
            message.error("บันทึกข้อมูลไม่สำเร็จ.");
            console.warn(err);
          });
      }).catch((errorInfo) => {
        console.log("Validate Failed:", errorInfo);
        message.error("โปรดตรวจสอบข้อมูลในฟอร์มก่อนบันทึก");
      });
  };

  const handleClose = async () => {
    navigate(gotoFrom, { replace: true });
    await delay(300);
    console.clear();
  };

  const handleDeleteStudent = (code) => {
    const itemDetail = [...listStudent];
    const newData = itemDetail.filter((item) => item?.student_code !== code);
    setListStudent([...newData]);
  };

  const handleRemoveStudent = (record) => {
    const itemDetail = [...listStudent];
    return itemDetail.length >= 1 ? (
      <Button
        className="bt-icon"
        size="small"
        danger
        icon={
          <RiDeleteBin5Line style={{ fontSize: "1rem", marginTop: "3px" }} />
        }
        onClick={() => handleDeleteStudent(record?.student_code)}
        disabled={!record?.student_code}
      />
    ) : null;
  };
  const handleSwitchChange = (checked, student) => {
    const updatedStudents = listStudent.map(s => s.student_code === student.student_code ? { ...s, attendance: checked, reason: checked ? '' : s.reason } : s);
    setListStudent(updatedStudents);
  };
  const handleReasonChange = (e, student) => {
    const updatedStudents = listStudent.map(s => s.student_code === student.student_code ? { ...s, reason: e.target.value } : s);
    setListStudent(updatedStudents);
  };
  const handleDateChange = (date, dateString) => {
    // แสดง alert ค่าวันที่ในรูปแบบ string ที่ได้รับจาก DatePicker
    alert(`Selected Date: ${dateString}`);
  };

  /** setting column table */
  //const prodcolumns = columnsParametersEditable(handleEditCell,unitOption, { handleRemove});
  const columnstudent = studentColumn( listStudent, handleReasonChange,handleSwitchChange );

  const SectionCourses = (
    <Row gutter={[8, 8]} className="px-2 sm:px-4 md:px-4 lg:px-4">
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form.Item
            label="คอร์สเรียน"
            name="course_name"
          >
            <Input readOnly />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
          <Form.Item
              label="วิชาเรียน"
              name="subject_name"
          >
           <Input readOnly />
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={4} xl={4} xxl={6}>
          <Form.Item
            label="รอบเรียน"
            name="session_no"
          >
            <Input readOnly />
          </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={12} xl={6} xxl={6}>
        <Form.Item
          label="ครูผู้สอน"
          name="teacher"
          rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
        >
          <Select
            size="large"
            placeholder="เลือกครูผู้สอน"
            showSearch
            filterOption={filterOption}
            options={listTeacher}
          ></Select>
        </Form.Item>
      </Col>
      <Col xs={24} sm={24} md={24} lg={10} xl={4} xxl={6}>
            <Form.Item 
              label='วันที่เรียน' 
              name='session_date'
               rules={[{ required: true, message: "กรุณากรอกข้อมูล!" }]}
            >
                <DatePicker  
                  placeholder="วันที่เรียน"
                  style={{width:'100%', height:40}} 
                  //onChange={handleDateChange}
                />
            </Form.Item>
      </Col>
    </Row>
  );


  const TitleTableStudent = (
    <Flex className="width-100" align="center">
      <Col span={14} className="p-0">
        <Flex gap={15} justify="start" align="center">
          <Typography.Title className="m-0 !text-zinc-800" level={4} >
            รายชื่อนักเรียน
          </Typography.Title>
        </Flex>
      </Col>
    </Flex>
  );

  const SectionStudent = (
    <>
      <Flex className="width-100" vertical gap={4}>
        <Table
          title={() => TitleTableStudent}
          bordered
          dataSource={listStudent}
          columns={columnstudent}
          pagination={false}
          rowKey="student_code"
          scroll={{ x: "max-content" }}
          locale={{
            emptyText: <span>No data available, please add some data.</span>,
          }}
        />
      </Flex>
    </>
  );


  ///** button */

  const SectionTop = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target={gotoFrom} />
        </Flex>
      </Col>
    </Row>
  );

  const SectionBottom = (
    <Row
      gutter={[{ xs: 32, sm: 32, md: 32, lg: 12, xl: 12 }, 8]}
      className="m-0"
    >
      <Col span={12} className="p-0">
        <Flex gap={4} justify="start">
          <ButtonBack target={gotoFrom} />
        </Flex>
      </Col>
      <Col span={12} style={{ paddingInline: 0 }}>
        <Flex gap={4} justify="end">
          <Button
            className="bn-center justify-center"
            icon={<SaveFilled style={{ fontSize: "1rem" }} />}
            type="primary"
            style={{ width: "9.5rem" }}
            onClick={() => {
              handleConfirm();
            }}
          >
            Save
          </Button>
        </Flex>
      </Col>
    </Row>
  );

  return (
    <div className="courses-manage">
      <div id="courses-manage" className="px-0 sm:px-0 md:px-8 lg:px-8">
        <Space direction="vertical" className="flex gap-4">
          {SectionTop}
          <Form
            form={form}
            layout="vertical"
            className="width-100"
            autoComplete="off"
          >
            <Card title={config?.title}>
              <Row className="m-0" gutter={[12, 12]}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!mb-3 !mt-1">
                    {" "}
                    ข้อมูลคอร์สเรียน{" "}
                  </Divider>
                  <Card style={cardStyle}>{SectionCourses}</Card>
                </Col>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                  <Divider orientation="left" className="!my-0">
                    รายชื่อนักเรียน
                  </Divider>
                  <Card style={{ backgroundColor: "#f0f0f0" }}>
                  {SectionStudent}
                  </Card>
                </Col>
              </Row>
            </Card>
          </Form>
          {SectionBottom}
        </Space>
      </div>
    </div>
  );
}

export default CheckingManage;
