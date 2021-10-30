import { Table, Tag } from "antd";
import React, { useEffect, memo } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AsyncTransferHistory } from "../SettingSlice";
import "./TableTransact.scss";

function TableTransact() {
  const { user } = useSelector((state) => state.auth);
  const { historyTransfer } = useSelector((state) => state.setting);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(AsyncTransferHistory(user?.id));
  }, []);

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "_id",
      key: "transaction",
      render: (text, index) => {
        return {
          children: index._id.slice(5, 15),
          props: {
            "data-tip": "a very long text",
          },
        };
      },
    },
    {
      title: "Sender",
      dataIndex: "sender",
      key: "sender",
      with: 50,
      render: (text, index) => {
        return {
          children: index.sender.fullName,
          props: {
            "data-tip": "a very long text",
          },
        };
      },
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      key: "receiver",
      with: 50,
      render: (text, index) => {
        return {
          children: index.receiver.fullName,
          props: {
            "data-tip": "a very long text",
          },
        };
      },
    },
    {
      title: "Amount",
      dataIndex: `money`,
      key: "amount",
    },
    {
      title: "Time",
      dataIndex: "createdAt",
      key: "time",
      render: (text, index) => {
        return new Date(index.createdAt).toLocaleDateString();
      },
    },
    {
      title: "Status",
      key: "type",
      dataIndex: "type",
      render: (text) => {
        let color = "geekblue";
        if (text === "deposit") {
          color = "volcano";
        }
        return (
          <Tag color={color} key={text}>
            {text.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="history">
      {historyTransfer && (
        <Table columns={columns} dataSource={historyTransfer} />
      )}
    </div>
  );
}
export default memo(TableTransact);