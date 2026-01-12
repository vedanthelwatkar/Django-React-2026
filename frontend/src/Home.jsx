import { useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  logout,
  updateUser,
} from "./redux/slice/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "./redux/selector/selector";
import { Typography, Table, Modal, Form, message, Button, Input } from "antd";
import UserForm from "./component/UserForm";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const { users, userData, total } = useSelector(userSelector);

  const [user, setUser] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    dispatch(getUsers(page));

    if (user) dispatch(getUser(user));
    else dispatch(getUser("7"));
  }, [dispatch, user, page]);

  const confirmDelete = (user) => {
    Modal.confirm({
      title: "Are you sure?",
      content: `Do you really want to delete ${user.name}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",

      onOk: () => {
        return dispatch(deleteUser(user.id))
          .unwrap()
          .then(() => {
            message.success("User deleted");
            dispatch(getUsers());
          })
          .catch(() => {
            message.error("Delete failed");
          });
      },
    });
  };

  const columns = [
    { title: "Id", dataIndex: "id", key: "id" },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Admin",
      key: "admin",
      render: (_, record) => (record.admin ? "True" : "False"),
    },
    { title: "Mobile", dataIndex: "mobile", key: "mobile" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        userData?.admin == true ? (
          <div className="w-full flex gap-2">
            <Button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => handleOpenModal(record)}
            >
              Edit
            </Button>
            <Button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => confirmDelete(record)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <div>No Access</div>
        ),
    },
    ,
  ];

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      admin: user.admin,
    });

    setOpenModal(true);
  };

  const handleOk = (create = false) => {
    form.validateFields().then((values) => {
      const payload = {
        name: values.name,
        mobile: values.mobile,
        email: values.email,
        admin: values.admin === "1" ? true : false,
      };

      if (create == true) {
        dispatch(createUser(payload))
          .unwrap()
          .then(() => {
            message.success("User Created successfully");
            form.resetFields();
            setOpenCreate(false);
            dispatch(getUsers());
          })
          .catch(() => {
            message.error("Create failed");
          });
      } else {
        dispatch(updateUser({ id: selectedUser.id, payload }))
          .unwrap()
          .then(() => {
            message.success("User updated successfully");
            setOpenModal(false);
            dispatch(getUsers());
          })
          .catch(() => {
            message.error("Update failed");
          });
      }
    });
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const cancelCreate = () => {
    setOpenCreate(false);
    form.resetFields();
  };

  return (
    <div className="flex flex-col items-start justify-center m-10">
      <div className="w-full flex items-center justify-between">
        <Title>Users</Title>
        <Input
          title="Enter user id"
          onChange={(e) => setUser(e.target.value)}
          size="large"
          className="w-80"
          placeholder="Enter User ID"
        />
        <Button
          size="large"
          onClick={() => {
            setOpenCreate(true);
            form.resetFields();
          }}
        >
          Create User
        </Button>
        <Button
          size="large"
          onClick={() => {
            dispatch(logout());
            message.success("Logged out");
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </div>

      <Table
        className="w-full"
        dataSource={users}
        columns={columns}
        pagination={{
          current: page,
          pageSize: 5,
          total: total,
          onChange: (pageNumber) => setPage(pageNumber),
        }}
      />

      <Modal
        title="Edit User"
        open={openModal}
        onOk={() => handleOk(false)}
        onCancel={handleCancel}
      >
        <UserForm form={form} />
      </Modal>
      <Modal
        title="Create User"
        open={openCreate}
        onOk={() => handleOk(true)}
        onCancel={cancelCreate}
      >
        <UserForm form={form} />
      </Modal>
    </div>
  );
};

export default Home;
