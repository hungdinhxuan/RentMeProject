import { Table, Tag } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import "./TableWallet.scss";

export default function TableWallet() {
  const { historyTransact } = useSelector((state) => state.setting);
  

  const columns = [
    {
      title: "Transaction ID",
      dataIndex: "_id",
      render: (text,index) => {
        return {
          children: index._id.slice(5,15),
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
      render: (text, index) => {
        return new Date(index.createdAt).toLocaleDateString()
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
      {historyTransact && (
        <Table columns={columns} dataSource={historyTransact} />
      )}
    </div>
  );
}
