import { Table, Tag } from "antd";
import React from "react";
import "./TableWallet.scss";

export default function TableWallet() {
  const a = new Date().toLocaleString();

  const columns = [
    {
      title: "Index",
      dataIndex: "index",
      render: (text) => {
        return {
          children: text,
          props: {
            "data-tip": "a very long text",
          },
        };
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Time",
      dataIndex: "time",
      render: (text) => {
        return {
          children: text,
          props: {
            "data-tip": "a very long text",
          },
        };
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = "geekblue" ;
            if (tag === "withdraw") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      index: "John Brown",
      amount: 32,
      time: a,
      status: ["add", "withdraw"],
    },
    {
      key: "2",
      index: "John Brown",
      amount: 32,
      time: a,
      status: ["withdraw"],
    },
    {
        key: "3",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "4",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "5",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "6",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "7",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "8",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "9",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "10",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
      {
        key: "11",
        index: "John Brown",
        amount: 32,
        time: a,
        status: ["withdraw"],
      },
  ];
  return (
    <div className="history">
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
