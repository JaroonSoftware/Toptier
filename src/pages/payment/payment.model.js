import { Button, Popconfirm, Space, Badge, Switch, Form, Input } from "antd"; 
import "../../assets/styles/banks.css";
import { Tooltip } from "antd";
// import { EditOutlined, QuestionCircleOutlined, DeleteOutlined } from "@ant-design/icons"; 
import { EditableRow, EditableCell } from "../../components/table/TableEditAble";
import { FaListCheck } from "react-icons/fa6";

/** export component for edit table */
export const componentsEditable = {
  body: { row: EditableRow, cell: EditableCell },
};

/** get sample column */
export const accessColumn = ({handleListPayment}) => [
  {
    title: "ชื่อคอร์ส",
    key: "course_name",
    dataIndex: "course_name",
    align: "left",
    sorter: (a, b) => (a.course_name).localeCompare(b.course_name),
    width:140,
    render: (text, record) => (
      <span
        style={{ color: "#29f", cursor: "pointer" }}
        onClick={(e) => handleListPayment(record)}
      >
        {record.course_name}
      </span>
    ),
  },
  {
    title: "วิชา",
    dataIndex: "subject_name",
    key: "subject_name",
    width: 140,
    sorter: (a, b) => (a.subject_name).localeCompare(b.subject_name),
  },
  {
    title: "เวลาเรียน",
    dataIndex: "study_time",
    key: "study_time",
    width: 120,
    sorter: (a, b) => (a.study_time).localeCompare(b.study_time),
  },
  { 
    title: "จำนวนนักเรียน",
    dataIndex: "student_count",
    key: "student_count", 
    align: "right",
    width: 80,
  },
];

export const studentColumn = (listStudent, handleDetailPayment,handleAddPayment ) => [
  {
    title: "ลำดับ",
    dataIndex: "ind",
    key: "ind",
    width: 80, 
    render: (im, rc, index) => <>{index + 1}</>,
  },
  {
    title: "ชื่อ-นามสกุล นักเรียน",
    dataIndex: "student_name",
    key: "student_name",
    align: "left",
  },
  {
    title: "ชั้นปี",
    dataIndex: "degree",
    key: "degree", 
    align: "left",
  },
  {
    title: "โรงเรียน",
    dataIndex: "school",
    key: "school", 
    align: "left",
  },
  {
    title: "สถานะการชำระเงิน",
    dataIndex: "check_checking",
    key: "check_checking", 
    align: "left",
    render: (text, record) => {
      if (record.check_checking === "N") {
        return "รอการชำระเงิน"
      }else if ((record.price * record.last_sessions) === record.total_payment) {
        return "ชำระเงินครบ"
      }else if (record.total_payment < (record.price * record.last_sessions)) {
        return "ค้างชำระเงิน"
      }else if (record.total_payment > (record.price * record.last_sessions)) {
        return "ชำระเงินเกิน"
      }
      return null; // หรือสามารถแสดงข้อความอื่น หรือเว้นว่างไว้
    },
  },
  {
    title: "Action",
    key: "operation", 
    fixed: 'right',
    align: "center",
    width: 100,
    render: (text, record) => {
      if (record.session_count < record.number_of_sessions) {
        return (
          <span>
              <Button
                type="primary" ghost
                icon={<FaListCheck  />}
                className="checking-button"
                onClick={(e) => handleDetailPayment(record)}
                size="small"
              />
            {' '}
            <Button
                type="primary" ghost
                icon={<FaListCheck  />}
                className="checking-button"
                onClick={(e) => handleAddPayment(record)}
                size="small"
              />
          </span>
        )
      }else{
        return (
          <span>
              <Button
                type="primary" ghost
                icon={<FaListCheck  />}
                className="checking-button"
                onClick={(e) => handleDetailPayment(record)}
                size="small"
              />
            {' '}
          </span>
        )
      }
    },
  }, 
];
