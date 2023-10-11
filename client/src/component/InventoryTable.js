import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { message, Table } from "antd";
import { GetInventorywithFilters } from "../apicalls/inventory";
import { setLoading } from "../redux/loaderSlice";
import { getDateFormat } from "../utils/helper";

function InventoryTable({ filters, userType, limit }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  const columns = [
    {
      title: "Inventory Type",
      dataIndex: "inventoryType",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Blood Group",
      dataIndex: "bloodGroup",
      render: (text) => text.toUpperCase(),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      render: (text) => text + "ML",
    },
    {
      title: "Reference",
      dataIndex: "reference",
      render: (text, record) => {
        if (userType === "organization") {
          return record.inventoryType === "in"
            ? record.donar?.name
            : record.hospital?.hospitalName;
        } else {
          return "record.organization.organizationName,";
        }
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => getDateFormat(text),
    },
  ];

  //change columns of a table according to loginUser=hospital || donar
  if (userType !== "organization") {
    //remove inventory type column
    columns.splice(0, 1);

    //change reference column to organization name
    columns[2] = {
      title: "Organization Name",
      dataIndex: "organization",
      render: (text) => text.organizationName ,
    };

    //date columns should be renamed as taken date
    columns[3] = {
      title: userType === "hospital" ? "Taken Date" : "Donated Date",
      // render: (text) => getDateFormat(text.updatedAt) ,
      dataIndex: userType === "hospital" ? "organization" : "organization",
      render: (text) =>  userType === "hospital" ? getDateFormat(text.updatedAt):getDateFormat(text.updatedAt) ,
    };
  }

  //change columns of a table according to loginUser=donar

  const getData = async () => {
    try {
      dispatch(setLoading(true));
      const response = await GetInventorywithFilters(filters, limit); // Pass filters here if needed
      dispatch(setLoading(false));
      if (response.success) {
        setData(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(setLoading(false));
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <Table columns={columns} dataSource={data} className="mt-3" />
    </div>
  );
}

export default InventoryTable;
