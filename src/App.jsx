import { DateTimePicker } from "@mantine/dates";
import { useEffect, useState } from "react";

import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";
import axios from "axios";

import { useDisclosure } from "@mantine/hooks";
import { Modal, Button, Select, NumberInput } from "@mantine/core";

import { TextInput, Table, Group, Box } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDispatch, useSelector } from "react-redux";
import { logOutFailure, logOutStart, logOutSuccess } from "./Slices/userSlice";
import { useNavigate } from "react-router-dom";

const App = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [data, setData] = useState([]);

  const getAllData = async () => {
    const res = await axios.get(
      "https://income-expense-utqh.onrender.com/api/data"
    );

    setData(res.data.data);
  };

  useEffect(() => {
    getAllData();
  }, []);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      title: "",
      amount: "",
      type: "Income",
      time: new Date(),
    },
  });

  const [opened, { open, close }] = useDisclosure(false);

  const [datas, setDatas] = useState([]);

  const filteredData = datas.filter((item) => {
    const startFilterTime = new Date(startTime);
    const endFilterTime = new Date(endTime); // Adjust time for 5:27 PM

    const itemTime = new Date(item.time);
    return itemTime >= startFilterTime && itemTime <= endFilterTime;
  });

  useEffect(() => {
    if (new Date(startTime) > new Date(endTime)) {
      console.log("filter wrong");
      setEndTime(new Date(startTime));
    } else {
      setDatas(filteredData);
    }
  }, [startTime, endTime]);

  const fetchAllData = async () => {
    try {
      const res = await axios.get(
        "https://income-expense-utqh.onrender.com/api/data"
      );

      const allData = res.data.data;
      const currentUserData = allData.filter(
        (data) => data.userId == currentUser._id
      );
      setDatas(currentUserData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const incomeDatas = datas?.filter((data) => data.type == "Income");
  const expenseDatas = datas?.filter((data) => data.type == "Expense");

  const totalIncomeAmount = incomeDatas.reduce((pv, cv) => pv + cv.amount, 0);
  const totalExpenseAmount = expenseDatas.reduce((pv, cv) => pv + cv.amount, 0);

  const totalAmount = totalIncomeAmount - totalExpenseAmount;

  const handleDelete = async (id) => {
    try {
      const res = await axios.post(
        "https://income-expense-utqh.onrender.com/api/data/delete",
        { id }
      );
      console.log(res.data);
      console.log(id);
      fetchAllData();
    } catch (error) {
      console.log(error);
    }
  };

  const rows = datas?.map((data) => (
    <Table.Tr key={data._id}>
      <Table.Td>{data.type}</Table.Td>
      <Table.Td>{data.title}</Table.Td>
      <Table.Td>{data.amount}</Table.Td>
      <Table.Td>{data.time}</Table.Td>
      <Table.Td>
        <div className="flex gap-4">
          {/* <Button className="text-white bg-blue-600">Edit</Button> */}
          <button
            onClick={() => handleDelete(data._id)}
            className="text-white bg-red-600"
          >
            Delete
          </button>
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  const nav = useNavigate();

  const handleLogout = async () => {
    dispatch(logOutStart());

    try {
      const res = await axios.post(
        "https://income-expense-utqh.onrender.com/api/auth/logout"
      );
      dispatch(logOutSuccess());
      nav("/login");

      console.log(res.data);
    } catch (error) {
      console.log(error);
      dispatch(logOutFailure());
    }
  };

  const handleAddNewData = async (datas) => {
    try {
      const res = await axios.post(
        "https://income-expense-utqh.onrender.com/api/data",
        datas
      );

      console.log(res.data.data);
      close();
      fetchAllData();
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen container mx-auto">
      <div className="flex items-center justify-end gap-4">
        <div className="flex justify-start items-center gap-2">
          <img
            src="https://i.pinimg.com/236x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
            alt="User Photo"
            className="w-16 h-16 rounded-full"
          />
          <h1>{currentUser.userName}</h1>
        </div>

        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <h1 className="text-4xl text-center">Income & Expense</h1>

      <div className="grid place-items-center">
        <img
          src="https://cdn3d.iconscout.com/3d/premium/thumb/finance-growth-4538554-3769798.png?f=webp"
          alt=""
        />
      </div>

      <h1 className="text-center text-4xl">
        Total Amount -{" "}
        <span className={`${totalAmount <= 0 ? "text-red-500" : ""}`}>
          {totalAmount} KS
        </span>
      </h1>

      {/* Add New Modal */}
      <Modal
        opened={opened}
        onClose={close}
        // fullScreen
        // radius={0}
        // transitionProps={{ transition: 'fade', duration: 200 }}

        title="New Income & Expense"
      >
        <Box maw={340} mx="auto">
          <form
            onSubmit={form.onSubmit((values) =>
              handleAddNewData({ ...values, userId: currentUser._id })
            )}
          >
            <TextInput
              required
              withAsterisk
              label="Title"
              placeholder="Title"
              {...form.getInputProps("title")}
            />
            <Select
              label="Type"
              defaultValue={"Income"}
              {...form.getInputProps("type")}
              data={["Income", "Expense"]}
            />

            <NumberInput
              label="Amount"
              required
              placeholder="Enter your amount"
              {...form.getInputProps("amount")}
            />

            <DateTimePicker
              label="Date"
              className=""
              valueFormat="DD MMM YYYY hh:mm A"
              {...form.getInputProps("time")}
              placeholder="Pick date and time"
            />

            <Group justify="flex-end" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Box>
      </Modal>
      {/* Add New Modal */}

      <div className="flex justify-end">
        <Button onClick={open}>Add New</Button>
      </div>

      <div className="w-full md:w-2/3 mx-auto">
        <div className="flex justify-center">
          <div className=" flex items-center justify-between gap-6">
            <h1 className="basis-1/2  border-b-4 text-center">Income</h1>
            <h1 className="basis-1/2 border-b-4 text-center">Expense</h1>
          </div>
        </div>

        <div className="w-full flex flex-col items-end">
          <DateTimePicker
            className="w-60 my-4"
            label="From Date"
            onChange={(value) => setStartTime(value)}
            valueFormat="DD MMM YYYY hh:mm A"
            defaultValue={startTime}
            placeholder="Pick date and time"
          />

          <DateTimePicker
            className="w-60"
            label="To Date"
            onChange={(value) => setEndTime(value)}
            valueFormat="DD MMM YYYY hh:mm A"
            defaultValue={endTime}
            placeholder="Pick date and time"
          />
        </div>

        <div className="mt-8">
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Title</Table.Th>
                <Table.Th>Amount</Table.Th>
                <Table.Th>Date</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default App;
